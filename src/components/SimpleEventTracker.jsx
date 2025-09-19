import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { events } from '../data/events.js';
import './PremiumMapElements.css';

// Animation component when clicking an event
function FlyToLocation({ location }) {
  const map = useMap();
  
  useEffect(() => {
    if (location) {
      // Spin and zoom animation
      map.flyTo(location, 10, {
        animate: true,
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }, [location, map]);
  
  return null;
}

const SimpleEventTracker = () => {
  const [showPast, setShowPast] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [mapRef, setMapRef] = useState(null);

  // Filter events based on toggle selection (past/upcoming)
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date.replace(/\s/g, ' '));
    const currentDate = new Date('September 16, 2025');
    
    if (showPast) {
      return eventDate < currentDate;
    } else {
      return eventDate >= currentDate;
    }
  });

  // Custom coffee marker with animation
  const createMarker = (event) => {
    const color = showPast ? '#362B1E' : '#E58A3C';
    
    const markerIcon = L.divIcon({
      html: `
        <div class="coffee-marker">
          <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
            <!-- Handle -->
            <path d="M35 15C38 15 40 12 40 9C40 6 38 5 35 5C32 5 29 5 29 5L30 15C30 15 32 15 35 15Z" fill="#8B5A2B"/>
            
            <!-- Cup base -->
            <path d="M30 42C30 46.4183 24.6274 50 18 50C11.3726 50 6 46.4183 6 42L8 15H28L30 42Z" fill="${color}"/>
            <path d="M6 15L5 8H29L28 15H6Z" fill="#A67C52"/>
            
            <!-- Cup rim -->
            <ellipse cx="17" cy="15" rx="12" ry="4" fill="#8B5A2B"/>
            
            <!-- Image placeholder (circle) -->
            <circle cx="18" cy="28" r="8" fill="white" stroke="#A67C52" stroke-width="1.5"/>
            
            <!-- Steam (animated) -->
            <path class="steam steam-1" d="M13 10C13 8 15 7 15 5C15 3 13 2 13 0" stroke="white" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.7"/>
            <path class="steam steam-2" d="M18 12C18 10 20 9 20 7C20 5 18 4 18 2" stroke="white" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.7"/>
            <path class="steam steam-3" d="M23 10C23 8 25 7 25 5C25 3 23 2 23 0" stroke="white" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.7"/>
          </svg>
          <div class="marker-label">${event.city}</div>
        </div>
      `,
      className: 'custom-marker',
      iconSize: [40, 50],
      iconAnchor: [20, 50],
      popupAnchor: [0, -45]
    });
    
    return markerIcon;
  };

  return (
    <div className="simple-event-tracker">
      <div className="toggle-container">
        <button 
          className={`toggle-button ${!showPast ? 'active' : ''}`}
          onClick={() => setShowPast(false)}
        >
          Upcoming Events
        </button>
        <button 
          className={`toggle-button ${showPast ? 'active' : ''}`}
          onClick={() => setShowPast(true)}
        >
          Past Events
        </button>
      </div>
      
      <div className="map-container">
        <MapContainer 
          center={[20, 0]} 
          zoom={2} 
          ref={setMapRef}
          zoomControl={false}
          scrollWheelZoom={true}
          className="map"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {filteredEvents.map(event => (
            <Marker 
              key={event.id} 
              position={[event.lat, event.lng]} 
              icon={createMarker(event)}
              eventHandlers={{
                click: () => setSelectedEvent(event)
              }}
            >
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
                  </div>
                  {event.highlightsLink && (
                    <a 
                      href={event.highlightsLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="popup-button"
                    >
                      {showPast ? 'VIEW HIGHLIGHTS ON X' : 'REGISTER NOW'}
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
          
          {selectedEvent && (
            <FlyToLocation location={[selectedEvent.lat, selectedEvent.lng]} />
          )}
        </MapContainer>
      </div>
      
      <div className="events-list">
        <h2>{showPast ? 'Past Events' : 'Upcoming Events'}</h2>
        <ul>
          {filteredEvents.map(event => (
            <li 
              key={event.id}
              className="event-list-item"
              onClick={() => setSelectedEvent(event)}
            >
              {event.city}, {event.country} ({event.date.split(',')[0]})
              {event.highlightsLink && (
                <a 
                  href={event.highlightsLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="event-highlight-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  Highlights
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SimpleEventTracker;