import { createBrowserClient } from "@supabase/ssr"
import { supabaseAnonKey, supabaseUrl } from "./env"

let client: ReturnType<typeof createBrowserClient> | undefined

export function createClient() {
  client ??= createBrowserClient(supabaseUrl, supabaseAnonKey)
  return client
}
