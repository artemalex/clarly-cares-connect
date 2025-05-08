
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Check if we have the GTM script in the head and inject it properly
const injectGTMScript = () => {
  try {
    const gtmScript = document.getElementById('gtm-script');
    if (gtmScript) {
      // Create a new script element
      const script = document.createElement('script');
      script.innerHTML = gtmScript.innerHTML;
      
      // Add it to the head
      document.head.appendChild(script);
      
      // Remove the original script element
      gtmScript.remove();
    }
  } catch (err) {
    console.error("Error injecting GTM script:", err);
  }
};

// Simply render the app - let the error boundaries handle errors
const renderApp = () => {
  try {
    const rootElement = document.getElementById("root");
    if (!rootElement) {
      console.error("Root element not found");
      return;
    }
    
    createRoot(rootElement).render(<App />);
  } catch (err) {
    console.error("Error rendering app:", err);
    // Create a minimal error display if rendering fails
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <h2>Something went wrong</h2>
          <p>There was an error loading the application</p>
          <button onclick="window.location.reload()">Reload Application</button>
        </div>
      `;
    }
  }
};

// When the DOM is ready, inject the GTM script and render our app
document.addEventListener('DOMContentLoaded', () => {
  injectGTMScript();
  renderApp();
});
