import { apiClient } from './apiClient';

export interface PetMatch {
  pet: {
    id: number;
    name: string;
    type: string;
    breed: string;
    age: number;
    gender: string;
    description: string;
    images: string[];
  };
  adoptionListing: {
    id: number;
    title: string;
    description: string;
    location: string;
    adoptionFee: number;
  };
  compatibilityScore: number;
  matchReasons: string[];
  distance: number;
}

export interface BreedingMatch {
  pet1: {
    id: number;
    name: string;
    type: string;
    breed: string;
    age: number;
    gender: string;
  };
  pet2: {
    id: number;
    name: string;
    type: string;
    breed: string;
    age: number;
    gender: string;
  };
  compatibilityScore: number;
  breedingReasons: string[];
  distance: number;
}

export interface AdoptionRecommendation {
  pet: {
    id: number;
    name: string;
    type: string;
    breed: string;
    age: number;
    gender: string;
    description: string;
    images: string[];
  };
  adoptionListing: {
    id: number;
    title: string;
    description: string;
    location: string;
    adoptionFee: number;
  };
  compatibilityScore: number;
  recommendationReasons: string[];
  confidenceLevel: number;
}

export interface SmartSearchResult {
  pet: {
    id: number;
    name: string;
    type: string;
    breed: string;
    age: number;
    gender: string;
    description: string;
    images: string[];
  };
  adoptionListing: {
    id: number;
    title: string;
    description: string;
    location: string;
    adoptionFee: number;
  };
  relevanceScore: number;
  searchHighlights: string[];
}

export interface ChatBotResponse {
  response: string;
  responseType: string;
  suggestedActions: string[];
}

export interface PetPreferences {
  preferredPetTypes: string[];
  preferredBreeds: string[];
  preferredGender?: string;
  minAge: number;
  maxAge: number;
}

export const aiApi = {
  // Find pet matches based on user preferences
  findPetMatches: async (userId: number, preferences: PetPreferences): Promise<PetMatch[]> => {
    const response = await apiClient.post('/ai/matches', preferences, {
      params: { userId }
    });
    return response.data;
  },

  // Find breeding matches for a pet
  findBreedingMatches: async (petId: number): Promise<BreedingMatch[]> => {
    const response = await apiClient.get(`/ai/breeding-matches/${petId}`);
    return response.data;
  },

  // Get AI-powered adoption recommendations
  getAdoptionRecommendations: async (userId: number): Promise<AdoptionRecommendation[]> => {
    const response = await apiClient.get(`/ai/recommendations/${userId}`);
    return response.data;
  },

  // Perform AI-powered smart search
  performSmartSearch: async (query: string, userId: number): Promise<SmartSearchResult[]> => {
    const response = await apiClient.post('/ai/smart-search', null, {
      params: { query, userId }
    });
    return response.data;
  },

  // Get AI chatbot response
  generateChatBotResponse: async (message: string, userId: number): Promise<ChatBotResponse> => {
    const response = await apiClient.post('/ai/chatbot', null, {
      params: { message, userId }
    });
    return response.data;
  }
};