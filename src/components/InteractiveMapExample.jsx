import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useMapInteractions } from '../hooks/useMapInteractions';
import { AnimatedPath } from './AnimatedPath';
import L from 'leaflet';

// Custom marker icon
const createCustomIcon = (isHovered = false) => {
  return L.divIcon({
    html: `<div class="custom-marker ${isHovered ? 'hovered' : ''}">
      <div class="marker-inner"></div>
    </div>`,
    className: 'custom-marker-container',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

export const InteractiveMap = ({ 
  events = [], 
  center = [51.505, -0.09], 
  zoom = 10,
  onEventSelect
}) => {
  const mapRef = useRef(null);
  const {
    isPathVisible,
    hoveredEvent,
    pathCoordinates,
    onMarkerMouseOver,
    onMarkerMouseOut,
    togglePath
  } = useMapInteractions(events, mapRef.current);

  // Set map reference when component mounts
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      // Enable canvas renderer for better performance
      map.options.preferCanvas = true;
    }
  }, []);

  return (
    <div className="relative h-full w-full">
      {/* Path Toggle Button */}
      <button
        onClick={togglePath}
        className={`absolute top-4 right-4 z-10 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          isPathVisible
            ? 'bg-amber-800 text-white shadow-lg'
            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
        }`}
      >
        {isPathVisible ? 'Hide Path' : 'Show Path'}
      </button>

      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
        ref={mapRef}
        preferCanvas={true}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Animated Path */}
        <AnimatedPath
          coordinates={pathCoordinates}
          isVisible={isPathVisible}
        />

        {/* Event Markers */}
        {events.map((event) => (
          <Marker
            key={event.id}
            position={[event.latitude, event.longitude]}
            icon={createCustomIcon(hoveredEvent?.id === event.id)}
            eventHandlers={{
              mouseover: () => onMarkerMouseOver(event),
              mouseout: onMarkerMouseOut,
              click: () => onEventSelect?.(event)
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-gray-900">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.location}</p>
                <p className="text-xs text-gray-500">{event.date}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

// Usage Example with LeftPanel Integration
export const MapWithLeftPanel = ({ events }) => {
  const mapRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = React.useState(null);
  
  const {
    onCardHover,
    onMarkerMouseOut,
    ...mapInteractions
  } = useMapInteractions(events, mapRef.current);

  // Enhanced event card component with hover interactions
  const EventCard = ({ event, isActive, onClick }) => (
    <div
      className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
        isActive 
          ? 'border-orange-200 bg-orange-50 shadow-md' 
          : 'border-gray-100 bg-white hover:bg-gray-50 hover:shadow-md'
      }`}
      onClick={() => onClick(event)}
      onMouseEnter={() => onCardHover(event)}
      onMouseLeave={onMarkerMouseOut}
    >
      <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
      <p className="text-sm text-gray-600">{event.location}</p>
      <p className="text-xs text-gray-500 mt-1">{event.date}</p>
    </div>
  );

  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Events</h2>
          <p className="text-sm text-gray-500">{events.length} total events</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isActive={selectedEvent?.id === event.id}
              onClick={setSelectedEvent}
            />
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1">
        <InteractiveMap
          events={events}
          onEventSelect={setSelectedEvent}
        />
      </div>
    </div>
  );
};