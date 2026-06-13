// ตัวอย่าง
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// interface FollowState {
//   followingIds: number[]; // เก็บ ID คนที่เราติดตาม
//   toggleFollow: (id: number) => void;
// }

// export const useFollowStore = create<FollowState>()(
//   persist(
//     (set) => ({
//       followingIds: [],
//       toggleFollow: (id) => set((state) => {
//         const isFollowing = state.followingIds.includes(id);
//         return {
//           followingIds: isFollowing
//             ? state.followingIds.filter(fid => fid !== id) // Unfollow
//             : [...state.followingIds, id] // Follow
//         };
//       }),
//     }),
//     { name: 'user-follow-storage' }
//   )
// );
