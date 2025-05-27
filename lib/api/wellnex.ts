import { apiClient } from './client';

// Define your API types here
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  // Add other user properties as needed
}

export interface BusinessDetails {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  logo?: string;
  // Add other business properties as needed
}

export interface BusinessListParams {
  limit?: number;
  skip?: number;
  sort?: string;
  sort_order?: 1 | -1;
}

export interface BusinessListItem {
  id: string;
  name: string;
  status: string;
  industry: string;
  email: string;
  logo?: string;
}

export interface BusinessListResponse {
  data: BusinessListItem[];
  total: number;
  limit: number;
  skip: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export const wellnexApi = {
  // User related endpoints
  users: {
    getCurrentUser: () => apiClient.get<ApiResponse<User>>('/users/me'),
    updateProfile: (data: Partial<User>) => 
      apiClient.put<ApiResponse<User>>('/users/profile', data),
  },

  // Business related endpoints
  business: {
    getBusinessDetails: () => 
      apiClient.get<ApiResponse<BusinessDetails>>('/business/getBusinessDetail'),
    getBusinessList: (params: BusinessListParams) => 
      apiClient.get<ApiResponse<BusinessListResponse>>('/admin/getBusinessList', {
        params: {
          limit: params.limit || 10,
          skip: params.skip || 0,
          sort: params.sort || 'name',
          sort_order: params.sort_order || -1
        }
      }),
  },

  // Add other API endpoints as needed
  // Example:
  // auth: {
  //   login: (credentials: { email: string; password: string }) =>
  //     apiClient.post<ApiResponse<{ token: string }>>('/auth/login', credentials),
  //   register: (userData: Partial<User>) =>
  //     apiClient.post<ApiResponse<User>>('/auth/register', userData),
  // },
}; 