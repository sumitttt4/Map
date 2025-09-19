import React, { useEffect, useState } from 'react';

const DebugOverlay = () => {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    // Override console methods to capture logs
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    console.log = (...args) => {
      setMessages(prev => [...prev, { type: 'log', content: args.map(arg => JSON.stringify(arg)).join(' ') }]);
      originalConsoleLog(...args);
    };
    
    console.error = (...args) => {
      setMessages(prev => [...prev, { type: 'error', content: args.map(arg => JSON.stringify(arg)).join(' ') }]);
      originalConsoleError(...args);
    };
    
    console.warn = (...args) => {
      setMessages(prev => [...prev, { type: 'warn', content: args.map(arg => JSON.stringify(arg)).join(' ') }]);
      originalConsoleWarn(...args);
    };
    
    // Clean up
    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '400px',
      maxHeight: '300px',
      overflowY: 'auto',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      zIndex: 9999,
      padding: '10px',
      fontFamily: 'monospace',
      fontSize: '12px'
    }}>
      <h3>Debug Console</h3>
      {messages.map((msg, i) => (
        <div 
          key={i} 
          style={{ 
            color: msg.type === 'error' ? 'red' : msg.type === 'warn' ? 'yellow' : 'white',
            marginBottom: '5px'
          }}
        >
          {msg.content}
        </div>
      ))}
    </div>
  );
};

export default DebugOverlay;