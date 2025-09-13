import React from 'react';
import { PetResponse } from '../../services/api/petApi';
import { 
    HeartIcon, 
    ChatBubbleLeftIcon, 
    ShareIcon,
    MapPinIcon,
    CalendarIcon,
    ScaleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface PetCardProps {
    pet: PetResponse;
    onLike?: (petId: number) => void;
    onComment?: (petId: number) => void;
    onShare?: (pet: PetResponse) => void;
    onViewDetails?: (petId: number) => void;
    isLiked?: boolean;
    showActions?: boolean;
}

const PetCard: React.FC<PetCardProps> = ({
    pet,
    onLike,
    onComment,
    onShare,
    onViewDetails,
    isLiked = false,
    showActions = true
}) => {
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

    const handleViewDetails = () => {
        if (onViewDetails) {
            onViewDetails(pet.id);
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

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {/* Pet Image */}
            <div className="relative h-48 bg-gray-200">
                {pet.mainImageUrl ? (
                    <img
                        src={pet.mainImageUrl}
                        alt={pet.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/400x300?text=Pet+Image';
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-6xl">{getPetTypeEmoji(pet.type)}</div>
                    </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
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
                <div className="absolute top-2 left-2 space-y-1">
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

            {/* Pet Info */}
            <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            {pet.name}
                            {getGenderEmoji(pet.gender || '')}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                            {getPetTypeEmoji(pet.type)} {pet.type}
                            {pet.breed && (
                                <span className="text-gray-500">• {pet.breed}</span>
                            )}
                        </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSizeColor(pet.size || '')}`}>
                        {pet.size === 'SMALL' ? 'Küçük' :
                         pet.size === 'MEDIUM' ? 'Orta' :
                         pet.size === 'LARGE' ? 'Büyük' : pet.size}
                    </span>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        <span>{formatAge(pet.birthDate)}</span>
                    </div>
                    
                    {pet.weight && (
                        <div className="flex items-center text-sm text-gray-600">
                            <ScaleIcon className="h-4 w-4 mr-2" />
                            <span>{pet.weight} kg</span>
                        </div>
                    )}
                    
                    {pet.owner?.city && (
                        <div className="flex items-center text-sm text-gray-600">
                            <MapPinIcon className="h-4 w-4 mr-2" />
                            <span>{pet.owner.city}</span>
                        </div>
                    )}
                </div>

                {/* Description */}
                {pet.description && (
                    <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                        {pet.description}
                    </p>
                )}

                {/* Actions */}
                {showActions && (
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleLike}
                                className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
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
                                className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
                            >
                                <ChatBubbleLeftIcon className="h-5 w-5" />
                                <span className="text-sm">Yorum</span>
                            </button>
                            
                            <button
                                onClick={handleShare}
                                className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors"
                            >
                                <ShareIcon className="h-5 w-5" />
                                <span className="text-sm">Paylaş</span>
                            </button>
                        </div>
                        
                        <button
                            onClick={handleViewDetails}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Detaylar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PetCard;
