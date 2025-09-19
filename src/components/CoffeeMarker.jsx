import React, { useState } from 'react';
import L from 'leaflet';
import { Marker } from 'react-leaflet';
import './PremiumMapElements.css';

const createCoffeeMarker = (event, isFeatured = false) => {
  // Create SVG with embedded photo
  const createSVG = (imageUrl) => {
    return `
      <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg" class="${isFeatured ? 'featured-marker' : ''}">
        <style>
          @keyframes steamUp { 0% { opacity: 0.7; transform: translateY(0); } 50% { opacity: 1; transform: translateY(-6px); } 100% { opacity: 0.7; transform: translateY(0); } }
          .steam { animation: steamUp 2s infinite ease-in-out; }
          .steam-2 { animation-delay: 0.5s; }
          .steam-3 { animation-delay: 1s; }
        </style>
        <!-- Handle -->
        <path d="M35 15C38 15 40 12 40 9C40 6 38 5 35 5C32 5 29 5 29 5L30 15C30 15 32 15 35 15Z" fill="#8B5A2B"/>
        <!-- Cup base -->
        <path d="M30 42C30 46.4183 24.6274 50 18 50C11.3726 50 6 46.4183 6 42L8 15H28L30 42Z" fill="${
          event.type === 'tasting' ? '#E58A3C' : 
          event.type === 'workshop' ? '#5F4339' : 
          event.type === 'competition' ? '#D04A2F' : '#362B1E'
        }"/>
        <path d="M6 15L5 8H29L28 15H6Z" fill="#A67C52"/>
        <!-- Cup rim -->
        <ellipse cx="17" cy="15" rx="12" ry="4" fill="#8B5A2B"/>
        <!-- Image placeholder (rounded-square) -->
        <rect x="10" y="20" width="16" height="16" rx="6" fill="white" stroke="#A67C52" stroke-width="1.5"/>
        <!-- Steam (animated) -->
        <path class="steam steam-1" d="M13 10C13 8 15 7 15 5C15 3 13 2 13 0" stroke="white" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.7"/>
        <path class="steam steam-2" d="M18 12C18 10 20 9 20 7C20 5 18 4 18 2" stroke="white" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.7"/>
        <path class="steam steam-3" d="M23 10C23 8 25 7 25 5C25 3 23 2 23 0" stroke="white" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.7"/>
        <!-- Image will be inserted here via foreignObject -->
        <foreignObject x="10" y="20" width="16" height="16">
          <div xmlns="http://www.w3.org/1999/xhtml">
            <img src="${imageUrl}" class="marker-image" alt="${event.city}" style="width:16px;height:16px;border-radius:6px;box-shadow:0 2px 8px rgba(43,43,43,0.12);object-fit:cover;border:2px solid #fff;" />
          </div>
        </foreignObject>
      </svg>
    `;
  };

  // Create custom icon
  return L.divIcon({
    html: createSVG(event.image),
    className: 'coffee-marker',
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -45]
  });
};

const CoffeeMarker = ({ event, position, onClick, isFeatured }) => {
  const [isHovered, setIsHovered] = useState(false);
  const icon = createCoffeeMarker(event, isFeatured || event.featured);

  return (
    <div
      className={`coffee-marker-wrapper${isHovered ? ' hovered' : ''}`}
      style={{ display: 'inline-block', transition: 'transform 0.2s', transform: isHovered ? 'scale(1.12) translateY(-4px)' : 'none' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Marker 
        position={position} 
        icon={icon}
        eventHandlers={{
          click: () => onClick(event)
        }}
      />
    </div>
  );
};

export default CoffeeMarker;