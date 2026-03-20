import { useEffect, useState } from 'react';

export default function RiskMap({ cities }) {
  const [MapComponents, setMapComponents] = useState(null);

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    Promise.all([
      import('react-leaflet'),
      import('leaflet'),
    ]).then(([rl, L]) => {
      // Fix default marker icons
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });
      setMapComponents({ rl, L });
    });
  }, []);

  const getRiskColor = (risk) => {
    if (risk === 'red') return '#C0392B';
    if (risk === 'amber') return '#E8620A';
    return '#1B7F4F';
  };

  const getStatusEmoji = (risk) => {
    if (risk === 'red') return '🔴';
    if (risk === 'amber') return '🟡';
    return '🟢';
  };

  if (!MapComponents) {
    return (
      <div className="admin-card" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="skeleton" style={{ width: '100%', height: '100%' }} />
      </div>
    );
  }

  const { MapContainer, TileLayer, CircleMarker, Popup } = MapComponents.rl;

  return (
    <div className="admin-card" style={{ padding: '0', overflow: 'hidden' }}>
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '18px',
          color: '#fff',
          padding: '20px 24px 0',
          marginBottom: '16px',
        }}
      >
        City Risk Heatmap
      </h3>
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ height: '380px', width: '100%', background: 'var(--charcoal)' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        {cities.map((city) => (
          <CircleMarker
            key={city.name}
            center={[city.lat, city.lng]}
            radius={Math.max(city.policies / 100, 10)}
            pathOptions={{
              color: getRiskColor(city.risk),
              fillColor: getRiskColor(city.risk),
              fillOpacity: 0.35,
              weight: 2,
            }}
          >
            <Popup>
              <div style={{ lineHeight: 1.7 }}>
                <strong style={{ fontSize: '15px' }}>{city.name}</strong>
                <br />
                Active policies: <span style={{ fontFamily: 'var(--font-mono)' }}>{city.policies.toLocaleString('en-IN')}</span>
                <br />
                Claims today: <span style={{ fontFamily: 'var(--font-mono)' }}>{city.claims}</span>
                <br />
                Status: {getStatusEmoji(city.risk)} {city.status}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
