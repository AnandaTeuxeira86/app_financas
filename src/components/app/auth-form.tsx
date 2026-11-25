"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Loader2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

const ERROR_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "E-mail ou senha incorretos.",
  "Email not confirmed": "Confirme seu e-mail antes de entrar.",
  "User already registered": "Este e-mail já está cadastrado.",
}

const translate = (message: string) => ERROR_MESSAGES[message] ?? message

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isSignup = mode === "signup"

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const email = String(form.get("email")).trim()
    const password = String(form.get("password"))

    if (isSignup && password !== String(form.get("confirm"))) {
      setError("As senhas não coincidem.")
      return
    }

    setError(null)
    setLoading(true)
    const supabase = createClient()

    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/dashboard` },
      })
      setLoading(false)
      if (error) return setError(translate(error.message))
      if (!data.session) {
        toast.success("Conta criada! Confira seu e-mail para confirmar o cadastro.")
        router.push("/login")
        return
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      setLoading(false)
      if (error) return setError(translate(error.message))
    }

    router.replace("/dashboard")
    router.refresh()
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">{isSignup ? "Criar conta" : "Entrar"}</CardTitle>
        <CardDescription>
          {isSignup
            ? "Comece a organizar suas finanças em menos de um minuto."
            : "Acesse seu painel financeiro."}
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              minLength={6}
              required
            />
          </div>
          {isSignup && (
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirmar senha</Label>
              <Input
                id="confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>
          )}
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </CardContent>
        <CardFooter className="mt-6 flex-col gap-3">
          <Button type="submit" className="h-10 w-full" disabled={loading}>
            {loading && <Loader2Icon className="animate-spin" />}
            {isSignup ? "Criar conta" : "Entrar"}
          </Button>
          <p className="text-sm text-muted-foreground">
            {isSignup ? "Já tem conta? " : "Ainda não tem conta? "}
            <Link
              href={isSignup ? "/login" : "/cadastro"}
              className="font-medium text-primary hover:underline"
            >
              {isSignup ? "Entrar" : "Criar conta"}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
