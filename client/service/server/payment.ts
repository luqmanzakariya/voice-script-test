"server-only";
import API_ROUTE from "@/lib/api-route";
import { apiServer } from "@/lib/axios-server";

export const getPaymentServer = async () => {
  try {
    const response = await apiServer.get(API_ROUTE.PAYMENT);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPaymentByUserServer = async (userId: string) => {
  try {
    const response = await apiServer.get(
      `${API_ROUTE.PAYMENT_BY_USER}/${userId}`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
