import crypto from "crypto";

export function hmacSha512Hex(key: string, data: string) {
  // Ensure key is treated as UTF-8 string for FonePay compatibility
  const hmac = crypto.createHmac("sha512", key);
  hmac.update(data, 'utf8');
  const result = hmac.digest("hex");
  
  console.log('HMAC Debug:', {
    keyLength: key.length,
    dataLength: data.length,
    resultLength: result.length
  });
  
  return result;
}

export function safeEqualHex(a: string, b: string) {
  const A = Buffer.from(a, "hex");
  const B = Buffer.from(b, "hex");
  if (A.length !== B.length) return false;
  return crypto.timingSafeEqual(A, B);
}
