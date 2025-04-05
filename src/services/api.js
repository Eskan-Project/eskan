import axios from "axios";

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

// API endpoints related to Turnstile verification
export const turnstileApi = {
  verify(token) {
    return api.post("/verify-turnstile", { turnstileToken: token });
  },
};

export default api;
