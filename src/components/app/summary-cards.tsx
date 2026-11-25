import { ArrowDownRightIcon, ArrowUpRightIcon, ScaleIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/finance"
import { cn } from "@/lib/utils"

export function SummaryCards({
  income,
  expense,
  balance,
  loading,
}: {
  income: number
  expense: number
  balance: number
  loading: boolean
}) {
  const cards = [
    {
      title: "Receitas",
      value: income,
      icon: ArrowUpRightIcon,
      tone: "text-emerald-600",
      chip: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Despesas",
      value: expense,
      icon: ArrowDownRightIcon,
      tone: "text-rose-600",
      chip: "bg-rose-50 text-rose-600",
    },
    {
      title: "Saldo",
      value: balance,
      icon: ScaleIcon,
      tone: balance < 0 ? "text-rose-600" : "text-foreground",
      chip: "bg-primary/10 text-primary",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map(({ title, value, icon: Icon, tone, chip }) => (
        <Card key={title}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <span className={cn("flex size-8 items-center justify-center rounded-lg", chip)}>
              <Icon className="size-4" />
            </span>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <p className={cn("text-2xl font-semibold tracking-tight tabular-nums", tone)}>
                {formatCurrency(value)}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
