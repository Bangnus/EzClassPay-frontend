import React from "react";
import {
  Select as AntSelect,
  SelectProps as AntSelectProps,
  ConfigProvider,
} from "antd";

interface Option {
  value: string | number;
  label: string;
}

interface CustomSelectProps extends Omit<AntSelectProps, "options"> {
  label?: string;
  wrapperClassName?: string;
  options: Option[];
}

export default function Select({
  label,
  wrapperClassName,
  className,
  options,
  ...props
}: CustomSelectProps) {
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
        <AntSelect
          className={`w-full ${className || ""}`}
          options={options}
          {...props}
        />
      </ConfigProvider>
    </div>
  );
}
