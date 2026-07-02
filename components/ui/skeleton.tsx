// 1. นำเข้า React (สำคัญ)
import React from "react";

// 2. เขียนแบบ Inline Type (ลดบรรทัด ลด Error)
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      // animate-pulse: สั่งกระพริบ
      // bg-gray-200: สีเทา
      // rounded-md: มุมมน
      className={`animate-pulse rounded-md bg-gray-200 ${className}`}
      {...props}
    />
  );
}