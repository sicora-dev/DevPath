import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import ContextProvider from './context/Context.jsx'
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from '@vercel/analytics/react';

createRoot(document.getElementById('root')).render(
  <ContextProvider>
    <App />
    <SpeedInsights />
    <Analytics />
  </ContextProvider>,
)
