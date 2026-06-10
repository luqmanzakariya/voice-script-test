import axios from "axios";
import API_CLIENT_ROUTE from "@/lib/api-client-route";

const apiClient = axios.create();
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url === API_CLIENT_ROUTE.LOGIN;
    if (error.response?.status === 401 && !isLoginRequest) {
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  },
);

export { apiClient };
