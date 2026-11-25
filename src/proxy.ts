import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env"

const PROTECTED = ["/dashboard", "/transacoes"]
const AUTH_PAGES = ["/login", "/cadastro"]

export async function proxy(request: NextRequest) {
  if (!isSupabaseConfigured) return NextResponse.next({ request })

  let response = NextResponse.next({ request })

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  // Revalida a sessão e renova os cookies quando necessário.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const redirectTo = (target: string) => {
    const url = request.nextUrl.clone()
    url.pathname = target
    url.search = ""
    const redirect = NextResponse.redirect(url)
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c))
    return redirect
  }

  if (!user && PROTECTED.some((p) => path.startsWith(p))) return redirectTo("/login")
  if (user && AUTH_PAGES.some((p) => path.startsWith(p))) return redirectTo("/dashboard")

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
