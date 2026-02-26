import { AxiosError } from "axios"
import { BaseResponse, DEFAULT_ERROR } from "./request"

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return (error as AxiosError<BaseResponse>).response?.data?.message ?? DEFAULT_ERROR
  }

  if (error instanceof Error) {
    return error.message
  }

  return DEFAULT_ERROR
}
