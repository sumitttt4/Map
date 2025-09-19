import React from 'react';
import { events } from '../data/events';
import espressoSquareLogo from '../assets/espresso-square-logo.png';

const Sidebar = ({ filter, setFilter, isOpen, toggleSidebar, resetMapView, zoomToEvents }) => {
  const filteredEvents = filter === 'all' ? events : events.filter(event => event.type === filter);
  
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-content">
        <div className="sidebar-header">
            <div className="sidebar-title">
              <img src={espressoSquareLogo} alt="Espresso Square Logo" className="sidebar-logo" style={{ borderRadius: '8px', width: '30px', height: '30px', boxShadow: '0 2px 8px rgba(43,43,43,0.10)' }} />
              <h2>Espresso Events</h2>
            </div>
        </div>
        
        <div className="filter-buttons">
          <button 
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-button tasting-button ${filter === 'tasting' ? 'active' : ''}`}
            onClick={() => setFilter('tasting')}
          >
            Tastings
          </button>
          <button 
            className={`filter-button workshop-button ${filter === 'workshop' ? 'active' : ''}`}
            onClick={() => setFilter('workshop')}
          >
            Workshops
          </button>
          <button 
            className={`filter-button competition-button ${filter === 'competition' ? 'active' : ''}`}
            onClick={() => setFilter('competition')}
          >
            Competitions
          </button>
        </div>
        
        <div className="map-actions">
          <button className="action-button" onClick={zoomToEvents}>Zoom to Events</button>
          <button className="action-button" onClick={resetMapView}>Reset View</button>
        </div>
        
        <div className="event-legend">
          <div className="legend-item">
            <span className="legend-dot tasting-dot"></span>
            <span>Coffee Tasting</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot workshop-dot"></span>
            <span>Workshop</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot competition-dot"></span>
            <span>Competition</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot featured-dot"></span>
            <span>Featured Event</span>
          </div>
        </div>
        
        <div className="event-list">
          {filteredEvents.map(event => (
            <div className="event-card" key={event.id}>
              <div className="event-header">
                  <span className={`event-badge ${event.type}-badge ${event.isPast ? 'past' : 'upcoming'}`}>{event.type.toUpperCase()}</span>
                  <h3 className="event-name">{event.name}</h3>
                  <div className="event-date-location">
                    <div className="event-date-icon">
                      <span className="calendar-icon">📅</span>
                      <span>{event.date}</span>
                    </div>
                    <p className="event-location">{event.city}, {event.country}</p>
                  </div>
              </div>
              <div className="event-details">
                  <p className="event-attendees">{event.attendees} expected attendees</p>
                  <p className="event-description">Clubs, crypto, and coffee.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;