import { fonepay } from "../config/payment.config";
import { hmacSha512Hex, safeEqualHex } from "../utils/crypto";
import { formatAmount, formatFonepayDate } from "../utils/format";
import { http } from "../utils/http";
import { FonepayRequestParams, TxnVerificationBody } from "../types/payment";

export function buildPaymentRequest(params: {
    prn: string;
    amount: number;
    ruAbsolute: string;
    r1?: string;
    r2?: string;
}): FonepayRequestParams {
    if (!fonepay.pid || !fonepay.redirectSharedSecret) {
        throw new Error('FonePay configuration missing: PID or Secret Key not configured');
    }

    if (!params.prn || !params.amount || !params.ruAbsolute) {
        throw new Error('Required payment parameters missing');
    }

    const base: Omit<FonepayRequestParams, "DV"> = {
        RU: params.ruAbsolute,
        PID: fonepay.pid,
        PRN: params.prn,
        AMT: formatAmount(params.amount),
        CRN: "NPR",
        DT: formatFonepayDate(),
        R1: params.r1 || "Test",
        R2: params.r2 || "Test",
        MD: "P",
    };

    // FonePay specification: PID,MD,PRN,AMT,CRN,DT,RI,R1,R2,RU
    const stringToSign = [
        base.PID,
        base.MD,
        base.PRN,
        base.AMT,
        base.CRN,
        base.DT,
        base.R1,
        base.R2,
        base.RU
    ].join(',');

    const dvHash = hmacSha512Hex(stringToSign);
    const DV = dvHash.toUpperCase();

    return { ...base, DV };
}

export function buildRedirectUrl(reqParams: FonepayRequestParams) {
    const url = new URL(fonepay.redirectBaseUrl);
    
    // Parameter order should match DV generation: PID,MD,PRN,AMT,CRN,DT,R1,R2,RU,DV
    const paramOrder = ['PID', 'MD', 'PRN', 'AMT', 'CRN', 'DT', 'R1', 'R2', 'RU', 'DV'];
    
    paramOrder.forEach(key => {
        const value = reqParams[key as keyof FonepayRequestParams];
        if (value !== undefined && value !== null) {
            url.searchParams.set(key, String(value));
        }
    });
    
    return url.toString();
}

export function verifyReturnDv(returnQuery: any) {
    const returnDvOrder = ['PRN', 'PID', 'PS', 'RC', 'UID', 'BC', 'INI', 'P_AMT', 'R_AMT'];
    const missing = returnDvOrder.filter((k) => !returnQuery[k]);

    if (missing.length) {
        return { ok: false, skipped: true };
    }

    const dvString = returnDvOrder
        .map((k) => String(returnQuery[k]).trim())
        .join(',');
    const expected = hmacSha512Hex(fonepay.redirectSharedSecret, dvString).toUpperCase();
    const provided = String(returnQuery.DV || "").toUpperCase();

    return { ok: safeEqualHex(expected, provided), skipped: false };
}

export async function verifyTransactionServerToServer(body: TxnVerificationBody) {
    if (fonepay.mode === "dev") {
        return { status: 200, data: { paymentStatus: "success", purchaseAmount: body.amount } };
    }

    if (!fonepay.apiUser || !fonepay.apiPass || !fonepay.apiSecret) {
        throw new Error("Missing Fonepay API credentials for live mode");
    }

    const method = "POST";
    const contentType = "application/json";
    const resource = fonepay.merchantTxnVerificationResource;
    const json = JSON.stringify(body);

    const basic = Buffer.from(`${fonepay.apiUser}:${fonepay.apiPass}`).toString("base64");
    const message = `${fonepay.apiUser},${fonepay.apiPass},${method},${contentType},${resource},${json}`;
    const authHmac = hmacSha512Hex(fonepay.apiSecret, message);

    const url = `${fonepay.merchantApiBaseUrl}${resource}`;
    const res = await http.post(url, body, {
        headers: {
            "Content-Type": contentType,
            Authorization: `Basic ${basic}`,
            auth: authHmac,
        },
    });

    return { status: res.status, data: res.data };
}
