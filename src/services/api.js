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

  // Check if user is verified
  isVerified() {
    return sessionStorage.getItem("turnstileVerified") === "true";
  },

  // Set verified status
  setVerified(status = true) {
    sessionStorage.setItem("turnstileVerified", status.toString());
  },

  // Clear verified status (useful for testing)
  clearVerification() {
    sessionStorage.removeItem("turnstileVerified");
  },
};

export default api;
