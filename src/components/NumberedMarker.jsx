import React, { useMemo } from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';

const iconCache = new Map();

const makeHtml = (number, backgroundColor, size) => `
  <div class="numbered-marker">
    <div class="numbered-marker-inner" style="background-color: ${backgroundColor}; width: ${size}px; height: ${size}px; border-radius: ${size}px; display:flex;align-items:center;justify-content:center;font-weight:700;color:white;">
      ${number}
    </div>
  </div>
`;

export function getNumberedIcon(number, backgroundColor = '#E58A3C', size = 32) {
  const key = `num-${number}-${backgroundColor}-${size}`;
  if (iconCache.has(key)) return iconCache.get(key);
  const html = makeHtml(number, backgroundColor, size);
  const icon = L.divIcon({ html, className: 'numbered-marker-container', iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
  iconCache.set(key, icon);
  return icon;
}

export const NumberedMarker = ({ position, number, backgroundColor = '#E58A3C', onClick, event }) => {
  const icon = useMemo(() => getNumberedIcon(number, backgroundColor, 32), [number, backgroundColor]);
  return <Marker position={position} icon={icon} eventHandlers={{ click: () => onClick?.(event) }} />;
};