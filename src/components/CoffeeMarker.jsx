import React, { useMemo } from 'react';
import L from 'leaflet';
import { Marker } from 'react-leaflet';
import './PremiumMapElements.css';

// Module-level cache for icons
const iconCache = new Map();

const makeSVG = (event, isFeatured, isLargeView, width, height, imageWidth, imageHeight, eventCount = 1) => {
  // Make all cards square with beautiful styling
  const size = isLargeView ? 100 : 70;
  const squareWidth = size;
  const squareHeight = size;
  const borderRadius = 20;
  
  // Beautiful branding colors
  const colors = {
    primary: '#8B4513',
    secondary: '#D2691E', 
    accent: '#CD853F',
    cream: '#F5DEB3',
    foam: '#FFF8DC',
    dark: '#4A2C2A',
    upcoming: '#10B981',
    past: '#6B7280',
    featured: '#F59E0B'
  };
  
  return `
      <svg width="${squareWidth}" height="${squareHeight}" viewBox="0 0 ${squareWidth} ${squareHeight}" xmlns="http://www.w3.org/2000/svg" 
           class="beautiful-coffee-card ${isFeatured ? 'featured-card' : ''} ${isLargeView ? 'large-card' : ''}">
        <defs>
          <!-- Beautiful square card clip path with rounded corners -->
          <clipPath id="cardClip-${event.id}">
            <rect x="4" y="4" width="${squareWidth - 8}" height="${squareHeight - 8}" rx="${borderRadius}" ry="${borderRadius}"/>
          </clipPath>
          
          <!-- Premium shadow with coffee-inspired colors -->
          <filter id="premiumShadow-${event.id}" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="6"/>
            <feOffset dx="0" dy="4" result="offset"/>
            <feFlood flood-color="${colors.primary}" flood-opacity="0.15"/>
            <feComposite in2="offset" operator="in"/>
            <feMerge> 
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
          
          <!-- Beautiful overlay gradient for text readability -->
          <linearGradient id="textOverlay-${event.id}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:rgba(74, 44, 42, 0);stop-opacity:0" />
            <stop offset="60%" style="stop-color:rgba(74, 44, 42, 0.3);stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgba(74, 44, 42, 0.85);stop-opacity:1" />
          </linearGradient>
          
          <!-- Coffee gradient for status indicators -->
          <linearGradient id="coffeeGradient-${event.id}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <!-- Beautiful card background with premium styling -->
        <rect x="4" y="4" width="${squareWidth - 8}" height="${squareHeight - 8}" 
              rx="${borderRadius}" ry="${borderRadius}" 
              fill="${colors.foam}" 
              stroke="${colors.cream}" 
              stroke-width="2"
              filter="url(#premiumShadow-${event.id})"/>
        
        <!-- City photo with enhanced clipping -->
        <foreignObject x="4" y="4" width="${squareWidth - 8}" height="${squareHeight - 8}" clip-path="url(#cardClip-${event.id})">
          <div xmlns="http://www.w3.org/1999/xhtml" 
               style="width:100%;height:100%;background:${colors.cream};position:relative;overflow:hidden;">
            <img src="${event.image}" 
                 alt="${event.city}" 
                 style="width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.3s ease;" />
            <div style="position:absolute;bottom:0;left:0;right:0;height:60%;background:linear-gradient(to bottom, transparent 0%, rgba(74, 44, 42, 0.8) 100%);"></div>
          </div>
        </foreignObject>
        
        <!-- Count badge for multiple events -->
        ${eventCount > 1 ? `
        <circle cx="${squareWidth - 15}" cy="15" 
                r="12" 
                fill="${colors.featured}" 
                stroke="${colors.foam}" 
                stroke-width="2"/>
        
        <text x="${squareWidth - 15}" y="20" text-anchor="middle"
              fill="${colors.foam}" font-family="'Poppins', sans-serif" 
              font-size="11" font-weight="700">
              ${eventCount}</text>
        ` : `
        <!-- Beautiful status indicator -->
        <rect x="${squareWidth - 32}" y="8" 
              width="24" height="16" 
              rx="12" ry="12" 
              fill="url(#coffeeGradient-${event.id})" 
              opacity="0.95"/>
        
        <circle cx="${squareWidth - 20}" cy="16" 
                r="3" 
                fill="${event.status === 'UPCOMING' ? colors.foam : colors.cream}"/>
        `}
        
        <!-- Event type indicator with coffee theme -->
        <rect x="8" y="8" 
              width="32" height="18" 
              rx="9" ry="9" 
              fill="${
                event.type === 'tasting' ? colors.secondary : 
                event.type === 'workshop' ? colors.primary : 
                event.type === 'competition' ? colors.featured : colors.accent
              }" 
              opacity="0.9"/>
        
        <text x="24" y="20" text-anchor="middle"
              fill="${colors.foam}" font-family="'Poppins', sans-serif" 
              font-size="8" font-weight="600" 
              style="letter-spacing: 0.5px;">
              ${event.type.toUpperCase().substr(0, 3)}</text>
        
        ${isLargeView ? `
        <!-- Beautiful attendee count for large cards -->
        <rect x="${squareWidth - 40}" y="${squareHeight - 28}" 
              width="32" height="20" 
              rx="10" ry="10" 
              fill="rgba(74, 44, 42, 0.9)"/>
        
        <text x="${squareWidth - 24}" y="${squareHeight - 14}" text-anchor="middle"
              fill="${colors.foam}" font-family="'Poppins', sans-serif" 
              font-size="9" font-weight="600">
              ${event.attendees > 999 ? (event.attendees/1000).toFixed(1) + 'K' : event.attendees}</text>
        ` : ''}
        
        <!-- Beautiful city name with enhanced styling -->
        <rect x="8" y="${squareHeight - 26}" 
              width="${squareWidth - 16}" 
              height="18" 
              rx="9" ry="9" 
              fill="rgba(74, 44, 42, 0.92)"/>
        
        <text x="16" y="${squareHeight - 14}" 
              fill="${colors.foam}" font-family="'Poppins', sans-serif" 
              font-size="${isLargeView ? 11 : 9}" font-weight="600" 
              style="letter-spacing: -0.025em;">
              ${event.city}</text>
      </svg>
    `;
};

