export type TransactionType = "receita" | "despesa"

export const CATEGORIES = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Lazer",
  "Saúde",
  "Educação",
  "Salário",
  "Freelance",
  "Outros",
] as const

export type Category = (typeof CATEGORIES)[number]

export const CATEGORIES_BY_TYPE: Record<TransactionType, Category[]> = {
  receita: ["Salário", "Freelance", "Outros"],
  despesa: ["Alimentação", "Transporte", "Moradia", "Lazer", "Saúde", "Educação", "Outros"],
}

/** Cor fixa por categoria de despesa (a cor segue a categoria, nunca a posição no ranking). */
export const CATEGORY_COLORS: Record<Category, string> = {
  Alimentação: "#257de0",
  Transporte: "#f47230",
  Moradia: "#00b894",
  Lazer: "#f2a600",
  Saúde: "#ee7fac",
  Educação: "#008a17",
  Outros: "#6a4ce2",
  Salário: "#257de0",
  Freelance: "#00b894",
}

export interface Transaction {
  id: string
  user_id: string
  description: string
  amount: number
  date: string // YYYY-MM-DD
  type: TransactionType
  category: Category
  created_at: string
}

export type TransactionInput = Pick<
  Transaction,
  "description" | "amount" | "date" | "type" | "category"
>

export const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
]

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
export const formatCurrency = (value: number) => brl.format(value)

/** Formata "2026-11-25" como "25/11/2026" sem conversão de fuso horário. */
export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-")
  return `${d}/${m}/${y}`
}

const pad = (n: number) => String(n).padStart(2, "0")

export function todayISO() {
  const now = new Date()
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

/** month: 1-12, ou 0 para o ano inteiro. Retorna [início, fim) em YYYY-MM-DD. */
export function periodRange(year: number, month: number): [string, string] {
  if (month === 0) return [`${year}-01-01`, `${year + 1}-01-01`]
  const nextYear = month === 12 ? year + 1 : year
  const nextMonth = month === 12 ? 1 : month + 1
  return [`${year}-${pad(month)}-01`, `${nextYear}-${pad(nextMonth)}-01`]
}

export function periodLabel(year: number, month: number) {
  return month === 0 ? `${year}` : `${MONTHS[month - 1]} de ${year}`
}

export function summarize(transactions: Transaction[]) {
  let income = 0
  let expense = 0
  for (const t of transactions) {
    if (t.type === "receita") income += t.amount
    else expense += t.amount
  }
  return { income, expense, balance: income - expense }
}

export function expensesByCategory(transactions: Transaction[]) {
  const totals = new Map<Category, number>()
  for (const t of transactions) {
    if (t.type !== "despesa") continue
    totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount)
  }
  return [...totals.entries()]
    .map(([category, value]) => ({ category, value }))
    .sort((a, b) => b.value - a.value)
}

function csvCell(value: string) {
  return /[";\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value
}

/** Gera CSV com ";" como separador (padrão do Excel em pt-BR). */
export function toCSV(transactions: Transaction[]) {
  const header = ["Data", "Descrição", "Tipo", "Categoria", "Valor"]
  const rows = transactions.map((t) => [
    formatDate(t.date),
    t.description,
    t.type === "receita" ? "Receita" : "Despesa",
    t.category,
    t.amount.toFixed(2).replace(".", ","),
  ])
  return [header, ...rows].map((r) => r.map(csvCell).join(";")).join("\r\n")
}

export function downloadCSV(transactions: Transaction[], filename: string) {
  // BOM para o Excel reconhecer UTF-8 (acentos)
  const blob = new Blob(["﻿" + toCSV(transactions)], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
