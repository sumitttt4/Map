import React from 'react';

const FloatingCard = ({ event, onClose }) => {
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000]">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm w-80 floating-card">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-lg font-semibold text-gray-900 pr-2">
            {event.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>{event.city}, {event.country}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>{event.date}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span>👥</span>
            <span>{event.attendees.toLocaleString()} attendees</span>
          </div>
        </div>
        
        <div className="flex gap-2 mb-4">
          <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded">
            {event.type}
          </span>
          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
            {event.venue}
          </span>
          <span className={`px-2 py-1 text-xs rounded ${
            event.status === 'UPCOMING'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {event.status}
          </span>
        </div>
        
        {event.description && (
          <p className="text-sm text-gray-700">
            {event.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default FloatingCard;