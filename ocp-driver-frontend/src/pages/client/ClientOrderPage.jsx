import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../features/auth/authSlice'

const LOCATIONS = [
  'Centre ville',
  'Gare principale',
  'Aéroport',
  'Zone industrielle',
  'Quartier résidentiel',
]

const API_URL = 'http://127.0.0.1:8000/api'

export default function ClientOrderPage() {
  const dispatch = useDispatch()
  const { token, role, user } = useSelector((state) => state.auth)

  const [pointA, setPointA] = useState(LOCATIONS[0])
  const [pointB, setPointB] = useState(LOCATIONS[1])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // If token/role are missing, App.jsx will render auth pages.

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess('')
    setError('')

    if (pointA === pointB) {
      setError("Le point de départ et d'arrivée doivent être différents.")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/client/trip/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ origin: pointA, destination: pointB }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Erreur lors de la création du trajet.')

      setSuccess('Trajet commandé avec succès.')
    } catch (err) {
      setError(err.message || 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <div className="client-page">
      <header className="client-navbar">
        <div className="client-navbar-inner">
          <div className="brand">
            <span className="brand-mark">OCP</span>
            <span className="brand-text">Client</span>
          </div>
          <div className="client-actions">
            <span className="client-hello">
              Bonjour, {user?.name || 'Client'}
            </span>
            <button type="button" className="logout-btn" onClick={handleLogout}>
              Se déconnecter
            </button>
          </div>
        </div>
      </header>

      <main className="client-main">
        <div className="client-card">
          <h1 className="client-title">Commander un trajet</h1>
          <p className="client-subtitle">
            Choisissez votre point de départ et votre destination pour réserver un chauffeur.
          </p>

          {error && <div className="alert error">{error}</div>}
          {success && <div className="alert success">{success}</div>}

          <form onSubmit={handleSubmit} className="form">
            <div className="field">
              <label className="label" htmlFor="pointA">Point de départ (Point A)</label>
              <select
                id="pointA"
                value={pointA}
                onChange={(e) => setPointA(e.target.value)}
                className="input"
              >
                {LOCATIONS.map((loc) => (
                  <option key={`A-${loc}`} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="label" htmlFor="pointB">Destination (Point B)</label>
              <select
                id="pointB"
                value={pointB}
                onChange={(e) => setPointB(e.target.value)}
                className="input"
              >
                {LOCATIONS.map((loc) => (
                  <option key={`B-${loc}`} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <button type="submit" disabled={loading} className="btn">
              {loading ? 'Envoi en cours…' : 'Passer commande'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
