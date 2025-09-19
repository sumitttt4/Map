import React from 'react';
import './PremiumMapElements.css';

const EventTimeline = ({ events, onEventSelect }) => {
  // Sort events by date (past to future)
  const sortedEvents = [...events].sort((a, b) => {
    // Convert dates to timestamps for comparison
    const dateA = new Date(a.date.replace(/\s/g, ' ')).getTime();
    const dateB = new Date(b.date.replace(/\s/g, ' ')).getTime();
    return dateA - dateB;
  });

  // Extract just the month and year for display
  const formatDate = (dateString) => {
    if (dateString.includes(',')) {
      // For dates like "20 Sep 2025, 4:00 pm"
      const parts = dateString.split(',')[0].split(' ');
      return `${parts[1]} ${parts[2]}`;
    }
    // For dates like "June 2023"
    return dateString;
  };

  return (
    <div className="event-timeline">
      <div className="timeline-line"></div>
      {sortedEvents.map((event, idx) => (
        <React.Fragment key={event.id}>
          <div 
            className="timeline-item"
            onClick={() => onEventSelect(event)}
            title={`${event.name} - ${event.city}, ${event.country}`}
          >
            <div className={`timeline-point ${event.type}`}></div>
            <div className="timeline-date">{formatDate(event.date)}</div>
            <div className="timeline-city">{event.city}</div>
          </div>
          {idx < sortedEvents.length - 1 && (
            <div className="timeline-connector"></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default EventTimeline;