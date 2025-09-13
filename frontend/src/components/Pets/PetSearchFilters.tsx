import React, { useState } from 'react';
import { 
    MagnifyingGlassIcon, 
    FunnelIcon, 
    XMarkIcon,
    AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

export interface PetSearchFilters {
    search?: string;
    type?: string;
    breed?: string;
    status?: string;
    gender?: string;
    size?: string;
    city?: string;
    minAge?: number;
    maxAge?: number;
    isNeutered?: boolean;
    isVaccinated?: boolean;
    isMicrochipped?: boolean;
}

interface PetSearchFiltersProps {
    filters: PetSearchFilters;
    onFiltersChange: (filters: PetSearchFilters) => void;
    onSearch: () => void;
    onClear: () => void;
    className?: string;
}

const PetSearchFilters: React.FC<PetSearchFiltersProps> = ({
    filters,
    onFiltersChange,
    onSearch,
    onClear,
    className = ''
}) => {
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [localFilters, setLocalFilters] = useState<PetSearchFilters>(filters);

    const handleFilterChange = (key: keyof PetSearchFilters, value: any) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
    };

    const handleSearch = () => {
        onFiltersChange(localFilters);
        onSearch();
    };

    const handleClear = () => {
        const clearedFilters: PetSearchFilters = {};
        setLocalFilters(clearedFilters);
        onFiltersChange(clearedFilters);
        onClear();
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

    const petGenders = [
        { value: 'MALE', label: '♂️ Erkek' },
        { value: 'FEMALE', label: '♀️ Dişi' }
    ];

    const petSizes = [
        { value: 'SMALL', label: '🐹 Küçük' },
        { value: 'MEDIUM', label: '🐕 Orta' },
        { value: 'LARGE', label: '🐎 Büyük' }
    ];

    const activeFiltersCount = Object.values(localFilters).filter(value => 
        value !== undefined && value !== '' && value !== null
    ).length;

    return (
        <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <MagnifyingGlassIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Evcil Hayvan Ara & Filtrele
                </h3>
                <button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                    <FunnelIcon className="h-4 w-4 mr-2" />
                    {showAdvancedFilters ? 'Basit' : 'Gelişmiş'}
                </button>
            </div>

            {/* Basic Search */}
            <div className="mb-6">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Arama
                        </label>
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="İsim, ırk, açıklama..."
                                value={localFilters.search || ''}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    
                    <div className="w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tür
                        </label>
                        <select
                            value={localFilters.type || ''}
                            onChange={(e) => handleFilterChange('type', e.target.value)}
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

                    <div className="w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Durum
                        </label>
                        <select
                            value={localFilters.status || ''}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
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
                </div>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                        <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
                        Gelişmiş Filtreler
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Breed */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Irk
                            </label>
                            <input
                                type="text"
                                placeholder="Irk ara..."
                                value={localFilters.breed || ''}
                                onChange={(e) => handleFilterChange('breed', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cinsiyet
                            </label>
                            <select
                                value={localFilters.gender || ''}
                                onChange={(e) => handleFilterChange('gender', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Tümü</option>
                                {petGenders.map(gender => (
                                    <option key={gender.value} value={gender.value}>
                                        {gender.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Size */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Boyut
                            </label>
                            <select
                                value={localFilters.size || ''}
                                onChange={(e) => handleFilterChange('size', e.target.value)}
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

                        {/* City */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Şehir
                            </label>
                            <input
                                type="text"
                                placeholder="Şehir ara..."
                                value={localFilters.city || ''}
                                onChange={(e) => handleFilterChange('city', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Age Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Yaş Aralığı
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    min="0"
                                    value={localFilters.minAge || ''}
                                    onChange={(e) => handleFilterChange('minAge', e.target.value ? parseInt(e.target.value) : undefined)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-gray-500 self-center">-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    min="0"
                                    value={localFilters.maxAge || ''}
                                    onChange={(e) => handleFilterChange('maxAge', e.target.value ? parseInt(e.target.value) : undefined)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Health Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sağlık Durumu
                            </label>
                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={localFilters.isVaccinated || false}
                                        onChange={(e) => handleFilterChange('isVaccinated', e.target.checked)}
                                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="text-sm text-gray-700">💉 Aşılı</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={localFilters.isNeutered || false}
                                        onChange={(e) => handleFilterChange('isNeutered', e.target.checked)}
                                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="text-sm text-gray-700">✂️ Kısırlaştırılmış</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={localFilters.isMicrochipped || false}
                                        onChange={(e) => handleFilterChange('isMicrochipped', e.target.checked)}
                                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="text-sm text-gray-700">🏷️ Mikroçipli</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium text-gray-700">
                            Aktif Filtreler ({activeFiltersCount}):
                        </span>
                        <button
                            onClick={handleClear}
                            className="text-sm text-red-600 hover:text-red-800 flex items-center"
                        >
                            <XMarkIcon className="h-4 w-4 mr-1" />
                            Tümünü Temizle
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(localFilters).map(([key, value]) => {
                            if (value !== undefined && value !== '' && value !== null) {
                                let displayValue = value;
                                let label = key;

                                // Format display values
                                if (key === 'type') {
                                    const type = petTypes.find(t => t.value === value);
                                    displayValue = type ? type.label : value;
                                    label = 'Tür';
                                } else if (key === 'status') {
                                    const status = petStatuses.find(s => s.value === value);
                                    displayValue = status ? status.label : value;
                                    label = 'Durum';
                                } else if (key === 'gender') {
                                    const gender = petGenders.find(g => g.value === value);
                                    displayValue = gender ? gender.label : value;
                                    label = 'Cinsiyet';
                                } else if (key === 'size') {
                                    const size = petSizes.find(s => s.value === value);
                                    displayValue = size ? size.label : value;
                                    label = 'Boyut';
                                } else if (key === 'search') {
                                    label = 'Arama';
                                } else if (key === 'breed') {
                                    label = 'Irk';
                                } else if (key === 'city') {
                                    label = 'Şehir';
                                } else if (key === 'minAge' || key === 'maxAge') {
                                    label = key === 'minAge' ? 'Min Yaş' : 'Max Yaş';
                                } else if (key === 'isVaccinated') {
                                    label = 'Aşılı';
                                    displayValue = 'Evet';
                                } else if (key === 'isNeutered') {
                                    label = 'Kısırlaştırılmış';
                                    displayValue = 'Evet';
                                } else if (key === 'isMicrochipped') {
                                    label = 'Mikroçipli';
                                    displayValue = 'Evet';
                                }

                                return (
                                    <span
                                        key={key}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                    >
                                        <span className="font-medium">{label}:</span>
                                        <span className="ml-1">{displayValue}</span>
                                        <button
                                            onClick={() => handleFilterChange(key as keyof PetSearchFilters, undefined)}
                                            className="ml-2 text-blue-600 hover:text-blue-800"
                                        >
                                            <XMarkIcon className="h-3 w-3" />
                                        </button>
                                    </span>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSearch}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                        <MagnifyingGlassIcon className="h-4 w-4 mr-2 inline" />
                        Ara
                    </button>
                    
                    <button
                        onClick={handleClear}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                    >
                        <XMarkIcon className="h-4 w-4 mr-2 inline" />
                        Temizle
                    </button>
                </div>

                <div className="text-sm text-gray-500">
                    {activeFiltersCount > 0 && `${activeFiltersCount} filtre aktif`}
                </div>
            </div>
        </div>
    );
};

export default PetSearchFilters;
