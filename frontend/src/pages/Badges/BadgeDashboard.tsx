import React, { useState, useEffect } from 'react';
import { badgeApi, Badge, UserBadge } from '../../services/api/badgeApi';
import BadgeCard from '../../components/Badges/BadgeCard';
import Leaderboard from '../../components/Badges/Leaderboard';
import AchievementProgress from '../../components/Badges/AchievementProgress';

const BadgeDashboard: React.FC = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'earned' | 'progress' | 'leaderboard'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock user ID - in a real app, this would come from auth context
  const userId = 1;

  useEffect(() => {
    fetchData();
  }, []);

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

  const filteredBadges = badges.filter(badge => {
    if (selectedCategory === 'all') return true;
    return badge.type === selectedCategory;
  });

  const earnedBadgeIds = new Set(userBadges.map(ub => ub.badgeId));

  const getEarnedBadge = (badgeId: number) => {
    return userBadges.find(ub => ub.badgeId === badgeId);
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'ADOPTION': return 'Sahiplendirme';
      case 'RESCUE': return 'Kurtarma';
      case 'SOCIAL': return 'Sosyal';
      case 'COMMUNITY': return 'Topluluk';
      default: return category;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🏆 Rozet Sistemi</h1>
          <p className="text-lg text-gray-600">
            Başarılarınızı takip edin ve yeni rozetler kazanın!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{userBadges.length}</div>
            <div className="text-gray-600">Kazanılan Rozet</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              {userBadges.reduce((sum, ub) => sum + ub.badge.points, 0)}
            </div>
            <div className="text-gray-600">Toplam Puan</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">{badges.length}</div>
            <div className="text-gray-600">Toplam Rozet</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">
              {Math.round((userBadges.length / badges.length) * 100)}%
            </div>
            <div className="text-gray-600">Tamamlanma</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'all', name: 'Tüm Rozetler', icon: '🏆' },
                { id: 'earned', name: 'Kazanılanlar', icon: '✅' },
                { id: 'progress', name: 'İlerleme', icon: '📊' },
                { id: 'leaderboard', name: 'Liderlik', icon: '🥇' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'all' && (
          <div>
            {/* Category Filter */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Tümü
                </button>
                {['ADOPTION', 'RESCUE', 'SOCIAL', 'COMMUNITY'].map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {getCategoryName(category)}
                  </button>
                ))}
              </div>
            </div>

            {/* Badge Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBadges.map(badge => {
                const isEarned = earnedBadgeIds.has(badge.id);
                const earnedBadge = getEarnedBadge(badge.id);
                
                return (
                  <BadgeCard
                    key={badge.id}
                    badge={badge}
                    isEarned={isEarned}
                    earnedAt={earnedBadge?.earnedAt}
                  />
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'earned' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userBadges.map(userBadge => (
              <BadgeCard
                key={userBadge.id}
                badge={userBadge.badge}
                isEarned={true}
                earnedAt={userBadge.earnedAt}
              />
            ))}
          </div>
        )}

        {activeTab === 'progress' && (
          <AchievementProgress userId={userId} />
        )}

        {activeTab === 'leaderboard' && (
          <Leaderboard />
        )}
      </div>
    </div>
  );
};

export default BadgeDashboard;
