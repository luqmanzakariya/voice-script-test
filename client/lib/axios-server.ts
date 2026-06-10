import "server-only";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const apiServer = axios.create({
  baseURL: process.env.API_URL,
});

apiServer.interceptors.request.use(async (config) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiServer.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response?.status === 401 ||
      error.response?.data?.statusCode === 401
    ) {
      redirect("/api/auth/logout");
    }
    return Promise.reject(error);
  },
);

export { apiServer };
