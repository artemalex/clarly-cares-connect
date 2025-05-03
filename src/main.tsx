
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Check if we have the GTM script in the head and inject it properly
const injectGTMScript = () => {
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
};

// When the DOM is ready, render our app and inject the GTM script
document.addEventListener('DOMContentLoaded', () => {
  injectGTMScript();
});

createRoot(document.getElementById("root")!).render(<App />);
