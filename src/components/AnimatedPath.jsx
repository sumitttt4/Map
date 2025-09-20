import React from 'react';
import { Polyline } from 'react-leaflet';

export const AnimatedPath = ({ 
  coordinates, 
  isVisible, 
  color = '#E58A3C',
  weight = 3,
  opacity = 0.8 
}) => {
  if (!isVisible || coordinates.length < 2) return null;

  return (
    <Polyline
      positions={coordinates}
      pathOptions={{
        color: color,
        weight: weight,
        opacity: opacity,
        dashArray: '10, 10',
        className: 'animated-path'
      }}
    />
  );
};

// CSS for the animated path (add to your styles.css)
export const pathAnimationCSS = `
@keyframes draw-path {
  from {
    stroke-dashoffset: 100;
  }
  to {
    stroke-dashoffset: 0;
  }
}

.animated-path {
  animation: draw-path 1200ms ease-out;
  stroke-dasharray: 10, 10;
}
`;