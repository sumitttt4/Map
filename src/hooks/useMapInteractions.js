import { useState, useRef, useCallback, useEffect } from 'react';
import L from 'leaflet';

// Named hook used across the app. Accepts (events, map) where map is a Leaflet map instance.
export const useMapInteractions = (events, map) => {
  const [isPathVisible, setIsPathVisible] = useState(false);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const previousView = useRef({ center: null, zoom: null });
  const hoverTimeout = useRef(null);
  const isAnimating = useRef(false);

  // Debounced hover handler
  const debouncedHover = useCallback((event, delay = 120) => {
    return new Promise((resolve) => {
      if (hoverTimeout.current) {
        clearTimeout(hoverTimeout.current);
      }
      hoverTimeout.current = setTimeout(() => {
        resolve(event);
      }, delay);
    });
  }, []);

  // Store original view before any hover interactions
  const storeOriginalView = useCallback(() => {
    if (map && !previousView.current.center) {
      previousView.current = {
        center: map.getCenter(),
        zoom: map.getZoom()
      };
    }
  }, [map]);

  // Handle marker/card hover
  const onMarkerMouseOver = useCallback(async (event) => {
    if (!map || !event || isAnimating.current) return;

    try {
      await debouncedHover(event);

      if (!previousView.current.center) {
        storeOriginalView();
      }

      isAnimating.current = true;
      setHoveredEvent(event);

      // More dynamic zoom based on current zoom level
      const currentZoom = map.getZoom();
      const targetZoom = currentZoom < 5 ? Math.min(currentZoom + 3, 8) : Math.min(currentZoom + 2, 12);
      const mapWidth = map.getSize().x;

      // Calculate adjusted latlng so marker appears ~20% from left
      const latlng = L.latLng(event.latitude ?? event.lat ?? event.latlng?.lat, event.longitude ?? event.lng ?? event.latlng?.lng);
      const point = map.latLngToContainerPoint(latlng);
      const adjustedPoint = L.point(point.x - mapWidth * 0.2, point.y);
      const adjustedLatLng = map.containerPointToLatLng(adjustedPoint);

      map.flyTo(adjustedLatLng, targetZoom, {
        duration: 0.5,
        easeLinearity: 0.2
      });

      // Reset animation flag after animation completes
      setTimeout(() => {
        isAnimating.current = false;
      }, 550);

    } catch (error) {
      console.warn('Hover interaction cancelled');
      isAnimating.current = false;
    }
  }, [map, debouncedHover, storeOriginalView]);

  // Handle hover end
  const onMarkerMouseOut = useCallback(() => {
    if (!map || !previousView.current.center || isAnimating.current) return;

    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }

    isAnimating.current = true;
    setHoveredEvent(null);

    map.flyTo(previousView.current.center, previousView.current.zoom, {
      duration: 0.5,
      easeLinearity: 0.2
    });

    // Reset animation flag and clear stored view
    setTimeout(() => {
      isAnimating.current = false;
      previousView.current = { center: null, zoom: null };
    }, 550);
  }, [map]);

  // Handle card hover (same as marker hover)
  const onCardHover = useCallback((event) => {
    onMarkerMouseOver(event);
  }, [onMarkerMouseOver]);

  // Generate path coordinates from events
  const pathCoordinates = useCallback(() => {
    if (!events || events.length < 2) return [];

    // Sort events by date and extract coordinates
    const sortedEvents = [...events]
      .filter(e => (e.latitude || e.lat) && (e.longitude || e.lng))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return sortedEvents.map(ev => [ev.latitude ?? ev.lat, ev.longitude ?? ev.lng]);
  }, [events]);

  // Toggle path visibility
  const togglePath = useCallback(() => {
    setIsPathVisible(prev => !prev);
  }, []);

  const openCard = useCallback((payload) => {
    setHoveredEvent(payload);
  }, []);

  const closeCard = useCallback(() => {
    setHoveredEvent(null);
  }, []);

  // Handle touch interactions
  const onMarkerTouchStart = useCallback((event) => {
    if (!map || !event) return;

    const latlng = L.latLng(event.latitude ?? event.lat, event.longitude ?? event.lng);
    map.flyTo(latlng, 16, {
      duration: 0.8,
      easeLinearity: 0.3
    });

    setHoveredEvent(event);
  }, [map]);

  const onMarkerTouchEnd = useCallback(() => {
    if (!map || !previousView.current.center) return;

    map.flyTo(previousView.current.center, previousView.current.zoom, {
      duration: 0.8,
      easeLinearity: 0.3
    });

    setHoveredEvent(null);
  }, [map]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout.current) {
        clearTimeout(hoverTimeout.current);
      }
    };
  }, []);

  return {
    // State
    isPathVisible,
    hoveredEvent,
    pathCoordinates: pathCoordinates(),

    // Handlers
    onMarkerMouseOver,
    onMarkerMouseOut,
    onCardHover,
    togglePath,
    openCard,
    closeCard,
    onMarkerTouchStart,
    onMarkerTouchEnd,

    // Utilities
    isAnimating: () => isAnimating.current
  };
};