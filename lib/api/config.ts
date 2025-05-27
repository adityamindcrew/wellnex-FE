export const API_BASE_URL = 'https://wellnexai.com/api';

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ3ZWxsbmV4dXNlcnMiLCJzdWIiOnsiX2lkIjoiNjgyYzgyZjY5NzIwMTY0YzE0MjE1MTBhIiwiZmlyc3ROYW1lIjoiQWRtaW4gT25lIiwiZW1haWwiOiJhZG1pbjFAbWFpbGluYXRvci5jb20iLCJyb2xlcyI6ImFkbWluIiwiY3JlYXRlZEF0IjoiMjAyNS0wNS0yMFQxMzoyNjoxNC4zNDVaIiwidXBkYXRlZEF0IjoiMjAyNS0wNS0yNlQyMDo1NzoxMC44NzFaIn0sImlhdCI6MTc0ODMzODk2NzYzNCwiZXhwIjoxNzUwOTMwOTY3NjM0fQ.SrMkM1DLyEP2e-5KW8gC5Q9ZuvYtbrhyKsbiIVyE9Vg'
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