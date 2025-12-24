import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
} from 'react-leaflet'
import { useState } from 'react'
import L from 'leaflet'

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// 📍 Fixed locations (TEXT ONLY)
const FIXED_LOCATIONS = [
    {
        name: '🚌 Station De Bus',
        position: [33.111555110432, -8.5987172810223],
    },
    {
        name: '🏭 Digital Manufacturing',
        position: [33.111088706459, -8.5949029308404],
    },
    {
        name: '🎓 UM6P',
        position: [33.110540521306, -8.5934497437592],
    },
    {
        name: '🏢 Administration',
        position: [33.108913919205, -8.5917451357636],
    },
]

// 🏷️ Text-only icon
const textIcon = (text) =>
    L.divIcon({
        className: 'map-text-label',
        html: `<div>${text}</div>`,
        iconSize: [150, 30],
        iconAnchor: [75, 15],
    })

function ClickHandler({ onSelect }) {
    useMapEvents({
        click(e) {
            onSelect(e.latlng)
        },
    })
    return null
}
// 🔹 Markers colorés
const greenMarker = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})

const redMarker = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})


export default function SelectMap({ pointA, pointB, setPointA, setPointB }) {
  const handleSelect = (latlng) => {
    if (!pointA) setPointA(latlng)
    else if (!pointB) setPointB(latlng)
  }

  return (
    <>
      {/* ✅ Légende permanente */}
      <div style={{ marginBottom: '10px' }}>
        <span style={{ color: 'green', fontWeight: 'bold' }}>● Départ</span>{' '}
        <span style={{ color: 'red', fontWeight: 'bold', marginLeft: '15px' }}>● Arrivée</span>
      </div>

      <MapContainer
        center={[33.1045, -8.6033]}
        zoom={14}
        style={{ height: '420px', width: '100%' }}
        onClick={(e) => handleSelect(e.latlng)}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles © Esri"
        />

        {/* 🏷️ FIXED PLACES → TEXT ONLY */}
        {FIXED_LOCATIONS.map((loc, index) => (
          <Marker
            key={index}
            position={loc.position}
            icon={textIcon(loc.name)}
            interactive={false}
          />
        ))}

        {/* 🔹 Point A → vert */}
        {pointA && <Marker position={pointA} icon={greenMarker} />}

        {/* 🔴 Point B → rouge */}
        {pointB && <Marker position={pointB} icon={redMarker} />}
      </MapContainer>
    </>
  )
}
