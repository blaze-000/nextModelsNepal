# Payment System Configuration

## Current Environment Setup

### Development Mode (Active Configuration)
- **Environment**: NBQM Sandbox
- **Mode**: `FONEPAY_MODE=dev`
- **Mock Mode**: `FONEPAY_MOCK_MODE=true`
- **PID**: `NBQM` (FonePay development merchant)
- **Base URL**: `https://41d11b05178b.ngrok-free.app` (Your ngrok tunnel)
- **Safe Testing**: ✅ No real money transactions

### Credentials in Use
```bash
FONEPAY_DEV_PID=NBQM
FONEPAY_DEV_SECRET_KEY=a7e3512f5032480a83137793cb2021dc
APP_BASE_URL=https://41d11b05178b.ngrok-free.app
```

### Production Mode
- **Live Credentials**: Use your actual FonePay merchant account
- **Real Transactions**: Will process actual payments
- **S2S Verification**: Full server-to-server verification enabled

## Configuration Files

### `.env` (Development)
- Currently configured for safe development testing
- Uses `FONEPAY_DEV_PID` and `FONEPAY_DEV_SECRET_KEY`
- Mock mode enabled for testing

### `.env.production.example` (Production Template)
- Contains your actual live credentials
- Copy to `.env.production` for production deployment
- Uses `FONEPAY_LIVE_PID` and `FONEPAY_LIVE_SECRET_KEY`

## Switching Between Environments

### For Development:
```bash
FONEPAY_MODE=dev
FONEPAY_MOCK_MODE=true
```

### For Production:
```bash
FONEPAY_MODE=live
FONEPAY_MOCK_MODE=false
```

## Security Best Practices

1. **Never commit live credentials** to version control
2. **Use environment variables** for all sensitive data
3. **Separate dev and live credentials** clearly
4. **Test thoroughly in dev mode** before going live
5. **Use .env.local or .env.production** for production secrets

## Testing the Payment System

### In Development Mode:
1. Start the backend: `npm run dev`
2. Create a payment via API: `POST /api/fonepay/payment`
3. Use the mock URL returned to simulate payment
4. Check payment status: `GET /api/fonepay/payment/status/:prn`

### Mock Payment Flow:
1. Payment creation returns a mock URL
2. Mock page has "Success" and "Failed" buttons
3. Clicking either simulates the respective outcome
4. Returns to your return URL with test parameters

## API Endpoints

- `POST /api/fonepay/payment` - Create payment
- `GET /api/fonepay/payment/mock` - Mock payment simulator
- `POST/GET /api/fonepay/payment/return` - Payment return handler
- `GET /api/fonepay/payment/status/:prn` - Check payment status
- `GET /api/fonepay/payment` - List all payments (admin)

## Troubleshooting

### Common Issues:
1. **Missing environment variables**: Check the validation messages in console
2. **Wrong mode**: Ensure FONEPAY_MODE matches your intent
3. **Credential mismatch**: Verify dev vs live credential usage
4. **Database connection**: Ensure MongoDB is running for local dev

### Debug Information:
The system logs extensively in development mode. Check console output for:
- Payment creation steps
- DV generation and verification
- Return URL processing
- Vote crediting confirmation