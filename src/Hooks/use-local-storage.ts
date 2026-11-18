"use client"

import { useEffect, useState } from "react"

export type UseLocalStorageOptions<T> = {
  /** Transform persisted JSON once on mount (e.g. drop fields that should not restore from cache). */
  deserialize?: (parsed: T) => T
}

/**
 * SSR-safe localStorage hook: always starts with `initialValue` so server and
 * first client render match, then hydrates from storage after mount.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: UseLocalStorageOptions<T>
) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (!item) return
      const parsed = JSON.parse(item) as T
      setStoredValue(options?.deserialize ? options.deserialize(parsed) : parsed)
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
    }
    // Only hydrate once per key on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const setValue = (value: T | ((val: T) => T)) => {
    setStoredValue((prev) => {
      try {
        const valueToStore =
          value instanceof Function ? value(prev) : value
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
        return valueToStore
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
        return prev
      }
    })
  }

  return [storedValue, setValue] as const
}
