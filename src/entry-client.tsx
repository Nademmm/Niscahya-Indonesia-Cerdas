import { hydrateRoot } from 'react-dom/client'
import { HydratedRouter } from 'react-router/dom'
import { AppProvider } from './context/AppContext'
import './index.css'

hydrateRoot(document, (
  <AppProvider>
    <HydratedRouter />
  </AppProvider>
))