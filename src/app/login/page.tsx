import type { Metadata } from "next"
import { AuthForm } from "@/components/app/auth-form"
import { Logo } from "@/components/app/logo"
import { SetupNotice } from "@/components/app/setup-notice"
import { isSupabaseConfigured } from "@/lib/supabase/env"

export const metadata: Metadata = { title: "Entrar" }

export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 bg-muted/40 px-4 py-12">
      <Logo />
      {isSupabaseConfigured ? <AuthForm mode="login" /> : <SetupNotice />}
    </main>
  )
}
