"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { LayoutDashboardIcon, ListIcon, LogOutIcon, UserIcon } from "lucide-react"
import { Logo } from "@/components/app/logo"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/transacoes", label: "Transações", icon: ListIcon },
]

export function AppHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }: { data: { user: { email?: string } | null } }) =>
        setEmail(data.user?.email ?? null)
      )
  }, [])

  async function signOut() {
    await createClient().auth.signOut()
    router.replace("/login")
    router.refresh()
  }

  const navLinks = (className: string) =>
    NAV.map(({ href, label, icon: Icon }) => {
      const active = pathname.startsWith(href)
      return (
        <Link
          key={href}
          href={href}
          aria-current={active ? "page" : undefined}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            active
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
            className
          )}
        >
          <Icon className="size-4" />
          {label}
        </Link>
      )
    })

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Logo href="/dashboard" />
        <nav className="hidden items-center gap-1 sm:flex">{navLinks("")}</nav>
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon" aria-label="Conta" />}
            >
              <UserIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-52">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="truncate">{email ?? "Minha conta"}</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                <LogOutIcon />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Navegação inferior no mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-1 border-t bg-background p-2 sm:hidden">
        {navLinks("justify-center")}
      </nav>
    </header>
  )
}
