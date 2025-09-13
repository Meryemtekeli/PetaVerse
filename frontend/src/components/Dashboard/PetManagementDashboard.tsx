import React, { useState, useEffect } from 'react';
import { PetResponse, petApiService } from '../../services/api/petApi';
import { 
    PlusIcon, 
    PencilIcon, 
    TrashIcon, 
    EyeIcon,
    ChartBarIcon,
    UsersIcon,
    HeartIcon,
    ExclamationTriangleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import CreatePetForm from '../Pets/CreatePetForm';
import PetDetailModal from '../Pets/PetDetailModal';
import PetSearchFilters, { PetSearchFilters as PetSearchFiltersType } from '../Pets/PetSearchFilters';
import PetList from '../Pets/PetList';

interface PetManagementDashboardProps {
    className?: string;
}

const PetManagementDashboard: React.FC<PetManagementDashboardProps> = ({ className = '' }) => {
    const [pets, setPets] = useState<PetResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedPet, setSelectedPet] = useState<PetResponse | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [filters, setFilters] = useState<PetSearchFiltersType>({});
    const [statistics, setStatistics] = useState<any>(null);

    useEffect(() => {
        loadPets();
        loadStatistics();
    }, [filters]);

    const loadPets = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await petApiService.getPets(filters);
            setPets(response.content || []);
        } catch (err) {
            setError('Evcil hayvanlar yüklenirken bir hata oluştu');
            console.error('Pet loading error:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadStatistics = async () => {
        try {
            const stats = await petApiService.getPetStatistics();
            setStatistics(stats);
        } catch (err) {
            console.error('Statistics loading error:', err);
        }
    };

    const handleCreatePet = async (petData: any) => {
        try {
            await petApiService.createPet(petData);
            setShowCreateForm(false);
            loadPets();
            loadStatistics();
            // Show success message
        } catch (err) {
            console.error('Pet creation error:', err);
            // Show error message
        }
    };

    const handleUpdatePet = async (petId: number, petData: any) => {
        try {
            await petApiService.updatePet(petId, petData);
            loadPets();
            loadStatistics();
            // Show success message
        } catch (err) {
            console.error('Pet update error:', err);
            // Show error message
        }
    };

    const handleDeletePet = async (petId: number) => {
        if (window.confirm('Bu evcil hayvanı silmek istediğinizden emin misiniz?')) {
            try {
                await petApiService.deletePet(petId);
                loadPets();
                loadStatistics();
                // Show success message
            } catch (err) {
                console.error('Pet deletion error:', err);
                // Show error message
            }
        }
    };

    const handlePetSelect = (pet: PetResponse) => {
        setSelectedPet(pet);
        setShowDetailModal(true);
    };

    const handleFiltersChange = (newFilters: PetSearchFiltersType) => {
        setFilters(newFilters);
    };

    const handleSearch = () => {
        loadPets();
    };

    const handleClear = () => {
        setFilters({});
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
        if (navigator.share) {
            navigator.share({
                title: `${pet.name} - Evcil Hayvan Profili`,
                text: `${pet.name} hakkında bilgi alın`,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link kopyalandı!');
        }
    };

    const handleContact = (pet: PetResponse) => {
        // TODO: Implement contact functionality
        console.log('Contact pet owner:', pet);
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        🐾 Evcil Hayvan Yönetimi
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Evcil hayvan profillerini oluşturun, düzenleyin ve yönetin
                    </p>
                </div>
                
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Yeni Evcil Hayvan
                </button>
            </div>

            {/* Statistics Cards */}
            {statistics && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <UsersIcon className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Toplam</p>
                                <p className="text-2xl font-bold text-gray-900">{statistics.totalPets}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-full">
                                <HeartIcon className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Aktif</p>
                                <p className="text-2xl font-bold text-gray-900">{statistics.activePets}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-full">
                                <ChartBarIcon className="h-8 w-8 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Sahiplenilen</p>
                                <p className="text-2xl font-bold text-gray-900">{statistics.adoptedPets}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
                        <div className="flex items-center">
                            <div className="p-3 bg-red-100 rounded-full">
                                <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Kayıp</p>
                                <p className="text-2xl font-bold text-gray-900">{statistics.lostPets}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Search and Filters */}
            <PetSearchFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onSearch={handleSearch}
                onClear={handleClear}
            />

            {/* Pet List */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Evcil Hayvan Listesi
                        </h3>
                        <div className="text-sm text-gray-600">
                            {pets.length} evcil hayvan bulundu
                        </div>
                    </div>
                </div>
                
                <div className="p-6">
                    <PetList
                        filters={filters}
                        showFilters={false}
                        onPetSelect={handlePetSelect}
                    />
                </div>
            </div>

            {/* Create Pet Form Modal */}
            {showCreateForm && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                        
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        🐾 Yeni Evcil Hayvan Ekle
                                    </h3>
                                    <button
                                        onClick={() => setShowCreateForm(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="px-6 py-6">
                                <CreatePetForm
                                    onSubmit={handleCreatePet}
                                    onCancel={() => setShowCreateForm(false)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Pet Detail Modal */}
            <PetDetailModal
                pet={selectedPet}
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                onLike={handlePetLike}
                onComment={handlePetComment}
                onShare={handlePetShare}
                onContact={handleContact}
            />
        </div>
    );
};

export default PetManagementDashboard;
