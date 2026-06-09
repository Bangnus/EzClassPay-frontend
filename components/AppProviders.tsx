"use client";

import { ConfigProvider } from "antd";

interface AppProvidersProps {
  children: React.ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#00c6ae",
          colorPrimaryHover: "#1fc2a2",
          colorPrimaryActive: "#1fc2a2",
          colorBorder: "#e0e0e0",
          colorText: "#333333",
          colorTextSecondary: "#7d7d7d",
          colorBgLayout: "#f2f2f7",
          colorBgContainer: "#ffffff",
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
