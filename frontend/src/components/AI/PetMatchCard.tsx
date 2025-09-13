import React from 'react';
import { PetMatch } from '../../services/api/aiApi';
import { HeartIcon, MapPinIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface PetMatchCardProps {
  match: PetMatch;
  onLike?: (match: PetMatch) => void;
  onContact?: (match: PetMatch) => void;
  isLiked?: boolean;
}

export const PetMatchCard: React.FC<PetMatchCardProps> = ({
  match,
  onLike,
  onContact,
  isLiked = false
}) => {
  const compatibilityPercentage = Math.round(match.compatibilityScore * 100);

  const getCompatibilityColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
      {/* Pet Image */}
      <div className="relative h-48 bg-gray-200">
        {match.pet.images && match.pet.images.length > 0 ? (
          <img
            src={match.pet.images[0]}
            alt={match.pet.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl text-gray-400">🐾</span>
          </div>
        )}
        
        {/* Compatibility Score */}
        <div className="absolute top-3 right-3">
          <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getCompatibilityColor(match.compatibilityScore)}`}>
            %{compatibilityPercentage} Uyum
          </div>
        </div>
        
        {/* Like Button */}
        <button
          onClick={() => onLike?.(match)}
          className="absolute top-3 left-3 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
        >
          {isLiked ? (
            <HeartSolidIcon className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Pet Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{match.pet.name}</h3>
          <div className="flex items-center text-yellow-500">
            <StarIcon className="h-4 w-4 fill-current" />
            <span className="ml-1 text-sm font-medium">{compatibilityPercentage}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-2">
          {match.pet.breed} • {match.pet.age} yaşında • {match.pet.gender}
        </p>
        
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
          {match.pet.description}
        </p>
        
        {/* Match Reasons */}
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-900 mb-1">Neden Uygun:</h4>
          <div className="flex flex-wrap gap-1">
            {match.matchReasons.slice(0, 3).map((reason, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {reason}
              </span>
            ))}
            {match.matchReasons.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                +{match.matchReasons.length - 3} daha
              </span>
            )}
          </div>
        </div>
        
        {/* Location and Fee */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <MapPinIcon className="h-4 w-4 mr-1" />
            <span>{match.distance.toFixed(1)} km uzaklıkta</span>
          </div>
          <div className="text-sm font-semibold text-green-600">
            {match.adoptionListing.adoptionFee === 0 ? 'Ücretsiz' : `${match.adoptionListing.adoptionFee} TL`}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={() => onContact?.(match)}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            İletişime Geç
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Detaylar
          </button>
        </div>
      </div>
    </div>
  );
};
