import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://56.228.66.97:3000"

const businessApi = {
  signup: async (data: {
    name: string
    email: string
    password: string
    website?: string
    instagram?: string
  }) => {
    const response = await axios.post(`${API_BASE_URL}/business/signup`, data)
    return response.data
  },

  uploadBusinessLogo: async (formData: FormData) => {
    const response = await axios.post(`${API_BASE_URL}/business/uploadBusinessLogo`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  setBusinessThemeColor: async (data: { themeColor: string; businessId: string }) => {
    const response = await axios.post(
      `${API_BASE_URL}/business/setBusinessThemeColor`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
    return response.data
  },

  addBusinessKeywords: async (data: { keywords: { name: string }[]; businessId: string }) => {
    const response = await axios.post(
      `${API_BASE_URL}/business/addBusinessKeywords`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
    return response.data
  },
}

export default businessApi 