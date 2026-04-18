"use client"

import { useState } from "react"

export type UseLocalStorageOptions<T> = {
  /** Transform persisted JSON once on mount (e.g. drop fields that should not restore from cache). */
  deserialize?: (parsed: T) => T
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: UseLocalStorageOptions<T>
) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      if (!item) return initialValue
      const parsed = JSON.parse(item) as T
      return options?.deserialize ? options.deserialize(parsed) : parsed
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

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
