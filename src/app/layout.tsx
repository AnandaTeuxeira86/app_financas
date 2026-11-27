import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/app/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Finanças — controle financeiro pessoal",
    template: "%s · Finanças",
  },
  description:
    "Registre receitas e despesas, organize por categoria e acompanhe seu saldo mensal em um dashboard simples.",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: o next-themes ajusta a classe do <html> antes do React carregar
    <html
      lang="pt-BR"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
