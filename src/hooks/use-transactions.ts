"use client"

import { useCallback, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { periodRange, type Transaction, type TransactionInput } from "@/lib/finance"

export function useTransactions(year: number, month: number) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const [start, end] = periodRange(year, month)
    const { data, error } = await createClient()
      .from("transactions")
      .select("*")
      .gte("date", start)
      .lt("date", end)
      .order("date", { ascending: false })
      .order("created_at", { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setError(null)
      setTransactions(
        ((data ?? []) as Transaction[]).map((t) => ({ ...t, amount: Number(t.amount) }))
      )
    }
    setLoading(false)
  }, [year, month])

  useEffect(() => {
    let active = true
    Promise.resolve().then(() => {
      if (active) {
        setLoading(true)
        load()
      }
    })
    return () => {
      active = false
    }
  }, [load])

  const create = async (input: TransactionInput) => {
    const { error } = await createClient().from("transactions").insert(input)
    if (error) throw error
    await load()
  }

  const update = async (id: string, input: TransactionInput) => {
    const { error } = await createClient().from("transactions").update(input).eq("id", id)
    if (error) throw error
    await load()
  }

  const remove = async (id: string) => {
    const { error } = await createClient().from("transactions").delete().eq("id", id)
    if (error) throw error
    await load()
  }

  return { transactions, loading, error, create, update, remove }
}
