"server-only";
import API_ROUTE from "@/lib/api-route";
import { apiServer } from "@/lib/axios-server";

export const getUserReporter = async () => {
  try {
    const response = await apiServer.get(API_ROUTE.USERS_REPORTERS);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserEditor = async () => {
  try {
    const response = await apiServer.get(API_ROUTE.USERS_EDITORS);
    return response.data;
  } catch (error) {
    throw error;
  }
};
