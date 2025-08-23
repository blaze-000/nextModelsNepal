import 'dotenv/config';

type Mode = 'dev' | 'live';
const MODE = (process.env.FONEPAY_MODE as Mode) || 'dev';

const byMode = <T,>(dev: T, live: T) => (MODE === 'dev' ? dev : live);

export const mongo = {
  uri: process.env.DATABASE_URI!, // ✅ changed from MONGO_URI
};

export const app = {
  baseUrl: process.env.APP_BASE_URL || "http://localhost:8000",
};

export const fonepay = {
  mode: process.env.FONEPAY_MODE || "dev", // dev | live
  pid: process.env.FONEPAY_MODE === 'live' 
    ? process.env.FONEPAY_LIVE_PID! 
    : process.env.FONEPAY_DEV_PID || 'NBQM', // Default to NBQM for dev
  redirectSharedSecret: process.env.FONEPAY_MODE === 'live'
    ? process.env.FONEPAY_LIVE_SECRET_KEY!
    : process.env.FONEPAY_DEV_SECRET_KEY || 'a7e3512f5032480a83137793cb2021dc', // Default dev secret
  requestDvOrder: ["PID", "MD", "PRN", "AMT", "CRN", "DT", "RI", "R1", "R2", "RU"],
  dvDelimiter: ",",
  redirectBaseUrl: process.env.FONEPAY_REDIRECT_BASE_URL
    || (process.env.FONEPAY_MODE === 'live' 
        ? "https://clientapi.fonepay.com/api/merchantRequest"
        : "https://dev-clientapi.fonepay.com/api/merchantRequest"),

  // API creds (needed only in live)
  apiUser: process.env.FONEPAY_API_USER,
  apiPass: process.env.FONEPAY_API_PASS,
  apiSecret: process.env.FONEPAY_API_SECRET,
  merchantApiBaseUrl: process.env.FONEPAY_API_BASE_URL
    || (process.env.FONEPAY_MODE === 'live'
        ? "https://merchantapi.fonepay.com"
        : "https://dev-clientapi.fonepay.com"),
  merchantTxnVerificationResource: "/merchant/api/txn_verification",
  
  // Mock mode for development - enables safe testing
  mockMode: process.env.FONEPAY_MOCK_MODE === 'true',
};

// Validate required configuration based on environment
if (fonepay.mode === 'live') {
  if (!process.env.FONEPAY_LIVE_PID) {
    throw new Error('FONEPAY_LIVE_PID environment variable is required for live mode');
  }
  if (!process.env.FONEPAY_LIVE_SECRET_KEY) {
    throw new Error('FONEPAY_LIVE_SECRET_KEY environment variable is required for live mode');
  }
  if (!fonepay.apiUser || !fonepay.apiPass || !fonepay.apiSecret) {
    console.warn('Warning: Live mode requires FONEPAY_API_USER, FONEPAY_API_PASS, and FONEPAY_API_SECRET');
  }
} else {
  // Development mode - using NBQM sandbox credentials
  console.log('✅ Development mode: Using NBQM sandbox credentials for safe testing');
  if (fonepay.mockMode) {
    console.log('🧪 Mock mode enabled: Payment simulation without real API calls');
  }
}

console.log(`🔧 FonePay configured: Mode=${fonepay.mode}, Mock=${fonepay.mockMode}, PID=${fonepay.pid}`);
