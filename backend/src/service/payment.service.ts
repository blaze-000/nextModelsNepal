import { fonepay } from '../config/payment.config';
import { hmacSha512Hex, safeEqualHex } from '../utils/crypto';
import { formatAmount, formatFonepayDate } from '../utils/format';
import { http } from '../utils/http';
import { FonepayRequestParams, FonepayReturnParams, TxnVerificationBody } from '../types/payment';

function buildDvString(orderKeys: readonly string[], delimiter: string, values: Record<string, string>) {
    // IMPORTANT: use RAW values, not URL-encoded
    const parts = orderKeys.map(k => values[k] ?? '');
    return parts.join(delimiter);
}

// Build request payload and DV
export function buildPaymentRequest(params: {
    prn: string;
    amount: number;
    ruAbsolute: string;
    ri: string;
    r1?: string;
    r2?: string;
}): FonepayRequestParams {
    const base: Omit<FonepayRequestParams, 'DV'> = {
        RU: params.ruAbsolute,
        PID: fonepay.pid,
        PRN: params.prn,
        AMT: formatAmount(params.amount),
        CRN: 'NPR',
        DT: formatFonepayDate(),
        RI: params.ri?.slice(0, 160) || 'Payment',
        R1: params.r1?.slice(0, 50) || 'N/A',
        R2: params.r2?.slice(0, 50) || 'N/A',
        MD: 'P',
    };

    // const dvString = buildDvString([...fonepay.requestDvOrder], fonepay.dvDelimiter, base as any);
    const dvString = buildDvString(fonepay.requestDvOrder, fonepay.dvDelimiter, base as any);
    const DV = hmacSha512Hex(fonepay.redirectSharedSecret, dvString).toUpperCase();

    return { ...base, DV };
}

export function buildRedirectUrl(reqParams: FonepayRequestParams) {
    const url = new URL(fonepay.redirectBaseUrl);
    Object.entries(reqParams).forEach(([k, v]) => url.searchParams.set(k, v));
    return url.toString();
}

// Verify DV from return URL
// payment.service.ts
export function verifyReturnDv(returnQuery: any) {
  const required = fonepay.responseDvOrder;
  const missing = required.filter(k => returnQuery[k] === undefined || returnQuery[k] === null || returnQuery[k] === '');

  // If the gateway didn't include all fields, don't try to verify DV yet.
  if (missing.length) {
    console.warn('Skipping DV check: missing fields:', missing.join(', '));
    return { ok: false, skipped: true };
  }

  const parts: string[] = [];
  for (const k of required) {
    // IMPORTANT: use raw string values; trim defensive whitespace
    parts.push(String(returnQuery[k]).trim());
  }

  const dvString = parts.join(fonepay.dvDelimiter);

  const expected = hmacSha512Hex(fonepay.redirectSharedSecret, dvString);
  const provided = String(returnQuery.DV || '').toLowerCase();

  return { ok: safeEqualHex(expected, provided), skipped: false };
}

// Server-to-server verification
export async function verifyTransactionServerToServer(body: TxnVerificationBody) {
    const method = 'POST';
    const contentType = 'application/json';
    const resource = fonepay.merchantTxnVerificationResource;
    const json = JSON.stringify(body);

    // Basic auth
    const basic = Buffer.from(`${fonepay.apiUser}:${fonepay.apiPass}`).toString('base64');

    // auth header HMAC over comma-separated string (NOT URL-encoded)
    const message = `${fonepay.apiUser},${fonepay.apiPass},${method},${contentType},${resource},${json}`;
    const authHmac = hmacSha512Hex(fonepay.apiSecret, message);

    const url = `${fonepay.merchantApiBaseUrl}${resource}`;
    const res = await http.post(url, body, {
        headers: {
            'Content-Type': contentType,
            'Authorization': `Basic ${basic}`,
            'auth': authHmac,
        }
    });

    return { status: res.status, data: res.data };
}
