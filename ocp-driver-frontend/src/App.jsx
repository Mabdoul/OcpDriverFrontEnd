import { useState } from 'react'
import { useSelector } from 'react-redux'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ClientOrderPage from './pages/client/ClientOrderPage'
import ChauffeurPage from './pages/chauffeur/ChauffeurPage'
import AuthNavbar from './components/layout/AuthNavbar'
import ToastHost from './components/ui/ToastHost'
import './App.css'

function App() {
  const [mode, setMode] = useState('login')
  const { token, role } = useSelector((state) => state.auth)

  // If user is logged in, redirect based on role
  if (token) {
    if (role === 'client')
      return (
        <>
          <ToastHost />
          <ClientOrderPage />
        </>
      )
    if (role === 'chauffeur')
      return (
        <>
          <ToastHost />
          <ChauffeurPage />
        </>
      )
  }

  return (
    <div className="auth-page">
      <ToastHost />
      <AuthNavbar mode={mode} onChange={setMode} />
      <main className="auth-main">
        {mode === 'login' ? <LoginPage /> : <RegisterPage onRegistered={() => setMode('login')} />}
      </main>
    </div>
  )
}

export default App
