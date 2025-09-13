import React, { useState } from 'react';
import { XMarkIcon, CreditCardIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { paymentApi, Payment } from '../../services/api/paymentApi';
import { useAuth } from '../../store/slices/authSlice';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  adoptionListingId: number;
  adoptionFee: number;
  onPaymentSuccess?: (payment: Payment) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  adoptionListingId,
  adoptionFee,
  onPaymentSuccess
}) => {
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<'stripe' | 'paypal' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentCreated, setPaymentCreated] = useState<Payment | null>(null);

  const handlePaymentMethodSelect = async (method: 'stripe' | 'paypal') => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Create payment
      const payment = await paymentApi.createPayment({
        userId: user.id,
        adoptionListingId,
        paymentMethod: method.toUpperCase()
      });

      setPaymentCreated(payment);
      setSelectedMethod(method);

      // Simulate payment processing
      setTimeout(async () => {
        try {
          let processedPayment: Payment;
          
          if (method === 'stripe') {
            processedPayment = await paymentApi.processStripePayment(
              payment.id, 
              'stripe_token_' + Date.now()
            );
          } else {
            processedPayment = await paymentApi.processPayPalPayment(
              payment.id, 
              'paypal_order_' + Date.now()
            );
          }

          onPaymentSuccess?.(processedPayment);
          onClose();
        } catch (error) {
          console.error('Payment processing failed:', error);
          setError('Ödeme işlemi başarısız oldu');
        } finally {
          setLoading(false);
        }
      }, 2000);

    } catch (error) {
      console.error('Failed to create payment:', error);
      setError('Ödeme oluşturulamadı');
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedMethod(null);
      setPaymentCreated(null);
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Ödeme Yap
              </h3>
              <button
                onClick={handleClose}
                disabled={loading}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Payment Amount */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Ödenecek Tutar</p>
                <p className="text-3xl font-bold text-gray-900">
                  {adoptionFee === 0 ? 'Ücretsiz' : `${adoptionFee} TL`}
                </p>
              </div>
            </div>

            {adoptionFee === 0 ? (
              <div className="text-center py-8">
                <BanknotesIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-600">Bu sahiplendirme ücretsizdir.</p>
                <button
                  onClick={handleClose}
                  className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                  Tamam
                </button>
              </div>
            ) : (
              <>
                {!selectedMethod ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Ödeme yönteminizi seçin:
                    </p>
                    
                    <button
                      onClick={() => handlePaymentMethodSelect('stripe')}
                      disabled={loading}
                      className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CreditCardIcon className="h-6 w-6 mr-3 text-blue-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Kredi/Banka Kartı</p>
                        <p className="text-sm text-gray-600">Stripe ile güvenli ödeme</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handlePaymentMethodSelect('paypal')}
                      disabled={loading}
                      className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="h-6 w-6 mr-3 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">PP</span>
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">PayPal</p>
                        <p className="text-sm text-gray-600">PayPal hesabınızla ödeme</p>
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">
                          {selectedMethod === 'stripe' ? 'Kart bilgileriniz işleniyor...' : 'PayPal ile ödeme işleniyor...'}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="text-green-500 text-4xl mb-4">✓</div>
                        <p className="text-gray-600">Ödeme başarıyla tamamlandı!</p>
                      </>
                    )}
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
