import React, { useState, useEffect } from 'react';
import './InMapEventDetails.css';

const InMapEventDetails = ({ event, position, isOpen, onClose, mapRef }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen && event && position && mapRef?.current) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 50);

      mapRef.current.setView(position, Math.max(mapRef.current.getZoom(), 6), {
        animate: true,
        duration: 0.8
      });
    } else {
      setIsAnimating(false);
      setTimeout(() => {
        setIsVisible(false);
      }, 300);
    }
  }, [isOpen, event, position, mapRef]);

  if (!isVisible || !event) return null;

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    return status === 'UPCOMING' ? '#E58A3C' : '#8B4513';
  };

  return (
    <div className={`in-map-event-details-overlay ${isAnimating ? 'open' : 'closed'}`}>
      <div className="in-map-event-details">
        <button 
          className="in-map-close-btn" 
          onClick={onClose}
          aria-label="Close event details"
        >
          ✕
        </button>

        <div className="in-map-header">
          <div className="in-map-image-container">
            <img 
              src={event.image} 
              alt={event.name}
              className="in-map-event-image"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=500&q=60';
              }}
            />
            <div 
              className="in-map-status-badge"
              style={{ backgroundColor: getStatusColor(event.status) }}
            >
              {event.status}
            </div>
          </div>
          
          <div className="in-map-title-section">
            <h3 className="in-map-event-title">{event.name}</h3>
            <p className="in-map-event-location">
              {event.city}, {event.country}
            </p>
          </div>
        </div>

        <div className="in-map-details-grid">
          <div className="in-map-detail-item">
            <div className="in-map-detail-icon">📅</div>
            <div className="in-map-detail-content">
              <div className="in-map-detail-label">Date</div>
              <div className="in-map-detail-value">{formatDate(event.date)}</div>
            </div>
          </div>

          <div className="in-map-detail-item">
            <div className="in-map-detail-icon">📍</div>
            <div className="in-map-detail-content">
              <div className="in-map-detail-label">Venue</div>
              <div className="in-map-detail-value">{event.venue || 'TBA'}</div>
            </div>
          </div>

          <div className="in-map-detail-item">
            <div className="in-map-detail-icon">👥</div>
            <div className="in-map-detail-content">
              <div className="in-map-detail-label">Attendees</div>
              <div className="in-map-detail-value">
                {event.attendees?.toLocaleString() || '0'} people
              </div>
            </div>
          </div>

          <div className="in-map-detail-item">
            <div className="in-map-detail-icon">☕</div>
            <div className="in-map-detail-content">
              <div className="in-map-detail-label">Type</div>
              <div className="in-map-detail-value">
                {event.type?.charAt(0).toUpperCase() + event.type?.slice(1) || 'Conference'}
              </div>
            </div>
          </div>
        </div>

        {event.description && (
          <div className="in-map-description">
            <h4>About this Event</h4>
            <p>{event.description}</p>
          </div>
        )}

        <div className="in-map-actions">
          {event.status === 'UPCOMING' && event.registrationLink && (
            <a 
              href={event.registrationLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="in-map-btn primary"
            >
              📝 Register Now
            </a>
          )}
          
          {event.status === 'PAST' && event.highlightsLink && (
            <a 
              href={event.highlightsLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="in-map-btn secondary"
            >
              🎥 View Highlights
            </a>
          )}
          
          <button 
            className="in-map-btn tertiary"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: event.name,
                  text: `Check out ${event.name} in ${event.city}!`,
                  url: window.location.href
                });
              } else {
                navigator.clipboard.writeText(`${event.name} in ${event.city} - ${window.location.href}`);
              }
            }}
          >
            🔗 Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default InMapEventDetails;