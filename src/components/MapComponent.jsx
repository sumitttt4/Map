import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapAnimation.css';
import './PremiumMapElements.css';
import { events } from '../data/events.js';
import CoffeeMarker from './CoffeeMarker';
import EventTimeline from './EventTimeline';
import ConnectingLines from './ConnectingLines';
import FloatingEventCard from './FloatingEventCard';

// Fix for default markers in Leaflet
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Fly to marker animation component
function FlyToMarker({ position }) {
  const map = useMap();
  
  const flyToMarker = () => {
    map.flyTo(position, 13, {
      animate: true,
      duration: 1.5,
      easeLinearity: 0.25
    });
  };
  
  return (
    <button 
      onClick={flyToMarker}
      className="map-button fly-to"
      title="Zoom to Event"
    >
      🔍
    </button>
  );
}

// Enhanced premium popup component
const PremiumPopup = ({ event }) => {
  return (
    <Popup className="premium-popup">
      <div className="popup-header">
        {event.name}
      </div>
      <div className="popup-content">
        <div className="popup-details">
          <img 
            src={event.image} 
            alt={event.name}
            className="popup-image" 
          />
          <div className="popup-info">
            <div className={`popup-type ${event.type}`}>
              {event.type.toUpperCase()}
            </div>
            <div className="popup-date">
              <strong>📅</strong> {event.date}
            </div>
            <div className="popup-location">
              <strong>📍</strong> {event.city}, {event.country}
            </div>
          </div>
        </div>
        <div className="popup-description">
          {event.description}
          {event.detailedInfo && (
            <>
              <br /><br />
              {event.detailedInfo}
            </>
          )}
        </div>
        {event.highlightsLink && (
          <a 
            href={event.highlightsLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="popup-button"
          >
            {event.type === 'tasting' ? 'REGISTER NOW' : 'VIEW HIGHLIGHTS'}
          </a>
        )}
      </div>
    </Popup>
  );
};

const MapComponentInner = ({ filter }, ref) => {
  const [activeEvent, setActiveEvent] = useState(null);
  const [showCard, setShowCard] = useState(false);
  const mapRef = useRef(null);
  
  const filteredEvents = filter === 'all' ? events : events.filter(event => event.type === filter);
  
  console.log('Filter:', filter);
  console.log('Filtered Events:', filteredEvents);
  console.log('First event structure:', filteredEvents.length > 0 ? filteredEvents[0] : 'No events');
  
  // Define which events are featured (could be based on various criteria)
  const isFeatured = (event) => {
    return event.attendees > 2000; // For example, events with more than 2000 attendees are featured
  };
  
  const handleMarkerClick = (event) => {
  setActiveEvent(event);
  setShowCard(true);
  };
  
  const resetView = () => {
    if (mapRef.current) {
      mapRef.current.setView([20, 0], 2);
    }
  };
  
  const zoomToEvents = () => {
    if (mapRef.current && filteredEvents.length > 0) {
      const bounds = L.latLngBounds(filteredEvents.map(event => [event.lat, event.lng]));
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };
  
  // Expose functions to parent component via ref
  useImperativeHandle(ref, () => ({
    resetView,
    zoomToEvents
  }));

  return (
  <>
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        ref={mapRef}
        zoomControl={false}
        scrollWheelZoom={true}
        className="map"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Connection lines between events */}
        <ConnectingLines events={filteredEvents} activeEvent={activeEvent} />
        
        {/* Coffee cup markers */}
        {filteredEvents.map(event => (
          <CoffeeMarker 
            key={event.id} 
            event={event}
            position={[event.lat, event.lng]}
            onClick={handleMarkerClick}
            isFeatured={isFeatured(event)}
          />
        ))}
        
        {/* City labels */}
        {filteredEvents.map(event => (
          <Marker 
            key={`label-${event.id}`} 
            position={[event.lat, event.lng]}
            icon={L.divIcon({
              className: 'city-label',
              html: `<div class="city-label-text">${event.city}</div>`,
              iconSize: [100, 20],
              iconAnchor: [50, 30]
            })}
            interactive={false}
          />
        ))}
        
        {/* Premium popups */}
        {filteredEvents.map(event => (
          <Marker
            key={`popup-${event.id}`}
            position={[event.lat, event.lng]}
            opacity={0}
            interactive={false}
          >
            <PremiumPopup event={event} />
          </Marker>
        ))}
        
        {activeEvent && (
          <FlyToMarker position={[activeEvent.lat, activeEvent.lng]} />
        )}
      </MapContainer>
      
      {/* Map controls */}
      <div className="map-controls">
        <button 
          className="map-button"
          onClick={resetView}
          title="Reset View"
        >
          🌎
        </button>
        <button 
          className="map-button"
          onClick={zoomToEvents}
          title="Zoom to Events"
        >
          🔍
        </button>
      </div>
      
      {/* Event timeline */}
      {/* Desktop: show event panel/timeline; Mobile: hide panel, show card only */}
      <div className="event-panel">
        <EventTimeline 
          events={filteredEvents} 
          onEventSelect={(event) => {
            setActiveEvent(event);
            setShowCard(true);
            mapRef.current.flyTo([event.lat, event.lng], 8, {
              animate: true,
              duration: 1.5
            });
          }} 
        />
      </div>

      {/* Floating event card (shown when marker is clicked) */}
      {activeEvent && showCard && (
        <FloatingEventCard 
          event={activeEvent} 
          onClose={() => setShowCard(false)} 
        />
      )}
    </>
  );
};

const MapComponent = forwardRef(MapComponentInner);

export default MapComponent;