import React from 'react';
import './EventDetailsModal.css';

const EventDetailsModal = ({ event, isOpen, onClose }) => {
  if (!isOpen || !event) return null;

  return (
    <div className="event-modal-overlay" onClick={onClose}>
      <div className="event-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="event-modal-close" onClick={onClose}>
          ×
        </button>
        
        <div className="event-modal-header">
          <h2 className="event-modal-title">{event.name}</h2>
          <div className="event-modal-status">
            <span className={`status-badge ${event.status?.toLowerCase()}`}>
              {event.status}
            </span>
          </div>
        </div>

        <div className="event-modal-body">
          <div className="event-detail-grid">
            <div className="event-detail-item">
              <div className="detail-icon">📍</div>
              <div className="detail-content">
                <div className="detail-label">Location</div>
                <div className="detail-value">
                  {event.venue && <div>{event.venue}</div>}
                  <div>{event.city}, {event.country}</div>
                </div>
              </div>
            </div>

            <div className="event-detail-item">
              <div className="detail-icon">📅</div>
              <div className="detail-content">
                <div className="detail-label">Date</div>
                <div className="detail-value">{event.date}</div>
              </div>
            </div>

            {event.attendees && (
              <div className="event-detail-item">
                <div className="detail-icon">👥</div>
                <div className="detail-content">
                  <div className="detail-label">Attendees</div>
                  <div className="detail-value">{event.attendees.toLocaleString()}</div>
                </div>
              </div>
            )}

            {event.type && (
              <div className="event-detail-item">
                <div className="detail-icon">☕</div>
                <div className="detail-content">
                  <div className="detail-label">Event Type</div>
                  <div className="detail-value">{event.type}</div>
                </div>
              </div>
            )}

            {event.featured && (
              <div className="event-detail-item">
                <div className="detail-icon">⭐</div>
                <div className="detail-content">
                  <div className="detail-label">Special</div>
                  <div className="detail-value">Featured Event</div>
                </div>
              </div>
            )}
          </div>

          {event.description && (
            <div className="event-description">
              <h3>About this Event</h3>
              <p>{event.description}</p>
            </div>
          )}

          <div className="event-modal-actions">
            {event.registrationLink && event.status === 'UPCOMING' && (
              <a 
                href={event.registrationLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="action-btn primary"
              >
                Register Now
              </a>
            )}
            {event.highlightsLink && event.status === 'PAST' && (
              <a 
                href={event.highlightsLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="action-btn secondary"
              >
                View Highlights
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;