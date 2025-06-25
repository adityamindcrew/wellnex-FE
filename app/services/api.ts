import axios from 'axios';

const BASE_URL = process.env.NEXT_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

export interface BusinessSignupData {
  email: string;
  password: string;
  mobile: string;
  name: string;
  contact_name: string;
  website_url?: string;
  instagram_url?: string;
}

export const businessApi = {
  signup: async (data: BusinessSignupData) => {
    const response = await fetch(`${BASE_URL}/business/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  sendVerificationEmail: async (token: string, businessId: string) => {
    const response = await fetch(`${BASE_URL}/business/sendVerificationEmail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        businessId,
      }),
    });
    return handleResponse(response);
  },
  verifyEmailByLink: async (businessId: string, token: string) => {
    const response = await fetch(`${BASE_URL}/business/verifyEmailByLink`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        verificationToken: token,
        _id: businessId
      })
    });
    return handleResponse(response);
  },
  uploadLogo: async (file: File, token: string, businessId: string) => {
    const formData = new FormData();
    formData.append('logo', file);
    formData.append('businessId', businessId);

    try {
      const response = await fetch(`${process.env.NEXT_API_URL}/business/uploadBusinessLogo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      // Handle 413 error specifically
      if (response.status === 413) {
        throw new Error('File size too large. Please use a smaller image (max 5MB).');
      }
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload logo');
      }

      // Format the logo URL to match the required format
      let logoUrl = data.logoUrl;
      if (logoUrl) {
        // If the URL doesn't start with https://wellnexai.com, add it
        if (!logoUrl.startsWith('https://wellnexai.com')) {
          logoUrl = `https://wellnexai.com${logoUrl.startsWith('/') ? '' : '/'}${logoUrl}`;
        }
      }

      return { ...data, logoUrl };
    } catch (err) {
      // Re-throw the error with more context if it's a network error
      if (err instanceof TypeError && err.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      throw err;
    }
  },
  setThemeColor: async (themeColor: string, token: string, businessId?: string) => {
    try {
      const body = businessId
        ? JSON.stringify({ themeColor, businessId })
        : JSON.stringify({ themeColor });
      const response = await fetch(`${process.env.NEXT_API_URL}/business/setBusinessThemeColor`, {
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
      const response = await fetch(`${process.env.NEXT_API_URL}/business/addBusinessKeywords`, {
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
    const response = await fetch(`${process.env.NEXT_API_URL}/business/signin`, {
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
  setupChatbot: async (
    businessId: string,
    questions: { name: string }[],
    token: string
  ) => {
    const response = await fetch(`${BASE_URL}/business/add-business-questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        businessId,
        questions,

      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to setup chatbot");
    }

    return response.json();
  },
  forgotPassword: async (email: string) => {
 
    try {
      const response = await fetch(`${BASE_URL}/business/forgotPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
   

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset password email');
      }

      return data;
    } catch (error) {
      console.error("Error in forgotPassword API:", error);
      throw error;
    }
  },
  resetPassword: async (password: string, token: string) => {
    const response = await fetch(`${BASE_URL}/business/resetPassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password, token }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reset password');
    }

    return response.json();
  },
  checkVerificationStatus: async (businessId: string, token: string) => {
    try {
      const response = await fetch(`${BASE_URL}/business/verify-status`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ businessId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to check verification status');
      }

      return data;
    } catch (error) {
      console.error('Error checking verification status:', error);
      throw error;
    }
  },
  // updateOneService: async (services: { name: string }[], token: string, businessId: string) => {
  //   const response = await fetch(`${BASE_URL}/business/updateOneService`, {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${token}`
  //     },
  //     body: JSON.stringify({
  //       businessId,
  //       services
  //     })
  //   });
  //   return response.json();
  // },
};

export default api; 