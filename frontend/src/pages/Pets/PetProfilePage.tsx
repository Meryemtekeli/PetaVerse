import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  HeartIcon, 
  CalendarIcon, 
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { RootState } from '../../store';

interface PetProfile {
  id: number;
  name: string;
  type: string;
  breed: string;
  color: string;
  age: number;
  weight: number;
  gender: string;
  size: string;
  description: string;
  mainImageUrl: string;
  imageUrls: string[];
  videoUrls: string[];
  status: string;
  isNeutered: boolean;
  isVaccinated: boolean;
  healthNotes: string;
  behaviorNotes: string;
  specialNeeds: string;
  isMicrochipped: boolean;
  microchipNumber: string;
  createdAt: string;
  owner: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    city: string;
  };
}

const PetProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [pet, setPet] = useState<PetProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    // TODO: API'den evcil hayvan verilerini çek
    const mockPet: PetProfile = {
      id: 1,
      name: 'Max',
      type: 'DOG',
      breed: 'Golden Retriever',
      color: 'Altın Sarısı',
      age: 2,
      weight: 25.5,
      gender: 'Erkek',
      size: 'Büyük',
      description: 'Max çok sevimli ve oyunsever bir Golden Retriever. Çocuklarla çok iyi anlaşır ve eğitim almaya açık. Ailesini çok seven, sadık bir dost.',
      mainImageUrl: '/images/pet1.jpg',
      imageUrls: ['/images/pet1.jpg', '/images/pet2.jpg', '/images/pet3.jpg'],
      videoUrls: ['/videos/pet1.mp4'],
      status: 'ACTIVE',
      isNeutered: true,
      isVaccinated: true,
      healthNotes: 'Tüm aşıları tamamlanmış, sağlıklı.',
      behaviorNotes: 'Sakin ve uyumlu, diğer hayvanlarla iyi anlaşır.',
      specialNeeds: 'Özel bir ihtiyacı yok.',
      isMicrochipped: true,
      microchipNumber: 'TR123456789',
      createdAt: '2024-01-15T10:30:00',
      owner: {
        id: 1,
        username: 'ahmet_yilmaz',
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        email: 'ahmet@example.com',
        city: 'İstanbul'
      }
    };

    setTimeout(() => {
      setPet(mockPet);
      setLoading(false);
    }, 1000);
  }, [id]);

  const isOwner = user && pet && user.id === pet.owner.id;

  const getPetTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'DOG': 'Köpek',
      'CAT': 'Kedi',
      'BIRD': 'Kuş',
      'FISH': 'Balık',
      'RABBIT': 'Tavşan',
      'HAMSTER': 'Hamster',
      'OTHER': 'Diğer'
    };
    return types[type] || type;
  };

  const getGenderLabel = (gender: string) => {
    return gender === 'MALE' ? 'Erkek' : gender === 'FEMALE' ? 'Dişi' : gender;
  };

  const getSizeLabel = (size: string) => {
    const sizes: { [key: string]: string } = {
      'SMALL': 'Küçük',
      'MEDIUM': 'Orta',
      'LARGE': 'Büyük'
    };
    return sizes[size] || size;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Evcil hayvan bulunamadı</h2>
          <p className="text-gray-600">Aradığınız evcil hayvan mevcut değil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{pet.name}</h1>
              <p className="text-gray-600 mt-2">
                {getPetTypeLabel(pet.type)} • {pet.breed} • {pet.age} yaşında
              </p>
            </div>
            {isOwner && (
              <div className="flex space-x-2">
                <Link
                  to={`/pets/${pet.id}/edit`}
                  className="btn-outline flex items-center"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Düzenle
                </Link>
                <button className="btn-danger flex items-center">
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Sil
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Images */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="relative h-96 bg-gray-200 rounded-t-lg overflow-hidden">
                <img
                  src={pet.imageUrls[activeImageIndex] || pet.mainImageUrl}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/pet-placeholder.jpg';
                  }}
                />
                {pet.imageUrls.length > 1 && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex space-x-2 overflow-x-auto">
                      {pet.imageUrls.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded border-2 ${
                            index === activeImageIndex
                              ? 'border-primary-500'
                              : 'border-white'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${pet.name} ${index + 1}`}
                            className="w-full h-full object-cover rounded"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Hakkında</h3>
              <p className="text-gray-700 leading-relaxed">{pet.description}</p>
            </div>

            {/* Details */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Detaylar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">{pet.age} yaşında</span>
                </div>
                <div className="flex items-center">
                  <HeartIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">{getGenderLabel(pet.gender)}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium mr-2">Boyut:</span>
                  <span className="text-gray-700">{getSizeLabel(pet.size)}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium mr-2">Ağırlık:</span>
                  <span className="text-gray-700">{pet.weight} kg</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium mr-2">Renk:</span>
                  <span className="text-gray-700">{pet.color}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium mr-2">Kısırlaştırılmış:</span>
                  <span className={`${pet.isNeutered ? 'text-green-600' : 'text-red-600'}`}>
                    {pet.isNeutered ? 'Evet' : 'Hayır'}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium mr-2">Aşılı:</span>
                  <span className={`${pet.isVaccinated ? 'text-green-600' : 'text-red-600'}`}>
                    {pet.isVaccinated ? 'Evet' : 'Hayır'}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium mr-2">Mikroçipli:</span>
                  <span className={`${pet.isMicrochipped ? 'text-green-600' : 'text-red-600'}`}>
                    {pet.isMicrochipped ? 'Evet' : 'Hayır'}
                  </span>
                </div>
              </div>
            </div>

            {/* Health & Behavior */}
            {(pet.healthNotes || pet.behaviorNotes || pet.specialNeeds) && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Sağlık ve Davranış</h3>
                {pet.healthNotes && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Sağlık Notları</h4>
                    <p className="text-gray-700">{pet.healthNotes}</p>
                  </div>
                )}
                {pet.behaviorNotes && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Davranış Notları</h4>
                    <p className="text-gray-700">{pet.behaviorNotes}</p>
                  </div>
                )}
                {pet.specialNeeds && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Özel İhtiyaçlar</h4>
                    <p className="text-gray-700">{pet.specialNeeds}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Owner Info */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sahip Bilgileri</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium mr-2">Ad Soyad:</span>
                  <span className="text-gray-700">{pet.owner.firstName} {pet.owner.lastName}</span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-700">{pet.owner.city}</span>
                </div>
                {!isOwner && (
                  <>
                    <div className="flex items-center">
                      <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-700">+90 555 123 4567</span>
                    </div>
                    <div className="flex items-center">
                      <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-700">{pet.owner.email}</span>
                    </div>
                  </>
                )}
              </div>
              {!isOwner && (
                <div className="mt-4 space-y-2">
                  <button className="btn-primary w-full">
                    <HeartIcon className="h-4 w-4 mr-2" />
                    Sahiplenmek İstiyorum
                  </button>
                  <button className="btn-outline w-full">
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    Mesaj Gönder
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            {isOwner && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
                <div className="space-y-2">
                  <Link
                    to={`/adoption/create?petId=${pet.id}`}
                    className="btn-primary w-full flex items-center justify-center"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Sahiplendirme İlanı Ver
                  </Link>
                  <Link
                    to={`/pets/${pet.id}/health`}
                    className="btn-outline w-full flex items-center justify-center"
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Sağlık Takibi
                  </Link>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">İstatistikler</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Görüntülenme</span>
                  <span className="font-medium">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kayıt Tarihi</span>
                  <span className="font-medium">
                    {new Date(pet.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                {pet.isMicrochipped && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mikroçip No</span>
                    <span className="font-medium">{pet.microchipNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetProfilePage; 