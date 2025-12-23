import { MapContainer, TileLayer, Marker, useMapEvents, Polygon } from 'react-leaflet'
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
function ClickHandler({ onSelect }) {
    useMapEvents({
        click(e) {


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
                center={[33.1045, -8.6033]} // Complexe OCP
                zoom={14}
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
