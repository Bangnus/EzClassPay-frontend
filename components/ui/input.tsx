import React from "react";
import { Input as AntInput, InputProps as AntInputProps, ConfigProvider } from "antd";

interface CustomInputProps extends AntInputProps {
  label?: string;
  wrapperClassName?: string;
  error?: string;
}

export default function Input({
  label,
  wrapperClassName,
  className,
  error,
  ...props
}: CustomInputProps) {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${wrapperClassName || ""}`}>
      {label && (
        <label className="text-sm font-semibold text-text-primary ml-1">
          {label}
        </label>
      )}
      <ConfigProvider
        theme={{
          token: {
            borderRadius: 12,
            controlHeight: 46,
            fontSize: 15,
          },
        }}
      >
        <AntInput
          status={error ? "error" : undefined}
          className={`w-full ${className || ""}`}
          {...props}
        />
      </ConfigProvider>
      {error && <span className="text-red-500 text-xs ml-1 font-medium">{error}</span>}
    </div>
  );
}
