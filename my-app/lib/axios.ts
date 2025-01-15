import axios from "axios";
import { useAuth } from "@clerk/nextjs";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Create a function to get the session token
const getSessionToken = async () => {
  try {
    const { getToken } = useAuth();
    return await getToken();
  } catch (error) {
    console.error("Error getting session token:", error);
    return null;
  }
};

// Add a request interceptor for authentication
api.interceptors.request.use(
  async (config) => {
    const token = await getSessionToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized error - you can use Next.js router here
      // or handle it in your components
      console.error("Unauthorized access");
    }
    return Promise.reject(error);
  }
);

export default api;
