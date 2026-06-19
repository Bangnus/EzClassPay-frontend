import React, { InputHTMLAttributes } from "react";

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  wrapperClassName?: string;
}

export default function Input({ label, wrapperClassName, className, ...props }: CustomInputProps) {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${wrapperClassName || ""}`}>
      {label && (
        <label className="text-sm font-semibold text-text-primary ml-1">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`w-full outline-none min-h-[46px] rounded-xl px-4 py-2.5 text-[15px] text-text-primary bg-white border border-border hover:border-primary hover:bg-white focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/20 transition-all duration-300 placeholder:text-text-secondary disabled:opacity-50 disabled:bg-bg disabled:cursor-not-allowed ${className || ""}`}
      />
    </div>
  );
}
