import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clapperboard } from 'lucide-react'
import { API } from '../App'
import type { AuthUser } from '../App'

interface Props {
  onLogin: (user: AuthUser, token: string) => void
}

function LoginPage({ onLogin }: Props) {
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin() {
    if (!username.trim()) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      })

      if (!res.ok) {
        const data = await res.json() as { error: string }
        throw new Error(data.error)
      }

      const data = await res.json() as { token: string; user: AuthUser }
      onLogin(data.user, data.token)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <div className="login-box">
        <h1 className="login-title"><Clapperboard size={28} /> Reelplay</h1>
        <p className="login-subtitle">Digite seu username para entrar</p>

        <input
          className="login-input"
          type="text"
          placeholder="username"
          value={username}
          autoFocus
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />

        {error && <p className="error">{error}</p>}

        <button
          className="login-btn"
          onClick={handleLogin}
          disabled={loading || !username.trim()}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </div>
    </main>
  )
}

export default LoginPage