import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearStatus } from '../../features/auth/authSlice'

export default function ToastHost() {
  const dispatch = useDispatch()
  const { error, successMessage } = useSelector((s) => s.auth)

  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!error && !successMessage) return

    const type = error ? 'error' : 'success'
    const message = error || successMessage

    dispatch(clearStatus())

    setToast({ type, message })

    const timer = setTimeout(() => {
      setToast(null)
    }, 3000)

    return () => clearTimeout(timer)
  }, [error, successMessage, dispatch])

  if (!toast) return null

  return (
    <div className="toast-wrap">
      <div className={`toast ${toast.type}`}>
        <strong>{toast.type === 'success' ? 'Succès' : 'Erreur'}</strong>
        <div>{toast.message}</div>
      </div>
    </div>
  )
}
