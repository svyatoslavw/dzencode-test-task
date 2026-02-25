import axios, { type AxiosRequestConfig } from "axios"

export interface BaseResponse {
  message: string
}

export type ApiRequestConfig<Data = unknown> = AxiosRequestConfig<Data> & {
  body?: Data
}

export const DEFAULT_ERROR = "Что-то пошло не так"

const apiClient = axios.create({ withCredentials: true })

export const apiRequest = async <TResponse, TData = unknown>(
  url: string,
  config: ApiRequestConfig<TData> = {}
): Promise<TResponse> => {
  const response = await apiClient.request<TResponse>({
    ...config,
    url,
    data: config.data ?? config.body,
    headers: {
      "Content-Type": "application/json",
      ...(config.headers ?? {})
    }
  })

  return response.data
}
