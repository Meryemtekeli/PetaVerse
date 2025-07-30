import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  HeartIcon, 
  UserGroupIcon, 
  BellIcon, 
  CalendarIcon,
  ChartBarIcon,
  CogIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { RootState } from '../../store';

interface DashboardStats {
  totalPets: number;
  activeListings: number;
  unreadMessages: number;
  upcomingReminders: number;
}

const DashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState<DashboardStats>({
    totalPets: 0,
    activeListings: 0,
    unreadMessages: 0,
    upcomingReminders: 0,
  });

  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    // TODO: API'den verileri çek
    setStats({
      totalPets: 3,
      activeListings: 2,
      unreadMessages: 5,
      upcomingReminders: 1,
    });

    setRecentActivities([
      {
        id: 1,
        type: 'adoption',
        title: 'Yeni sahiplendirme başvurusu',
        description: 'Max için yeni bir başvuru aldınız',
        time: '2 saat önce',
        icon: HeartIcon,
      },
      {
        id: 2,
        type: 'message',
        title: 'Yeni mesaj',
        description: 'Ahmet Yılmaz size mesaj gönderdi',
        time: '4 saat önce',
        icon: BellIcon,
      },
      {
        id: 3,
        type: 'reminder',
        title: 'Hatırlatma',
        description: 'Luna\'nın aşı tarihi yaklaşıyor',
        time: '1 gün önce',
        icon: CalendarIcon,
      },
    ]);
  }, []);

  const quickActions = [
    {
      title: 'Evcil Hayvan Ekle',
      description: 'Yeni evcil hayvan profili oluştur',
      icon: PlusIcon,
      href: '/pets/create',
      color: 'bg-primary-500',
    },
    {
      title: 'İlan Ver',
      description: 'Sahiplendirme ilanı oluştur',
      icon: HeartIcon,
      href: '/adoption/create',
      color: 'bg-success-500',
    },
    {
      title: 'Mesajlar',
      description: 'Gelen mesajları görüntüle',
      icon: BellIcon,
      href: '/messages',
      color: 'bg-warning-500',
    },
    {
      title: 'Ayarlar',
      description: 'Hesap ayarlarını düzenle',
      icon: CogIcon,
      href: '/settings',
      color: 'bg-secondary-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Hoş geldin, {user?.firstName || user?.username}! 🐾
          </h1>
          <p className="mt-2 text-gray-600">
            Evcil hayvanlarınızın durumunu ve platform aktivitelerinizi takip edin.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <HeartIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Toplam Evcil Hayvan</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalPets}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-8 w-8 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Aktif İlanlar</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.activeListings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BellIcon className="h-8 w-8 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Okunmamış Mesaj</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.unreadMessages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-8 w-8 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Yaklaşan Hatırlatma</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.upcomingReminders}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Hızlı İşlemler</h3>
              </div>
              <div className="p-6 space-y-4">
                {quickActions.map((action, index) => (
                  <a
                    key={index}
                    href={action.href}
                    className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{action.title}</p>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Son Aktiviteler</h3>
              </div>
              <div className="p-6">
                {recentActivities.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          <activity.icon className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {activity.time}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <button className="text-primary-600 hover:text-primary-700">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Henüz aktivite yok</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Platformda aktivite yapmaya başladığınızda burada görünecek.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Reminders */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Yaklaşan Hatırlatmalar</h3>
            </div>
            <div className="p-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-yellow-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-yellow-800">
                      Luna'nın Aşı Tarihi
                    </p>
                    <p className="text-sm text-yellow-700">
                      Yarın Luna'nın aşı tarihi. Veteriner kliniğinizi arayın.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 