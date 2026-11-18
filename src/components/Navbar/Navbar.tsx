import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCityCoordinates, getCitySuggestions } from '../../services/api'
import { CityContext } from '../../context/city-context'

type AuthUser = {
    id: number
    name: string
    email: string
}

function Navbar() {
    const [searchOpen, setSearchOpen] = useState(false)
    const [city, setCity] = useState('')
    const [searchError, setSearchError] = useState('')
    const [suggestions, setSuggestions] = useState<any[]>([])
    const [user, setUser] = useState<AuthUser | null>(null)
    const [menuOpen, setMenuOpen] = useState(false)
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        const savedTheme = localStorage.getItem('weather-now-theme')

        if (savedTheme) {
            return savedTheme === 'dark'
        }

        return window.matchMedia('(prefers-color-scheme: dark)').matches
    })

    const context = useContext(CityContext)
    const navigate = useNavigate()

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
        localStorage.setItem('weather-now-theme', darkMode ? 'dark' : 'light')
    }, [darkMode])

    useEffect(() => {
        const syncUser = () => {
            const storedUser = localStorage.getItem('weather_now_user')

            if (!storedUser) {
                setUser(null)
                return
            }

            try {
                setUser(JSON.parse(storedUser) as AuthUser)
            } catch {
                setUser(null)
            }
        }

        syncUser()
        window.addEventListener('storage', syncUser)

        return () => window.removeEventListener('storage', syncUser)
    }, [])

    useEffect(() => {
        const trimmedCity = city.trim()

        if (trimmedCity.length < 2) {
            setSuggestions([])
            return
        }

        const timeout = setTimeout(async () => {
            try {
                const results = await getCitySuggestions(trimmedCity)
                // Preserva a posição de scroll ao atualizar sugestões
                const scrollY = window.scrollY
                setSuggestions(results)
                requestAnimationFrame(() => {
                    window.scrollTo({ top: scrollY, behavior: 'instant' })
                })
            } catch {
                setSuggestions([])
            }
        }, 300)

        return () => clearTimeout(timeout)
    }, [city])

    async function searchCity() {
        const query = city.trim()

        if (!query) {
            setSearchError('Digite um local para buscar.')
            return
        }

        const result = await getCityCoordinates(query)

        if (!result || !context) {
            setSearchError('Nenhum lugar encontrado. Tente outra cidade, estado ou país.')
            return
        }

        const nextCity = {
            name: result.name,
            latitude: result.latitude,
            longitude: result.longitude,
        }

        context.setCity(nextCity)

        const history = JSON.parse(localStorage.getItem('weather_now_history') ?? '[]')
        const filtered = history.filter((item: { name: string }) => item.name !== result.name)
        filtered.unshift({ name: result.name, latitude: result.latitude, longitude: result.longitude })
        localStorage.setItem('weather_now_history', JSON.stringify(filtered.slice(0, 6)))

        setSearchError('')
        setCity('')
        setSuggestions([])
        setSearchOpen(false)
    }

    function handleSuggestionClick(result: any) {
        if (!context || !result) {
            return
        }

        context.setCity({
            name: result.name,
            latitude: result.latitude,
            longitude: result.longitude,
        })

        const history = JSON.parse(localStorage.getItem('weather_now_history') ?? '[]')
        const filtered = history.filter((item: { name: string }) => item.name !== result.name)
        filtered.unshift({ name: result.name, latitude: result.latitude, longitude: result.longitude })
        localStorage.setItem('weather_now_history', JSON.stringify(filtered.slice(0, 6)))

        setCity('')
        setSuggestions([])
        setSearchError('')
        setSearchOpen(false)
    }

    function handleLogout() {
        localStorage.removeItem('weather_now_token')
        localStorage.removeItem('weather_now_user')
        setUser(null)
        setMenuOpen(false)
        navigate('/login')
    }

    return (
        <header
            className="sticky top-0 z-50 border-b backdrop-blur-sm"
            style={{
                borderColor: darkMode ? 'rgba(148, 163, 184, 0.14)' : '#e2e8f0',
                background: darkMode ? 'rgba(15, 23, 42, 0.76)' : 'rgba(255, 255, 255, 0.8)',
            }}
        >
            <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => document.getElementById('clima')?.scrollIntoView({ behavior: 'smooth' })}
                        className="flex items-center gap-2 text-sm font-semibold"
                        style={{ color: darkMode ? '#e2e8f0' : '#0f172a', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                        <span
                            className="flex h-9 w-9 items-center justify-center rounded-full text-lg shadow-sm"
                            style={{ background: darkMode ? 'rgba(56, 189, 248, 0.12)' : '#e0f2fe' }}
                        >
                            ☀️
                        </span>
                        <span>Weather Now</span>
                    </button>
                </div>

                <div
                    className="hidden items-center gap-6 text-sm md:flex"
                    style={{ color: darkMode ? '#cbd5e1' : '#475569' }}
                >
                    {['clima','hora','semana','mapa','noticias'].map((id, i) => (
                        <button key={id} type="button"
                            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
                            className="transition hover:text-sky-600"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', color: 'inherit' }}
                        >
                            {['Clima','Horário','Semanal','Mapa','Notícias'][i]}
                        </button>
                    ))}
                </div>

                <div className="relative flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setDarkMode((current) => !current)}
                        onMouseEnter={(event) => {
                            event.currentTarget.style.background = darkMode ? 'rgba(14, 116, 144, 0.22)' : '#e0f2fe'
                            event.currentTarget.style.borderColor = darkMode ? 'rgba(56, 189, 248, 0.5)' : '#bae6fd'
                            event.currentTarget.style.transform = 'translateY(-1px)'
                            event.currentTarget.style.boxShadow = darkMode ? '0 8px 16px rgba(14, 165, 233, 0.18)' : '0 8px 16px rgba(14, 165, 233, 0.12)'
                        }}
                        onMouseLeave={(event) => {
                            event.currentTarget.style.background = darkMode ? 'rgba(15, 23, 42, 0.8)' : '#f8fafc'
                            event.currentTarget.style.borderColor = darkMode ? 'rgba(148,163,184,0.18)' : '#e2e8f0'
                            event.currentTarget.style.transform = 'translateY(0)'
                            event.currentTarget.style.boxShadow = 'none'
                        }}
                        className="rounded-full border px-3 py-2 text-xs font-semibold transition-all duration-200"
                        style={{
                            borderColor: darkMode ? 'rgba(148,163,184,0.18)' : '#e2e8f0',
                            background: darkMode ? 'rgba(15, 23, 42, 0.8)' : '#f8fafc',
                            color: darkMode ? '#e2e8f0' : '#0f172a',
                            transition: 'all 0.2s ease',
                        }}
                        aria-label="Alternar tema"
                    >
                        {darkMode ? '☀️ Claro' : '🌙 Escuro'}
                    </button>

                    <form
                        className={`${searchOpen ? 'flex' : 'hidden'} flex-col gap-2 md:flex`}
                        onSubmit={(event) => {
                            event.preventDefault()
                            searchCity()
                        }}
                    >
                        <div className="relative">
                            <div
                                className="flex items-center gap-2 rounded-full border px-3 py-2"
                                style={{
                                    borderColor: darkMode ? 'rgba(148,163,184,0.18)' : '#e2e8f0',
                                    background: darkMode ? 'rgba(15, 23, 42, 0.8)' : '#f8fafc',
                                }}
                            >
                                <input
                                    type="text"
                                    placeholder="Buscar cidade, país ou região"
                                    value={city}
                                    onChange={(event) => {
                                        setCity(event.target.value)
                                        if (searchError) setSearchError('')
                                    }}
                                    className="w-52 bg-transparent text-sm outline-none md:w-64"
                                    style={{
                                        color: darkMode ? '#e2e8f0' : '#0f172a',
                                    }}
                                />
                            </div>

                            {suggestions.length > 0 && (
                                <ul
                                    className="absolute left-0 top-full z-20 mt-2 w-full min-w-[240px] overflow-hidden rounded-2xl border shadow-xl"
                                    style={{
                                        borderColor: darkMode ? 'rgba(148,163,184,0.18)' : '#e2e8f0',
                                        background: darkMode ? '#0f172a' : '#ffffff',
                                        boxShadow: darkMode ? '0 8px 24px rgba(2, 6, 23, 0.45)' : '0 8px 24px rgba(15, 23, 42, 0.08)',
                                    }}
                                >
                                    {suggestions.map((result) => (
                                        <li key={`${result.name}-${result.latitude}-${result.longitude}`}>
                                            <button
                                                type="button"
                                                onClick={() => handleSuggestionClick(result)}
                                                onMouseEnter={(event) => {
                                                    event.currentTarget.style.background = darkMode ? 'rgba(14, 116, 144, 0.18)' : '#f0f9ff'
                                                    event.currentTarget.style.color = darkMode ? '#f8fafc' : '#0f172a'
                                                    event.currentTarget.style.transform = 'translateX(2px)'
                                                }}
                                                onMouseLeave={(event) => {
                                                    event.currentTarget.style.background = darkMode ? 'rgba(15, 23, 42, 0.9)' : '#ffffff'
                                                    event.currentTarget.style.color = darkMode ? '#e2e8f0' : '#334155'
                                                    event.currentTarget.style.transform = 'translateX(0)'
                                                }}
                                                className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-all duration-200"
                                                style={{
                                                    color: darkMode ? '#e2e8f0' : '#334155',
                                                    background: darkMode ? 'rgba(15, 23, 42, 0.9)' : '#ffffff',
                                                    transition: 'all 0.2s ease',
                                                }}
                                            >
                                                <span>{result.name}</span>
                                                <span style={{ color: darkMode ? '#94a3b8' : '#94a3b8' }}>
                                                    {result.country ?? 'Local'}
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {searchError && (
                            <p className="text-xs text-red-500">{searchError}</p>
                        )}
                    </form>

                    <button
                        type="button"
                        onClick={() => setSearchOpen(!searchOpen)}
                        onMouseEnter={(event) => {
                            event.currentTarget.style.borderColor = darkMode ? 'rgba(56, 189, 248, 0.65)' : '#bae6fd'
                            event.currentTarget.style.background = darkMode ? 'rgba(14, 116, 144, 0.18)' : '#f0f9ff'
                            event.currentTarget.style.color = '#0284c7'
                            event.currentTarget.style.transform = 'translateY(-1px)'
                        }}
                        onMouseLeave={(event) => {
                            event.currentTarget.style.borderColor = darkMode ? 'rgba(148,163,184,0.18)' : '#e2e8f0'
                            event.currentTarget.style.background = darkMode ? 'rgba(15, 23, 42, 0.8)' : '#f8fafc'
                            event.currentTarget.style.color = darkMode ? '#e2e8f0' : '#0f172a'
                            event.currentTarget.style.transform = 'translateY(0)'
                        }}
                        className="rounded-full border px-3 py-2 text-xs font-medium transition-all duration-200"
                        style={{
                            borderColor: darkMode ? 'rgba(148,163,184,0.18)' : '#e2e8f0',
                            background: darkMode ? 'rgba(15, 23, 42, 0.8)' : '#f8fafc',
                            color: darkMode ? '#e2e8f0' : '#0f172a',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        Buscar
                    </button>

                    {user ? (
                        <div className="user-menu-wrap">
                            <button
                                type="button"
                                className="user-menu-button"
                                onClick={() => setMenuOpen((current) => !current)}
                            >
                                <span className="user-avatar">👤</span>
                                <span>{user.name.split(' ')[0]}</span>
                                <span className="user-chevron">{menuOpen ? '▴' : '▾'}</span>
                            </button>

                            {menuOpen && (
                                <div className="user-menu-dropdown">
                                    <div className="user-menu-header">
                                        <span className="user-avatar">👤</span>
                                        <div>
                                            <strong>{user.name}</strong>
                                            <small>{user.email}</small>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="user-menu-item"
                                        onClick={() => {
                                            setMenuOpen(false)
                                            navigate('/configuracoes')
                                        }}
                                    >
                                        Configurações
                                    </button>
                                    <button
                                        type="button"
                                        className="user-menu-item danger"
                                        onClick={handleLogout}
                                    >
                                        Sair
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            onMouseEnter={(event) => {
                                event.currentTarget.style.background = '#0369a1'
                                event.currentTarget.style.transform = 'translateY(-1px)'
                                event.currentTarget.style.boxShadow = '0 10px 18px rgba(2, 132, 199, 0.28)'
                            }}
                            onMouseLeave={(event) => {
                                event.currentTarget.style.background = '#0284c7'
                                event.currentTarget.style.transform = 'translateY(0)'
                                event.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0)'
                            }}
                            className="rounded-full px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200"
                            style={{
                                background: '#0284c7',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            Entrar
                        </button>
                    )}
                </div>
            </nav>
        </header>
    )
}

export default Navbar
