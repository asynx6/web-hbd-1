import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import BirthdayWeb from './BirthdayWeb.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BirthdayWeb />
  </StrictMode>,
)
