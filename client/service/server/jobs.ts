"server-only";
import API_ROUTE from "@/lib/api-route";
import { apiServer } from "@/lib/axios-server";

export const getJobsServer = async () => {
  try {
    const response = await apiServer.get(API_ROUTE.JOBS);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postAssignJobServer = async (payload: {
  jobId: number;
  reporterId?: number;
  editorId?: number;
}) => {
  try {
    const response = await apiServer.post(API_ROUTE.JOBS_ASSIGN, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const patchUpdateJobStatusServer = async (payload: {
  jobId: number;
  status: string;
}) => {
  try {
    const response = await apiServer.patch(API_ROUTE.JOBS_UPDATE, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
