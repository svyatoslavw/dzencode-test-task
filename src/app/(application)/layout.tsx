import { AppWrapper } from "@/widgets/AppWrapper"

export default async function ApplicationLayout({ children }: { children: React.ReactNode }) {
  //   const response = await apiRequest<{ user: UserModel }>("/api/auth/me")

  //   if (!response.user) {
  //     redirect("/login")
  //   }

  return <AppWrapper title="Orders & Products">{children}</AppWrapper>
}
