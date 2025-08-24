import crypto from "crypto";
// const secretKey = process.env.FONEPAY_DEV_SECRET_KEY as string;
const secretKey = process.env.FONEPAY_LIVE_SECRET_KEY as string;

export function hmacSha512Hex(data: string, key: string = secretKey): string {
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
