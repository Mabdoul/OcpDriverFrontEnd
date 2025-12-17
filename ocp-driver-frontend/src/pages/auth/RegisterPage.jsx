import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, clearStatus } from '../../features/auth/authSlice'

const validateEmail = (email) => /\S+@\S+\.\S+/.test(email)

export default function RegisterPage({ onRegistered }) {
  const dispatch = useDispatch()
  const { loading, error, successMessage } = useSelector((state) => state.auth)

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'client' })
  const [touched, setTouched] = useState({})
  const [localErrors, setLocalErrors] = useState({})

  useEffect(() => {
    return () => dispatch(clearStatus())
  }, [dispatch])

  useEffect(() => {
    if (successMessage) {
      // After successful registration, go back to login screen.
      // (Parent passes onRegistered)
      // eslint-disable-next-line no-use-before-define
      onRegistered?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successMessage])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    validate()
  }

  const validate = () => {
    const errors = {}
    if (!form.name) errors.name = 'Nom requis'
    if (!form.email) errors.email = !form.email ? 'Email requis' : !validateEmail(form.email) ? 'Format d’email invalide' : ''
    if (!form.phone) errors.phone = 'Téléphone requis'
    if (!form.password) errors.password = !form.password ? 'Mot de passe requis' : form.password.length < 6 ? 'Minimum 6 caractères' : ''
    setLocalErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    dispatch(registerUser(form))
  }

  const showError = (field) => touched[field] && localErrors[field]

  return (
    <div className="auth-card">
      <h1 className="title">Créer un compte</h1>
      <p className="subtitle">Inscrivez-vous pour démarrer avec le service</p>

      {error && <div className="alert error">{error}</div>}
      {successMessage && <div className="alert success">{successMessage}</div>}

      <form onSubmit={handleSubmit} className="form">
        {/* Role toggle */}
        <div className="field">
          <span className="label">Créer un compte en tant que</span>
          <div className="role-toggle">
            <button
              type="button"
              className={`role-pill ${form.role === 'client' ? 'active' : ''}`}
              onClick={() => setForm((prev) => ({ ...prev, role: 'client' }))}
            >
              Client
            </button>
            <button
              type="button"
              className={`role-pill ${form.role === 'chauffeur' ? 'active' : ''}`}
              onClick={() => setForm((prev) => ({ ...prev, role: 'chauffeur' }))}
            >
              Chauffeur
            </button>
          </div>
        </div>

        {/* Name, Email, Phone, Password */}
        <div className="field">
          <label htmlFor="name" className="label">Nom</label>
          <input id="name" name="name" type="text" value={form.name} onChange={handleChange} onBlur={handleBlur} className={`input ${showError('name') ? 'error' : ''}`} placeholder="Jean Dupont" />
          {showError('name') && <p className="error-text">{localErrors.name}</p>}
        </div>

        <div className="field">
          <label htmlFor="email" className="label">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} onBlur={handleBlur} className={`input ${showError('email') ? 'error' : ''}`} placeholder="vous@example.com" />
          {showError('email') && <p className="error-text">{localErrors.email}</p>}
        </div>

        <div className="field">
          <label htmlFor="phone" className="label">Téléphone</label>
          <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} onBlur={handleBlur} className={`input ${showError('phone') ? 'error' : ''}`} placeholder="+33 6 12 34 56 78" />
          {showError('phone') && <p className="error-text">{localErrors.phone}</p>}
        </div>

        <div className="field">
          <label htmlFor="password" className="label">Mot de passe</label>
          <input id="password" name="password" type="password" value={form.password} onChange={handleChange} onBlur={handleBlur} className={`input ${showError('password') ? 'error' : ''}`} placeholder="Minimum 6 caractères" />
          {showError('password') && <p className="error-text">{localErrors.password}</p>}
        </div>

        <button type="submit" disabled={loading} className="btn">{loading ? 'Création…' : 'Créer un compte'}</button>
      </form>
    </div>
  )
}
