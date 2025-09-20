import React from 'react';
import espressoLogo from '../assets/espresso-square-logo.png';

const Header = ({ showNumbers = false, showRoute = false, onToggleNumbers, onToggleRoute }) => {
  return (
    <header className="app-header" style={{ height: '60px' }}>
      <div className="header-content">
        {/* Logo + title */}
        <div className="logo-corner">
          <div className="logo-container">
            <img src={espressoLogo} alt="Espresso Logo" className="corner-logo" />
          </div>
          <div className="brand-text-minimal">
            <h1 className="brand-title-minimal">Espresso World Map</h1>
          </div>
        </div>

        {/* Spacer to keep header minimal */}
        <div style={{ flex: 1 }} />

        {/* New minimal controls */}
        <div className="header-controls">
          <button
            onClick={onToggleNumbers}
            className={`nav-toggle-btn ${showNumbers ? 'active' : ''}`}
            aria-pressed={showNumbers}
            title="Show numbered markers"
          >
            {showNumbers ? 'Hide Numbers' : 'Show Numbers'}
          </button>

          <button
            onClick={onToggleRoute}
            className={`nav-toggle-btn ${showRoute ? 'active' : ''}`}
            aria-pressed={showRoute}
            title="Show route"
          >
            {showRoute ? 'Hide Route' : 'Show Route'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;