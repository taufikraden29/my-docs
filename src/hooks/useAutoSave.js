import { useEffect, useRef, useState } from 'react'

export const useAutoSave = (data, onSave, delay = 3000) => {
  const [lastSaved, setLastSaved] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const timeoutRef = useRef(null)
  const previousDataRef = useRef(data)

  useEffect(() => {
    // Skip if data hasn't changed
    if (JSON.stringify(data) === JSON.stringify(previousDataRef.current)) {
      return
    }

    // Skip if data is incomplete (e.g., no title or content)
    if (!data.title || !data.content) {
      return
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      try {
        setIsSaving(true)
        await onSave(data)
        setLastSaved(new Date())
        previousDataRef.current = data
      } catch (error) {
        console.error('Auto-save failed:', error)
      } finally {
        setIsSaving(false)
      }
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, onSave, delay])

  return { lastSaved, isSaving }
}

export const formatLastSaved = (lastSaved) => {
  if (!lastSaved) return null

  const now = new Date()
  const diff = Math.floor((now - lastSaved) / 1000)

  if (diff < 10) return 'just now'
  if (diff < 60) return `${diff} seconds ago`
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
  
  return lastSaved.toLocaleTimeString()
}
