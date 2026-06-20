import React from "react";
import {
  Modal as AntModal,
  ModalProps as AntModalProps,
  ConfigProvider,
} from "antd";

interface CustomModalProps extends AntModalProps {
  children: React.ReactNode;
}

export default function Modal({ children, ...props }: CustomModalProps) {
  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadiusLG: 16,
          paddingContentHorizontalLG: 24,
        },
      }}
    >
      <AntModal centered {...props}>
        {children}
      </AntModal>
    </ConfigProvider>
  );
}
