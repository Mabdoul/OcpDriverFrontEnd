import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../features/auth/authSlice'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

const API_URL = 'http://127.0.0.1:8000/api'

// Fix des icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export default function ChauffeurPage() {
  const dispatch = useDispatch()
  const { token, user } = useSelector((state) => state.auth)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [trips, setTrips] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const [acceptedTrip, setAcceptedTrip] = useState(null)

  const fetchTrips = async () => {
    setError('')
    if (!token) return setError('Token introuvable. Veuillez vous reconnecter.')

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
      if (!res.ok) throw new Error(data.message || data.error || 'Impossible de récupérer les commandes.')
      setTrips(Array.isArray(data) ? data : [])
      setLastUpdated(new Date())
    } catch (err) {
      setError(err.message || 'Erreur réseau.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrips()
    const intervalId = setInterval(fetchTrips, 5000) // polling 5s
    return () => clearInterval(intervalId)
  }, [])

  const handleLogout = () => dispatch(logout())

  const handleAccept = async (tripId) => {
    try {
      const res = await fetch(`${API_URL}/chauffeur/trip/${tripId}/accept`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Impossible d’accepter le trajet.')
      const trip = trips.find(t => t.id === tripId)
      setAcceptedTrip(trip)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleRefuse = async (tripId) => {
    try {
      const res = await fetch(`${API_URL}/chauffeur/trip/${tripId}/refuse`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Impossible de refuser le trajet.')
      setTrips(prev => prev.filter(t => t.id !== tripId))
    } catch (err) {
      alert(err.message)
    }
  }

  const handleArrived = async (tripId) => {
    try {
      const res = await fetch(`${API_URL}/chauffeur/trip/${tripId}/complete`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Impossible de marquer comme arrivé.')
      alert('✅ Trajet marqué comme complet')
      setAcceptedTrip(null) // retour à la liste des trips pendants
      fetchTrips() // recharge les trips jdad
    } catch (err) {
      alert(err.message)
    }
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
            <span className="client-hello">{user?.name ? `Bonjour, ${user.name}` : '—'}</span>
            <span className="client-hello">{lastUpdated ? `Dernière mise à jour: ${lastUpdated.toLocaleTimeString()}` : '—'}</span>
            <button type="button" className="nav-link" onClick={fetchTrips} disabled={loading}>
              {loading ? 'Actualisation…' : 'Actualiser'}
            </button>
            <button type="button" className="logout-btn" onClick={handleLogout}>Se déconnecter</button>
          </div>
        </div>
      </header>

      <main className="chauffeur-main">
        <div className="chauffeur-card">
          <h1 className="client-title">Commandes de trajets</h1>

          {!acceptedTrip && (
            <>
              <p className="client-subtitle">
                Suivi en temps réel des commandes (actualisation automatique toutes les 5 secondes).
              </p>
              {error && <div className="alert error">{error}</div>}
              {!error && trips.length === 0 && <div className="alert success">Aucune commande pour le moment.</div>}
              <div className="trip-list">
                {trips.map((t) => {
                  const id = t.id
                  const origin = t.start_lat ?? '—'
                  const destination = t.end_lat ?? '—'
                  const status = t.status ?? 'en attente'
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
                        <div className="trip-actions">
                          {status === 'pending' ? (
                            <>
                              <button
                                onClick={() => handleAccept(id)}
                                style={{
                                  padding: '5px 12px',
                                  marginRight: '8px',
                                  backgroundColor: '#4CAF50',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer'
                                }}
                              >
                                Accepter
                              </button>
                              <button
                                onClick={() => handleRefuse(id)}
                                style={{
                                  padding: '5px 12px',
                                  backgroundColor: '#f44336',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer'
                                }}
                              >
                                Refuser
                              </button>
                            </>
                          ) : (
                            <span className="trip-status">{status}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {acceptedTrip && (
            <div className="trip-map" style={{ height: '400px', marginTop: '20px' }}>
              <MapContainer
                center={[acceptedTrip.start_lat, acceptedTrip.start_lng]}
                zoom={14}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution="Tiles © Esri"
                />
                <Marker position={[acceptedTrip.start_lat, acceptedTrip.start_lng]}>
                  <Popup>Départ</Popup>
                </Marker>
                <Marker position={[acceptedTrip.end_lat, acceptedTrip.end_lng]}>
                  <Popup>Arrivée</Popup>
                </Marker>
              </MapContainer>

              {/* 🔹 Button “Arrivé au client” */}
              <button
                onClick={() => handleArrived(acceptedTrip.id)}
                style={{
                  marginTop: '15px',
                  padding: '8px 15px',
                  backgroundColor: '#55b240ff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Arrivé au client
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}

