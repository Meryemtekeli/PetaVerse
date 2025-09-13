import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  type: string;
  rarity: string;
  points: number;
  requiredCount: number;
}

export interface UserBadge {
  id: number;
  userId: number;
  badgeId: number;
  earnedAt: string;
  badge: Badge;
}

export const badgeApi = {
  // Get all available badges
  getAllBadges: async (): Promise<Badge[]> => {
    const response = await axios.get(`${API_BASE_URL}/api/badges`);
    return response.data;
  },

  // Get user's badges
  getUserBadges: async (userId: number): Promise<UserBadge[]> => {
    const response = await axios.get(`${API_BASE_URL}/api/badges/user/${userId}`);
    return response.data;
  },

  // Award a badge to a user
  awardBadge: async (userId: number, badgeId: number): Promise<UserBadge> => {
    const response = await axios.post(`${API_BASE_URL}/api/badges/award`, null, {
      params: { userId, badgeId }
    });
    return response.data;
  },

  // Check and award achievements for a user
  checkAchievements: async (userId: number): Promise<Badge[]> => {
    const response = await axios.get(`${API_BASE_URL}/api/badges/check-achievements/${userId}`);
    return response.data;
  },

  // Get leaderboard
  getLeaderboard: async (): Promise<UserBadge[]> => {
    const response = await axios.get(`${API_BASE_URL}/api/badges/leaderboard`);
    return response.data;
  }
};
