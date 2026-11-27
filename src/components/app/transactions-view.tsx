"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { DownloadIcon, PlusIcon, SearchIcon } from "lucide-react"
import { PeriodFilter, WithCurrentPeriod, type Period } from "@/components/app/period-filter"
import { TransactionDialog } from "@/components/app/transaction-dialog"
import { TransactionList } from "@/components/app/transaction-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTransactions } from "@/hooks/use-transactions"
import {
  CATEGORIES,
  downloadCSV,
  formatCurrency,
  periodLabel,
  summarize,
  type Transaction,
} from "@/lib/finance"

const ALL = "todas"
const categoryItems: Record<string, string> = {
  [ALL]: "Todas as categorias",
  ...Object.fromEntries(CATEGORIES.map((c) => [c, c])),
}

const normalize = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()

export function TransactionsView() {
  return <WithCurrentPeriod>{(period) => <Transactions initial={period} />}</WithCurrentPeriod>
}

function Transactions({ initial }: { initial: Period }) {
  const [period, setPeriod] = useState(initial)
  const [category, setCategory] = useState<string>(ALL)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const { transactions, loading, error, create, update, remove } = useTransactions(
    period.year,
    period.month
  )

  const filtered = useMemo(() => {
    const q = normalize(search.trim())
    return transactions.filter(
      (t) =>
        (category === ALL || t.category === category) &&
        (!q || normalize(t.description).includes(q))
    )
  }, [transactions, category, search])

  const totals = useMemo(() => summarize(filtered), [filtered])

  function openNew() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(t: Transaction) {
    setEditing(t)
    setDialogOpen(true)
  }

  function exportCSV() {
    if (filtered.length === 0) {
      toast.info("Não há transações para exportar.")
      return
    }
    const suffix =
      period.month === 0
        ? `${period.year}`
        : `${period.year}-${String(period.month).padStart(2, "0")}`
    downloadCSV(filtered, `transacoes-${suffix}.csv`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Transações</h1>
          <p className="text-sm text-muted-foreground">{periodLabel(period.year, period.month)}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV}>
            <DownloadIcon /> Exportar CSV
          </Button>
          <Button onClick={openNew}>
            <PlusIcon /> Nova transação
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 lg:flex-row">
            <div className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por descrição"
                className="pl-8"
                aria-label="Buscar por descrição"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <PeriodFilter
                year={period.year}
                month={period.month}
                onChange={(year, month) => setPeriod({ year, month })}
              />
              <Select
                items={categoryItems}
                value={category}
                onValueChange={(v) => v && setCategory(v)}
              >
                <SelectTrigger className="w-48" aria-label="Categoria">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryItems).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!loading && filtered.length > 0 && (
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
              <span>{filtered.length} transações</span>
              <span>
                Receitas:{" "}
                <span className="font-medium text-income tabular-nums">
                  {formatCurrency(totals.income)}
                </span>
              </span>
              <span>
                Despesas:{" "}
                <span className="font-medium text-expense tabular-nums">
                  {formatCurrency(totals.expense)}
                </span>
              </span>
              <span>
                Saldo:{" "}
                <span className="font-medium text-foreground tabular-nums">
                  {formatCurrency(totals.balance)}
                </span>
              </span>
            </div>
          )}

          {error && (
        <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Não foi possível carregar as transações. {error}
        </p>
      )}

          <TransactionList
            transactions={filtered}
            loading={loading}
            onEdit={openEdit}
            onDelete={remove}
            emptyMessage={
              transactions.length === 0
                ? "Nenhuma transação neste período. Que tal adicionar a primeira?"
                : "Nenhuma transação corresponde aos filtros."
            }
          />
        </CardContent>
      </Card>

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        transaction={editing}
        onSubmit={(input) => (editing ? update(editing.id, input) : create(input))}
      />
    </div>
  )
}
