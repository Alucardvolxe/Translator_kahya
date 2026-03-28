import axios from 'axios'
import { useCallback, useEffect, useRef, useState } from 'react'

function translateUrl() {
  const base = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
  return `${base}/api/translate/`
}

function errorMessageFromAxios(err) {
  let msg = 'Translation failed. Please check your connection and try again.'
  if (axios.isAxiosError(err) && err.response?.data != null) {
    const d = err.response.data
    if (typeof d.error === 'string' && d.error.trim()) return d.error
    if (typeof d.detail === 'string' && d.detail.trim()) return d.detail
  }
  if (err instanceof Error && err.message && !axios.isAxiosError(err)) {
    return err.message
  }
  return msg
}

/**
 * POST /api/translate/ with { in, lang }. Aborts in-flight requests on new translate or unmount.
 */
export function useTranslate() {
  const [translation, setTranslation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)
  const requestGenRef = useRef(0)

  const reset = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    requestGenRef.current += 1
    setTranslation('')
    setError(null)
    setIsLoading(false)
  }, [])

  useEffect(
    () => () => {
      abortRef.current?.abort()
    },
    [],
  )

  const translate = useCallback(async ({ text, langCode }) => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    const gen = ++requestGenRef.current

    setIsLoading(true)
    setError(null)
    setTranslation('')

    try {
      const { data } = await axios.post(
        translateUrl(),
        { in: text, lang: langCode },
        {
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' },
        },
      )
      if (gen !== requestGenRef.current) return
      const t = data?.translated
      const out = typeof t === 'string' ? t : t != null ? String(t) : ''
      setTranslation(out)
      setError(null)
    } catch (err) {
      if (axios.isCancel(err) || err?.code === 'ERR_CANCELED') return
      if (gen !== requestGenRef.current) return
      setError(errorMessageFromAxios(err))
      setTranslation('')
    } finally {
      if (gen === requestGenRef.current) {
        setIsLoading(false)
      }
    }
  }, [])

  return { translation, isLoading, error, translate, reset }
}
