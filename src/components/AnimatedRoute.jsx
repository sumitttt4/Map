import React, { useEffect, useRef } from 'react';
import { Polyline } from 'react-leaflet';

// Default-exported AnimatedRoute component.
// Adds/removes the CSS class 'animate-draw-route' on the underlying SVG path when visible.
export default function AnimatedRoute({ coordinates = [], isVisible = false, color = '#E58A3C', weight = 3, opacity = 0.85 }) {
  const ref = useRef(null);

  // Ensure the `animate-draw-route` class is applied correctly to the route
  useEffect(() => {
    const layer = ref.current && (ref.current.leafletElement || ref.current);
    const pathEl = layer && layer.getElement ? layer.getElement() : null;
    if (!pathEl) return;

    if (isVisible) {
      pathEl.classList.add('animate-draw-route');
      // Restart animation
      pathEl.getBoundingClientRect();
    } else {
      pathEl.classList.remove('animate-draw-route');
    }
  }, [isVisible, coordinates]);

  if (!coordinates || coordinates.length < 2) return null;

  return (
    <Polyline
      ref={ref}
      positions={coordinates}
      pathOptions={{ color, weight, opacity, dashArray: '8 6' }}
    />
  );
}