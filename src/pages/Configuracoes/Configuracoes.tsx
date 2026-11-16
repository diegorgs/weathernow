import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type UserData = {
  id: number
  name: string
  email: string
}

function Configuracoes() {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserData | null>(null)
  const [dailyEmailEnabled, setDailyEmailEnabled] = useState(false)
  const [dailyEmailHour, setDailyEmailHour] = useState('08:00')
  const [history, setHistory] = useState<Array<{ name: string; latitude: number; longitude: number }>>([])

  useEffect(() => {
    const storedUser = localStorage.getItem('weather_now_user')

    if (!storedUser) {
      navigate('/login')
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser) as UserData
      setUser(parsedUser)
    } catch {
      navigate('/login')
      return
    }

    const savedPreferences = localStorage.getItem('weather_now_preferences')
    if (savedPreferences) {
      try {
        const parsedPreferences = JSON.parse(savedPreferences)
        setDailyEmailEnabled(Boolean(parsedPreferences.dailyEmailEnabled))
        setDailyEmailHour(parsedPreferences.dailyEmailHour || '08:00')
      } catch {
        setDailyEmailEnabled(false)
        setDailyEmailHour('08:00')
      }
    }

    const storedHistory = localStorage.getItem('weather_now_history')
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory))
      } catch {
        setHistory([])
      }
    }
  }, [navigate])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const preferences = {
      dailyEmailEnabled,
      dailyEmailHour,
    }

    localStorage.setItem('weather_now_preferences', JSON.stringify(preferences))
    window.alert('Configurações salvas com sucesso!')
  }

  return (
    <div className="settings-page">
      <div className="settings-shell">
        <button type="button" className="settings-back-button" onClick={() => navigate('/')}>
          ← Voltar para o início
        </button>

        <div className="settings-header">
          <div>
            <span className="settings-eyebrow">Conta</span>
            <h1>Configurações do usuário</h1>
          </div>
          <div className="settings-user-pill">
            <span className="user-avatar large">👤</span>
            <div>
              <strong>{user?.name ?? 'Usuário'}</strong>
              <small>{user?.email ?? 'email@exemplo.com'}</small>
            </div>
          </div>
        </div>

        <div className="settings-grid">
          <section className="settings-card">
            <h2>Notificações por e-mail</h2>
            <form className="settings-form" onSubmit={handleSubmit}>
              <label className="switch-row">
                <div>
                  <span>Receber resumo diário do clima</span>
                  <small>Enviar um e-mail com o resumo do dia e a previsão.</small>
                </div>
                <input
                  type="checkbox"
                  checked={dailyEmailEnabled}
                  onChange={(event) => setDailyEmailEnabled(event.target.checked)}
                />
              </label>

              <label className="time-row">
                <span>Horário do envio</span>
                <input
                  type="time"
                  value={dailyEmailHour}
                  onChange={(event) => setDailyEmailHour(event.target.value)}
                  disabled={!dailyEmailEnabled}
                />
              </label>

              <button type="submit" className="settings-save-button">
                Salvar configurações
              </button>
            </form>
          </section>

          <section className="settings-card">
            <h2>Últimas cidades visitadas</h2>
            {history.length > 0 ? (
              <ul className="settings-history-list">
                {history.map((item, index) => (
                  <li key={`${item.name}-${index}`}>
                    <span>📍 {item.name}</span>
                    <small>Última sessão</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="settings-empty-state">
                Nenhuma cidade foi salva ainda. Faça uma busca para começar a registrar sua última sessão.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default Configuracoes
