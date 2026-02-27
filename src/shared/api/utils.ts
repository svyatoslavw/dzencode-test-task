import { AxiosError } from "axios"
import { m } from "@/shared/i18n/messages"
import { getLocale } from "@/shared/i18n/runtime"
import { BaseResponse } from "./request"

export const getErrorMessage = (error: unknown): string => {
  const locale = getLocale()

  if (error instanceof AxiosError) {
    return (
      (error as AxiosError<BaseResponse>).response?.data?.message ??
      m.common_default_error({}, { locale })
    )
  }

  if (error instanceof Error) {
    return error.message
  }

  return m.common_default_error({}, { locale })
}
