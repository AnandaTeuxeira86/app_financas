"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowRightIcon, PlusIcon } from "lucide-react"
import { ExpenseChart } from "@/components/app/expense-chart"
import { PeriodFilter, WithCurrentPeriod, type Period } from "@/components/app/period-filter"
import { SummaryCards } from "@/components/app/summary-cards"
import { TransactionDialog } from "@/components/app/transaction-dialog"
import { TransactionList } from "@/components/app/transaction-list"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTransactions } from "@/hooks/use-transactions"
import { expensesByCategory, periodLabel, summarize } from "@/lib/finance"

export function DashboardView() {
  return <WithCurrentPeriod>{(period) => <Dashboard initial={period} />}</WithCurrentPeriod>
}

function Dashboard({ initial }: { initial: Period }) {
  const [period, setPeriod] = useState(initial)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { transactions, loading, error, create } = useTransactions(period.year, period.month)

  const totals = useMemo(() => summarize(transactions), [transactions])
  const byCategory = useMemo(() => expensesByCategory(transactions), [transactions])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Resumo de {periodLabel(period.year, period.month)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <PeriodFilter
            year={period.year}
            month={period.month}
            onChange={(year, month) => setPeriod({ year, month })}
          />
          <Button onClick={() => setDialogOpen(true)}>
            <PlusIcon /> Nova transação
          </Button>
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Não foi possível carregar as transações. {error}
        </p>
      )}

      <SummaryCards {...totals} loading={loading} />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ExpenseChart data={byCategory} loading={loading} />
        </div>
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Últimas transações</CardTitle>
            <Link href="/transacoes" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              Ver todas <ArrowRightIcon />
            </Link>
          </CardHeader>
          <CardContent>
            <TransactionList
              compact
              transactions={transactions.slice(0, 6)}
              loading={loading}
              emptyMessage="Nenhuma transação neste período."
            />
          </CardContent>
        </Card>
      </div>

      <TransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={create} />
    </div>
  )
}
