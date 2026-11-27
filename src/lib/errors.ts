/**
 * Converte erros do Supabase (que são objetos simples, não instâncias de Error)
 * numa mensagem amigável em português.
 */
export function errorMessage(err: unknown, fallback = "Algo deu errado. Tente novamente.") {
  const message =
    typeof err === "string"
      ? err
      : err && typeof err === "object" && "message" in err && typeof err.message === "string"
        ? err.message
        : ""

  if (!message) return fallback
  if (/permission denied for table/i.test(message))
    return "O banco de dados recusou o acesso às transações. Verifique se o script supabase/schema.sql (incluindo o GRANT no final) foi executado no Supabase."
  if (/relation .* does not exist|Could not find the table/i.test(message))
    return "A tabela de transações não existe. Execute o script supabase/schema.sql no SQL Editor do Supabase."
  if (/row-level security/i.test(message))
    return "Operação bloqueada pelas regras de segurança. Faça login novamente."
  if (/JWT expired|not authenticated/i.test(message)) return "Sua sessão expirou. Faça login novamente."
  if (/Failed to fetch|NetworkError/i.test(message))
    return "Sem conexão com o servidor. Verifique sua internet."
  return message
}
