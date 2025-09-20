import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import CoffeeMarker from './CoffeeMarker';
import { useMapInteractions } from '../hooks/useMapInteractions';
import { NumberedMarker } from './NumberedMarker';
import InMapEventDetails from './InMapEventDetails';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Map reference handler
const MapRefHandler = ({ setMapRef, mapRef }) => {
  const map = useMap();
  
  useEffect(() => {
    if (map) {
      setMapRef(map);
      mapRef.current = map;
      map.options.preferCanvas = true;
      
      // Ensure proper sizing after map is created
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  }, [map, setMapRef, mapRef]);
  
  return null;
};

const MapWithMarkers = forwardRef(({ events, selectedEvent, onMarkerClick, showNumbers = false, showRoute = false }, ref) => {
  const mapRef = useRef();
  const interactionMapRef = useRef(null);
  // numbered markers & route are controlled by parent props: showNumbers, showRoute
  
  // In-map event details state
  const [inMapDetailsOpen, setInMapDetailsOpen] = useState(false);
  const [selectedInMapEvent, setSelectedInMapEvent] = useState(null);
  const [selectedEventPosition, setSelectedEventPosition] = useState(null);
  
  const {
    isPathVisible,
    hoveredEvent,
    pathCoordinates,
    onMarkerMouseOver,
    onMarkerMouseOut,
    togglePath,
    openCard,
    closeCard
  } = useMapInteractions(events, interactionMapRef.current);

  const setInteractionMapRef = (map) => {
    interactionMapRef.current = map;
  };

  // Enhanced marker click handler for in-map details
  const handleInMapMarkerClick = (event) => {
    console.log('Clicking event for in-map details:', event.name);
    setSelectedInMapEvent(event);
    setSelectedEventPosition([event.lat, event.lng]);
    setInMapDetailsOpen(true);
    
    // DO NOT call onMarkerClick to avoid modal conflicts
    // We want in-map details, not the modal
  };

  const closeInMapDetails = () => {
    setInMapDetailsOpen(false);
    setTimeout(() => {
      setSelectedInMapEvent(null);
      setSelectedEventPosition(null);
    }, 300);
  };

  useImperativeHandle(ref, () => ({
    flyTo: (latlng, zoom, options) => {
      mapRef.current?.flyTo(latlng, zoom, options);
    },
    fitBounds: (bounds, options) => {
      mapRef.current?.fitBounds(bounds, options);
    },
    setView: (latlng, zoom) => {
      mapRef.current?.setView(latlng, zoom);
    },
    // Expose interaction methods
    onMarkerMouseOver,
    onMarkerMouseOut
  }));

  // ResizeObserver to invalidate map size when container changes
  useEffect(() => {
    const el = mapRef.current && mapRef.current.getContainer ? mapRef.current.getContainer() : null;
    if (!el || !mapRef.current) return;
    const ro = new ResizeObserver(() => {
      try { mapRef.current.invalidateSize(); } catch (e) { /* ignore */ }
    });
    ro.observe(el);
    return () => ro.disconnect(); // Cleanup observer on unmount
  }, []);

  // Close floating overlay on ESC
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeCard(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeCard]);

  // Group events by identical lat/lng coordinates
  const groupedEvents = useMemo(() => {
    const groups = new Map();
    
    events.forEach(event => {
      const key = `${event.lat},${event.lng}`;
      if (!groups.has(key)) {
        groups.set(key, {
          location: [event.lat, event.lng],
          events: [],
          lat: event.lat,
          lng: event.lng
        });
      }
      groups.get(key).events.push(event);
    });
    
    return Array.from(groups.values());
  }, [events]);

  // Sort events chronologically and convert to coordinates for route
  const sortedEvents = useMemo(() => {
    return [...events]
      .filter(event => event.lat && event.lng && event.date)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events]);

  const routeCoordinates = useMemo(() => {
    return sortedEvents.map(event => [event.lat, event.lng]);
  }, [sortedEvents]);

  const handleZoomAll = () => {
    if (mapRef.current && events.length > 0) {
      const group = new L.featureGroup(
        events.map(event => L.marker([event.lat, event.lng]))
      );
      mapRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  };

  const handleReset = () => {
    if (mapRef.current) {
      mapRef.current.setView([20, 0], 2);
    }
  };

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}
        zoomControl={true}
        scrollWheelZoom={true}
        preferCanvas={true}
      >
        <MapRefHandler setMapRef={setInteractionMapRef} mapRef={mapRef} />
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />

        {/* Chronological Dotted Route (controlled by parent) */}
        {(showRoute || isPathVisible) && routeCoordinates.length > 1 && (
          <Polyline
            positions={routeCoordinates}
            pathOptions={{
              color: "#E58A3C",
              weight: 4,
              opacity: 0.8,
              dashArray: "10 8",
              lineCap: "round",
              lineJoin: "round",
              className: "chronological-route"
            }}
          />
        )}

        {/* Numbered Markers for Route */}
        {showNumbers && groupedEvents.map((group, index) => {
          const primaryEvent = group.events[0];
          const sortedIndex = sortedEvents.findIndex(e => e.id === primaryEvent.id);
          
          return (
            <NumberedMarker
              key={`numbered-${group.lat}-${group.lng}-${index}`}
              position={[group.lat, group.lng]}
              number={sortedIndex + 1}
              backgroundColor="#E58A3C"
              onClick={() => {
                if (group.events.length === 1) {
                  handleInMapMarkerClick(primaryEvent);
                } else {
                  // Handle multiple events - show popup for numbered markers too
                  if (mapRef.current) {
                    const popupContent = `
                      <div style="font-family: Poppins, sans-serif; min-width: 280px;">
                        <h3 style="margin: 0 0 12px 0; color: #6B2C0F; font-size: 16px; font-weight: 600;">
                          ${group.events.length} Events at this Location
                        </h3>
                        ${group.events.map(event => `
                          <div style="
                            margin-bottom: 12px; 
                            padding: 12px; 
                            border-radius: 8px; 
                            background: linear-gradient(145deg, #FFF5E6 0%, #FFF8F1 100%);
                            border: 1px solid #E58A3C20;
                            cursor: pointer;
                          " onclick="window.selectEvent(${event.id})">
                            <div style="font-weight: 600; color: #6B2C0F; margin-bottom: 6px;">${event.name}</div>
                            <div style="color: #8B4513; font-size: 14px; margin-bottom: 4px;">📍 ${event.venue}</div>
                            <div style="color: #8B4513; font-size: 14px; margin-bottom: 4px;">📅 ${event.date}</div>
                            <div style="color: #8B4513; font-size: 14px;">👥 ${event.attendees?.toLocaleString() || 0} attendees</div>
                          </div>
                        `).join('')}
                      </div>
                    `;
                    
                    window.selectEvent = (eventId) => {
                      const selectedEvent = group.events.find(e => e.id === eventId);
                      if (selectedEvent) {
                        handleInMapMarkerClick(selectedEvent);
                        mapRef.current.closePopup();
                      }
                    };
                    
                    const popup = L.popup({
                      maxWidth: 320,
                      className: 'custom-popup'
                    })
                    .setLatLng([group.lat, group.lng])
                    .setContent(popupContent)
                    .openOn(mapRef.current);
                  }
                }
              }}
              event={primaryEvent}
            />
          );
        })}
        
        {/* Regular Coffee Markers (hidden when numbered markers are shown) */}
        {!showNumbers && groupedEvents.map((group, index) => {
          const primaryEvent = group.events[0]; // Use first event for primary display
          const eventCount = group.events.length;
          
          console.log('Rendering coffee marker for:', primaryEvent.name, 'showNumbers:', showNumbers);
          
          return (
            <CoffeeMarker
              key={`group-${group.lat}-${group.lng}-${index}`}
              event={primaryEvent}
              position={[group.lat, group.lng]}
              onClick={() => {
                console.log('CoffeeMarker clicked:', primaryEvent.name, 'eventCount:', eventCount);
                if (eventCount === 1) {
                  handleInMapMarkerClick(primaryEvent);
                } else {
                  // Handle multiple events - show popup at marker location
                  if (mapRef.current) {
                    const popupContent = `
                      <div style="font-family: Poppins, sans-serif; min-width: 280px;">
                        <h3 style="margin: 0 0 12px 0; color: #6B2C0F; font-size: 16px; font-weight: 600;">
                          ${eventCount} Events at this Location
                        </h3>
                        ${group.events.map(event => `
                          <div style="
                            margin-bottom: 12px; 
                            padding: 12px; 
                            border-radius: 8px; 
                            background: linear-gradient(145deg, #FFF5E6 0%, #FFF8F1 100%);
                            border: 1px solid #E58A3C20;
                            cursor: pointer;
                          " onclick="window.selectEvent(${event.id})">
                            <div style="font-weight: 600; color: #6B2C0F; margin-bottom: 6px;">${event.name}</div>
                            <div style="color: #8B4513; font-size: 14px; margin-bottom: 4px;">📍 ${event.venue}</div>
                            <div style="color: #8B4513; font-size: 14px; margin-bottom: 4px;">📅 ${event.date}</div>
                            <div style="color: #8B4513; font-size: 14px;">👥 ${event.attendees?.toLocaleString() || 0} attendees</div>
                          </div>
                        `).join('')}
                      </div>
                    `;
                    
                    // Expose selectEvent function globally for popup clicks
                    window.selectEvent = (eventId) => {
                      const selectedEvent = group.events.find(e => e.id === eventId);
                      if (selectedEvent) {
                        handleInMapMarkerClick(selectedEvent);
                        mapRef.current.closePopup();
                      }
                    };
                    
                    const popup = L.popup({
                      maxWidth: 320,
                      className: 'custom-popup'
                    })
                    .setLatLng([group.lat, group.lng])
                    .setContent(popupContent)
                    .openOn(mapRef.current);
                  }
                }
              }}
              onMouseOver={(payload) => onMarkerMouseOver({
                ...primaryEvent,
                latitude: primaryEvent.lat,
                longitude: primaryEvent.lng,
                latlng: { lat: primaryEvent.lat, lng: primaryEvent.lng }
              })}
              onMouseOut={onMarkerMouseOut}
              isSelected={selectedEvent && group.events.some(e => e.id === selectedEvent.id)}
              isHovered={hoveredEvent && group.events.some(e => e.id === hoveredEvent.id)}
              isFeatured={primaryEvent.featured || false}
              mapZoom={2}
              showAsCard={true}
              eventCount={eventCount}
            />
          );
        })}
      </MapContainer>
      
      {/* In-Map Event Details */}
      <InMapEventDetails
        event={selectedInMapEvent}
        position={selectedEventPosition}
        isOpen={inMapDetailsOpen}
        onClose={closeInMapDetails}
        mapRef={mapRef}
      />
    </div>
  );
});

export default MapWithMarkers;