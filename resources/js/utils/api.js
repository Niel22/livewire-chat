import axios from "axios";
import { router } from "@inertiajs/react";

const api = axios.create({
  // baseURL: "http://localhost:8000/api",
  // baseURL: "https://taskwin-workstation.com/api",
  baseURL: "https://staging.taskwin-workstation.com/api",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

api.defaults.withCredentials = true;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      
      if (error.response.status === 401) {
        router.visit("/login"); 
      }

      if (error.response.status === 403) {
        router.visit("/forbidden");
      }

    }

    return Promise.reject(error);
  }
);

export default api;
