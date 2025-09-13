import { apiClient } from './apiClient';

export interface MapMarker {
  id: string;
  type: 'adoption' | 'lost' | 'vet' | 'petshop';
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  data?: any;
}

export const mapApi = {
  // Get all map markers
  getAllMarkers: async (): Promise<MapMarker[]> => {
    const response = await apiClient.get('/map/markers');
    return response.data;
  },

  // Get markers by type
  getMarkersByType: async (type: string): Promise<MapMarker[]> => {
    const response = await apiClient.get(`/map/markers/${type}`);
    return response.data;
  },

  // Get markers near a location
  getMarkersNearby: async (
    latitude: number,
    longitude: number,
    radiusKm: number = 10
  ): Promise<MapMarker[]> => {
    const response = await apiClient.get('/map/markers/nearby', {
      params: { latitude, longitude, radiusKm }
    });
    return response.data;
  },

  // Get adoption markers
  getAdoptionMarkers: async (): Promise<MapMarker[]> => {
    const response = await apiClient.get('/map/markers/adoption');
    return response.data;
  },

  // Get lost pet markers
  getLostPetMarkers: async (): Promise<MapMarker[]> => {
    const response = await apiClient.get('/map/markers/lost');
    return response.data;
  },

  // Get veterinarian markers
  getVeterinarianMarkers: async (): Promise<MapMarker[]> => {
    const response = await apiClient.get('/map/markers/veterinarians');
    return response.data;
  }
};
