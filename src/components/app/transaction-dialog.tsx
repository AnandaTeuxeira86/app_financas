"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CATEGORIES_BY_TYPE,
  todayISO,
  type Category,
  type Transaction,
  type TransactionInput,
  type TransactionType,
} from "@/lib/finance"
import { cn } from "@/lib/utils"

export function TransactionDialog({
  open,
  onOpenChange,
  transaction,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Quando presente, o formulário entra em modo de edição. */
  transaction?: Transaction | null
  onSubmit: (input: TransactionInput) => Promise<void>
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {/* key remonta o formulário com os valores certos a cada abertura */}
        {open && (
          <TransactionForm
            key={transaction?.id ?? "new"}
            transaction={transaction}
            onSubmit={onSubmit}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function TransactionForm({
  transaction,
  onSubmit,
  onDone,
}: {
  transaction?: Transaction | null
  onSubmit: (input: TransactionInput) => Promise<void>
  onDone: () => void
}) {
  const [type, setType] = useState<TransactionType>(transaction?.type ?? "despesa")
  const [category, setCategory] = useState<Category>(transaction?.category ?? "Alimentação")
  const [description, setDescription] = useState(transaction?.description ?? "")
  const [amount, setAmount] = useState(transaction ? String(transaction.amount) : "")
  const [date, setDate] = useState(transaction?.date ?? todayISO())
  const [saving, setSaving] = useState(false)

  const categories = CATEGORIES_BY_TYPE[type]

  function changeType(next: TransactionType) {
    setType(next)
    if (!CATEGORIES_BY_TYPE[next].includes(category)) setCategory(CATEGORIES_BY_TYPE[next][0])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const value = Number(amount.replace(",", "."))
    if (!Number.isFinite(value) || value <= 0) {
      toast.error("Informe um valor maior que zero.")
      return
    }
    setSaving(true)
    try {
      await onSubmit({
        description: description.trim(),
        amount: Math.round(value * 100) / 100,
        date,
        type,
        category,
      })
      toast.success(transaction ? "Transação atualizada." : "Transação adicionada.")
      onDone()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível salvar.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <DialogHeader>
        <DialogTitle>{transaction ? "Editar transação" : "Nova transação"}</DialogTitle>
        <DialogDescription>Preencha os dados da receita ou despesa.</DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1" role="radiogroup" aria-label="Tipo">
        {(["despesa", "receita"] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={type === t}
            onClick={() => changeType(t)}
            className={cn(
              "rounded-md py-1.5 text-sm font-medium transition-colors",
              type === t
                ? cn("bg-background shadow-sm", t === "receita" ? "text-income" : "text-expense")
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t === "receita" ? "Receita" : "Despesa"}
          </button>
        ))}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex.: Supermercado"
          maxLength={200}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-2">
          <Label htmlFor="amount">Valor (R$)</Label>
          <Input
            id="amount"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0,00"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label>Categoria</Label>
        <Select value={category} onValueChange={(v) => v && setCategory(v as Category)}>
          <SelectTrigger className="w-full" aria-label="Categoria">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2Icon className="animate-spin" />}
          Salvar
        </Button>
      </DialogFooter>
    </form>
  )
}
