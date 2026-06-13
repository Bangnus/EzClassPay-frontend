// ตัวอย่าง
// 'use server'
// import { axiosInstance } from "@/lib/axios";
// import { UserDto } from "./types";

// export const fetchUsers = async (): Promise<UserDto[]> => {
//   try {
//     const res = await axiosInstance.get("/users");
//     return res.data;
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     return [];
//   }
// };

// export const fetchUserById = async (id: string): Promise<UserDto | null> => {
//   try {
//     const res = await axiosInstance.get(`/users/${id}`);
//     return res.data;
//   } catch (error) {
//     console.log(error)
//     return null;
//   }
// };
