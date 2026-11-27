"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

/** Aplica a classe "dark" no <html> e lembra a escolha do usuário. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  )
}
