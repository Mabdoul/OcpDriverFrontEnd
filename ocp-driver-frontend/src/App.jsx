import { useState } from 'react'
import { useSelector } from 'react-redux'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ClientOrderPage from './pages/client/ClientOrderPage'
import ChauffeurPage from './pages/chauffeur/ChauffeurPage'
import AuthNavbar from './components/layout/AuthNavbar'
import 'leaflet/dist/leaflet.css'
import './App.css'

function App() {
  const [mode, setMode] = useState('login')
  const { token, role } = useSelector((state) => state.auth)

  return (
    <>
     

      {token ? (
        role === 'client' ? (
          <ClientOrderPage />
        ) : role === 'chauffeur' ? (
          <ChauffeurPage />
        ) : null
      ) : (
        <div className="auth-page">
          <AuthNavbar mode={mode} onChange={setMode} />
          <main className="auth-main">
            {mode === 'login' ? (
              <LoginPage />
            ) : (
              <RegisterPage onRegistered={() => setMode('login')} />
            )}
          </main>
        </div>
      )}
    </>
  )
}

export default App
