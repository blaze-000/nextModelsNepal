import Axios from './axios-instance';

export interface PaymentRequest {
  amount: number;
  vote: number;
  contestant: string;
  description?: string;
  r1?: string;
  r2?: string;
}

export interface PaymentResponse {
  prn: string;
  redirectUrl: string;
}

export interface PaymentStatusResponse {
  success: boolean;
  status?: string;
  payment?: any;
  message?: string;
}

/**
 * Create a payment session with FonePay
 */
export const createPayment = async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
  try {
    const response = await Axios.post('/api/payment', paymentData);
    return response.data;
  } catch (error: any) {
    console.error('Payment creation failed:', error);
    throw new Error(error.response?.data?.message || 'Failed to create payment');
  }
};

/**
 * Get payment status by PRN
 */
export const getPaymentStatus = async (prn: string): Promise<PaymentStatusResponse> => {
  try {
    const response = await Axios.get(`/api/payment/status/${prn}`);
    return response.data;
  } catch (error: any) {
    console.error('Payment status check failed:', error);
    throw new Error(error.response?.data?.message || 'Failed to get payment status');
  }
};

/**
 * Process FonePay payment redirect
 */
export const redirectToPayment = (redirectUrl: string, autoSubmit: boolean = true) => {
  if (autoSubmit) {
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1000);
  } else {
    window.location.href = redirectUrl;
  }
};

/**
 * Create payment form for FonePay gateway
 */
export const createPaymentForm = (redirectUrl: string, autoSubmit: boolean = true): HTMLFormElement => {
  const url = new URL(redirectUrl);
  const params = Object.fromEntries(url.searchParams);
  
  const form = document.createElement('form');
  form.method = 'GET';
  form.action = url.origin + url.pathname;
  form.id = 'payment-form';
  form.style.display = 'none';
  
  const paramOrder = ['PID', 'MD', 'AMT', 'CRN', 'DT', 'RI', 'R1', 'R2', 'DV', 'RU', 'PRN'];
  
  paramOrder.forEach(paramName => {
    if (params[paramName]) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = paramName;
      input.value = params[paramName];
      form.appendChild(input);
    }
  });
  
  document.body.appendChild(form);
  
  if (autoSubmit) {
    setTimeout(() => {
      form.submit();
    }, 2500);
  }
  
  return form;
};

/**
 * Validate contestant exists before payment
 */
export const validateContestant = async (contestantId: string): Promise<boolean> => {
  try {
    const response = await Axios.get(`/api/contestants/${contestantId}`);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};