const getCachedIcon = (event, isFeatured = false, isZoomed = false, mapZoom = 2, forceCard = false, eventCount = 1) => {
  const isLargeView = forceCard || (isZoomed && mapZoom >= 3);
  // Square dimensions
  const size = isLargeView ? 100 : 70;
  const squareWidth = size;
  const squareHeight = size;
  
  const key = `coffee-square-${event.id}-${isFeatured ? 1 : 0}-${isLargeView ? 'L' : 'S'}-${forceCard ? 'C' : 'N'}-count${eventCount}`;
  if (iconCache.has(key)) return iconCache.get(key);
  
  const html = makeSVG(event, isFeatured, isLargeView, squareWidth, squareHeight, squareWidth - 8, squareHeight - 8, eventCount);
  const icon = L.divIcon({
    html,
    className: 'beautiful-coffee-marker',
    iconSize: [squareWidth, squareHeight],
    iconAnchor: [squareWidth / 2, squareHeight],
    popupAnchor: [0, -squareHeight + 10]
  });
  iconCache.set(key, icon);
  return icon;
};

const CoffeeMarker = ({ 
  event, 
  position, 
  onClick, 
  onMouseOver, 
  onMouseOut, 
  isSelected, 
  isHovered, 
  isFeatured, 
  isZoomed, 
  mapZoom,
  showAsCard = false,
  eventCount = 1
}) => {
  // Always show as card if showAsCard is true, or if zoomed/selected/hovered
  const shouldShowAsCard = showAsCard || isZoomed || isSelected || isHovered;
  
  const icon = useMemo(() => getCachedIcon(
    event, 
    isFeatured || event.featured, 
    shouldShowAsCard, 
    mapZoom,
    showAsCard,
    eventCount
  ), [event.id, isFeatured, shouldShowAsCard, mapZoom, showAsCard, eventCount]);

  return (
    <Marker 
      position={position} 
      icon={icon}
      eventHandlers={{
        click: () => onClick?.(event),
        mouseover: (e) => {
          const element = e.target.getElement();
          if (element) {
            element.style.transform = 'scale(1.1) translateY(-6px)';
            element.style.zIndex = '1000';
            element.style.transition = 'all 0.3s ease';
            // Add tooltip on hover
            element.title = eventCount > 1 
              ? `${eventCount} events at this location` 
              : `${event.name} - ${event.city}, ${event.country}`;
          }
          // Provide a small payload to the interaction handler
          onMouseOver?.({ id: event.id, latlng: e.latlng, event });
        },
        mouseout: (e) => {
          const element = e.target.getElement();
          if (element) {
            element.style.transform = 'scale(1) translateY(0)';
            element.style.zIndex = '999';
          }
          onMouseOut?.();
        }
      }}
    />
  );
};

export default CoffeeMarker;