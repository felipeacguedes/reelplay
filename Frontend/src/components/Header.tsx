import { Link } from 'react-router-dom'
import type { AuthUser } from '../App'

interface Props {
  user: AuthUser | null
  token: string | null
  login: (username: string) => Promise<void>
  logout: () => void
}

function Header({ user, login, logout }: Props) {
  async function handleLogin() {
    const username = prompt('Digite seu username:')
    if (!username?.trim()) return
    try {
      await login(username.trim())
    } catch {
      alert('Erro ao fazer login.')
    }
  }

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
              <button className="auth-btn" onClick={handleLogin}>Entrar</button>
            )}
          </div>
        </nav>
      </div>
      <p className="tagline">Seu próximo filme favorito, sorteado.</p>
    </header>
  )
}

export default Header