import { useState, useRef } from 'react'
import 'leaflet/dist/leaflet.css';
import './index.css'
import { MapContainer, TileLayer, Popup } from 'react-leaflet';
import L from 'leaflet';
import { events } from './data/events.js'
import espressoSquareLogo from './assets/espresso-square-logo.png';
import CoffeeMarker from './components/CoffeeMarker';
import EventTimeline from './components/EventTimeline';
import ConnectingLines from './components/ConnectingLines';
import SimpleEventTracker from './components/SimpleEventTracker';
import './components/SimpleEventTracker.css';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function App() {
  const [filter, setFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewMode, setViewMode] = useState('simple'); // 'simple' or 'premium'
  const mapRef = useRef();

  const filteredEvents = filter === 'all' ? events : events.filter(event => event.type === filter);

  const handleMarkerClick = (event) => {
    setSelectedEvent(event);
  };

  const handleResetView = () => {
    if (mapRef.current) {
      mapRef.current.setView([20, 0], 2);
      setSelectedEvent(null);
    }
  };

  return (
    <div className="app">
  <header>
        <div className="logo-container">
            <img src={espressoSquareLogo} alt="Espresso Logo" className="espresso-logo" style={{ borderRadius: '12px', width: '40px', height: '40px', boxShadow: '0 2px 8px rgba(43,43,43,0.10)', objectFit: 'cover' }} />
            <div>
              <span className="espresso-title">Espresso</span> World Map
              <div className="subtitle">Espresso events around the world</div>
            </div>
        </div>
        
        {/* View Mode Switcher */}
        <div className="view-mode-switcher">
          <button 
            className={`view-mode-button ${viewMode === 'simple' ? 'active' : ''}`}
            onClick={() => setViewMode('simple')}
          >
            Simple View
          </button>
          <button 
            className={`view-mode-button ${viewMode === 'premium' ? 'active' : ''}`}
            onClick={() => setViewMode('premium')}
          >
            Premium View
          </button>
        </div>
        
        {viewMode === 'premium' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '20px' }}>
            <div className="filter-buttons">
              <button 
                className={`filter-button ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={`filter-button tasting-button ${filter === 'tasting' ? 'active' : ''}`}
                onClick={() => setFilter('tasting')}
              >
                Tastings
              </button>
              <button 
                className={`filter-button workshop-button ${filter === 'workshop' ? 'active' : ''}`}
                onClick={() => setFilter('workshop')}
              >
                Workshops
              </button>
              <button 
                className={`filter-button competition-button ${filter === 'competition' ? 'active' : ''}`}
                onClick={() => setFilter('competition')}
              >
                Competitions
              </button>
            </div>
            <button className="view-reset-button" onClick={handleResetView}>Reset View</button>
          </div>
        )}
      </header>
      
      <div className="main-content" style={{ height: 'calc(100vh - 70px)' }}>
        {viewMode === 'simple' ? (
          // Simple Event Tracker View
          <SimpleEventTracker />
        ) : (
          // Premium View
          <div className="map-container" style={{ height: '100%', width: '100%' }}>
            <MapContainer 
              center={[20, 0]} 
              zoom={2} 
              style={{ height: '100%', width: '100%' }}
              whenCreated={mapInstance => { mapRef.current = mapInstance; }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {/* Add connecting lines between events */}
              <ConnectingLines events={filteredEvents} activeEvent={selectedEvent} />
              
              {filteredEvents.map(event => (
                <CoffeeMarker 
                  key={event.id} 
                  event={event}
                  position={[event.lat, event.lng]}
                  onClick={handleMarkerClick}
                >
                </CoffeeMarker>
              ))}
              
              {selectedEvent && (
                <Popup
                  position={[selectedEvent.lat, selectedEvent.lng]}
                  onClose={() => setSelectedEvent(null)}
                >
                  <div className="event-popup premium-popup">
                    <div className="popup-image-container">
                      <img src={selectedEvent.image} alt={selectedEvent.name} className="popup-image premium-image" />
                    </div>
                    <div className="popup-main">
                      <div className="popup-title-row">
                        <h3 className="popup-title">{selectedEvent.name}</h3>
                        <span className="popup-country">{selectedEvent.city}, {selectedEvent.country}</span>
                      </div>
                      <div className="popup-info-row">
                        <span className="popup-icon">📅</span>
                        <span className="popup-date">{selectedEvent.date}</span>
                      </div>
                      <div className="popup-info-row">
                        <span className="popup-icon">👥</span>
                        <span className="popup-attendees">{selectedEvent.attendees} attendees</span>
                      </div>
                      <div className="popup-description">{selectedEvent.description}</div>
                      <div className="popup-details">{selectedEvent.detailedInfo}</div>
                      <span className={`popup-badge ${selectedEvent.type === 'past' ? 'past' : 'upcoming'}`}>{selectedEvent.type === 'past' ? 'PAST EVENT' : 'UPCOMING EVENT'}</span>
                      {selectedEvent.highlightsLink && (
                        <a href={selectedEvent.highlightsLink} target="_blank" rel="noopener noreferrer" className="popup-cta">See Highlights</a>
                      )}
                    </div>
                  </div>
                </Popup>
              )}
            </MapContainer>
            
            {/* Event Timeline */}
            <EventTimeline 
              events={filteredEvents} 
              onEventSelect={handleMarkerClick} 
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default App