import React, { useState, useEffect } from 'react';
import { badgeApi, UserBadge } from '../../services/api/badgeApi';

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await badgeApi.getLeaderboard();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">🏆 Liderlik Tablosu</h2>
      
      <div className="space-y-4">
        {leaderboard.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Henüz liderlik tablosu verisi bulunmuyor.</p>
        ) : (
          leaderboard.map((userBadge, index) => (
            <div key={userBadge.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                  index === 0 ? 'bg-yellow-500' : 
                  index === 1 ? 'bg-gray-400' : 
                  index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Kullanıcı #{userBadge.userId}</h3>
                  <p className="text-sm text-gray-600">
                    {userBadge.badge.name} - {userBadge.badge.points} puan
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl">{userBadge.badge.icon}</div>
                <p className="text-xs text-gray-500">
                  {new Date(userBadge.earnedAt).toLocaleDateString('tr-TR')}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
