import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearStatus } from '../../features/auth/authSlice'

export default function ToastHost() {
  const dispatch = useDispatch()
  const { error, successMessage } = useSelector((s) => s.auth)

  const [toast, setToast] = useState(null) // { type: 'success'|'error', message: string }

  useEffect(() => {
    if (!error && !successMessage) return

    const type = error ? 'error' : 'success'
    const message = error || successMessage
    setToast({ type, message })

    const id = setTimeout(() => {
      setToast(null)
      dispatch(clearStatus())
    }, 4000)

    return () => clearTimeout(id)
  }, [error, successMessage, dispatch])

  if (!toast) return null

  return (
    <div className="toast-wrap" aria-live="polite" aria-atomic="true">
      <div className={`toast ${toast.type}`}>
        <div className="toast-title">{toast.type === 'success' ? 'Succès' : 'Erreur'}</div>
        <div className="toast-message">{toast.message}</div>
      </div>
    </div>
  )
}


