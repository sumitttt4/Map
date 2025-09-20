import React, { useState } from 'react';

const LeftPanel = ({ 
  events, 
  onSelect, 
  onZoomAll, 
  onReset, 
  activeId,
  selectedEvent,
  filter,
  setFilter,
  onCardHover,
  onCardMouseOut
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'past', label: 'Past' },
    { key: 'upcoming', label: 'Upcoming' }
  ];

  return (
    <div className="left-panel">
      {/* Header */}
      <div className="left-panel-header">
        <p className="events-count-text">
          {events.length} {events.length === 1 ? 'event' : 'events'}
        </p>
      </div>

      {/* Filter Pills */}
      <div className="filter-section">
        <div className="filter-pills">
          {filterOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => setFilter(option.key)}
              className={`filter-pill ${filter === option.key ? 'active' : ''}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Utility Actions */}
      <div className="utility-actions">
        <div className="action-buttons-group">
          <button
            onClick={onZoomAll}
            className="action-btn zoom-btn"
          >
            <span>🔍</span>
            Zoom to Events
          </button>
          <button
            onClick={onReset}
            className="action-btn reset-btn"
          >
            <span>🌎</span>
            Reset View
          </button>
          
          {/* Dropdown Menu */}
          <div className="dropdown-container">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="dropdown-trigger"
            >
              <span>⋯</span>
            </button>
            
            {showDropdown && (
              <div className="dropdown-menu">
                <button className="dropdown-item">
                  📤 Export
                </button>
                <button className="dropdown-item">
                  📱 Share
                </button>
                <button className="dropdown-item">
                  ⚙️ Settings
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="events-list">
        {/* Selected Event Details */}
        {selectedEvent && (
          <div className="selected-event-details">
            <div className="selected-event-header">
              <img src={selectedEvent.image} alt={selectedEvent.name} className="selected-event-image" />
              <div className="selected-event-info">
                <h2 className="selected-event-title">{selectedEvent.name}</h2>
                <p className="selected-event-location">{selectedEvent.city}, {selectedEvent.country}</p>
                <span className={`selected-event-status ${selectedEvent.status === 'UPCOMING' ? 'upcoming' : 'past'}`}>
                  {selectedEvent.status}
                </span>
              </div>
            </div>
            
            <div className="selected-event-details-grid">
              <div className="detail-row">
                <span className="detail-icon">🗓️</span>
                <span className="detail-text">{selectedEvent.date}</span>
              </div>
              <div className="detail-row">
                <span className="detail-icon">👥</span>
                <span className="detail-text">{selectedEvent.attendees?.toLocaleString() || 0} attendees</span>
              </div>
              <div className="detail-row">
                <span className="detail-icon">📍</span>
                <span className="detail-text">{selectedEvent.venue}</span>
              </div>
              <div className="detail-row">
                <span className="detail-icon">⭐</span>
                <span className="detail-text">{selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}</span>
              </div>
            </div>
            
            <div className="selected-event-description">
              <p>{selectedEvent.description}</p>
            </div>
            
            <button 
              onClick={() => onSelect(null)} 
              className="close-details-btn"
            >
              ✕ Close Details
            </button>
          </div>
        )}
        
        <div className="events-container">
          {events.map((event) => (
            <div
              key={event.id}
              onClick={() => onSelect(event)}
              onMouseEnter={() => onCardHover?.(event)}
              onMouseLeave={() => onCardMouseOut?.()}
              className={`event-card ${activeId === event.id ? 'selected' : ''}`}
            >
              {/* Status Badge */}
              <div className="event-status-badge">
                <span className={`event-status ${event.status === 'UPCOMING' ? 'upcoming' : 'past'}`}>
                  {event.status}
                </span>
              </div>

              {/* Event Title */}
              <h3 className="event-card-title">
                {event.name}
              </h3>

              {/* Location & Date */}
              <div className="event-card-details">
                <div className="event-detail-item">
                  <span>📍</span>
                  <span>{event.city}, {event.country}</span>
                </div>
                <div className="event-detail-item">
                  <span>📅</span>
                  <span>{event.date}</span>
                </div>
              </div>

              {/* Attendees */}
              <div className="event-detail-item">
                <span>👥</span>
                <span>{event.attendees?.toLocaleString() || 0} attendees</span>
              </div>

              {/* Tags */}
              <div className="event-tags">
                <span className="event-tag type">
                  {event.type}
                </span>
                {event.venue && (
                  <span className="event-tag venue">
                    {event.venue}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Click outside handler for dropdown */}
      {showDropdown && (
        <div
          className="dropdown-overlay"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default LeftPanel;