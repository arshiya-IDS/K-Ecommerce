import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './assets/style.css'

// Add sidebar toggle functionality
document.addEventListener('DOMContentLoaded', () => {
  const sidebarToggle = document.body.querySelector('#sidebarToggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', (event) => {
      event.preventDefault();
      document.body.classList.toggle('toggled');
      localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('toggled'));
    });
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)