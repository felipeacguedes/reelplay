import { Link, useNavigate } from 'react-router-dom'
import type { AuthUser } from '../App'

interface Props {
  user: AuthUser | null
  token: string | null
  logout: () => void
}

function Header({ user, logout }: Props) {
  const navigate = useNavigate()

  return (
    <header className="header">
      <div className="header-top">
        <Link to="/" className="logo-link">
          <h1 className="logo">🎬 Reelplay</h1>
        </Link>
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
      </div>
      <p className="tagline">Seu próximo filme favorito, sorteado.</p>
    </header>
  )
}

export default Header