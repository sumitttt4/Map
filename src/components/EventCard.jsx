import React from 'react';

const EventCard = ({ event, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`event-card ${isSelected ? 'selected' : ''}`}
    >
      <div className="event-card-header">
        <h3 className="event-card-title">
          {event.name}
        </h3>
        <span className={`event-status ${event.status.toLowerCase()}`}>
          {event.status}
        </span>
      </div>
      
      <div className="event-card-details">
        <div className="event-detail-item">
          <span>📍</span>
          <span>{event.city}, {event.country}</span>
        </div>
        
        <div className="event-detail-item">
          <span>📅</span>
          <span>{event.date}</span>
        </div>
        
        <div className="event-detail-item">
          <span>👥</span>
          <span>{event.attendees.toLocaleString()} attendees</span>
        </div>
      </div>
      
      <div className="event-tags">
        <span className="event-tag type">
          {event.type}
        </span>
        <span className="event-tag venue">
          {event.venue}
        </span>
      </div>
    </div>
  );
};

export default EventCard;