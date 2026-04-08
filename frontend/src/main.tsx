import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';



export const authService = "http://localhost:5000";

createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <GoogleOAuthProvider clientId="500323250919-0cj6enb6plmc4j475q1mb99svupuaohl.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
