import { Link, useNavigate, useLocation } from 'react-router-dom'
import type { AuthUser } from '../App'

interface Props {
  user: AuthUser | null
  token: string | null
  logout: () => void
  hasMovie?: boolean
}

function Header({ user, logout, hasMovie }: Props) {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const showFull = !isHome || hasMovie

  if (!showFull) {
    return (
      <header className="header-top-right">
        <nav className="nav">
          {user && <Link to="/watchlist" className="nav-link">📋 Watchlist</Link>}
          <div className="auth-area">
            {user ? (
              <div className="user-info">
                <span className="username">👤 {user.name}</span>
                <button className="auth-btn" onClick={logout}>Sair</button>
              </div>
            ) : (
              <button className="auth-btn" onClick={() => navigate('/login')}>Entrar</button>
            )}
          </div>
        </nav>
      </header>
    )
  }

  return (
    <header className="navbar">
      <div className="navbar-left">
        {!isHome && (
          <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        )}
        <Link to="/" className="logo-link">
          <h1 className="logo">🎬 Reelplay</h1>
        </Link>
      </div>
      <nav className="nav">
        {user && <Link to="/watchlist" className="nav-link">📋 Watchlist</Link>}
        <div className="auth-area">
          {user ? (
            <div className="user-info">
              <span className="username">👤 {user.name}</span>
              <button className="auth-btn" onClick={logout}>Sair</button>
            </div>
          ) : (
            <button className="auth-btn" onClick={() => navigate('/login')}>Entrar</button>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header