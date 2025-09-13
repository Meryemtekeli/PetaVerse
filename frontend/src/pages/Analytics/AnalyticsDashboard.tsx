import React, { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  HeartIcon, 
  HomeIcon, 
  ExclamationTriangleIcon,
  ChatBubbleLeftIcon,
  BellIcon,
  ChartBarIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { analyticsApi, DashboardStats, MonthlyStats, TopUser, PetTypeStats, LocationStats } from '../../services/api/analyticsApi';
import { StatsCard } from '../../components/Analytics/StatsCard';
import { ChartCard } from '../../components/Analytics/ChartCard';
import { SimpleBarChart } from '../../components/Analytics/SimpleBarChart';
import { SimpleLineChart } from '../../components/Analytics/SimpleLineChart';

export const AnalyticsDashboard: React.FC = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [petTypeStats, setPetTypeStats] = useState<PetTypeStats[]>([]);
  const [locationStats, setLocationStats] = useState<LocationStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [dashboard, monthly, topUsersData, petTypes, locations] = await Promise.all([
        analyticsApi.getDashboardStats(),
        analyticsApi.getMonthlyStats(6),
        analyticsApi.getTopUsers(5),
        analyticsApi.getPetTypeStats(),
        analyticsApi.getLocationStats()
      ]);

      setDashboardStats(dashboard);
      setMonthlyStats(monthly);
      setTopUsers(topUsersData);
      setPetTypeStats(petTypes);
      setLocationStats(locations);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
      setError('Analitik veriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Analitik veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardStats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hata</h2>
          <p className="text-gray-600 mb-4">{error || 'Veriler yüklenemedi'}</p>
          <button
            onClick={loadAnalyticsData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  const monthlyChartData = monthlyStats.map(stat => ({
    label: stat.month.substring(0, 3),
    value: stat.newUsers
  }));

  const petTypeChartData = petTypeStats.map(stat => ({
    label: stat.petType,
    value: stat.count
  }));

  const locationChartData = locationStats.slice(0, 5).map(stat => ({
    label: stat.location,
    value: stat.adoptionListings
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analitik Dashboard</h1>
          <p className="mt-2 text-gray-600">
            PetaVerse platformunun genel istatistikleri ve performans metrikleri
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Toplam Kullanıcı"
            value={dashboardStats.totalUsers.toLocaleString()}
            subtitle={`${dashboardStats.activeUsers} aktif`}
            icon={<UsersIcon className="h-6 w-6" />}
            color="blue"
            trend={{ value: 12, isPositive: true }}
          />
          
          <StatsCard
            title="Toplam Evcil Hayvan"
            value={dashboardStats.totalPets.toLocaleString()}
            subtitle={`${dashboardStats.dogs} köpek, ${dashboardStats.cats} kedi`}
            icon={<HeartIcon className="h-6 w-6" />}
            color="green"
            trend={{ value: 8, isPositive: true }}
          />
          
          <StatsCard
            title="Sahiplendirme İlanları"
            value={dashboardStats.totalAdoptionListings.toLocaleString()}
            subtitle={`${dashboardStats.activeAdoptionListings} aktif`}
            icon={<HomeIcon className="h-6 w-6" />}
            color="purple"
            trend={{ value: 15, isPositive: true }}
          />
          
          <StatsCard
            title="Başarılı Sahiplendirme"
            value={dashboardStats.successfulAdoptions.toLocaleString()}
            subtitle={`%${dashboardStats.adoptionSuccessRate.toFixed(1)} başarı oranı`}
            icon={<ChartBarIcon className="h-6 w-6" />}
            color="indigo"
            trend={{ value: 22, isPositive: true }}
          />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Kayıp Hayvan Bildirimi"
            value={dashboardStats.totalLostPetReports.toLocaleString()}
            subtitle={`${dashboardStats.foundPets} bulundu`}
            icon={<ExclamationTriangleIcon className="h-6 w-6" />}
            color="red"
          />
          
          <StatsCard
            title="Toplam Mesaj"
            value={dashboardStats.totalMessages.toLocaleString()}
            subtitle={`${dashboardStats.messagesThisMonth} bu ay`}
            icon={<ChatBubbleLeftIcon className="h-6 w-6" />}
            color="yellow"
          />
          
          <StatsCard
            title="Bildirimler"
            value={dashboardStats.totalNotifications.toLocaleString()}
            subtitle={`${dashboardStats.unreadNotifications} okunmamış`}
            icon={<BellIcon className="h-6 w-6" />}
            color="blue"
          />
          
          <StatsCard
            title="Bu Ay Yeni Kullanıcı"
            value={dashboardStats.newUsersThisMonth.toLocaleString()}
            subtitle="Son 30 gün"
            icon={<UsersIcon className="h-6 w-6" />}
            color="green"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard title="Aylık Yeni Kullanıcı Trendi">
            <SimpleLineChart data={monthlyChartData} color="#3B82F6" />
          </ChartCard>
          
          <ChartCard title="Evcil Hayvan Türleri">
            <SimpleBarChart data={petTypeChartData} />
          </ChartCard>
        </div>

        {/* Top Users and Locations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="En Aktif Kullanıcılar">
            <div className="space-y-4">
              {topUsers.map((user, index) => (
                <div key={user.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-semibold text-sm">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.userName}</p>
                      <p className="text-sm text-gray-600">{user.userEmail}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{user.score} puan</p>
                    <p className="text-sm text-gray-600">
                      {user.petCount} pet, {user.adoptionListings} ilan
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
          
          <ChartCard title="En Aktif Şehirler">
            <div className="space-y-4">
              {locationStats.slice(0, 5).map((location, index) => (
                <div key={location.location} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{location.location}</p>
                      <p className="text-sm text-gray-600">{location.users} kullanıcı</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{location.adoptionListings}</p>
                    <p className="text-sm text-gray-600">sahiplendirme ilanı</p>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};
