import API_ROUTE from "@/lib/api-route";
import { apiServer } from "@/lib/axios-server";

export const postLoginServer = async (payload: {
  email: string;
  password: string;
}) => {
  try {
    const response = await apiServer.post(API_ROUTE.LOGIN, payload);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
