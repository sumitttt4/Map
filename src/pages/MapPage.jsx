import React, { useState, useRef } from 'react';
import Header from '../components/Header';
import LeftPanel from '../components/LeftPanel';
import MapWithMarkers from '../components/MapWithMarkers';
import { events } from '../data/events.js';

const MapPage = () => {
  const [filter, setFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  // New map control states
  const [showNumbers, setShowNumbers] = useState(false);
  const [showRoute, setShowRoute] = useState(false);
  const mapRef = useRef();

  const currentDate = new Date('2025-09-20');
  const filteredEvents = events.filter(event => {
    if (filter === 'past') return event.status === 'PAST';
    if (filter === 'upcoming') return event.status === 'UPCOMING';
    return true;
  });

  const handleCardClick = (event) => {
    if (event === null) {
      setSelectedEvent(null);
      return;
    }
    setSelectedEvent(event);
    if (mapRef.current) {
      mapRef.current.flyTo([event.lat, event.lng], 6, {
        animate: true,
        duration: 1.5
      });
    }
  };

  const handleMarkerClick = (event) => {
    setSelectedEvent(event);
  };

  // Handle card hover interactions
  const handleCardHover = (event) => {
    if (mapRef.current && mapRef.current.onMarkerMouseOver) {
      const eventWithCoords = {
        ...event,
        latitude: event.lat,
        longitude: event.lng
      };
      mapRef.current.onMarkerMouseOver(eventWithCoords);
    }
  };

  const handleCardMouseOut = () => {
    if (mapRef.current && mapRef.current.onMarkerMouseOut) {
      mapRef.current.onMarkerMouseOut();
    }
  };

  const handleZoomToEvents = () => {
    if (mapRef.current && filteredEvents.length > 0) {
      const bounds = filteredEvents.map(event => [event.lat, event.lng]);
      mapRef.current.fitBounds(bounds, { padding: [20, 20] });
    }
  };

  const handleResetView = () => {
    if (mapRef.current) {
      mapRef.current.setView([20, 0], 2);
    }
    setSelectedEvent(null);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  // Toggle handlers passed to Header
  const toggleShowNumbers = () => setShowNumbers(v => !v);
  const toggleShowRoute = () => setShowRoute(v => !v);

  // ResizeObserver is handled in MapWithMarkers component

  return (
    <div className="app-layout">
      <Header
        showNumbers={showNumbers}
        showRoute={showRoute}
        onToggleNumbers={toggleShowNumbers}
        onToggleRoute={toggleShowRoute}
      />
      
      <div className="main-content">
        <LeftPanel
          events={filteredEvents}
          onSelect={handleCardClick}
          onZoomAll={handleZoomToEvents}
          onReset={handleResetView}
          activeId={selectedEvent?.id}
          selectedEvent={selectedEvent}
          filter={filter}
          setFilter={setFilter}
          onCardHover={handleCardHover}
          onCardMouseOut={handleCardMouseOut}
        />
        
        <div className="map-container-full relative">
          <MapWithMarkers
            ref={mapRef}
            events={filteredEvents}
            selectedEvent={selectedEvent}
            onMarkerClick={handleMarkerClick}
            showNumbers={showNumbers}
            showRoute={showRoute}
          />
        </div>
      </div>
    </div>
  );
};

export default MapPage;