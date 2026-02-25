"use client"

import Link from "next/link"

import { AuthMode, useAuthForm } from "./useAuthForm"

interface AuthFormProps {
  mode: AuthMode
}

export const AuthForm = ({ mode }: AuthFormProps) => {
  const {
    form: {
      register,
      formState: { errors }
    },
    onSubmit,
    isPending,
    serverError
  } = useAuthForm(mode)

  const isRegisterMode = mode === "register"

  return (
    <div className="card border-0 shadow-sm" style={{ width: "min(100%, 420px)" }}>
      <div className="card-body p-4">
        <h1 className="h4 mb-3">{isRegisterMode ? "Регистрация" : "Вход"}</h1>

        <form onSubmit={onSubmit} className="d-grid gap-3">
          {isRegisterMode && (
            <div>
              <label className="form-label">Имя</label>
              <input
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                {...register("name")}
                placeholder="Ваше имя"
              />
              {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
            </div>
          )}

          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              {...register("email")}
              placeholder="you@example.com"
            />
            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
          </div>

          <div>
            <label className="form-label">Пароль</label>
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              {...register("password")}
              placeholder="******"
            />
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
          </div>

          {serverError && <div className="alert alert-danger mb-0">{serverError}</div>}

          <button type="submit" disabled={isPending} className="btn btn-dark">
            {isPending ? "Загрузка..." : isRegisterMode ? "Создать аккаунт" : "Войти"}
          </button>
        </form>

        <p className="small text-body-secondary mt-3 mb-0">
          {isRegisterMode ? "Уже есть аккаунт?" : "Нет аккаунта?"}{" "}
          <Link href={isRegisterMode ? "/login" : "/register"} className="link-primary">
            {isRegisterMode ? "Войти" : "Зарегистрироваться"}
          </Link>
        </p>
      </div>
    </div>
  )
}
