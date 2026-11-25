"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MONTHS } from "@/lib/finance"

const monthItems: Record<string, string> = {
  "0": "Ano inteiro",
  ...Object.fromEntries(MONTHS.map((m, i) => [String(i + 1), m])),
}

function yearOptions() {
  const current = new Date().getFullYear()
  return Array.from({ length: 6 }, (_, i) => String(current + 1 - i))
}

export function PeriodFilter({
  year,
  month,
  onChange,
}: {
  year: number
  month: number
  onChange: (year: number, month: number) => void
}) {
  const years = yearOptions()
  if (!years.includes(String(year))) years.push(String(year))

  return (
    <div className="flex gap-2">
      <Select
        items={monthItems}
        value={String(month)}
        onValueChange={(v) => v !== null && onChange(year, Number(v))}
      >
        <SelectTrigger className="w-36" aria-label="Mês">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(monthItems).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={String(year)} onValueChange={(v) => v !== null && onChange(Number(v), month)}>
        <SelectTrigger className="w-24" aria-label="Ano">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={y}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export function useCurrentPeriod() {
  const now = new Date()
  return { year: now.getFullYear(), month: now.getMonth() + 1 }
}
