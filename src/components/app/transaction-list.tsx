"use client"

import { useState } from "react"
import { toast } from "sonner"
import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency, formatDate, type Transaction } from "@/lib/finance"
import { cn } from "@/lib/utils"

function Amount({ t }: { t: Transaction }) {
  const income = t.type === "receita"
  return (
    <span className={cn("font-medium tabular-nums", income ? "text-income" : "text-expense")}>
      {income ? "+ " : "− "}
      {formatCurrency(t.amount)}
    </span>
  )
}

function RowActions({
  t,
  onEdit,
  onDelete,
}: {
  t: Transaction
  onEdit?: (t: Transaction) => void
  onDelete?: (t: Transaction) => void
}) {
  if (!onEdit && !onDelete) return null
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon-sm" aria-label={`Ações para ${t.description}`} />}
      >
        <MoreHorizontalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onEdit && (
          <DropdownMenuItem onClick={() => onEdit(t)}>
            <PencilIcon /> Editar
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem variant="destructive" onClick={() => onDelete(t)}>
            <Trash2Icon /> Excluir
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function TransactionList({
  transactions,
  loading,
  onEdit,
  onDelete,
  emptyMessage = "Nenhuma transação encontrada.",
  compact = false,
}: {
  transactions: Transaction[]
  loading: boolean
  onEdit?: (t: Transaction) => void
  onDelete?: (id: string) => Promise<void>
  emptyMessage?: string
  /** Sempre usa o layout de lista (para espaços estreitos, como o dashboard). */
  compact?: boolean
}) {
  const [pendingDelete, setPendingDelete] = useState<Transaction | null>(null)

  async function confirmDelete() {
    if (!pendingDelete || !onDelete) return
    try {
      await onDelete(pendingDelete.id)
      toast.success("Transação excluída.")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível excluir.")
    }
    setPendingDelete(null)
  }

  const askDelete = onDelete ? setPendingDelete : undefined

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    )
  }

  if (transactions.length === 0) {
    return <p className="py-10 text-center text-sm text-muted-foreground">{emptyMessage}</p>
  }

  return (
    <>
      {/* Desktop: tabela */}
      <div className={compact ? "hidden" : "hidden md:block"}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="text-muted-foreground tabular-nums">{formatDate(t.date)}</TableCell>
                <TableCell className="max-w-xs truncate font-medium">{t.description}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{t.category}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Amount t={t} />
                </TableCell>
                <TableCell>
                  <RowActions t={t} onEdit={onEdit} onDelete={askDelete} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile: lista */}
      <ul className={cn("divide-y", !compact && "md:hidden")}>
        {transactions.map((t) => (
          <li key={t.id} className="flex items-center gap-3 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{t.description}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(t.date)} · {t.category}
              </p>
            </div>
            <Amount t={t} />
            <RowActions t={t} onEdit={onEdit} onDelete={askDelete} />
          </li>
        ))}
      </ul>

      <AlertDialog open={pendingDelete !== null} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir transação?</AlertDialogTitle>
            <AlertDialogDescription>
              “{pendingDelete?.description}” será removida permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
