export default function AuthNavbar({ mode, onChange }) {
  return (
    <header className="auth-navbar">
      <div className="auth-navbar-inner">
        <div className="brand">
          <span className="brand-mark">OCP</span>
          <span className="brand-text">Driver</span>
        </div>
        <nav className="nav-links">
          <button
            type="button"
            className={`nav-link ${mode === 'login' ? 'active' : ''}`}
            onClick={() => onChange('login')}
          >
            Connexion
          </button>
          <button
            type="button"
            className={`nav-link ${mode === 'register' ? 'active' : ''}`}
            onClick={() => onChange('register')}
          >
            Inscription
          </button>
        </nav>
      </div>
    </header>
  )
}


