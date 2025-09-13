import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { chatApi } from '../../services/api/chatApi';
import { useAuth } from '../../store/slices/authSlice';
import { PaymentModal } from '../../components/Payment/PaymentModal';
import { 
  HeartIcon, 
  MapPinIcon, 
  CalendarIcon, 
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

interface AdoptionListing {
  id: number;
  title: string;
  description: string;
  location: string;
  adoptionFee: number;
  status: string;
  createdAt: string;
  pet: {
    id: number;
    name: string;
    type: string;
    breed: string;
    age: number;
    gender: string;
    description: string;
    images: string[];
  };
  owner: {
    id: number;
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
}

const AdoptionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState<AdoptionListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchListing = async () => {
      try {
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockListing: AdoptionListing = {
          id: parseInt(id || '1'),
          title: "Sevimli Golden Retriever Yavrusu",
          description: "3 aylık, çok enerjik ve oyuncu bir Golden Retriever yavrusu. Ailesini çok seven, çocuklarla iyi anlaşan bir köpek. Tüm aşıları yapılmış ve sağlıklı.",
          location: "İstanbul, Kadıköy",
          adoptionFee: 0,
          status: "ACTIVE",
          createdAt: "2024-01-15T10:00:00Z",
          pet: {
            id: 1,
            name: "Max",
            type: "DOG",
            breed: "Golden Retriever",
            age: 3,
            gender: "MALE",
            description: "Max çok enerjik ve oyuncu bir yavru. Günde en az 2 saat egzersiz ihtiyacı var. Çok zeki ve eğitime açık.",
            images: [
              "https://images.unsplash.com/photo-1552053831-71594a27632d?w=500",
              "https://images.unsplash.com/photo-1552053831-71594a27632d?w=500",
              "https://images.unsplash.com/photo-1552053831-71594a27632d?w=500"
            ]
          },
          owner: {
            id: 1,
            name: "Ayşe Yılmaz",
            email: "ayse.yilmaz@email.com",
            phone: "+90 555 123 4567",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100"
          }
        };
        
        setListing(mockListing);
      } catch (err) {
        setError('İlan yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    // TODO: Implement like functionality
  };

  const handleContact = () => {
    setShowContactForm(true);
  };

  const handleStartChat = async () => {
    if (!user || !listing) return;
    
    try {
      // Create or get chat room
      const chatRoom = await chatApi.createOrGetChatRoom(listing.id, user.id);
      
      // Navigate to chat page with the specific room
      navigate(`/chat?room=${chatRoom.id}`);
    } catch (error) {
      console.error('Failed to start chat:', error);
      // Fallback to contact form
      setShowContactForm(true);
    }
  };

  const handlePayment = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (payment: any) => {
    console.log('Payment successful:', payment);
    // You could show a success message or redirect
  };

  const handleAdopt = () => {
    navigate(`/adoption/${id}/apply`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hata</h2>
          <p className="text-gray-600 mb-4">{error || 'İlan bulunamadı'}</p>
          <button
            onClick={() => navigate('/adoption')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <button
                onClick={() => navigate('/adoption')}
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Sahiplendirme
              </button>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-gray-400 mx-2">/</span>
                <span className="text-sm font-medium text-gray-500">{listing.title}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Images */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={listing.pet.images[0]}
                  alt={listing.pet.name}
                  className="w-full h-96 object-cover"
                />
              </div>
              {/* Thumbnail images */}
              <div className="p-4 flex space-x-2 overflow-x-auto">
                {listing.pet.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${listing.pet.name} ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-75"
                  />
                ))}
              </div>
            </div>

            {/* Pet Information */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{listing.title}</h1>
              <p className="text-gray-600 mb-6">{listing.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{listing.pet.age}</div>
                  <div className="text-sm text-gray-500">Ay</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{listing.pet.gender === 'MALE' ? 'Erkek' : 'Dişi'}</div>
                  <div className="text-sm text-gray-500">Cinsiyet</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{listing.pet.breed}</div>
                  <div className="text-sm text-gray-500">Irk</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{listing.pet.type === 'DOG' ? 'Köpek' : 'Kedi'}</div>
                  <div className="text-sm text-gray-500">Tür</div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Detaylı Bilgi</h3>
                <p className="text-gray-600">{listing.pet.description}</p>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center mb-4">
                <MapPinIcon className="h-6 w-6 text-red-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Konum</h3>
              </div>
              <p className="text-gray-600">{listing.location}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Adoption Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {listing.adoptionFee === 0 ? 'Ücretsiz' : `${listing.adoptionFee} TL`}
                </div>
                <div className="text-sm text-gray-500">Sahiplendirme Ücreti</div>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={handleAdopt}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Sahiplenmek İstiyorum
                </button>
                
                {user && user.id !== listing.owner.id ? (
                  <div className="space-y-3">
                    <button
                      onClick={handleStartChat}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      <ChatBubbleLeftIcon className="h-5 w-5 inline mr-2" />
                      Sohbet Başlat
                    </button>
                    {listing.adoptionFee > 0 && (
                      <button
                        onClick={handlePayment}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        💳 Ödeme Yap
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={handleContact}
                    className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    <ChatBubbleLeftIcon className="h-5 w-5 inline mr-2" />
                    İletişime Geç
                  </button>
                )}

                <button
                  onClick={handleLike}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    isLiked 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <HeartIcon className={`h-5 w-5 inline mr-2 ${isLiked ? 'text-red-600' : 'text-gray-600'}`} />
                  {isLiked ? 'Beğenildi' : 'Beğen'}
                </button>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  İlan Tarihi: {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
                </div>
                <div className="text-sm text-gray-500">
                  Durum: <span className="text-green-600 font-medium">{listing.status === 'ACTIVE' ? 'Aktif' : 'Pasif'}</span>
                </div>
              </div>
            </div>

            {/* Owner Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <img
                  src={listing.owner.avatar}
                  alt={listing.owner.name}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{listing.owner.name}</h3>
                  <p className="text-sm text-gray-500">İlan Sahibi</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  {listing.owner.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  {listing.owner.phone}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">İletişime Geç</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mesajınız
                </label>
                <textarea
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Sahiplenmek istediğiniz hayvan hakkında bilgi almak için mesajınızı yazın..."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  Gönder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {listing && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          adoptionListingId={listing.id}
          adoptionFee={listing.adoptionFee}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default AdoptionDetailPage;