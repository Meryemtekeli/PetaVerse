import { apiClient } from './apiClient';

export interface CreatePetRequest {
    name: string;
    type: string;
    breed?: string;
    color?: string;
    birthDate?: string;
    weight?: number;
    gender?: string;
    size?: string;
    description?: string;
    mainImageUrl?: string;
    imageUrls?: string[];
    videoUrls?: string[];
    status: string;
    isNeutered: boolean;
    isVaccinated: boolean;
    healthNotes?: string;
    behaviorNotes?: string;
    specialNeeds?: string;
    isMicrochipped: boolean;
    microchipNumber?: string;
    ownerId: number;
}

export interface PetResponse {
    id: number;
    name: string;
    type: string;
    breed?: string;
    color?: string;
    birthDate?: string;
    age?: number;
    weight?: number;
    gender?: string;
    size?: string;
    description?: string;
    mainImageUrl?: string;
    imageUrls: string[];
    videoUrls: string[];
    status: string;
    isNeutered: boolean;
    isVaccinated: boolean;
    healthNotes?: string;
    behaviorNotes?: string;
    specialNeeds?: string;
    isMicrochipped: boolean;
    microchipNumber?: string;
    createdAt: string;
    updatedAt: string;
    owner: {
        id: number;
        username: string;
        email: string;
        firstName?: string;
        lastName?: string;
    };
}

export interface UpdatePetRequest extends Partial<CreatePetRequest> {
    id: number;
}

export interface PetFilters {
    type?: string;
    status?: string;
    ownerId?: number;
    search?: string;
    page?: number;
    size?: number;
}

