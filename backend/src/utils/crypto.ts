import crypto from "crypto";
// Function to get the correct FonePay secret key based on mode
function getFonepaySecretKey(): string {
    const mode = process.env.FONEPAY_MODE || "dev";
    if (mode === "live") {
        const secret = process.env.FONEPAY_LIVE_SECRET_KEY;
        if (!secret) {
            throw new Error(
                "FONEPAY_LIVE_SECRET_KEY is required for live mode",
            );
        }
        return secret;
    } else {
        // Use the same default as in payment.config.ts
        return (
            process.env.FONEPAY_DEV_SECRET_KEY ||
            "a7e3512f5032480a83137793cb2021dc"
        );
    }
}

export function hmacSha512Hex(
    data: string,
    key: string = getFonepaySecretKey(),
): string {
    // Create HMAC with SHA512 using the key
    const hmac = crypto.createHmac("sha512", key);

    // Update with the data to be hashed
    hmac.update(data);

    // Return the hexadecimal digest
    return hmac.digest("hex");
}

export function safeEqualHex(a: string, b: string) {
    const A = Buffer.from(a, "hex");
    const B = Buffer.from(b, "hex");
    if (A.length !== B.length) return false;
    return crypto.timingSafeEqual(A, B);
}
