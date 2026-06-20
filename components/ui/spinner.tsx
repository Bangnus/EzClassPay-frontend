import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

interface SpinnerProps {
  text?: string;
  className?: string;
  size?: number;
}

export default function Spinner({
  text = "กำลังโหลด...",
  className = "",
  size = 40,
}: SpinnerProps) {
  const antIcon = (
    <LoadingOutlined className="text-primary" style={{ fontSize: size }} spin />
  );

  return (
    <div
      className={`flex flex-col items-center justify-center py-10 space-y-4 ${className}`}
    >
      <Spin indicator={antIcon} />
      {text && <p className="text-text-secondary font-medium">{text}</p>}
    </div>
  );
}
