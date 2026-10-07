import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CityProvider } from './context/CityContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CityProvider>
        <App />
    </CityProvider>
</StrictMode>
)
