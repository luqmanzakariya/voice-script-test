import { apiClient } from "@/lib/axios";
import API_CLIENT_ROUTE from "@/lib/api-client-route";

export const postLoginClient = async (payload: {
  email: string;
  password: string;
}) => {
  try {
    const response = await apiClient.post(API_CLIENT_ROUTE.LOGIN, payload);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
