"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CATEGORY_COLORS, formatCurrency, type Category } from "@/lib/finance"

type Slice = { category: Category; value: number }

export function ExpenseChart({ data, loading }: { data: Slice[]; loading: boolean }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Despesas por categoria</CardTitle>
        <CardDescription>Distribuição dos gastos no período</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="mx-auto size-48 rounded-full" />
        ) : data.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Nenhuma despesa registrada neste período.
          </p>
        ) : (
          <div className="grid items-center gap-6 md:grid-cols-[200px_1fr]">
            <div className="relative mx-auto size-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="category"
                    innerRadius={62}
                    outerRadius={96}
                    paddingAngle={data.length > 1 ? 1 : 0}
                    stroke="var(--card)"
                    strokeWidth={2}
                    isAnimationActive={false}
                  >
                    {data.map((d) => (
                      <Cell key={d.category} fill={CATEGORY_COLORS[d.category]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      const p = payload[0].payload as Slice
                      return (
                        <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
                          <p className="font-medium">{p.category}</p>
                          <p className="text-muted-foreground tabular-nums">
                            {formatCurrency(p.value)} · {((p.value / total) * 100).toFixed(1)}%
                          </p>
                        </div>
                      )
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs text-muted-foreground">Total</span>
                <span className="text-sm font-semibold tabular-nums">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Legenda + tabela de valores: a identidade nunca depende só da cor */}
            <ul className="space-y-2.5 text-sm">
              {data.map((d) => (
                <li key={d.category} className="flex items-center gap-3">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[d.category] }}
                  />
                  <span className="flex-1">{d.category}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {((d.value / total) * 100).toFixed(0)}%
                  </span>
                  <span className="w-28 text-right font-medium tabular-nums">
                    {formatCurrency(d.value)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
