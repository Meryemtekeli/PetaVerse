import React, { useState, useEffect } from 'react';
import { petApiService } from '../../services/api/petApi';
import { 
    ChartBarIcon, 
    UsersIcon, 
    HeartIcon, 
    ExclamationTriangleIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

interface PetStatistics {
    totalPets: number;
    activePets: number;
    adoptedPets: number;
    lostPets: number;
    deceasedPets: number;
    vaccinatedPets: number;
    neuteredPets: number;
    microchippedPets: number;
    averageAge: number;
    averageWeight: number;
    byType: Record<string, number>;
    byGender: Record<string, number>;
    bySize: Record<string, number>;
}

const PetStatisticsDashboard: React.FC = () => {
    const [statistics, setStatistics] = useState<PetStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadStatistics();
    }, []);

    const loadStatistics = async () => {
        try {
            setLoading(true);
            setError(null);
            const stats = await petApiService.getPetStatistics();
            setStatistics(stats);
        } catch (err) {
            setError('İstatistikler yüklenirken bir hata oluştu');
            console.error('Statistics loading error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">İstatistikler yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (error || !statistics) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600 mb-4">{error || 'İstatistikler yüklenemedi'}</p>
                <button
                    onClick={loadStatistics}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Tekrar Dene
                </button>
            </div>
        );
    }

    const getPetTypeEmoji = (type: string) => {
        const emojiMap: Record<string, string> = {
            'DOG': '🐕',
            'CAT': '🐱',
            'BIRD': '🐦',
            'FISH': '🐠',
            'RABBIT': '🐰',
            'HAMSTER': '🐹',
            'GUINEA_PIG': '🐹',
            'FERRET': '🦦',
            'REPTILE': '🦎',
            'HORSE': '🐎',
            'OTHER': '🐾'
        };
        return emojiMap[type] || '🐾';
    };

    const getGenderEmoji = (gender: string) => {
        return gender === 'MALE' ? '♂️' : '♀️';
    };

    const getSizeLabel = (size: string) => {
        return size === 'SMALL' ? 'Küçük' : size === 'MEDIUM' ? 'Orta' : 'Büyük';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    🐾 Evcil Hayvan İstatistikleri
                </h2>
                <p className="text-gray-600">
                    Platform genelinde evcil hayvan verileri ve analizler
                </p>
            </div>

            {/* Main Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Pets */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <UsersIcon className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Toplam Evcil Hayvan</p>
                            <p className="text-2xl font-bold text-gray-900">{statistics.totalPets}</p>
                        </div>
                    </div>
                </div>

                {/* Active Pets */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-full">
                            <HeartIcon className="h-8 w-8 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Aktif Evcil Hayvan</p>
                            <p className="text-2xl font-bold text-gray-900">{statistics.activePets}</p>
                        </div>
                    </div>
                </div>

                {/* Adopted Pets */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-full">
                            <CheckCircleIcon className="h-8 w-8 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Sahiplenilen</p>
                            <p className="text-2xl font-bold text-gray-900">{statistics.adoptedPets}</p>
                        </div>
                    </div>
                </div>

                {/* Lost Pets */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
                    <div className="flex items-center">
                        <div className="p-3 bg-red-100 rounded-full">
                            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Kayıp Evcil Hayvan</p>
                            <p className="text-2xl font-bold text-gray-900">{statistics.lostPets}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Health Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        💉 Sağlık Durumu
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Aşılı</span>
                            <span className="font-semibold text-green-600">{statistics.vaccinatedPets}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Kısırlaştırılmış</span>
                            <span className="font-semibold text-purple-600">{statistics.neuteredPets}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Mikroçipli</span>
                            <span className="font-semibold text-orange-600">{statistics.microchippedPets}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        📊 Ortalama Değerler
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Ortalama Yaş</span>
                            <span className="font-semibold text-blue-600">
                                {statistics.averageAge.toFixed(1)} yıl
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Ortalama Kilo</span>
                            <span className="font-semibold text-green-600">
                                {statistics.averageWeight.toFixed(1)} kg
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        📈 Durum Dağılımı
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Aktif</span>
                            <span className="font-semibold text-green-600">
                                {((statistics.activePets / statistics.totalPets) * 100).toFixed(1)}%
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Sahiplenilen</span>
                            <span className="font-semibold text-blue-600">
                                {((statistics.adoptedPets / statistics.totalPets) * 100).toFixed(1)}%
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Kayıp</span>
                            <span className="font-semibold text-red-600">
                                {((statistics.lostPets / statistics.totalPets) * 100).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* By Type */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        🐾 Tür Bazında Dağılım
                    </h3>
                    <div className="space-y-3">
                        {Object.entries(statistics.byType)
                            .sort(([,a], [,b]) => b - a)
                            .map(([type, count]) => (
                                <div key={type} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <span className="text-2xl mr-3">{getPetTypeEmoji(type)}</span>
                                        <span className="text-gray-700">{type}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="font-semibold text-gray-900 mr-2">{count}</span>
                                        <div className="w-20 bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-blue-600 h-2 rounded-full" 
                                                style={{ width: `${(count / statistics.totalPets) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                {/* By Gender */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        ♂️♀️ Cinsiyet Dağılımı
                    </h3>
                    <div className="space-y-3">
                        {Object.entries(statistics.byGender)
                            .sort(([,a], [,b]) => b - a)
                            .map(([gender, count]) => (
                                <div key={gender} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <span className="text-2xl mr-3">{getGenderEmoji(gender)}</span>
                                        <span className="text-gray-700">
                                            {gender === 'MALE' ? 'Erkek' : 'Dişi'}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="font-semibold text-gray-900 mr-2">{count}</span>
                                        <div className="w-20 bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-pink-600 h-2 rounded-full" 
                                                style={{ width: `${(count / statistics.totalPets) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            {/* Size Distribution */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    📏 Boyut Dağılımı
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(statistics.bySize)
                        .sort(([,a], [,b]) => b - a)
                        .map(([size, count]) => (
                            <div key={size} className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-3xl mb-2">
                                    {size === 'SMALL' ? '🐹' : size === 'MEDIUM' ? '🐕' : '🐎'}
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-1">
                                    {getSizeLabel(size)}
                                </h4>
                                <p className="text-2xl font-bold text-blue-600">{count}</p>
                                <p className="text-sm text-gray-600">
                                    {((count / statistics.totalPets) * 100).toFixed(1)}%
                                </p>
                            </div>
                        ))}
                </div>
            </div>

            {/* Refresh Button */}
            <div className="text-center">
                <button
                    onClick={loadStatistics}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
                >
                    <ChartBarIcon className="h-5 w-5 mr-2" />
                    İstatistikleri Yenile
                </button>
            </div>
        </div>
    );
};

export default PetStatisticsDashboard;
