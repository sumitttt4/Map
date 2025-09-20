import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './components/MobileStyles.css'

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-error">
          <div className="error-container">
            <h2>Something went wrong</h2>
            <p>The application encountered an unexpected error.</p>
            <button onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}>
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)

// Clear the fallback loading screen
const fallbackElement = document.querySelector('.app-loading-fallback');
if (fallbackElement) {
  fallbackElement.style.display = 'none';
}