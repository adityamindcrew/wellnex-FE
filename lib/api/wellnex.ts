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
  search?: string;
}

export interface BusinessListResponse {
  docs: BusinessListItem[];
  totalDocs: number;
  offset: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface BusinessListItem {
  _id: string;
  name: string;
  email: string;
  contact_name: string;
  website_url: string | null;
  instagram_url: string | null;
  logo: string | null;
  themeColor: string | null;
  isEmailVerified: boolean;
  keywords: Array<{
    name: string;
    _id: string;
  }>;
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
          sort_order: params.sort_order || -1,
          search: params.search || ''
        }
      }),
  },

 
}; 