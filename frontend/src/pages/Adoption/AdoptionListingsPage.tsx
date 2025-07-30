import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartIcon, 
  MapPinIcon, 
  CalendarIcon,
  FilterIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface AdoptionListing {
  id: number;
  title: string;
  petName: string;
  petType: string;
  breed: string;
  age: number;
  location: string;
  imageUrl: string;
  isUrgent: boolean;
  createdAt: string;
  adoptionFee: number;
}

const AdoptionListingsPage: React.FC = () => {
  const [listings, setListings] = useState<AdoptionListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    breed: '',
    location: '',
    age: '',
    price: '',
  });

  useEffect(() => {
    // TODO: API'den verileri çek
    const mockListings: AdoptionListing[] = [
      {
        id: 1,
        title: 'Sevimli Golden Retriever Yavrusu',
        petName: 'Max',
        petType: 'DOG',
        breed: 'Golden Retriever',
        age: 2,
        location: 'İstanbul, Kadıköy',
        imageUrl: '/images/pet1.jpg',
        isUrgent: true,
        createdAt: '2024-01-15',
        adoptionFee: 0,
      },
      {
        id: 2,
        title: 'Sakin ve Sevimli Kedi',
        petName: 'Luna',
        petType: 'CAT',
        breed: 'British Shorthair',
        age: 1,
        location: 'Ankara, Çankaya',
        imageUrl: '/images/pet2.jpg',
        isUrgent: false,
        createdAt: '2024-01-14',
        adoptionFee: 500,
      },
      {
        id: 3,
        title: 'Aktif ve Oyunsever Köpek',
        petName: 'Rocky',
        petType: 'DOG',
        breed: 'Border Collie',
        age: 3,
        location: 'İzmir, Konak',
        imageUrl: '/images/pet3.jpg',
        isUrgent: false,
        createdAt: '2024-01-13',
        adoptionFee: 0,
      },
    ];

    setTimeout(() => {
      setListings(mockListings);
      setLoading(false);
    }, 1000);
  }, []);

  const petTypes = [
    { value: '', label: 'Tüm Türler' },
    { value: 'DOG', label: 'Köpek' },
    { value: 'CAT', label: 'Kedi' },
    { value: 'BIRD', label: 'Kuş' },
    { value: 'OTHER', label: 'Diğer' },
  ];

  const ageRanges = [
    { value: '', label: 'Tüm Yaşlar' },
    { value: '0-1', label: '0-1 yaş' },
    { value: '1-3', label: '1-3 yaş' },
    { value: '3-7', label: '3-7 yaş' },
    { value: '7+', label: '7+ yaş' },
  ];

  const priceRanges = [
    { value: '', label: 'Tüm Fiyatlar' },
    { value: 'free', label: 'Ücretsiz' },
    { value: '0-500', label: '0-500 TL' },
    { value: '500-1000', label: '500-1000 TL' },
    { value: '1000+', label: '1000+ TL' },
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredListings = listings.filter(listing => {
    if (filters.type && listing.petType !== filters.type) return false;
    if (filters.breed && !listing.breed.toLowerCase().includes(filters.breed.toLowerCase())) return false;
    if (filters.location && !listing.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.age) {
      const [min, max] = filters.age.split('-').map(Number);
      if (max && (listing.age < min || listing.age > max)) return false;
      if (!max && listing.age < min) return false;
    }
    if (filters.price) {
      if (filters.price === 'free' && listing.adoptionFee > 0) return false;
      if (filters.price !== 'free') {
        const [min, max] = filters.price.split('-').map(Number);
        if (max && (listing.adoptionFee < min || listing.adoptionFee > max)) return false;
        if (!max && listing.adoptionFee < min) return false;
      }
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sahiplendirme İlanları
          </h1>
          <p className="text-gray-600">
            Evcil hayvanlarınızı güvenle sahiplendirin veya yeni aile üyelerinizi bulun.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="İlan ara..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  value={filters.breed}
                  onChange={(e) => handleFilterChange('breed', e.target.value)}
                />
              </div>
            </div>

            {/* Pet Type */}
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                {petTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Age */}
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                value={filters.age}
                onChange={(e) => handleFilterChange('age', e.target.value)}
              >
                {ageRanges.map(age => (
                  <option key={age.value} value={age.value}>
                    {age.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                value={filters.price}
                onChange={(e) => handleFilterChange('price', e.target.value)}
              >
                {priceRanges.map(price => (
                  <option key={price.value} value={price.value}>
                    {price.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <input
                type="text"
                placeholder="Konum..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            {filteredListings.length} ilan bulundu
          </p>
          <Link
            to="/adoption/create"
            className="btn-primary flex items-center"
          >
            <HeartIcon className="h-4 w-4 mr-2" />
            İlan Ver
          </Link>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={listing.imageUrl}
                  alt={listing.petName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/pet-placeholder.jpg';
                  }}
                />
                {listing.isUrgent && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Acil
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded text-sm font-medium">
                  {listing.adoptionFee === 0 ? 'Ücretsiz' : `${listing.adoptionFee} TL`}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {listing.title}
                </h3>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <HeartIcon className="h-4 w-4 mr-2" />
                    <span>{listing.petName} • {listing.breed}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>{listing.age} yaşında</span>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    <span>{listing.location}</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                  <Link
                    to={`/adoption/${listing.id}`}
                    className="btn-primary text-sm"
                  >
                    Detayları Gör
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              İlan bulunamadı
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Filtrelerinizi değiştirerek tekrar deneyin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdoptionListingsPage; 