import { useContext, useEffect, useState } from 'react'
import { getCityCoordinates, getCitySuggestions } from '../../services/api'
import { CityContext } from '../../context/CityContext'

function Navbar() {
    const [searchOpen, setSearchOpen] = useState(false)
    const [city, setCity] = useState('')
    const [searchError, setSearchError] = useState('')
    const [suggestions, setSuggestions] = useState<any[]>([])
    const [darkMode, setDarkMode] = useState(false)

    const context = useContext(CityContext)

    useEffect(() => {
        const savedTheme = localStorage.getItem('weather-now-theme')
        const initialDark = savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches

        setDarkMode(initialDark)
        document.documentElement.setAttribute('data-theme', initialDark ? 'dark' : 'light')
    }, [])

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
        localStorage.setItem('weather-now-theme', darkMode ? 'dark' : 'light')
    }, [darkMode])

    useEffect(() => {
        const trimmedCity = city.trim()

        if (!trimmedCity || trimmedCity.length < 2) {
            setSuggestions([])
            return
        }

        const timeout = setTimeout(async () => {
            try {
                const results = await getCitySuggestions(trimmedCity)
                setSuggestions(results)
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

        context.setCity({
            name: result.name,
            latitude: result.latitude,
            longitude: result.longitude,
        })

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

        setCity('')
        setSuggestions([])
        setSearchError('')
        setSearchOpen(false)
    }

    return (
        <header
            className="border-b backdrop-blur-sm"
            style={{
                borderColor: darkMode ? 'rgba(148, 163, 184, 0.14)' : '#e2e8f0',
                background: darkMode ? 'rgba(15, 23, 42, 0.76)' : 'rgba(255, 255, 255, 0.8)',
            }}
        >
            <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
                <div className="flex items-center gap-3">
                    <a
                        href="/"
                        className="flex items-center gap-2 text-sm font-semibold"
                        style={{ color: darkMode ? '#e2e8f0' : '#0f172a' }}
                    >
                        <span
                            className="flex h-9 w-9 items-center justify-center rounded-full text-lg shadow-sm"
                            style={{ background: darkMode ? 'rgba(56, 189, 248, 0.12)' : '#e0f2fe' }}
                        >
                            ☀️
                        </span>
                        <span>Weather Now</span>
                    </a>
                </div>

                <div
                    className="hidden items-center gap-6 text-sm md:flex"
                    style={{ color: darkMode ? '#cbd5e1' : '#475569' }}
                >
                    <a href="/" className="transition hover:text-sky-600">Clima</a>
                    <a href="/Hora" className="transition hover:text-sky-600">Tempo</a>
                    <a href="/Semana" className="transition hover:text-sky-600">Previsão</a>
                    <a href="/Mapa" className="transition hover:text-sky-600">Calendário</a>
                </div>

                <div className="relative flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setDarkMode((current) => !current)}
                        className="rounded-full border px-3 py-2 text-xs font-semibold transition"
                        style={{
                            borderColor: darkMode ? 'rgba(148,163,184,0.18)' : '#e2e8f0',
                            background: darkMode ? 'rgba(15, 23, 42, 0.8)' : '#f8fafc',
                            color: darkMode ? '#e2e8f0' : '#0f172a',
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
                                                className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition"
                                                style={{
                                                    color: darkMode ? '#e2e8f0' : '#334155',
                                                    background: darkMode ? 'rgba(15, 23, 42, 0.9)' : '#ffffff',
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
                        className="rounded-full border px-3 py-2 text-xs font-medium transition hover:border-sky-300 hover:text-sky-600"
                        style={{
                            borderColor: darkMode ? 'rgba(148,163,184,0.18)' : '#e2e8f0',
                            background: darkMode ? 'rgba(15, 23, 42, 0.8)' : '#f8fafc',
                            color: darkMode ? '#e2e8f0' : '#0f172a',
                        }}
                    >
                        Buscar
                    </button>

                    <button
                        className="rounded-full px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-700"
                        style={{ background: '#0284c7' }}
                    >
                        Entrar
                    </button>
                </div>
            </nav>
        </header>
    )
}

export default Navbar
