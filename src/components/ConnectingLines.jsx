import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import './PremiumMapElements.css';

const ConnectingLines = ({ events, activeEvent }) => {
  const map = useMap();
  const linesRef = useRef([]);

  // Clean up lines on unmount
  useEffect(() => {
    return () => {
      linesRef.current.forEach(line => {
        if (map && line) {
          line.remove();
        }
      });
    };
  }, [map]);

  // Update lines when events or active event changes
  useEffect(() => {
    // Clear existing lines
    linesRef.current.forEach(line => {
      if (map && line) {
        line.remove();
      }
    });
    linesRef.current = [];

    if (!events || events.length < 2) return;

    // Sort events by date
    const sortedEvents = [...events].sort((a, b) => {
      const dateA = new Date(a.date.replace(/\s/g, ' ')).getTime();
      const dateB = new Date(b.date.replace(/\s/g, ' ')).getTime();
      return dateA - dateB;
    });

    // Draw connecting lines between consecutive events
    for (let i = 0; i < sortedEvents.length - 1; i++) {
      const start = L.latLng(sortedEvents[i].lat, sortedEvents[i].lng);
      const end = L.latLng(sortedEvents[i + 1].lat, sortedEvents[i + 1].lng);
      
      // Create a curved line if points are far enough apart
      const distance = start.distanceTo(end);
      
      if (distance > 500000) { // 500km threshold for curved lines
        // Create curved line with control point
        const midPoint = L.latLng(
          (start.lat + end.lat) / 2,
          (start.lng + end.lng) / 2
        );
        
        // Calculate control point for curve (perpendicular to midpoint)
        const latDiff = end.lat - start.lat;
        const lngDiff = end.lng - start.lng;
        const curveFactor = distance / 10000000; // Adjust curve based on distance
        
        const controlPoint = L.latLng(
          midPoint.lat + lngDiff * curveFactor,
          midPoint.lng - latDiff * curveFactor
        );
        
        // Since L.curve might not be working properly, we'll use a simpler approach
        // with a polyline with multiple points to simulate a curve
        const pathOptions = {
          color: '#E58A3C',
          weight: 2,
          opacity: 0.7,
          dashArray: '5, 5',
          className: 'event-connection'
        };
        
        // Create a curved effect with multiple points
        const curvePoints = [];
        const steps = 10; // Number of points to create the curve
        
        for (let step = 0; step <= steps; step++) {
          const t = step / steps;
          
          // Quadratic Bezier curve formula: B(t) = (1-t)²P0 + 2(1-t)tP1 + t²P2
          const lat = (1 - t) * (1 - t) * start.lat + 
                      2 * (1 - t) * t * controlPoint.lat + 
                      t * t * end.lat;
                      
          const lng = (1 - t) * (1 - t) * start.lng + 
                      2 * (1 - t) * t * controlPoint.lng + 
                      t * t * end.lng;
                      
          curvePoints.push([lat, lng]);
        }
        
        const polyline = L.polyline(curvePoints, pathOptions);
        polyline.addTo(map);
        linesRef.current.push(polyline);
      } else {
        // For shorter distances, use a straight line
        const polyline = L.polyline([start, end], {
          color: '#E58A3C',
          weight: 2,
          opacity: 0.7,
          dashArray: '5, 5',
          className: 'event-connection'
        });
        
        polyline.addTo(map);
        linesRef.current.push(polyline);
      }
    }
  }, [map, events, activeEvent]);

  return null;
};

export default ConnectingLines;