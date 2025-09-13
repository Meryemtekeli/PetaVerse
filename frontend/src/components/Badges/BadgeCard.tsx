import React from 'react';
import { Badge } from '../../services/api/badgeApi';

interface BadgeCardProps {
  badge: Badge;
  isEarned?: boolean;
  earnedAt?: string;
  onClick?: () => void;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge, isEarned = false, earnedAt, onClick }) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common':
        return 'bg-gray-100 border-gray-300';
      case 'rare':
        return 'bg-blue-100 border-blue-300';
      case 'epic':
        return 'bg-purple-100 border-purple-300';
      case 'legendary':
        return 'bg-yellow-100 border-yellow-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  const getRarityTextColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common':
        return 'text-gray-600';
      case 'rare':
        return 'text-blue-600';
      case 'epic':
        return 'text-purple-600';
      case 'legendary':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div 
      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
        isEarned ? getRarityColor(badge.rarity) : 'bg-gray-50 border-gray-200 opacity-60'
      }`}
      onClick={onClick}
    >
      {isEarned && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
          ✓
        </div>
      )}
      
      <div className="text-center">
        <div className="text-4xl mb-2">{badge.icon}</div>
        <h3 className="font-semibold text-lg mb-1">{badge.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
        
        <div className="flex justify-between items-center text-xs">
          <span className={`font-medium ${getRarityTextColor(badge.rarity)}`}>
            {badge.rarity.toUpperCase()}
          </span>
          <span className="text-gray-500">{badge.points} puan</span>
        </div>
        
        {isEarned && earnedAt && (
          <div className="mt-2 text-xs text-gray-500">
            Kazanıldı: {new Date(earnedAt).toLocaleDateString('tr-TR')}
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgeCard;
