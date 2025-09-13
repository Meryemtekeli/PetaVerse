import React, { useState, useEffect } from 'react';
import { badgeApi, Badge, UserBadge } from '../../services/api/badgeApi';

interface AchievementProgressProps {
  userId: number;
}

const AchievementProgress: React.FC<AchievementProgressProps> = ({ userId }) => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [badgesData, userBadgesData] = await Promise.all([
        badgeApi.getAllBadges(),
        badgeApi.getUserBadges(userId)
      ]);
      setBadges(badgesData);
      setUserBadges(userBadgesData);
    } catch (error) {
      console.error('Error fetching badge data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAchievements = async () => {
    try {
      const newBadges = await badgeApi.checkAchievements(userId);
      if (newBadges.length > 0) {
        alert(`Tebrikler! ${newBadges.length} yeni rozet kazandınız!`);
        fetchData(); // Refresh data
      } else {
        alert('Henüz yeni rozet kazanmadınız. Daha fazla aktivite yapın!');
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  };

  const getProgressPercentage = (badge: Badge) => {
    // This is a simplified calculation - in a real app, you'd track actual progress
    const userBadge = userBadges.find(ub => ub.badgeId === badge.id);
    if (userBadge) return 100;
    
    // Mock progress based on badge type
    switch (badge.type) {
      case 'ADOPTION':
        return Math.min(75, Math.random() * 100); // Mock adoption progress
      case 'RESCUE':
        return Math.min(50, Math.random() * 100); // Mock rescue progress
      case 'SOCIAL':
        return Math.min(90, Math.random() * 100); // Mock social progress
      default:
        return Math.min(60, Math.random() * 100);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const earnedBadges = userBadges.length;
  const totalBadges = badges.length;
  const progressPercentage = totalBadges > 0 ? (earnedBadges / totalBadges) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🎯 Başarı İlerlemesi</h2>
        <button
          onClick={checkAchievements}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Başarıları Kontrol Et
        </button>
      </div>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Genel İlerleme</span>
          <span className="text-sm text-gray-500">{earnedBadges}/{totalBadges} rozet</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          %{Math.round(progressPercentage)} tamamlandı
        </p>
      </div>

      {/* Badge Categories */}
      <div className="space-y-4">
        {['ADOPTION', 'RESCUE', 'SOCIAL', 'COMMUNITY'].map(category => {
          const categoryBadges = badges.filter(badge => badge.type === category);
          const earnedCategoryBadges = userBadges.filter(ub => 
            categoryBadges.some(badge => badge.id === ub.badgeId)
          );
          
          return (
            <div key={category} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800">
                  {category === 'ADOPTION' && '🏠 Sahiplendirme'}
                  {category === 'RESCUE' && '🚑 Kurtarma'}
                  {category === 'SOCIAL' && '👥 Sosyal'}
                  {category === 'COMMUNITY' && '🌍 Topluluk'}
                </h3>
                <span className="text-sm text-gray-500">
                  {earnedCategoryBadges.length}/{categoryBadges.length}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categoryBadges.map(badge => {
                  const userBadge = userBadges.find(ub => ub.badgeId === badge.id);
                  const progress = getProgressPercentage(badge);
                  
                  return (
                    <div key={badge.id} className="text-center">
                      <div className={`text-2xl mb-1 ${userBadge ? '' : 'opacity-50'}`}>
                        {badge.icon}
                      </div>
                      <div className="text-xs font-medium text-gray-700 mb-1">
                        {badge.name}
                      </div>
                      {!userBadge && (
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-blue-400 h-1 rounded-full"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementProgress;
