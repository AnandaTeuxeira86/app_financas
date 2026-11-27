"use client"

import { useSyncExternalStore } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
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

export type Period = { year: number; month: number }

const noopSubscribe = () => () => {}
const currentPeriodKey = () => {
  const now = new Date()
  return `${now.getFullYear()}-${now.getMonth() + 1}`
}

/**
 * Mês/ano atuais, lidos só no navegador. Durante o pré-render no servidor
 * retorna null: a data "de hoje" não pode ficar congelada na build.
 */
export function useCurrentPeriod(): Period | null {
  const key = useSyncExternalStore(noopSubscribe, currentPeriodKey, () => null)
  if (!key) return null
  const [year, month] = key.split("-").map(Number)
  return { year, month }
}

/** Renderiza os filhos com o período atual, mostrando um carregamento até ele estar disponível. */
export function WithCurrentPeriod({ children }: { children: (period: Period) => React.ReactNode }) {
  const period = useCurrentPeriod()
  if (!period) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }
  return children(period)
}
