import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type AuthUser = {
  id: number
  name: string
  email: string
}

type AuthResponse = {
  access_token: string
  user: AuthUser
}

const DEMO_USERS_KEY = 'weather_now_demo_users'

function readDemoUsers(): AuthUser[] {
  const storedUsers = localStorage.getItem(DEMO_USERS_KEY)

  if (!storedUsers) {
    return []
  }

  try {
    return JSON.parse(storedUsers) as AuthUser[]
  } catch {
    return []
  }
}

function Login() {
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const normalizedEmail = email.trim().toLowerCase()
    const endpoint = isRegister ? 'http://localhost:8000/api/auth/register' : 'http://localhost:8000/api/auth/login'
    const payload = isRegister
      ? { name: name.trim(), email: normalizedEmail, password }
      : { email: normalizedEmail, password }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.detail || 'Erro ao autenticar o usuário.')
      }

      const authData = data as AuthResponse
      localStorage.setItem('weather_now_token', authData.access_token)
      localStorage.setItem('weather_now_user', JSON.stringify(authData.user))

      navigate('/')
      return
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro inesperado.'
      const isFetchFailure = err instanceof TypeError || message.toLowerCase().includes('fetch')

      if (isFetchFailure) {
        const savedUsers = readDemoUsers()

        if (isRegister) {
          const existingUser = savedUsers.some((user) => user.email === normalizedEmail)

          if (existingUser) {
            setError('Este e-mail já está cadastrado no modo local.')
            return
          }

          const demoUser: AuthUser = {
            id: Date.now(),
            name: name.trim() || 'Usuário',
            email: normalizedEmail,
          }

          savedUsers.push(demoUser)
          localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(savedUsers))
          localStorage.setItem('weather_now_token', 'demo-token')
          localStorage.setItem('weather_now_user', JSON.stringify(demoUser))
          navigate('/')
          return
        }

        const demoUser = savedUsers.find((user) => user.email === normalizedEmail)

        if (!demoUser) {
          setError('Servidor de autenticação indisponível. Crie uma conta primeiro para usar o modo local.')
          return
        }

        localStorage.setItem('weather_now_token', `demo-token-${demoUser.id}`)
        localStorage.setItem('weather_now_user', JSON.stringify(demoUser))
        navigate('/')
        return
      }

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-badge">WeatherNow</span>
          <h1>{isRegister ? 'Criar conta' : 'Entrar na conta'}</h1>
          <p>
            {isRegister
              ? 'Cadastre-se para salvar preferências e acompanhar o clima com sua conta.'
              : 'Acesse sua conta para continuar no painel do clima.'}
          </p>
        </div>

        <form className="auth-form" onSubmit={submitForm}>
          {isRegister && (
            <label>
              <span>Nome</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Seu nome"
                required
              />
            </label>
          )}

          <label>
            <span>E-mail</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seu@email.com"
              required
            />
          </label>

          <label>
            <span>Senha</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Carregando...' : isRegister ? 'Cadastrar' : 'Entrar'}
          </button>
        </form>

        <button
          type="button"
          className="auth-toggle"
          onClick={() => {
            setIsRegister((current) => !current)
            setError('')
          }}
        >
          {isRegister ? 'Já tenho conta' : 'Criar uma conta'}
        </button>
      </div>
    </div>
  )
}

export default Login
