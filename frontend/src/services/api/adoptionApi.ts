import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export interface AdoptionListing {
  id: number;
  title: string;
  description: string;
  location: string;
  adoptionFee: number;
  status: string;
  listingType: string;
  createdAt: string;
  updatedAt: string;
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
  owner: {
    id: number;
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
}

export interface CreateAdoptionListingRequest {
  petId: number;
  title: string;
  description: string;
  location: string;
  listingType: string;
  adoptionFee: number;
}

export interface UpdateAdoptionListingRequest {
  title?: string;
  description?: string;
  location?: string;
  adoptionFee?: number;
  status?: string;
}

export interface AdoptionApplication {
  id: number;
  adoptionListingId: number;
  applicantId: number;
  status: string;
  motivation: string;
  experienceWithPets: string;
  livingSituation: string;
  workSchedule: string;
  otherPets: string;
  childrenInHome: boolean;
  allergies: string;
  financialStability: string;
  references: string;
  createdAt: string;
}

export interface CreateAdoptionApplicationRequest {
  adoptionListingId: number;
  motivation: string;
  experienceWithPets: string;
  livingSituation: string;
  workSchedule: string;
  otherPets: string;
  childrenInHome: boolean;
  allergies: string;
  financialStability: string;
  references: string;
}

class AdoptionApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Get all adoption listings
  async getAllAdoptionListings(): Promise<AdoptionListing[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/adoption-listings`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching adoption listings:', error);
      throw error;
    }
  }

  // Get adoption listing by ID
  async getAdoptionListingById(id: number): Promise<AdoptionListing> {
    try {
      const response = await axios.get(`${API_BASE_URL}/adoption-listings/${id}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching adoption listing:', error);
      throw error;
    }
  }

  // Create new adoption listing
  async createAdoptionListing(data: CreateAdoptionListingRequest): Promise<AdoptionListing> {
    try {
      const response = await axios.post(`${API_BASE_URL}/adoption-listings`, data, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating adoption listing:', error);
      throw error;
    }
  }

  // Update adoption listing
  async updateAdoptionListing(id: number, data: UpdateAdoptionListingRequest): Promise<AdoptionListing> {
    try {
      const response = await axios.put(`${API_BASE_URL}/adoption-listings/${id}`, data, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating adoption listing:', error);
      throw error;
    }
  }

  // Delete adoption listing
  async deleteAdoptionListing(id: number): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/adoption-listings/${id}`, {
        headers: this.getAuthHeaders()
      });
    } catch (error) {
      console.error('Error deleting adoption listing:', error);
      throw error;
    }
  }

  // Get adoption listings by type
  async getAdoptionListingsByType(type: string): Promise<AdoptionListing[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/adoption-listings/type/${type}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching adoption listings by type:', error);
      throw error;
    }
  }

  // Get adoption listings by location
  async getAdoptionListingsByLocation(location: string): Promise<AdoptionListing[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/adoption-listings/location/${location}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching adoption listings by location:', error);
      throw error;
    }
  }

  // Search adoption listings
  async searchAdoptionListings(query: string): Promise<AdoptionListing[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/adoption-listings/search`, {
        params: { q: query },
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error searching adoption listings:', error);
      throw error;
    }
  }

  // Get adoption applications for a listing
  async getAdoptionApplications(listingId: number): Promise<AdoptionApplication[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/adoption-listings/${listingId}/applications`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching adoption applications:', error);
      throw error;
    }
  }

  // Create adoption application
  async createAdoptionApplication(data: CreateAdoptionApplicationRequest): Promise<AdoptionApplication> {
    try {
      const response = await axios.post(`${API_BASE_URL}/adoption-applications`, data, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating adoption application:', error);
      throw error;
    }
  }

  // Update adoption application status
  async updateAdoptionApplicationStatus(id: number, status: string): Promise<AdoptionApplication> {
    try {
      const response = await axios.put(`${API_BASE_URL}/adoption-applications/${id}/status`, { status }, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating adoption application status:', error);
      throw error;
    }
  }

  // Get user's adoption listings
  async getUserAdoptionListings(): Promise<AdoptionListing[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/adoption-listings/my-listings`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user adoption listings:', error);
      throw error;
    }
  }

  // Get user's adoption applications
  async getUserAdoptionApplications(): Promise<AdoptionApplication[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/adoption-applications/my-applications`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user adoption applications:', error);
      throw error;
    }
  }
}

export const adoptionApi = new AdoptionApiService();
export default adoptionApi;