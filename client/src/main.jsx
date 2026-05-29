import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { Toaster } from 'react-hot-toast'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '12px',
                padding: '14px 20px',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: {
                style: {
                  background: '#065f46',
                  color: '#ecfdf5',
                },
                iconTheme: { primary: '#34d399', secondary: '#065f46' }
              },
              error: {
                style: {
                  background: '#991b1b',
                  color: '#fef2f2',
                },
                iconTheme: { primary: '#fca5a5', secondary: '#991b1b' }
              },
            }}
          />
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
