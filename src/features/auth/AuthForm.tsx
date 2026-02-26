"use client"

import Link from "next/link"

import type { AuthMode } from "@/entities/user"
import { FormField } from "@/shared/ui"
import { useAuthForm } from "./useAuthForm"

export const AuthForm = ({ mode }: { mode: AuthMode }) => {
  const {
    form: {
      register,
      formState: { errors }
    },
    onSubmit,
    isPending,
    serverError
  } = useAuthForm({ mode })

  const isRegister = mode === "register"

  const title = isRegister ? "Регистрация" : "Вход"
  const submitText = isPending ? "Загрузка..." : isRegister ? "Создать аккаунт" : "Войти"
  const switchText = isRegister ? "Уже есть аккаунт?" : "Нет аккаунта?"
  const switchHref = isRegister ? "/login" : "/register"
  const switchLinkText = isRegister ? "Войти" : "Зарегистрироваться"

  return (
    <div className="card border-0 shadow-sm" style={{ width: "min(100%, 420px)" }}>
      <div className="card-body p-4">
        <h1 className="h4 mb-3">{title}</h1>

        <form onSubmit={onSubmit} className="d-grid gap-3">
          {isRegister && (
            <FormField
              label="Имя"
              type="text"
              placeholder="Ваше имя"
              registerProps={register("name")}
              error={errors.name}
            />
          )}

          <FormField
            label="Email"
            type="email"
            placeholder="you@example.com"
            registerProps={register("email")}
            error={errors.email}
          />

          <FormField
            label="Пароль"
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
