import { axiosInstance } from "@/lib/axios";

export const getUserSummaryApi = () => {
  return axiosInstance.get("/api/users/summary");
};
