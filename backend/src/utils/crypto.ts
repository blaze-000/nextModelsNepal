import crypto from 'crypto';

// HMAC SHA512 returning lowercase hex
export function hmacSha512Hex(key: string, data: string) {
    return crypto.createHmac('sha512', Buffer.from(key, 'utf8'))
        .update(Buffer.from(data, 'utf8'))
        .digest('hex');
}

// constant-time compare
export function safeEqualHex(a: string, b: string) {
    const A = Buffer.from(a, 'hex');
    const B = Buffer.from(b, 'hex');
    if (A.length !== B.length) return false;
    return crypto.timingSafeEqual(A, B);
}
