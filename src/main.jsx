import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { FavouritesProvider } from './context/FavouritesContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <FavouritesProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </FavouritesProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
