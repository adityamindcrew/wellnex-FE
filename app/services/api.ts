import axios from 'axios';

const BASE_URL = 'http://56.228.66.97:3000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface BusinessSignupData {
  email: string;
  password: string;
  name: string;
  contact_name: string;
  website_url?: string;
  instagram_url?: string;
}

export const businessApi = {
  signup: async (data: BusinessSignupData) => {
    try {
      const response = await api.post('/business/signup', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  uploadLogo: async (file: File, token: string, businessId: string) => {
    const formData = new FormData();
    formData.append('logo', file);
    formData.append('businessId', businessId);
    try {
      const response = await fetch('http://56.228.66.97:3000/business/uploadBusinessLogo', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to upload logo');
      return data;
    } catch (err) {
      throw err;
    }
  },
  setThemeColor: async (themeColor: string, token: string, businessId?: string) => {
    try {
      const body = businessId
        ? JSON.stringify({ themeColor, businessId })
        : JSON.stringify({ themeColor });
      const response = await fetch('http://56.228.66.97:3000/business/setBusinessThemeColor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to set theme color');
      return data;
    } catch (err) {
      throw err;
    }
  },
  addBusinessKeywords: async (keywords: { name: string }[], token: string, businessId: string) => {
    try {
      const response = await fetch('http://56.228.66.97:3000/business/addBusinessKeywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          keywords, 
          businessId,
          replace: true
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to add keywords');
      return data;
    } catch (err) {
      throw err;
    }
  },
  signin: async (email: string, password: string) => {
    const businessId = typeof window !== 'undefined' ? localStorage.getItem('businessId') : undefined;
    const body: any = { email, password };
    if (businessId) body.businessId = businessId;
    const response = await fetch('http://56.228.66.97:3000/business/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok || !data.status) {
      throw new Error(data.message || 'Invalid email or password');
    }
    return data;
  },
};

export default api; 