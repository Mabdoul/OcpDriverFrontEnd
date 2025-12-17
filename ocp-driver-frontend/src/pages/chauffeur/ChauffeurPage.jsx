import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../features/auth/authSlice'

const API_URL = 'http://127.0.0.1:8000/api'

export default function ChauffeurPage() {
  const dispatch = useDispatch()
  const { token, role, user } = useSelector((state) => state.auth)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [trips, setTrips] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)

  // If not logged in or not chauffeur, App.jsx will render auth pages.

  const fetchTrips = async () => {
    setError('')
    if (!token) {
      setError('Token introuvable. Veuillez vous reconnecter.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/chauffeur/trips/pending`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const text = await res.text()
      const data = text ? JSON.parse(text) : {}

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Impossible de récupérer les commandes.')
      }

      const list = data.trips || data.data || data.orders || []
      setTrips(Array.isArray(list) ? list : [])
      setLastUpdated(new Date())
    } catch (err) {
      setError(err.message || 'Erreur réseau.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrips()
    const intervalId = setInterval(fetchTrips, 5000)
    return () => clearInterval(intervalId)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <div className="chauffeur-page">
      <header className="client-navbar">
        <div className="client-navbar-inner">
          <div className="brand">
            <span className="brand-mark">OCP</span>
            <span className="brand-text">Chauffeur</span>
          </div>
          <div className="client-actions">
            <span className="client-hello">
              {user?.name ? `Bonjour, ${user.name}` : '—'}
            </span>
            <span className="client-hello">
              {lastUpdated ? `Dernière mise à jour: ${lastUpdated.toLocaleTimeString()}` : '—'}
            </span>
            <button type="button" className="nav-link" onClick={fetchTrips} disabled={loading}>
              {loading ? 'Actualisation…' : 'Actualiser'}
            </button>
            <button type="button" className="logout-btn" onClick={handleLogout}>
              Se déconnecter
            </button>
          </div>
        </div>
      </header>

      <main className="chauffeur-main">
        <div className="chauffeur-card">
          <h1 className="client-title">Commandes de trajets</h1>
          <p className="client-subtitle">
            Suivi en temps réel des commandes (actualisation automatique toutes les 5 secondes).
          </p>

          {error && <div className="alert error">{error}</div>}

          {!error && trips.length === 0 && (
            <div className="alert success">Aucune commande pour le moment.</div>
          )}

          <div className="trip-list">
            {trips.map((t, idx) => {
              const id = t.id ?? t.trip_id ?? idx
              const origin = t.origin ?? t.pointA ?? t.from ?? '—'
              const destination = t.destination ?? t.pointB ?? t.to ?? '—'
              const status = t.status ?? t.state ?? 'en attente'

              return (
                <div key={id} className="trip-card">
                  <div className="trip-top">
                    <div className="trip-route">
                      <div className="trip-line">
                        <span className="trip-dot" />
                        <span className="trip-label">Départ</span>
                        <span className="trip-value">{origin}</span>
                      </div>
                      <div className="trip-line">
                        <span className="trip-dot to" />
                        <span className="trip-label">Arrivée</span>
                        <span className="trip-value">{destination}</span>
                      </div>
                    </div>
                    <span className="trip-status">{String(status)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
