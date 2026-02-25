import { UserIcon } from "@/shared/ui"
import type { UserModel } from "../model"

interface UserCardProps {
  user?: UserModel
}

export const UserCard = ({ user }: UserCardProps) => {
  return (
    <div className="card bg-secondary bg-opacity-10">
      <div className="card-body d-flex align-items-center gap-3">
        <div className="flex-shrink-0 bg-secondary bg-opacity-10 rounded-circle p-2 text-body-secondary">
          <UserIcon className="size-6 flex-shrink-0" />
        </div>
        <div className="d-flex flex-column">
          <span className="fw-semibold">{user?.name ?? "Загрузка..."}</span>
          <span className="small text-body-secondary">{user?.email ?? ""}</span>
        </div>
      </div>
    </div>
  )
}
