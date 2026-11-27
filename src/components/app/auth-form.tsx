"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Loader2Icon, MailCheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

const ERROR_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "E-mail ou senha incorretos.",
  "Email not confirmed": "Seu e-mail ainda não foi confirmado.",
  "User already registered": "Este e-mail já está cadastrado.",
  "email rate limit exceeded":
    "Muitos e-mails enviados em pouco tempo. Aguarde alguns minutos e tente de novo.",
}

function translate(message: string) {
  if (ERROR_MESSAGES[message]) return ERROR_MESSAGES[message]
  const wait = message.match(/after (\d+) seconds?/)
  if (wait) return `Aguarde ${wait[1]} segundos para tentar de novo.`
  return message
}

/** Para onde o link de confirmação do e-mail leva o usuário. */
const confirmRedirect = () => `${window.location.origin}/login`

/** Reenvia o e-mail de confirmação. Retorna a mensagem de erro traduzida, se houver. */
async function resendConfirmation(email: string) {
  const { error } = await createClient().auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: confirmRedirect() },
  })
  return error ? translate(error.message) : null
}

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null)
  /** E-mail para o qual o link de confirmação foi enviado. */
  const [pendingEmail, setPendingEmail] = useState<string | null>(null)
  const isSignup = mode === "signup"

  // Ao abrir o link de confirmação, o Supabase cria a sessão nesta página:
  // nesse caso, leva o usuário direto para o dashboard.
  useEffect(() => {
    const { data } = createClient().auth.onAuthStateChange((event: string) => {
      if (event === "SIGNED_IN") {
        router.replace("/dashboard")
        router.refresh()
      }
    })
    return () => data.subscription.unsubscribe()
  }, [router])

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
    setUnconfirmedEmail(null)
    setLoading(true)
    const supabase = createClient()

    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: confirmRedirect() },
      })
      setLoading(false)
      if (error) return setError(translate(error.message))
      // Sem sessão = o Supabase exige confirmação por e-mail.
      if (!data.session) return setPendingEmail(email)
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      setLoading(false)
      if (error) {
        if (error.message === "Email not confirmed") setUnconfirmedEmail(email)
        return setError(translate(error.message))
      }
    }

    router.replace("/dashboard")
    router.refresh()
  }

  if (pendingEmail) {
    return (
      <CheckEmailCard
        email={pendingEmail}
        onContinue={() => {
          setPendingEmail(null)
          setError(null)
          setUnconfirmedEmail(null)
          if (isSignup) router.push("/login")
        }}
        onBack={() => {
          setPendingEmail(null)
          setError(null)
          setUnconfirmedEmail(null)
        }}
      />
    )
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
            <div role="alert" className="space-y-1 text-sm text-destructive">
              <p>{error}</p>
              {unconfirmedEmail && (
                <button
                  type="button"
                  className="font-medium text-primary hover:underline"
                  disabled={loading}
                  onClick={async () => {
                    setLoading(true)
                    const err = await resendConfirmation(unconfirmedEmail)
                    setLoading(false)
                    if (err) return setError(err)
                    setPendingEmail(unconfirmedEmail)
                  }}
                >
                  Reenviar e-mail de confirmação
                </button>
              )}
            </div>
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

const RESEND_COOLDOWN = 60

function CheckEmailCard({
  email,
  onContinue,
  onBack,
}: {
  email: string
  onContinue: () => void
  onBack: () => void
}) {
  const [cooldown, setCooldown] = useState(0)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (cooldown <= 0) return
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(id)
  }, [cooldown])

  async function resend() {
    setSending(true)
    const err = await resendConfirmation(email)
    setSending(false)
    if (err) {
      toast.error(err)
      return
    }
    toast.success("E-mail reenviado! Confira sua caixa de entrada.")
    setCooldown(RESEND_COOLDOWN)
  }

  return (
    <Card className="w-full max-w-sm text-center">
      <CardHeader className="items-center">
        <span className="mx-auto mb-2 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MailCheckIcon className="size-7" />
        </span>
        <CardTitle className="text-xl">Confira seu e-mail</CardTitle>
        <CardDescription className="text-pretty">
          Quase lá! Enviamos um link de confirmação para{" "}
          <span className="font-medium break-all text-foreground">{email}</span>. Clique nele para
          ativar sua conta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 rounded-lg bg-muted/60 p-4 text-left text-sm text-muted-foreground">
          <li>• O e-mail pode levar alguns minutos para chegar.</li>
          <li>
            • Não encontrou? Olhe também as pastas <strong>Spam</strong>, <strong>Lixo eletrônico</strong>{" "}
            ou <strong>Promoções</strong>.
          </li>
          <li>• Depois de confirmar, é só entrar com seu e-mail e senha.</li>
        </ul>
      </CardContent>
      <CardFooter className="mt-6 flex-col gap-3">
        <Button className="h-10 w-full" onClick={onContinue}>
          Já confirmei, quero entrar
        </Button>
        <Button
          variant="outline"
          className="h-10 w-full"
          onClick={resend}
          disabled={sending || cooldown > 0}
        >
          {sending && <Loader2Icon className="animate-spin" />}
          {cooldown > 0 ? `Reenviar e-mail (${cooldown}s)` : "Reenviar e-mail"}
        </Button>
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-muted-foreground hover:text-foreground hover:underline"
        >
          Usar outro e-mail
        </button>
      </CardFooter>
    </Card>
  )
}
