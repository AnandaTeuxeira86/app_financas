import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
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
    <html lang="pt-BR" className={`${inter.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {children}
        <Toaster position="top-center" theme="light" richColors />
      </body>
    </html>
  )
}
