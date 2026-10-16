'use client'

import { useCallback, useSyncExternalStore } from 'react'

const CHANGE_EVENT = 'fame-browser-storage'
const SERVER_VALUE = () => null
const READY = () => true
const NOT_READY = () => false

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback)
  window.addEventListener(CHANGE_EVENT, callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener(CHANGE_EVENT, callback)
  }
}

export function readStoredValue(key: string): string | null {
  try { return window.localStorage.getItem(key) } catch { return null }
}

export function writeStoredValue(key: string, value: string): boolean {
  try {
    window.localStorage.setItem(key, value)
    if (window.localStorage.getItem(key) !== value) return false
    window.dispatchEvent(new Event(CHANGE_EVENT))
    return true
  } catch { return false }
}

export function removeStoredValue(key: string): boolean {
  try {
    window.localStorage.removeItem(key)
    window.dispatchEvent(new Event(CHANGE_EVENT))
    return true
  } catch { return false }
}

export function useStoredValue(key: string): string | null {
  const snapshot = useCallback(() => readStoredValue(key), [key])
  return useSyncExternalStore(subscribe, snapshot, SERVER_VALUE)
}

export function useBrowserReady() {
  return useSyncExternalStore(subscribe, READY, NOT_READY)
}

export const orderAccessKey = (id: string) => `fame-order-access-v1:${id}`

export function readAccessToken(raw: string | null): string | null {
  try {
    const data = JSON.parse(raw || 'null')
    return data?.version === 1 && typeof data.accessToken === 'string' && /^[A-Za-z0-9_-]{43}$/.test(data.accessToken) ? data.accessToken : null
  } catch { return null }
}
