import Axios from './axios-instance';

export interface PaymentRequest {
  amount: number;
  vote: number;
  contestant_Id: string;
  description?: string;
  purpose?: string;
  r1?: string;
  r2?: string;
}

export interface BulkPaymentRequest {
  amount: number;
  vote: number;
  contestant_Id: string;
  description?: string;
  purpose?: string;
  r1?: string;
  r2?: string;
}

export interface PaymentResponse {
  prn: string;
  redirectUrl: string;
}

export interface ContestantInfo {
  id: string;
  name: string;
  votes: number;
}

export interface SimplifiedPaymentResponse {
  message: string;
  isSuccess: boolean;
  status: string;
  prn: string;
  contestants?: ContestantInfo[];
  amount: number;
  event?: string;
  bankCode?: string;
  accountNumber?: string;
}

export interface PaymentStatusResponse {
  success: boolean;
  status?: string;
  payment?: SimplifiedPaymentResponse;
  message?: string;
}

/**
 * Create a payment session with FonePay
 */
export const createPayment = async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
  try {
    const response = await Axios.post('/api/fonepay/payment', paymentData);
    return response.data;
  } catch (error: unknown) {
    // Production: Payment creation error handled
    const errorMessage = error instanceof Error ? error.message : 'Failed to create payment';
    throw new Error(errorMessage);
  }
};

/**
 * Create a bulk payment session with FonePay for multiple contestants
 */
export const createBulkPayment = async (paymentData: BulkPaymentRequest): Promise<PaymentResponse> => {
  try {    
    const response = await Axios.post('/api/fonepay/payment', paymentData);
    return response.data;
  } catch (error: unknown) {
    // Production: Bulk payment creation error handled
    const errorMessage = error instanceof Error ? error.message : 'Failed to create bulk payment';
    throw new Error(errorMessage);
  }
};

/**
 * Get payment status by PRN
 */
export const getPaymentStatus = async (prn: string): Promise<PaymentStatusResponse> => {
  try {
    const response = await Axios.get(`/api/fonepay/payment/status/${prn}`);
    return response.data;
  } catch (error: unknown) {
    // Production: Payment status check error handled
    const errorMessage = error instanceof Error ? error.message : 'Failed to get payment status';
    throw new Error(errorMessage);
  }
};

/**
 * Process FonePay payment redirect with error handling
 */
export const redirectToPayment = (redirectUrl: string, autoSubmit: boolean = true) => {
  try {
    if (autoSubmit) {
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1000);
    } else {
      window.location.href = redirectUrl;
    }
  } catch (error) {
    console.error('Error redirecting to payment gateway:', error);
    // Show user-friendly error message
    alert('Failed to redirect to payment gateway. Please try again or contact support.');
  }
};

/**
 * Create payment form for FonePay gateway with error handling
 */
export const createPaymentForm = (redirectUrl: string, autoSubmit: boolean = true): HTMLFormElement => {
  try {
    const url = new URL(redirectUrl);
    const params = Object.fromEntries(url.searchParams);
    
    const form = document.createElement('form');
    form.method = 'GET';
    form.action = url.origin + url.pathname;
    form.id = 'payment-form';
    form.style.display = 'none';
    
    // Parameter order should match FonePay specification for proper DV verification:
    // PID,MD,PRN,AMT,CRN,DT,R1,R2,RU,DV
    const paramOrder = ['PID', 'MD', 'PRN', 'AMT', 'CRN', 'DT', 'R1', 'R2', 'RU', 'DV'];
    
    paramOrder.forEach(paramName => {
      if (params[paramName]) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = paramName;
        // Use the parameter value as-is since it's already properly encoded
        input.value = params[paramName];
        form.appendChild(input);
      }
    });
    
    document.body.appendChild(form);
    
    if (autoSubmit) {
      setTimeout(() => {
        try {
          form.submit();
        } catch (submitError) {
          console.error('Error submitting payment form:', submitError);
          alert('Failed to submit payment form. Please try again or contact support.');
        }
      }, 2500);
    }
    
    return form;
  } catch (error) {
    console.error('Error creating payment form:', error);
    alert('Failed to create payment form. Please try again or contact support.');
    throw error;
  }
};

/**
 * Validate contestant exists before payment
 */
export const validateContestant = async (contestantId: string): Promise<boolean> => {
  try {
    const response = await Axios.get(`/api/contestants/${contestantId}`);
    return response.status === 200;
  } catch (error: unknown) {
    console.log(error)
    return false;
  }
};