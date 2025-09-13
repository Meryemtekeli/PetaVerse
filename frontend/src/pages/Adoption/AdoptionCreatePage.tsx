import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusIcon, 
  PhotoIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { adoptionApi, CreateAdoptionListingRequest } from '../../services/api/adoptionApi';
import { petApi } from '../../services/api/petApi';

interface Pet {
  id: number;
  name: string;
  type: string;
  breed: string;
  age: number;
  gender: string;
  description: string;
  images: string[];
}

const AdoptionCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userPets, setUserPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateAdoptionListingRequest>({
    petId: 0,
    title: '',
    description: '',
    location: '',
    listingType: 'ADOPTION',
    adoptionFee: 0
  });

  useEffect(() => {
    fetchUserPets();
  }, []);

  const fetchUserPets = async () => {
    try {
      const pets = await petApi.getUserPets();
      setUserPets(pets);
      if (pets.length > 0) {
        setSelectedPet(pets[0].id);
        setFormData(prev => ({ ...prev, petId: pets[0].id }));
      }
    } catch (error) {
      console.error('Error fetching user pets:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'adoptionFee' ? parseFloat(value) || 0 : value
    }));
  };

  const handlePetSelection = (petId: number) => {
    setSelectedPet(petId);
    setFormData(prev => ({ ...prev, petId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPet) {
      alert('Lütfen bir evcil hayvan seçin');
      return;
    }

    if (!formData.title || !formData.description || !formData.location) {
      alert('Lütfen tüm gerekli alanları doldurun');
      return;
    }

    setLoading(true);
    try {
      const createdListing = await adoptionApi.createAdoptionListing(formData);
      alert('Sahiplendirme ilanı başarıyla oluşturuldu!');
      navigate(`/adoption/${createdListing.id}`);
    } catch (error) {
      console.error('Error creating adoption listing:', error);
      alert('İlan oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (userPets.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Evcil Hayvan Bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500">
            Sahiplendirme ilanı oluşturmak için önce bir evcil hayvan eklemelisiniz.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/pets/create')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Evcil Hayvan Ekle
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sahiplendirme İlanı Oluştur</h1>
          <p className="mt-2 text-gray-600">
            Evcil hayvanınız için yeni bir sahiplendirme ilanı oluşturun
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Pet Selection */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Evcil Hayvan Seçimi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userPets.map((pet) => (
                <div
                  key={pet.id}
                  onClick={() => handlePetSelection(pet.id)}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedPet === pet.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="aspect-w-1 aspect-h-1 mb-3">
                    <img
                      src={pet.images[0] || '/default-pet.jpg'}
                      alt={pet.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="font-medium text-gray-900">{pet.name}</h3>
                  <p className="text-sm text-gray-500">{pet.breed}</p>
                  <p className="text-sm text-gray-500">{pet.age} ay</p>
                </div>
              ))}
            </div>
          </div>

          {/* Listing Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">İlan Detayları</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  İlan Başlığı *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Örn: Sevimli Golden Retriever Yavrusu"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Evcil hayvanınız hakkında detaylı bilgi verin..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPinIcon className="inline h-4 w-4 mr-1" />
                    Konum *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Şehir, İlçe"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="listingType" className="block text-sm font-medium text-gray-700 mb-2">
                    İlan Türü
                  </label>
                  <select
                    id="listingType"
                    name="listingType"
                    value={formData.listingType}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ADOPTION">Sahiplendirme</option>
                    <option value="BREEDING">Üretim</option>
                    <option value="FOSTER">Geçici Bakım</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="adoptionFee" className="block text-sm font-medium text-gray-700 mb-2">
                  <CurrencyDollarIcon className="inline h-4 w-4 mr-1" />
                  Sahiplendirme Ücreti (TL)
                </label>
                <input
                  type="number"
                  id="adoptionFee"
                  name="adoptionFee"
                  value={formData.adoptionFee}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0 (ücretsiz için)"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Ücretsiz sahiplendirme için 0 yazın
                </p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Ek Bilgiler</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <DocumentTextIcon className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-800">Önemli Notlar</h3>
                  <ul className="mt-2 text-sm text-blue-700 space-y-1">
                    <li>• Sahiplendirme ilanınız yayınlandıktan sonra düzenlenebilir</li>
                    <li>• Başvuruları değerlendirip en uygun adayı seçebilirsiniz</li>
                    <li>• İlanınızı istediğiniz zaman kapatabilirsiniz</li>
                    <li>• Güvenli sahiplendirme için ev ziyareti yapmanızı öneririz</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/adoption')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Oluşturuluyor...' : 'İlanı Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdoptionCreatePage;