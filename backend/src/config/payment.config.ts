import 'dotenv/config';

type Mode = 'dev' | 'live';
const MODE = (process.env.FONEPAY_MODE as Mode) || 'dev';

const byMode = <T,>(dev: T, live: T) => (MODE === 'dev' ? dev : live);

export const app = {
  port: Number(process.env.PORT || 4000),
  baseUrl: process.env.APP_BASE_URL!, // used to form RU
};

export const mongo = {
  uri: process.env.MONGO_URI!,
};

export const fonepay = {
  mode: MODE,
  pid: process.env.FONEPAY_PID!,
  // Client redirect endpoints
  redirectBaseUrl: byMode(
    'https://dev-clientapi.fonepay.com/api/merchantRequest',
    'https://clientapi.fonepay.com/api/merchantRequest'
  ),

  // Merchant API base for txnVerification
  merchantApiBaseUrl: byMode(
    'https://dev-merchantapi.fonepay.com/convergent-merchantweb/api',
    'https://merchantapi.fonepay.com/api'
  ),

  // The “resource” path string to include in the HMAC message for auth header
  // Fonepay docs show this canonical path:
  merchantTxnVerificationResource: '/merchant/merchantDetailsForThirdParty/txnVerification',

  // Secrets
  redirectSharedSecret: byMode(
    process.env.FONEPAY_SHARED_SECRET_DEV!,
    process.env.FONEPAY_SHARED_SECRET_LIVE!
  ),
  apiUser: byMode(
    process.env.FONEPAY_API_USERNAME_DEV!,
    process.env.FONEPAY_API_USERNAME_LIVE!
  ),
  apiPass: byMode(
    process.env.FONEPAY_API_PASSWORD_DEV!,
    process.env.FONEPAY_API_PASSWORD_LIVE!
  ),
  apiSecret: byMode(
    process.env.FONEPAY_API_SECRET_DEV!,
    process.env.FONEPAY_API_SECRET_LIVE!
  ),

  // DV settings — update from official doc once confirmed
  // Values must be raw (NOT URL-encoded) when hashing.
  requestDvOrder: ['PID', 'MD', 'PRN', 'AMT', 'CRN', 'DT', 'RI', 'R1', 'R2', 'RU'] as const,
  responseDvOrder: ['PRN', 'PID', 'PS', 'RC', 'P_AMT', 'R_AMT', 'UID'] as const, // keep until confirmed
  dvDelimiter: ',', // comma per PHP sample
} as const;
