import Link from "next/link"
import {
  ArrowRightIcon,
  DownloadIcon,
  FilterIcon,
  PieChartIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
  TagsIcon,
} from "lucide-react"
import { Logo } from "@/components/app/logo"
import { ThemeToggle } from "@/components/app/theme-toggle"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: PieChartIcon,
    title: "Dashboard visual",
    text: "Receitas, despesas e saldo do mês num relance, com gráfico de gastos por categoria.",
  },
  {
    icon: TagsIcon,
    title: "Categorias prontas",
    text: "Alimentação, Moradia, Transporte, Salário e mais — sem configurar nada.",
  },
  {
    icon: FilterIcon,
    title: "Filtros e busca",
    text: "Encontre qualquer lançamento por mês, ano, categoria ou descrição.",
  },
  {
    icon: DownloadIcon,
    title: "Exportar CSV",
    text: "Leve suas transações filtradas para o Excel ou Google Planilhas em um clique.",
  },
  {
    icon: SmartphoneIcon,
    title: "Funciona no celular",
    text: "Layout responsivo para registrar um gasto na hora, onde você estiver.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Seus dados, só seus",
    text: "Login seguro e isolamento por usuário direto no banco de dados.",
  },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <Link href="/login" className={buttonVariants({ variant: "ghost" })}>
            Entrar
          </Link>
          <Link href="/cadastro" className={buttonVariants()}>
            Criar conta
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-income-soft px-3 py-1 text-xs font-medium text-income">
              Gratuito e sem planilhas
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Saiba para onde vai cada real do seu mês.
            </h1>
            <p className="max-w-md text-lg text-muted-foreground text-pretty">
              Registre receitas e despesas em segundos e acompanhe seu saldo num dashboard limpo e
              direto ao ponto.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/cadastro" className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}>
                Começar agora <ArrowRightIcon />
              </Link>
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-5")}
              >
                Já tenho conta
              </Link>
            </div>
          </div>

          <HeroPreview />
        </section>

        <section className="border-t bg-muted/40">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-2xl font-semibold tracking-tight">Tudo o que você precisa</h2>
            <p className="mt-2 text-muted-foreground">E nada que atrapalhe.</p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-xl border bg-background p-5">
                  <Icon className="size-5 text-primary" />
                  <h3 className="mt-3 font-medium">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-muted-foreground sm:px-6">
          Finanças — controle financeiro pessoal.
        </div>
      </footer>
    </div>
  )
}

/** Prévia estática do dashboard, ilustrativa. */
function HeroPreview() {
  const rows = [
    { label: "Moradia", value: 62, color: "var(--series-3)" },
    { label: "Alimentação", value: 41, color: "var(--series-1)" },
    { label: "Transporte", value: 23, color: "var(--series-2)" },
    { label: "Lazer", value: 14, color: "var(--series-4)" },
  ]
  return (
    <div className="rounded-2xl border bg-background p-5 shadow-sm" aria-hidden>
      <div className="grid grid-cols-3 gap-3">
        {[
          ["Receitas", "R$ 6.200", "text-income"],
          ["Despesas", "R$ 4.150", "text-expense"],
          ["Saldo", "R$ 2.050", "text-foreground"],
        ].map(([label, value, color]) => (
          <div key={label} className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className={cn("mt-1 font-semibold tabular-nums", color)}>{value}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 text-sm font-medium">Despesas por categoria</p>
      <div className="mt-3 space-y-3">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-3 text-sm">
            <span className="w-24 text-muted-foreground">{r.label}</span>
            <div className="h-2 flex-1 rounded-full bg-muted">
              <div
                className="h-2 rounded-full"
                style={{ width: `${r.value}%`, backgroundColor: r.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
