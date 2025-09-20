
import React from 'react';

const FloatingEventCard = ({ event, onClose }) => {
  if (!event) return null;
  
  const getEventTypeIcon = (type) => {
    switch(type) {
      case 'tasting': return '☕';
      case 'workshop': return '🛠️';
      case 'competition': return '🏆';
      default: return '📅';
    }
  };

  const getEventTypeColor = (type) => {
    switch(type) {
      case 'tasting': return '#E58A3C';
      case 'workshop': return '#5F4339';
      case 'competition': return '#D04A2F';
      default: return '#362B1E';
    }
  };

  return (
    <div className="floating-overlay">
      <div className="floating-card-panel">
        <button className="floating-card-close" onClick={onClose} title="Close">×</button>
        
        {/* Event Header with Image and Basic Info */}
        <div className="event-header">
          <img className="event-thumbnail" src={event.image} alt={event.name} />
          <div className="event-basic-info">
            <div className="event-title">{event.name}</div>
            <div className="event-location">{event.city}, {event.country}</div>
            <div className="event-venue">📍 {event.venue}</div>
          </div>
        </div>

      {/* Event Type Badge */}
      <div className="event-type-container">
        <span 
          className="event-type-badge" 
          style={{ backgroundColor: getEventTypeColor(event.type) }}
        >
          {getEventTypeIcon(event.type)} {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
        </span>
        <span className={`event-status-badge ${event.status.toLowerCase()}`}>
          {event.status === 'PAST' ? 'PAST EVENT' : 'UPCOMING'}
        </span>
      </div>

      {/* Event Details Grid */}
      <div className="event-details-grid">
        <div className="detail-item">
          <span className="detail-icon">🗓️</span>
          <div className="detail-content">
            <div className="detail-label">Date & Time</div>
            <div className="detail-value">{event.date}</div>
          </div>
        </div>
        
        <div className="detail-item">
          <span className="detail-icon">👥</span>
          <div className="detail-content">
            <div className="detail-label">Attendees</div>
            <div className="detail-value">{event.attendees.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Event Description */}
      <div className="event-description">
        <div className="description-title">About this event</div>
        <div className="description-text">{event.description}</div>
        {event.detailedInfo && (
          <div className="description-detail">{event.detailedInfo}</div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="event-actions">
        {event.highlightsLink && (
          <a 
            href={event.highlightsLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="action-button primary"
          >
            🔗 View Highlights
          </a>
        )}
        <button 
          className="action-button secondary"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: event.name,
                text: `Check out ${event.name} in ${event.city}!`,
                url: window.location.href
              });
            }
          }}
        >
          📤 Share Event
        </button>
      </div>
      </div>
    </div>
  );
};

export default FloatingEventCard;
