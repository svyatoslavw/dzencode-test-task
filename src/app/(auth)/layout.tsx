import { getServerLocale } from "@/shared/lib"
import { TopMenu } from "@/widgets"

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const locale = await getServerLocale()

  return (
    <div className="container-fluid bg-body-tertiary vh-100 px-0 overflow-hidden">
      <TopMenu locale={locale} />
      <main className="p-3 p-md-4 d-flex justify-content-center align-items-center flex-column vh-100 overflow-hidden flex-grow-1">
        {children}
      </main>
    </div>
  )
}
