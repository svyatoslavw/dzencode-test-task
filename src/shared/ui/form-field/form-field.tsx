import { UseFormRegisterReturn } from "react-hook-form"

interface FormFieldProps {
  label: string
  type: React.HTMLInputTypeAttribute
  registerProps: UseFormRegisterReturn<"name" | "email" | "password">
  error?: { message?: string }
  placeholder?: string
}

const FormField = ({ label, type, placeholder, registerProps, error }: FormFieldProps) => {
  const hasError = Boolean(error?.message)

  return (
    <div>
      <label className="form-label">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className={`form-control ${hasError ? "is-invalid" : ""}`}
        {...registerProps}
      />
      {hasError && <div className="invalid-feedback">{error?.message}</div>}
    </div>
  )
}

export { FormField }
