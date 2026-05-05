import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error.message + "\n" + error.stack };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'red', padding: '2rem', whiteSpace: 'pre-wrap', fontFamily: 'monospace', zIndex: 99999, position: 'relative', background: 'white', minHeight: '100vh' }}>
          <h2>Application Crash</h2>
          {this.state.message}
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>,
)
