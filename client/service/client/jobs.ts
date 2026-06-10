import { apiClient } from "@/lib/axios";
import API_CLIENT_ROUTE from "@/lib/api-client-route";

export const postAssignJobClient = async (payload: {
  jobId: number;
  reporterId?: number;
  editorId?: number;
}) => {
  try {
    const response = await apiClient.post(API_CLIENT_ROUTE.JOBS, payload);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const getJobsClient = async () => {
  try {
    const response = await apiClient.get(API_CLIENT_ROUTE.JOBS);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const patchUpdateJobStatusClient = async (payload: {
  jobId: number;
  status: string;
}) => {
  try {
    const response = await apiClient.post(
      API_CLIENT_ROUTE.JOBS_UPDATE,
      payload,
    );
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const getUserReporterAndEditorClient = async () => {
  try {
    const response = await apiClient.get(API_CLIENT_ROUTE.JOBS_LIST);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
