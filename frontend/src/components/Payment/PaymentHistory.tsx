import React, { useState, useEffect } from 'react';
import { Payment, paymentApi } from '../../services/api/paymentApi';
import { useAuth } from '../../store/slices/authSlice';
import { 
  CreditCardIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export const PaymentHistory: React.FC = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadPayments();
    }
  }, [user?.id]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await paymentApi.getUserPayments(user!.id);
      setPayments(data);
    } catch (error) {
      console.error('Failed to load payments:', error);
      setError('Ödeme geçmişi yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'FAILED':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'PENDING':
      case 'PROCESSING':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'REFUNDED':
      case 'PARTIALLY_REFUNDED':
        return <ExclamationTriangleIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Tamamlandı';
      case 'FAILED':
        return 'Başarısız';
      case 'PENDING':
        return 'Beklemede';
      case 'PROCESSING':
        return 'İşleniyor';
      case 'CANCELLED':
        return 'İptal Edildi';
      case 'REFUNDED':
        return 'İade Edildi';
      case 'PARTIALLY_REFUNDED':
        return 'Kısmi İade';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REFUNDED':
      case 'PARTIALLY_REFUNDED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'STRIPE':
      case 'CREDIT_CARD':
      case 'DEBIT_CARD':
        return <CreditCardIcon className="h-5 w-5" />;
      case 'PAYPAL':
        return <div className="h-5 w-5 bg-blue-600 rounded flex items-center justify-center">
          <span className="text-white text-xs font-bold">PP</span>
        </div>;
      default:
        return <CreditCardIcon className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Ödeme geçmişi yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-4xl mb-2">💳</div>
        <p className="text-red-600">{error}</p>
        <button
          onClick={loadPayments}
          className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-8">
        <CreditCardIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Ödeme geçmişi yok</h3>
        <p className="text-gray-600">
          Henüz hiç ödeme yapmamışsınız.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Ödeme Geçmişi</h2>
        <button
          onClick={loadPayments}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Yenile
        </button>
      </div>

      <div className="space-y-3">
        {payments.map((payment) => (
          <div key={payment.id} className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getPaymentMethodIcon(payment.paymentMethod)}
                <div>
                  <h3 className="font-medium text-gray-900">
                    {payment.adoptionListing.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formatDate(payment.createdAt)}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-1">
                  {getStatusIcon(payment.status)}
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                    {getStatusText(payment.status)}
                  </span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {payment.amount} {payment.currency}
                </p>
                {payment.refundAmount && (
                  <p className="text-sm text-blue-600">
                    İade: {payment.refundAmount} {payment.currency}
                  </p>
                )}
              </div>
            </div>
            
            {payment.failureReason && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-600">
                  <strong>Hata:</strong> {payment.failureReason}
                </p>
              </div>
            )}
            
            {payment.refundReason && (
              <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-600">
                  <strong>İade Nedeni:</strong> {payment.refundReason}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
