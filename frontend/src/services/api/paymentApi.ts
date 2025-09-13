import { apiClient } from './apiClient';

export interface Payment {
  id: number;
  amount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
  paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'PAYPAL' | 'STRIPE' | 'CASH' | 'CRYPTO';
  paymentProvider?: string;
  paymentProviderId?: string;
  currency: string;
  description?: string;
  failureReason?: string;
  refundAmount?: number;
  refundReason?: string;
  refundedAt?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt?: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  adoptionListing: {
    id: number;
    title: string;
    description: string;
    adoptionFee: number;
  };
}

export interface PaymentStatistics {
  totalCompletedPayments: number;
  totalRevenue: number;
  averagePaymentAmount: number;
}

export interface CreatePaymentRequest {
  userId: number;
  adoptionListingId: number;
  paymentMethod: string;
}

export interface ProcessPaymentRequest {
  paymentId: number;
  stripeToken?: string;
  paypalOrderId?: string;
}

export interface RefundPaymentRequest {
  paymentId: number;
  refundAmount: number;
  reason: string;
}

export const paymentApi = {
  // Create a new payment
  createPayment: async (request: CreatePaymentRequest): Promise<Payment> => {
    const response = await apiClient.post('/payments/create', null, {
      params: request
    });
    return response.data;
  },

  // Process Stripe payment
  processStripePayment: async (paymentId: number, stripeToken: string): Promise<Payment> => {
    const response = await apiClient.post('/payments/stripe/process', null, {
      params: { paymentId, stripeToken }
    });
    return response.data;
  },

  // Process PayPal payment
  processPayPalPayment: async (paymentId: number, paypalOrderId: string): Promise<Payment> => {
    const response = await apiClient.post('/payments/paypal/process', null, {
      params: { paymentId, paypalOrderId }
    });
    return response.data;
  },

  // Refund a payment
  refundPayment: async (request: RefundPaymentRequest): Promise<Payment> => {
    const response = await apiClient.post('/payments/refund', null, {
      params: request
    });
    return response.data;
  },

  // Get user payments
  getUserPayments: async (userId: number): Promise<Payment[]> => {
    const response = await apiClient.get(`/payments/user/${userId}`);
    return response.data;
  },

  // Get payments for an adoption listing
  getAdoptionListingPayments: async (adoptionListingId: number): Promise<Payment[]> => {
    const response = await apiClient.get(`/payments/adoption-listing/${adoptionListingId}`);
    return response.data;
  },

  // Get payment statistics
  getPaymentStatistics: async (): Promise<PaymentStatistics> => {
    const response = await apiClient.get('/payments/statistics');
    return response.data;
  },

  // Cancel pending payments (admin only)
  cancelPendingPayments: async (): Promise<void> => {
    await apiClient.post('/payments/cancel-pending');
  }
};
