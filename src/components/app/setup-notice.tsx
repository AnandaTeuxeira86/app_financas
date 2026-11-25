import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/** Exibido quando as variáveis de ambiente do Supabase ainda não foram configuradas. */
export function SetupNotice() {
  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>Configure o Supabase</CardTitle>
        <CardDescription>
          O app precisa de um projeto Supabase para autenticação e armazenamento.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p>
          1. Copie <code className="rounded bg-muted px-1">.env.example</code> para{" "}
          <code className="rounded bg-muted px-1">.env.local</code> e preencha a URL e a anon key.
        </p>
        <p>
          2. Rode o script <code className="rounded bg-muted px-1">supabase/schema.sql</code> no SQL
          Editor do Supabase.
        </p>
        <p>3. Reinicie o servidor de desenvolvimento.</p>
      </CardContent>
    </Card>
  )
}
