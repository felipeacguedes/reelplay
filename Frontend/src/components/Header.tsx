import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Clapperboard, Bookmark, User, LogOut, ArrowLeft } from 'lucide-react'
import type { AuthUser } from '../App'

interface Props {
  user: AuthUser | null
  token: string | null
  logout: () => void
  hasMovie?: boolean
  onHome?: () => void
}

function Header({ user, logout, hasMovie, onHome }: Props) {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const showNavbar = !isHome || hasMovie
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const userMenu = user ? (
    <div className="user-menu" ref={menuRef}>
      <button className="user-menu__trigger" onClick={() => setMenuOpen((v) => !v)}>
        <User size={16} /> {user.name}
      </button>
      {menuOpen && (
        <div className="user-menu__dropdown">
          <Link to="/watchlist" className="user-menu__item" onClick={() => setMenuOpen(false)}>
            <Bookmark size={14} /> Watchlist
          </Link>
          <button className="user-menu__item" onClick={() => { setMenuOpen(false); logout(); }}>
            <LogOut size={14} /> Sair
          </button>
        </div>
      )}
    </div>
  ) : null

  if (!showNavbar) {
    return (
      <header className="header-top-right">
        <nav className="nav">
          {userMenu}
          {!user && (
            <button className="auth-btn" onClick={() => navigate('/login')}>Entrar</button>
          )}
        </nav>
      </header>
    )
  }

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className={`back-btn ${(!isHome || hasMovie) ? '' : 'back-btn--hidden'}`}
          onClick={() => isHome ? onHome?.() : navigate(-1)}
        >
          <ArrowLeft size={16} />
        </button>
        <a href="/" className="logo-link" onClick={(e) => { e.preventDefault(); onHome?.(); }}>
          <h1 className="logo"><Clapperboard size={26} /> Reelplay</h1>
        </a>
      </div>
      <nav className="nav">
        {userMenu}
        {!user && (
          <button className="auth-btn" onClick={() => navigate('/login')}>Entrar</button>
        )}
      </nav>
    </header>
  )
}

export default Header