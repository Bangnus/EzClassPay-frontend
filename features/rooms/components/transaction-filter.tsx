"use client";

import { THAI_MONTHS_LONG, toBuddhistYear } from "@/utils/date";

interface TransactionFilterProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

export default function TransactionFilter({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
}: TransactionFilterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-extrabold text-primary tracking-tight">
        ประวัติรับ-จ่าย
      </h1>
      <div className="flex items-center gap-2">
        <select
          value={selectedMonth}
          onChange={(e) => onMonthChange(Number(e.target.value))}
          className="bg-white border border-border text-text-primary rounded-xl px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
        >
          {THAI_MONTHS_LONG.map((m, i) => (
            <option key={i} value={i + 1}>
              {m}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="bg-white border border-border text-text-primary rounded-xl px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
        >
          {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
            <option key={y} value={y}>
              {toBuddhistYear(y)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
