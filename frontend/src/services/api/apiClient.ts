import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';

// API base URL'i environment variable'dan al
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// Axios instance oluştur
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 saniye timeout
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor - her istekte JWT token ekle
apiClient.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        const token = localStorage.getItem('jwt_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - hata yönetimi ve token yenileme
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // 401 Unauthorized hatası - token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Refresh token ile yeni token al
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
                        refreshToken
                    });

                    const { accessToken } = response.data;
                    localStorage.setItem('jwt_token', accessToken);

                    // Orijinal isteği yeni token ile tekrarla
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                // Refresh token da expired - kullanıcıyı logout yap
                localStorage.removeItem('jwt_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                
                // Login sayfasına yönlendir
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Diğer hataları handle et
        handleApiError(error);
        return Promise.reject(error);
    }
);

// API hata yönetimi
const handleApiError = (error: any) => {
    let errorMessage = 'Bir hata oluştu';

    if (error.response) {
        // Server'dan gelen hata
        const { status, data } = error.response;
        
        switch (status) {
            case 400:
                errorMessage = data.message || 'Geçersiz istek';
                break;
            case 401:
                errorMessage = 'Yetkilendirme hatası';
                break;
            case 403:
                errorMessage = 'Bu işlem için yetkiniz yok';
                break;
            case 404:
                errorMessage = 'İstenen kaynak bulunamadı';
                break;
            case 409:
                errorMessage = data.message || 'Çakışma hatası';
                break;
            case 422:
                errorMessage = data.message || 'Validasyon hatası';
                break;
            case 500:
                errorMessage = 'Sunucu hatası';
                break;
            default:
                errorMessage = data.message || `Hata kodu: ${status}`;
        }
    } else if (error.request) {
        // Network hatası
        errorMessage = 'Sunucuya bağlanılamıyor';
    } else {
        // Diğer hatalar
        errorMessage = error.message || 'Bilinmeyen hata';
    }

    // Toast ile hata mesajını göster
    toast.error(errorMessage);
    
    // Console'a da logla
    console.error('API Error:', {
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method
    });
};

// HTTP metodları için wrapper fonksiyonlar
export const apiClientWrapper = {
    get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return apiClient.get<T>(url, config);
    },

    post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return apiClient.post<T>(url, data, config);
    },

    put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return apiClient.put<T>(url, data, config);
    },

    patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return apiClient.patch<T>(url, data, config);
    },

    delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return apiClient.delete<T>(url, config);
    },

    upload: <T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        const uploadConfig: AxiosRequestConfig = {
            ...config,
            headers: {
                ...config?.headers,
                'Content-Type': 'multipart/form-data',
            },
        };
        return apiClient.post<T>(url, formData, uploadConfig);
    },

    download: (url: string, filename?: string, config?: AxiosRequestConfig): Promise<void> => {
        return apiClient.get(url, {
            ...config,
            responseType: 'blob',
        }).then((response) => {
            const blob = new Blob([response.data]);
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename || 'download';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
        });
    },
};

// Utility fonksiyonlar
export const apiUtils = {
    // URL parametrelerini oluştur
    buildQueryParams: (params: Record<string, any>): string => {
        const searchParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                if (Array.isArray(value)) {
                    value.forEach(item => searchParams.append(key, item.toString()));
                } else {
                    searchParams.append(key, value.toString());
                }
            }
        });
        
        return searchParams.toString();
    },

    // Pagination parametrelerini oluştur
    buildPaginationParams: (page: number = 0, size: number = 20, sort?: string): Record<string, any> => {
        const params: Record<string, any> = { page, size };
        if (sort) params.sort = sort;
        return params;
    },

    // Response'u handle et
    handleResponse: <T>(response: AxiosResponse<T>): T => {
        return response.data;
    },

    // Error'u handle et
    handleError: (error: any): never => {
        throw error;
    },
};

// Export ana client
export { apiClient };

// Default export
export default apiClient;
