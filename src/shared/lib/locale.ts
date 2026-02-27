"use server"

import { cookies } from "next/headers"

import { assertIsLocale, baseLocale, type Locale } from "@/shared/i18n/runtime"

export const getServerLocale = async (): Promise<Locale> => {
  const cookieStore = await cookies()
  const locale = cookieStore.get("PARAGLIDE_LOCALE")?.value

  return assertIsLocale(locale ?? baseLocale)
}