export interface PetListResponse {
    content: PetResponse[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

class PetApiService {
    private readonly baseUrl = '/api/pets';

    /**
     * Yeni evcil hayvan oluştur
     */
    async createPet(petData: CreatePetRequest): Promise<PetResponse> {
        try {
            const response = await apiClient.post(this.baseUrl, petData);
            return response.data;
        } catch (error) {
            console.error('Evcil hayvan oluşturma hatası:', error);
            throw new Error('Evcil hayvan oluşturulamadı');
        }
    }

    /**
     * Evcil hayvan güncelle
     */
    async updatePet(petId: number, petData: UpdatePetRequest): Promise<PetResponse> {
        try {
            const response = await apiClient.put(`${this.baseUrl}/${petId}`, petData);
            return response.data;
        } catch (error) {
            console.error('Evcil hayvan güncelleme hatası:', error);
            throw new Error('Evcil hayvan güncellenemedi');
        }
    }

    /**
     * Evcil hayvan detayını getir
     */
    async getPetById(petId: number): Promise<PetResponse> {
        try {
            const response = await apiClient.get(`${this.baseUrl}/${petId}`);
            return response.data;
        } catch (error) {
            console.error('Evcil hayvan getirme hatası:', error);
            throw new Error('Evcil hayvan bulunamadı');
        }
    }

    /**
     * Evcil hayvanları listele (filtreli)
     */
    async getPets(filters: PetFilters = {}): Promise<PetListResponse> {
        try {
            const params = new URLSearchParams();
            
            if (filters.type) params.append('type', filters.type);
            if (filters.status) params.append('status', filters.status);
            if (filters.ownerId) params.append('ownerId', filters.ownerId.toString());
            if (filters.search) params.append('search', filters.search);
            if (filters.page) params.append('page', filters.page.toString());
            if (filters.size) params.append('size', filters.size.toString());

            const response = await apiClient.get(`${this.baseUrl}?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Evcil hayvan listesi getirme hatası:', error);
            throw new Error('Evcil hayvan listesi alınamadı');
        }
    }

    /**
     * Kullanıcının evcil hayvanlarını getir
     */
    async getUserPets(userId: number, filters: Omit<PetFilters, 'ownerId'> = {}): Promise<PetListResponse> {
        return this.getPets({ ...filters, ownerId: userId });
    }

    /**
     * Evcil hayvan sil
     */
    async deletePet(petId: number): Promise<void> {
        try {
            await apiClient.delete(`${this.baseUrl}/${petId}`);
        } catch (error) {
            console.error('Evcil hayvan silme hatası:', error);
            throw new Error('Evcil hayvan silinemedi');
        }
    }

    /**
     * Evcil hayvan resmi ekle
     */
    async addPetImage(petId: number, imageUrl: string): Promise<PetResponse> {
        try {
            const response = await apiClient.post(`${this.baseUrl}/${petId}/images`, { imageUrl });
            return response.data;
        } catch (error) {
            console.error('Resim ekleme hatası:', error);
            throw new Error('Resim eklenemedi');
        }
    }

    /**
     * Evcil hayvan resmi sil
     */
    async removePetImage(petId: number, imageUrl: string): Promise<PetResponse> {
        try {
            const response = await apiClient.delete(`${this.baseUrl}/${petId}/images`, { 
                data: { imageUrl } 
            });
            return response.data;
        } catch (error) {
            console.error('Resim silme hatası:', error);
            throw new Error('Resim silinemedi');
        }
    }

    /**
     * Evcil hayvan videosu ekle
     */
    async addPetVideo(petId: number, videoUrl: string): Promise<PetResponse> {
        try {
            const response = await apiClient.post(`${this.baseUrl}/${petId}/videos`, { videoUrl });
            return response.data;
        } catch (error) {
            console.error('Video ekleme hatası:', error);
            throw new Error('Video eklenemedi');
        }
    }

    /**
     * Evcil hayvan videosu sil
     */
    async removePetVideo(petId: number, videoUrl: string): Promise<PetResponse> {
        try {
            const response = await apiClient.delete(`${this.baseUrl}/${petId}/videos`, { 
                data: { videoUrl } 
            });
            return response.data;
        } catch (error) {
            console.error('Video silme hatası:', error);
            throw new Error('Video silinemedi');
        }
    }

    /**
     * Evcil hayvan durumunu güncelle
     */
    async updatePetStatus(petId: number, status: string): Promise<PetResponse> {
        try {
            const response = await apiClient.patch(`${this.baseUrl}/${petId}/status`, { status });
            return response.data;
        } catch (error) {
            console.error('Durum güncelleme hatası:', error);
            throw new Error('Durum güncellenemedi');
        }
    }

    /**
     * Evcil hayvan sağlık notlarını güncelle
     */
    async updateHealthNotes(petId: number, healthNotes: string): Promise<PetResponse> {
        try {
            const response = await apiClient.patch(`${this.baseUrl}/${petId}/health-notes`, { healthNotes });
            return response.data;
        } catch (error) {
            console.error('Sağlık notları güncelleme hatası:', error);
            throw new Error('Sağlık notları güncellenemedi');
        }
    }

    /**
     * Evcil hayvan davranış notlarını güncelle
     */
    async updateBehaviorNotes(petId: number, behaviorNotes: string): Promise<PetResponse> {
        try {
            const response = await apiClient.patch(`${this.baseUrl}/${petId}/behavior-notes`, { behaviorNotes });
            return response.data;
        } catch (error) {
            console.error('Davranış notları güncelleme hatası:', error);
            throw new Error('Davranış notları güncellenemedi');
        }
    }

    /**
     * Evcil hayvan özel ihtiyaçlarını güncelle
     */
    async updateSpecialNeeds(petId: number, specialNeeds: string): Promise<PetResponse> {
        try {
            const response = await apiClient.patch(`${this.baseUrl}/${petId}/special-needs`, { specialNeeds });
            return response.data;
        } catch (error) {
            console.error('Özel ihtiyaçlar güncelleme hatası:', error);
            throw new Error('Özel ihtiyaçlar güncellenemedi');
        }
    }

    /**
     * Evcil hayvan arama (gelişmiş)
     */
    async searchPets(query: string, filters: Omit<PetFilters, 'search'> = {}): Promise<PetListResponse> {
        return this.getPets({ ...filters, search: query });
    }

    /**
     * Popüler evcil hayvan türlerini getir
     */
    async getPopularPetTypes(): Promise<Array<{ type: string; count: number }>> {
        try {
            const response = await apiClient.get(`${this.baseUrl}/popular-types`);
            return response.data;
        } catch (error) {
            console.error('Popüler türler getirme hatası:', error);
            return [];
        }
    }

    /**
     * Evcil hayvan istatistiklerini getir
     */
    async getPetStatistics(userId?: number): Promise<{
        totalPets: number;
        activePets: number;
        adoptedPets: number;
        lostPets: number;
        byType: Record<string, number>;
    }> {
        try {
            const url = userId ? `${this.baseUrl}/statistics?userId=${userId}` : `${this.baseUrl}/statistics`;
            const response = await apiClient.get(url);
            return response.data;
        } catch (error) {
            console.error('İstatistik getirme hatası:', error);
            return {
                totalPets: 0,
                activePets: 0,
                adoptedPets: 0,
                lostPets: 0,
                byType: {}
            };
        }
    }
}

export const petApiService = new PetApiService();
export default petApiService;