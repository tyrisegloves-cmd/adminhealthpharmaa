import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '../src/index.css'; // Share the tailwind / custom styles

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
