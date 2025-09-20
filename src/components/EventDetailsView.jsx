import React from 'react';

const EventDetailsView = ({ event, onClose }) => {
  if (!event) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="event-details-overlay">
      <div className="bento-event-card">
        {/* Close Button */}
        <button className="bento-close-btn" onClick={onClose} aria-label="Close details">
          ✕
        </button>
        
        {/* Event Image - small, top-left */}
        <div className="bento-image">
          <img src={event.image} alt={event.name} />
        </div>
        
        {/* City name and country */}
        <div className="bento-title-section">
          <h2 className="bento-title">{event.city}</h2>
          <div className="bento-country">{event.country}</div>
        </div>

        {/* Event Details with Icons */}
        <div className="bento-details">
          {/* Date/time with calendar icon */}
          <div className="bento-detail-row">
            <span className="bento-icon">🗓️</span>
            <span className="bento-text">{formatDate(event.date)}</span>
          </div>

          {/* Attendee count with people icon */}
          <div className="bento-detail-row">
            <span className="bento-icon">👥</span>
            <span className="bento-text">{event.attendees.toLocaleString()} attendees</span>
          </div>

          {/* Brief description with star icon */}
          <div className="bento-detail-row">
            <span className="bento-icon">⭐</span>
            <span className="bento-text">{event.type.charAt(0).toUpperCase() + event.type.slice(1)}, crypto, and coffee.</span>
          </div>

          {/* Event description with coffee icon */}
          <div className="bento-detail-row">
            <span className="bento-icon">☕</span>
            <span className="bento-text">{event.description.substring(0, 50)}...</span>
          </div>
        </div>

        {/* Simple status badge */}
        <div className="bento-status-section">
          <span className={`bento-status-badge ${event.status.toLowerCase()}`}>
            {event.status === 'PAST' ? 'PAST EVENT' : 'UPCOMING'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsView;