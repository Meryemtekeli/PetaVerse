import React, { useState, useEffect } from 'react';
import { PetResponse, PetFilters, petApiService } from '../../services/api/petApi';
import PetCard from './PetCard';
import { 
    FunnelIcon, 
    MagnifyingGlassIcon,
    AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

interface PetListProps {
    filters?: PetFilters;
    showFilters?: boolean;
    onPetSelect?: (pet: PetResponse) => void;
    className?: string;
}

const PetList: React.FC<PetListProps> = ({
    filters = {},
    showFilters = true,
    onPetSelect,
    className = ''
}) => {
    const [pets, setPets] = useState<PetResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentFilters, setCurrentFilters] = useState<PetFilters>(filters);
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [selectedSize, setSelectedSize] = useState<string>('');

    useEffect(() => {
        loadPets();
    }, [currentFilters]);

    const loadPets = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await petApiService.getPets(currentFilters);
            setPets(response.content);
        } catch (err) {
            setError('Evcil hayvanlar yüklenirken bir hata oluştu');
            console.error('Pet listesi yükleme hatası:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        const newFilters: PetFilters = {
            ...currentFilters,
            search: searchQuery || undefined,
            type: selectedType || undefined,
            status: selectedStatus || undefined
        };
        setCurrentFilters(newFilters);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedType('');
        setSelectedStatus('');
        setSelectedSize('');
        setCurrentFilters({});
    };

    const handlePetLike = async (petId: number) => {
        // TODO: Implement like functionality
        console.log('Pet liked:', petId);
    };

    const handlePetComment = (petId: number) => {
        // TODO: Implement comment functionality
        console.log('Pet comment:', petId);
    };

    const handlePetShare = (pet: PetResponse) => {
        // TODO: Implement share functionality
        if (navigator.share) {
            navigator.share({
                title: `${pet.name} - Evcil Hayvan Profili`,
                text: `${pet.name} hakkında bilgi alın`,
                url: window.location.href
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(window.location.href);
            alert('Link kopyalandı!');
        }
    };

    const handlePetViewDetails = (petId: number) => {
        if (onPetSelect) {
            const pet = pets.find(p => p.id === petId);
            if (pet) {
                onPetSelect(pet);
            }
        }
    };

    const petTypes = [
        { value: 'DOG', label: '🐕 Köpek' },
        { value: 'CAT', label: '🐱 Kedi' },
        { value: 'BIRD', label: '🐦 Kuş' },
        { value: 'FISH', label: '🐠 Balık' },
        { value: 'RABBIT', label: '🐰 Tavşan' },
        { value: 'HAMSTER', label: '🐹 Hamster' },
        { value: 'GUINEA_PIG', label: '🐹 Gine Domuzu' },
        { value: 'FERRET', label: '🦦 Gelincik' },
        { value: 'REPTILE', label: '🦎 Sürüngen' },
        { value: 'HORSE', label: '🐎 At' },
        { value: 'OTHER', label: '🐾 Diğer' }
    ];

    const petStatuses = [
        { value: 'ACTIVE', label: 'Aktif' },
        { value: 'ADOPTED', label: 'Sahiplenildi' },
        { value: 'LOST', label: 'Kayıp' },
        { value: 'FOUND', label: 'Bulundu' },
        { value: 'DECEASED', label: 'Vefat' },
        { value: 'INACTIVE', label: 'Pasif' }
    ];

    const petSizes = [
        { value: 'SMALL', label: 'Küçük' },
        { value: 'MEDIUM', label: 'Orta' },
        { value: 'LARGE', label: 'Büyük' }
    ];

    if (loading) {
        return (
            <div className={`flex items-center justify-center h-64 ${className}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Evcil hayvanlar yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`text-center py-8 ${className}`}>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                    onClick={loadPets}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Tekrar Dene
                </button>
            </div>
        );
    }

    return (
        <div className={className}>
            {/* Search and Filters */}
            {showFilters && (
                <div className="mb-6">
                    {/* Search Bar */}
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Evcil hayvan ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <button
                            onClick={() => setShowFilterPanel(!showFilterPanel)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                            <FunnelIcon className="h-5 w-5" />
                            Filtreler
                        </button>
                        
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Ara
                        </button>
                    </div>

                    {/* Filter Panel */}
                    {showFilterPanel && (
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Type Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tür
                                    </label>
                                    <select
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Tümü</option>
                                        {petTypes.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Status Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Durum
                                    </label>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Tümü</option>
                                        {petStatuses.map(status => (
                                            <option key={status.value} value={status.value}>
                                                {status.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Size Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Boyut
                                    </label>
                                    <select
                                        value={selectedSize}
                                        onChange={(e) => setSelectedSize(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Tümü</option>
                                        {petSizes.map(size => (
                                            <option key={size.value} value={size.value}>
                                                {size.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Clear Filters */}
                                <div className="flex items-end">
                                    <button
                                        onClick={clearFilters}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Filtreleri Temizle
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Results Count */}
            <div className="mb-4">
                <p className="text-gray-600">
                    {pets.length} evcil hayvan bulundu
                </p>
            </div>

            {/* Pet Grid */}
            {pets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {pets.map(pet => (
                        <PetCard
                            key={pet.id}
                            pet={pet}
                            onLike={handlePetLike}
                            onComment={handlePetComment}
                            onShare={handlePetShare}
                            onViewDetails={handlePetViewDetails}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🐾</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Evcil hayvan bulunamadı
                    </h3>
                    <p className="text-gray-600">
                        Arama kriterlerinize uygun evcil hayvan bulunamadı. Filtreleri değiştirmeyi deneyin.
                    </p>
                </div>
            )}
        </div>
    );
};

export default PetList;
