import axios from "axios";
import { getAccessTokenFromLocalStorage } from "utils/web-storage";

const NEXT_API_BASE_URL = "/api";

export const authApiClient = axios.create({
  baseURL: NEXT_API_BASE_URL,
});

authApiClient.interceptors.request.use((config) => {
  const accessToken = getAccessTokenFromLocalStorage();

  if (accessToken) {
    config.headers.authorization = accessToken;
  }

  return config;
});

export const apiClient = axios.create({
  baseURL: NEXT_API_BASE_URL,
});
