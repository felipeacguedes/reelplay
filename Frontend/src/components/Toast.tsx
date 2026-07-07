import { useState, useEffect, useCallback } from 'react'
import { Check, AlertCircle } from 'lucide-react'

interface ToastData {
  message: string
  type: 'success' | 'error'
}

let toastListener: ((data: ToastData) => void) | null = null

export function showToast(message: string, type: 'success' | 'error' = 'success') {
  toastListener?.({ message, type })
}

function Toast() {
  const [data, setData] = useState<ToastData | null>(null)
  const [visible, setVisible] = useState(false)

  const show = useCallback((d: ToastData) => {
    setData(d)
    setVisible(true)
    setTimeout(() => setVisible(false), 3000)
  }, [])

  useEffect(() => {
    toastListener = show
    return () => { toastListener = null }
  }, [show])

  return (
    <div className={`toast ${data ? `toast--${data.type}` : ''} ${visible ? 'toast--visible' : ''}`}>
      {data && (
        <>
          {data.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
          <span>{data.message}</span>
        </>
      )}
    </div>
  )
}

export default Toast
