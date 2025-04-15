// axiosInterceptors.ts
import axios from "axios";
import { signOut } from "next-auth/react";

// Add an interceptor that checks for 401 responses
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Session expired. Signing out user...");
      signOut({ callbackUrl: "/signin" });
    }
    return Promise.reject(error);
  }
);
