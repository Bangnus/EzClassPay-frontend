import React from "react";

interface RecommendCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
}

export default function RecommendCard({
  title,
  description,
  icon,
  iconBg,
}: RecommendCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col items-center text-center shadow-card w-full hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer group">
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${iconBg}`}
      >
        {icon}
      </div>
      <h3 className="text-[18px] font-semibold mb-4 text-text-primary">
        {title}
      </h3>
      <p className="text-[14px] text-text-secondary font-normal leading-relaxed">
        {description}
      </p>
    </div>
  );
}
