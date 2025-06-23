import axios from "axios";
import { config } from "../config";

export const api = axios.create({
  baseURL: config.apiUrl,
  timeout: config.api.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (config.isDevelopment) {
      console.error("API Error:", error);
    }
    return Promise.reject(error);
  }
);

// Interceptor para logging en desarrollo
if (config.isDevelopment) {
  api.interceptors.request.use(
    (config) => {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
      );
      return config;
    },
    (error) => {
      console.error("Request Error:", error);
      return Promise.reject(error);
    }
  );
}
