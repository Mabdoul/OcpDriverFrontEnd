import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../features/auth/authSlice'
import SelectMap from '../../components/SelectMap'
import './ClientOrderPage.css'

const API_URL = 'http://127.0.0.1:8000/api'

export default function ClientOrderPage() {
  const dispatch = useDispatch()
  const { token, user } = useSelector((state) => state.auth)

  const [pointA, setPointA] = useState(null)
  const [pointB, setPointB] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [trip, setTrip] = useState(null)
  const [orderPlaced, setOrderPlaced] = useState(false)

  // 🔁 Polling: check latest trip status every 5s
  useEffect(() => {
    if (!token || !orderPlaced) return

    const checkTripStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/client/trip/latest`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return
        const data = await res.json()
        setTrip(data)
      } catch (err) {
        console.log('Polling error', err)
      }
    }

    checkTripStatus()
    const interval = setInterval(checkTripStatus, 5000)
    return () => clearInterval(interval)
  }, [token, orderPlaced])

  // 🟢 Create trip
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess('')
    setError('')

    if (!pointA || !pointB) {
      setError('خاصك تختار Point A و Point B من الماب')
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
        body: JSON.stringify({
          start_lat: pointA.lat,
          start_lng: pointA.lng,
          end_lat: pointB.lat,
          end_lng: pointB.lng,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Erreur lors de la création du trajet')

      setSuccess('Trajet commandé avec succès 🚗')
      setPointA(null)
      setPointB(null)
      setOrderPlaced(true) // ✅ Start polling
    } catch (err) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => dispatch(logout())

  return (
    <div className="client-page">
      <header className="client-navbar">
        <div className="client-navbar-inner">
          <div className="brand">
            <span className="brand-mark">OCP</span>
            <span className="brand-text">Client</span>
          </div>
          <div className="client-actions">
            <span className="client-hello">Bonjour, {user?.name || 'Client'}</span>
            <button className="logout-btn" onClick={handleLogout}>Se déconnecter</button>
          </div>
        </div>
      </header>

      <main className="client-main">
        <div className="client-card">
          <h1 className="client-title">Commander un trajet</h1>

          {orderPlaced && trip && (
            <div className={`trip-status ${trip.status}`}>
              {trip.status === 'pending' && (
                <div className="waiting">
                  <div className="spinner"></div>
                  ⏳ En attente d’un chauffeur
                </div>
              )}
              {trip.status === 'accepted' && (
                <div className="accepted">
                  <div className="car-animation"></div>
                  🚗 Chauffeur en route : {trip.chauffeur?.name}
                </div>
              )}
            </div>
          )}

          {!orderPlaced && (
            <>
              <p className="client-subtitle">
                Cliquez sur la carte pour choisir le point de départ et la destination
              </p>

              {error && <div className="alert error">{error}</div>}
              {success && <div className="alert success">{success}</div>}

              <form onSubmit={handleSubmit} className="form">
                <SelectMap
                  pointA={pointA}
                  pointB={pointB}
                  setPointA={setPointA}
                  setPointB={setPointB}
                />
                <button type="submit" disabled={loading} className="btn">
                  {loading ? 'Envoi en cours…' : 'Passer commande'}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
