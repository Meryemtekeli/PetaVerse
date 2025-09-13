import { apiClient } from './apiClient';

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  totalPets: number;
  dogs: number;
  cats: number;
  otherPets: number;
  totalAdoptionListings: number;
  activeAdoptionListings: number;
  successfulAdoptions: number;
  adoptionSuccessRate: number;
  totalLostPetReports: number;
  activeLostPetReports: number;
  foundPets: number;
  totalMessages: number;
  messagesThisMonth: number;
  totalNotifications: number;
  unreadNotifications: number;
}

export interface UserAnalytics {
  totalPets: number;
  dogs: number;
  cats: number;
  adoptionListings: number;
  activeListings: number;
  adoptionApplications: number;
  approvedApplications: number;
  lostPetReports: number;
  foundPets: number;
  totalMessages: number;
  messagesThisMonth: number;
}

export interface MonthlyStats {
  month: string;
  year: number;
  newUsers: number;
  newPets: number;
  newAdoptionListings: number;
  newLostPetReports: number;
  messages: number;
}

export interface TopUser {
  userId: number;
  userName: string;
  userEmail: string;
  petCount: number;
  adoptionListings: number;
  adoptionApplications: number;
  score: number;
}

export interface PetTypeStats {
  petType: string;
  count: number;
  adoptionListings: number;
  lostReports: number;
}

export interface LocationStats {
  location: string;
  adoptionListings: number;
  users: number;
}

export const analyticsApi = {
  // Get dashboard statistics
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/analytics/dashboard');
    return response.data;
  },

  // Get user analytics
  getUserAnalytics: async (userId: number): Promise<UserAnalytics> => {
    const response = await apiClient.get(`/analytics/user/${userId}`);
    return response.data;
  },

  // Get monthly statistics
  getMonthlyStats: async (months: number = 12): Promise<MonthlyStats[]> => {
    const response = await apiClient.get('/analytics/monthly', {
      params: { months }
    });
    return response.data;
  },

  // Get top users
  getTopUsers: async (limit: number = 10): Promise<TopUser[]> => {
    const response = await apiClient.get('/analytics/top-users', {
      params: { limit }
    });
    return response.data;
  },

  // Get pet type statistics
  getPetTypeStats: async (): Promise<PetTypeStats[]> => {
    const response = await apiClient.get('/analytics/pet-types');
    return response.data;
  },

  // Get location statistics
  getLocationStats: async (): Promise<LocationStats[]> => {
    const response = await apiClient.get('/analytics/locations');
    return response.data;
  }
};
