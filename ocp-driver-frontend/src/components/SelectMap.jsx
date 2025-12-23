import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { useState } from 'react'
import L from 'leaflet'

// Fix icon problem
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})
  const OCP_BOUNDS = [
        [33.085, -8.635], // sud-ouest
        [33.105, -8.610], // nord-est
    ]

function ClickHandler({ onSelect }) {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng

            if (
                lat < 33.085 || lat > 33.105 ||
                lng < -8.635 || lng > -8.610
            ) {
                alert('الاختيار خاص يكون داخل Complexe OCP')
                return
            }

            onSelect(e.latlng)
        },
    })
    return null
}


export default function SelectMap({ pointA, pointB, setPointA, setPointB }) {
  

    const [selectA, setSelectA] = useState(true)

    const handleSelect = (latlng) => {
        if (selectA) {
            setPointA(latlng)
        } else {
            setPointB(latlng)
        }
        setSelectA(!selectA)
    }

    return (
        <>
            <p>
                {selectA
                    ? 'Cliquez sur la carte pour choisir Point A'
                    : 'Cliquez sur la carte pour choisir Point B'}
            </p>

            <MapContainer
                center={[33.0939, -8.6233]} // Complexe OCP
                zoom={16}
                style={{ height: '420px', width: '100%' }}
            >
                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution="Tiles © Esri"
                />

                <ClickHandler onSelect={handleSelect} />

                {pointA && <Marker position={pointA} />}
                {pointB && <Marker position={pointB} />}
            </MapContainer>
        </>
    )
}
