import { AppHeader } from "@/components/app/app-header"
import { SetupNotice } from "@/components/app/setup-notice"
import { isSupabaseConfigured } from "@/lib/supabase/env"

export default function AppLayout({ children }: LayoutProps<"/">) {
  if (!isSupabaseConfigured) {
    return (
      <main className="flex flex-1 items-center justify-center bg-muted/40 px-4 py-12">
        <SetupNotice />
      </main>
    )
  }

  return (
    <div className="flex flex-1 flex-col bg-muted/40">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-6 pb-24 sm:px-6 sm:pb-10">
        {children}
      </main>
    </div>
  )
}
