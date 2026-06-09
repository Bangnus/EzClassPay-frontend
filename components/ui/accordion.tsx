"use client";

import { ReactNode, useState } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function Accordion({
  title,
  icon,
  children,
  defaultOpen = false,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={`group bg-white border border-gray-100 rounded-2xl shadow-soft mb-4 last:mb-0 transition-all duration-300 ${
        isOpen ? "shadow-md" : ""
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex cursor-pointer items-center justify-between p-5 text-text-primary font-medium text-lg text-left select-none outline-none ${
          isOpen ? "border-b border-gray-200" : ""
        }`}
      >
        <div className="flex items-center gap-2">
          {icon && (
            <span className="w-10 h-10 flex items-center justify-center shrink-0">
              {icon}
            </span>
          )}
          <span>{title}</span>
        </div>
        <span
          className={`transition-transform duration-300 shrink-0 ml-4 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          <ChevronDown className="w-6 h-6 text-gray-400" strokeWidth={2} />
        </span>
      </button>

      {/* Smooth height transition wrapper using CSS Grid */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 py-4 text-base text-text-secondary leading-relaxed font-normal">{children}</div>
        </div>
      </div>
    </div>
  );
}
