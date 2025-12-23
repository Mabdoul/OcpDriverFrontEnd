import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function ChauffeurTripMap({ start, end, onClose }) {
  const [pointA] = useState(start)
  const [pointB] = useState(end)

  const getDistanceKm = (a, b) => {
    const R = 6371
    const dLat = ((b.lat - a.lat) * Math.PI) / 180
    const dLng = ((b.lng - a.lng) * Math.PI) / 180
    const c =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(a.lat * Math.PI / 180) *
      Math.cos(b.lat * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c))
  }

  return (
    <div style={{ padding: '10px' }}>
      <button onClick={onClose} style={{ marginBottom: '10px' }}>Fermer la map</button>

      <MapContainer
        center={[ (pointA.lat + pointB.lat)/2, (pointA.lng + pointB.lng)/2 ]}
        zoom={16}
        style={{ height: '420px', width: '100%' }}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles © Esri"
        />

        <Marker position={pointA}>
          <Popup>
            Départ (Client) <br/>
            Distance: {getDistanceKm(pointA, pointB).toFixed(2)} km
          </Popup>
        </Marker>

        <Marker position={pointB}>
          <Popup>Arrivée</Popup>
        </Marker>

        <Polyline positions={[pointA, pointB]} color="blue" />
      </MapContainer>
    </div>
  )
}
