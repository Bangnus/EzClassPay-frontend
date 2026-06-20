import React, { SelectHTMLAttributes } from "react";

interface Option {
  value: string | number;
  label: string;
}

interface CustomSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  wrapperClassName?: string;
  options: Option[];
  onChange?: (value: string | number) => void;
}

export default function Select({ label, wrapperClassName, className, options, onChange, ...props }: CustomSelectProps) {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${wrapperClassName || ""}`}>
      {label && (
        <label className="text-sm font-semibold text-text-primary ml-1">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <select
          {...props}
          onChange={(e) => onChange?.(e.target.value)}
          className={`appearance-none w-full outline-none min-h-[46px] rounded-xl px-4 py-2.5 pr-10 text-[15px] text-text-primary bg-white border border-border hover:border-primary hover:bg-white focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/20 transition-all duration-300 disabled:opacity-50 disabled:bg-bg disabled:cursor-not-allowed ${className || ""}`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-500">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
