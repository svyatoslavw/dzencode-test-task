"use client"

import Link from "next/link"

import type { AuthMode } from "@/entities/user"
import { m } from "@/shared/i18n/messages"
import type { Locale } from "@/shared/i18n/runtime"
import { FormField } from "@/shared/ui"
import { useAuthForm } from "./useAuthForm"

export const AuthForm = ({ mode, locale }: { mode: AuthMode; locale: Locale }) => {
  const {
    form: {
      register,
      formState: { errors }
    },
    onSubmit,
    isPending,
    serverError
  } = useAuthForm({ mode, locale })

  const isRegister = mode === "register"

  const title = isRegister
    ? m.auth_title_register({}, { locale })
    : m.auth_title_login({}, { locale })
  const submitText = isPending
    ? m.auth_submit_loading({}, { locale })
    : isRegister
      ? m.auth_submit_register({}, { locale })
      : m.auth_submit_login({}, { locale })
  const switchText = isRegister
    ? m.auth_switch_have_account({}, { locale })
    : m.auth_switch_no_account({}, { locale })
  const switchHref = isRegister ? "/login" : "/register"
  const switchLinkText = isRegister
    ? m.auth_switch_login({}, { locale })
    : m.auth_switch_register({}, { locale })

  return (
    <div className="card border-0 shadow-sm" style={{ width: "min(100%, 420px)" }}>
      <div className="card-body p-4">
        <h1 className="h4 mb-3">{title}</h1>

        <form onSubmit={onSubmit} className="d-grid gap-3">
          {isRegister && (
            <FormField
              label={m.auth_field_name({}, { locale })}
              type="text"
              placeholder={m.auth_placeholder_name({}, { locale })}
              registerProps={register("name")}
              error={errors.name}
            />
          )}

          <FormField
            label={m.auth_field_email({}, { locale })}
            type="email"
            placeholder="you@example.com"
            registerProps={register("email")}
            error={errors.email}
          />

          <FormField
            label={m.auth_field_password({}, { locale })}
            type="password"
            placeholder="******"
            registerProps={register("password")}
            error={errors.password}
          />

          {serverError && <div className="alert alert-danger mb-0">{serverError}</div>}

          <button type="submit" disabled={isPending} className="btn btn-dark">
            {submitText}
          </button>
        </form>

        <p className="small text-body-secondary mt-3 mb-0">
          {switchText}{" "}
          <Link href={switchHref} className="link-primary">
            {switchLinkText}
          </Link>
        </p>
      </div>
    </div>
  )
}
