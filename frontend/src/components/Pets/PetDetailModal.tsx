import React, { useState } from 'react';
import { PetResponse } from '../../services/api/petApi';
import { 
    XMarkIcon, 
    HeartIcon, 
    ChatBubbleLeftIcon, 
    ShareIcon,
    MapPinIcon,
    CalendarIcon,
    ScaleIcon,
    UserIcon,
    PhoneIcon,
    EnvelopeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface PetDetailModalProps {
    pet: PetResponse | null;
    isOpen: boolean;
    onClose: () => void;
    onLike?: (petId: number) => void;
    onComment?: (petId: number) => void;
    onShare?: (pet: PetResponse) => void;
    onContact?: (pet: PetResponse) => void;
    isLiked?: boolean;
}

const PetDetailModal: React.FC<PetDetailModalProps> = ({
    pet,
    isOpen,
    onClose,
    onLike,
    onComment,
    onShare,
    onContact,
    isLiked = false
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showAllImages, setShowAllImages] = useState(false);

    if (!isOpen || !pet) return null;

    const handleLike = () => {
        if (onLike) {
            onLike(pet.id);
        }
    };

    const handleComment = () => {
        if (onComment) {
            onComment(pet.id);
        }
    };

    const handleShare = () => {
        if (onShare) {
            onShare(pet);
        }
    };

    const handleContact = () => {
        if (onContact) {
            onContact(pet);
        }
    };

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

    const getSizeColor = (size: string) => {
        const colorMap: Record<string, string> = {
            'SMALL': 'bg-green-100 text-green-800',
            'MEDIUM': 'bg-yellow-100 text-yellow-800',
            'LARGE': 'bg-red-100 text-red-800'
        };
        return colorMap[size] || 'bg-gray-100 text-gray-800';
    };

    const formatAge = (birthDate?: string) => {
        if (!birthDate) return 'Bilinmiyor';
        
        const birth = new Date(birthDate);
        const today = new Date();
        const ageInYears = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            ageInYears--;
        }
        
        if (ageInYears === 0) {
            const ageInMonths = Math.abs(monthDiff);
            return `${ageInMonths} ay`;
        }
        
        return `${ageInYears} yaş`;
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Bilinmiyor';
        return new Date(dateString).toLocaleDateString('tr-TR');
    };

    const allImages = [pet.mainImageUrl, ...(pet.imageUrls || [])].filter(Boolean);

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div 
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    onClick={onClose}
                ></div>

                {/* Modal panel */}
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                    {/* Header */}
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <span className="text-3xl mr-3">{getPetTypeEmoji(pet.type)}</span>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {pet.name} {getGenderEmoji(pet.gender || '')}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {pet.type} • {pet.breed || 'Irk belirtilmemiş'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column - Images */}
                            <div>
                                {/* Main Image */}
                                <div className="relative mb-4">
                                    <img
                                        src={allImages[currentImageIndex] || 'https://via.placeholder.com/400x300?text=Pet+Image'}
                                        alt={pet.name}
                                        className="w-full h-80 object-cover rounded-lg"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = 'https://via.placeholder.com/400x300?text=Pet+Image';
                                        }}
                                    />
                                    
                                    {/* Status Badge */}
                                    <div className="absolute top-3 right-3">
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                                            pet.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                            pet.status === 'ADOPTED' ? 'bg-blue-100 text-blue-800' :
                                            pet.status === 'LOST' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {pet.status === 'ACTIVE' ? 'Aktif' :
                                             pet.status === 'ADOPTED' ? 'Sahiplenildi' :
                                             pet.status === 'LOST' ? 'Kayıp' :
                                             pet.status}
                                        </span>
                                    </div>

                                    {/* Health Badges */}
                                    <div className="absolute top-3 left-3 space-y-2">
                                        {pet.isVaccinated && (
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                💉 Aşılı
                                            </span>
                                        )}
                                        {pet.isNeutered && (
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                                                ✂️ Kısır
                                            </span>
                                        )}
                                        {pet.isMicrochipped && (
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                                                🏷️ Mikroçip
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Image Gallery */}
                                {allImages.length > 1 && (
                                    <div className="grid grid-cols-4 gap-2">
                                        {allImages.map((image, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentImageIndex(index)}
                                                className={`relative overflow-hidden rounded-lg ${
                                                    currentImageIndex === index ? 'ring-2 ring-blue-500' : ''
                                                }`}
                                            >
                                                <img
                                                    src={image}
                                                    alt={`${pet.name} ${index + 1}`}
                                                    className="w-full h-20 object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = 'https://via.placeholder.com/100x80?text=Image';
                                                    }}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Videos */}
                                {pet.videoUrls && pet.videoUrls.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-900 mb-2">Videolar</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {pet.videoUrls.map((video, index) => (
                                                <video
                                                    key={index}
                                                    controls
                                                    className="w-full h-24 object-cover rounded-lg"
                                                >
                                                    <source src={video} type="video/mp4" />
                                                    Tarayıcınız video oynatmayı desteklemiyor.
                                                </video>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Column - Details */}
                            <div className="space-y-6">
                                {/* Basic Info */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Temel Bilgiler</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <CalendarIcon className="h-4 w-4 mr-2" />
                                            <span>Yaş: {formatAge(pet.birthDate)}</span>
                                        </div>
                                        
                                        {pet.weight && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <ScaleIcon className="h-4 w-4 mr-2" />
                                                <span>Kilo: {pet.weight} kg</span>
                                            </div>
                                        )}
                                        
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="mr-2">Cinsiyet:</span>
                                            <span>{getGenderEmoji(pet.gender || '')} {pet.gender === 'MALE' ? 'Erkek' : 'Dişi'}</span>
                                        </div>
                                        
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="mr-2">Boyut:</span>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSizeColor(pet.size || '')}`}>
                                                {pet.size === 'SMALL' ? 'Küçük' :
                                                 pet.size === 'MEDIUM' ? 'Orta' :
                                                 pet.size === 'LARGE' ? 'Büyük' : pet.size}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                {pet.description && (
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Açıklama</h4>
                                        <p className="text-gray-700 leading-relaxed">{pet.description}</p>
                                    </div>
                                )}

                                {/* Health & Behavior Notes */}
                                {(pet.healthNotes || pet.behaviorNotes || pet.specialNeeds) && (
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Özel Notlar</h4>
                                        <div className="space-y-3">
                                            {pet.healthNotes && (
                                                <div>
                                                    <h5 className="text-sm font-medium text-gray-900 mb-1">💊 Sağlık Notları</h5>
                                                    <p className="text-sm text-gray-700">{pet.healthNotes}</p>
                                                </div>
                                            )}
                                            {pet.behaviorNotes && (
                                                <div>
                                                    <h5 className="text-sm font-medium text-gray-900 mb-1">🐾 Davranış Notları</h5>
                                                    <p className="text-sm text-gray-700">{pet.behaviorNotes}</p>
                                                </div>
                                            )}
                                            {pet.specialNeeds && (
                                                <div>
                                                    <h5 className="text-sm font-medium text-gray-900 mb-1">⭐ Özel İhtiyaçlar</h5>
                                                    <p className="text-sm text-gray-700">{pet.specialNeeds}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Owner Information */}
                                {pet.owner && (
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                            <UserIcon className="h-5 w-5 mr-2" />
                                            Sahip Bilgileri
                                        </h4>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center mb-2">
                                                <span className="font-medium text-gray-900">
                                                    {pet.owner.firstName} {pet.owner.lastName}
                                                </span>
                                            </div>
                                            {pet.owner.city && (
                                                <div className="flex items-center text-sm text-gray-600 mb-2">
                                                    <MapPinIcon className="h-4 w-4 mr-2" />
                                                    <span>{pet.owner.city}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center text-sm text-gray-600">
                                                <EnvelopeIcon className="h-4 w-4 mr-2" />
                                                <span>{pet.owner.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Timestamps */}
                                <div className="text-xs text-gray-500 space-y-1">
                                    {pet.createdAt && (
                                        <div>Oluşturulma: {formatDate(pet.createdAt)}</div>
                                    )}
                                    {pet.updatedAt && (
                                        <div>Güncellenme: {formatDate(pet.updatedAt)}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer - Actions */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={handleLike}
                                    className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
                                >
                                    {isLiked ? (
                                        <HeartIconSolid className="h-5 w-5 text-red-500" />
                                    ) : (
                                        <HeartIcon className="h-5 w-5" />
                                    )}
                                    <span className="text-sm">Beğen</span>
                                </button>
                                
                                <button
                                    onClick={handleComment}
                                    className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
                                >
                                    <ChatBubbleLeftIcon className="h-5 w-5" />
                                    <span className="text-sm">Yorum</span>
                                </button>
                                
                                <button
                                    onClick={handleShare}
                                    className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
                                >
                                    <ShareIcon className="h-5 w-5" />
                                    <span className="text-sm">Paylaş</span>
                                </button>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                {onContact && (
                                    <button
                                        onClick={handleContact}
                                        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors flex items-center"
                                    >
                                        <PhoneIcon className="h-4 w-4 mr-2" />
                                        İletişim
                                    </button>
                                )}
                                
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    Kapat
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetDetailModal;
