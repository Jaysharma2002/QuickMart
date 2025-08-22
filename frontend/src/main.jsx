import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LoaderProvider } from './context/ContextLoader.jsx'

createRoot(document.getElementById('root')).render(
    <LoaderProvider>
        <App />
    </LoaderProvider>
)
