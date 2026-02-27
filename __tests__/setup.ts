import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterEach, vi } from "vitest"

afterEach(() => {
  cleanup()
})

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null
  readonly rootMargin = "0px"
  readonly thresholds = [0]

  disconnect = vi.fn()
  observe = vi.fn()
  takeRecords = vi.fn((): IntersectionObserverEntry[] => [])
  unobserve = vi.fn()
}

vi.stubGlobal("IntersectionObserver", MockIntersectionObserver)
