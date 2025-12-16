import { useState } from 'react'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import AuthNavbar from './components/layout/AuthNavbar'
import './App.css'

function App() {
  const [mode, setMode] = useState('login')

  return (
    <div className="auth-page">
      <AuthNavbar mode={mode} onChange={setMode} />
      <main className="auth-main">
        {mode === 'login' ? <LoginPage /> : <RegisterPage />}
      </main>
    </div>
  )
}

export default App
