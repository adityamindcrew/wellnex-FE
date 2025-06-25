export const API_BASE_URL = "http://13.61.105.209/api";

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("token") || '';

  }
  return '';
};

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${getToken()}`
};

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
} 