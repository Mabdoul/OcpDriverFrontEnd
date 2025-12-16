import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, clearStatus } from '../../features/auth/authSlice'

const validateEmail = (email) => /\S+@\S+\.\S+/.test(email)

export default function LoginPage() {
  const dispatch = useDispatch()
  const { loading, error, successMessage } = useSelector((state) => state.auth)

  const [form, setForm] = useState({ email: '', password: '', role: 'client' })
  const [touched, setTouched] = useState({})
  const [localErrors, setLocalErrors] = useState({})

  useEffect(() => {
    return () => {
      dispatch(clearStatus())
    }
  }, [dispatch])

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
    if (!form.email) {
      errors.email = 'Email requis'
    } else if (!validateEmail(form.email)) {
      errors.email = 'Format d’email invalide'
    }
    if (!form.password) {
      errors.password = 'Mot de passe requis'
    }
    setLocalErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    dispatch(loginUser(form))
  }

  const showError = (field) => touched[field] && localErrors[field]

  return (
    <div className="auth-card">
      <h1 className="title">Content de vous revoir</h1>
      <p className="subtitle">Connectez-vous pour accéder à votre compte</p>

      {error && <div className="alert error">{error}</div>}

      {successMessage && <div className="alert success">{successMessage}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="field">
          <span className="label">Se connecter en tant que</span>
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

        <div className="field">
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`input ${showError('email') ? 'error' : ''}`}
            placeholder="vous@example.com"
            autoComplete="email"
          />
          {showError('email') && <p className="error-text">{localErrors.email}</p>}
        </div>

        <div className="field">
          <label htmlFor="password" className="label">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`input ${showError('password') ? 'error' : ''}`}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          {showError('password') && <p className="error-text">{localErrors.password}</p>}
        </div>

        <button type="submit" disabled={loading} className="btn">
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </div>
  )
}


