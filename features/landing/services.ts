import { getUserSummaryApi } from "./repository";

export const getUserSummary = async () => {
  const res = await getUserSummaryApi();
  return res.data;
};
