import { m } from "@/shared/i18n/messages"
import type { Locale } from "@/shared/i18n/runtime"
import { UserIcon } from "@/shared/ui"
import type { UserModel } from "../model"

interface UserCardProps {
  locale: Locale
  user?: UserModel
}

export const UserCard = ({ locale, user }: UserCardProps) => {
  return (
    <div className="card bg-secondary bg-opacity-10">
      <div className="card-body d-flex align-items-center gap-3">
        <div className="flex-shrink-0 bg-secondary bg-opacity-10 rounded-circle p-2 text-body-secondary">
          <UserIcon className="size-6 flex-shrink-0" />
        </div>
        <div className="d-flex clamp flex-column">
          <span className="fw-semibold clamp">{user?.name ?? m.user_loading({}, { locale })}</span>
          <span className="small text-body-secondary clamp">{user?.email ?? ""}</span>
        </div>
      </div>
    </div>
  )
}
