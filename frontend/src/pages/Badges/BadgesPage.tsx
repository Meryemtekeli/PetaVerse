import React, { useEffect, useState } from "react";
import { getUserBadges, getUserPoints, UserBadge, UserPoints } from "../../services/api/badgesApi";
import { auth } from "../../services/firebase";

const BadgesPage: React.FC = () => {
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (user?.uid) {
      getUserBadges(user.uid).then(setUserBadges);
      getUserPoints(user.uid).then(setUserPoints);
    }
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6">Rozetler ve Ödüller</h2>
      
      {/* Puan ve Seviye */}
      <div className="bg-white rounded shadow p-6 mb-6">
        <h3 className="font-bold text-lg mb-4">Puanlarınız</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary-600">{userPoints?.points || 0}</div>
            <div className="text-sm text-gray-600">Toplam Puan</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{userPoints?.level || 1}</div>
            <div className="text-sm text-gray-600">Seviye</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{userPoints?.totalActions || 0}</div>
            <div className="text-sm text-gray-600">Toplam Aksiyon</div>
          </div>
        </div>
      </div>

      {/* Kazanılan Rozetler */}
      <div className="bg-white rounded shadow p-6">
        <h3 className="font-bold text-lg mb-4">Kazanılan Rozetler</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userBadges.map(badge => (
            <div key={badge.id} className="border rounded p-4 text-center">
              <div className="text-3xl mb-2">🏆</div>
              <div className="font-semibold">{badge.badgeName}</div>
              <div className="text-sm text-gray-600">{new Date(badge.earnedAt).toLocaleDateString()}</div>
            </div>
          ))}
          {userBadges.length === 0 && (
            <div className="text-gray-500 text-center col-span-full py-8">
              Henüz rozet kazanmadınız. Aktif olun ve rozetler kazanın!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BadgesPage; 