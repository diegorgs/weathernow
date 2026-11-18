import { useState, useEffect, useCallback, useRef } from 'react'
import { getCitySuggestions, getWeather } from '../../services/api'
import { getWeatherIconUrl } from '../../utils/weatherIcons'

// ── tipos ────────────────────────────────────────────────────────────────────

interface FavoriteCity {
    id: string
    name: string
    displayName: string
    latitude: number
    longitude: number
}

interface CityWeather {
    temp: number
    condition: string
    iconUrl: string
}

interface Suggestion {
    name: string
    admin1?: string
    country?: string
    latitude: number
    longitude: number
}

// ── helpers ──────────────────────────────────────────────────────────────────

function getWeatherCondition(code: number): string {
    if (code === 0) return 'Céu limpo'
    if (code === 1) return 'Principalmente limpo'
    if (code === 2) return 'Parcialmente nublado'
    if (code === 3) return 'Nublado'
    if (code === 45 || code === 48) return 'Neblina'
    if (code >= 51 && code <= 57) return 'Chuvisco'
    if (code >= 61 && code <= 67) return 'Chuva'
    if (code >= 71 && code <= 77) return 'Neve'
    if (code >= 80 && code <= 82) return 'Pancadas de chuva'
    if (code >= 85 && code <= 86) return 'Pancadas de neve'
    if (code >= 95) return 'Trovoada'
    return 'Parcialmente nublado'
}

function getFavoritesKey(userId: number | string): string {
    return `weather_now_favorites_${userId}`
}

function loadFavorites(userId: number | string): FavoriteCity[] {
    try {
        const raw = localStorage.getItem(getFavoritesKey(userId))
        return raw ? (JSON.parse(raw) as FavoriteCity[]) : []
    } catch {
        return []
    }
}

function saveFavorites(userId: number | string, cities: FavoriteCity[]): void {
    localStorage.setItem(getFavoritesKey(userId), JSON.stringify(cities))
}

// ── componente ───────────────────────────────────────────────────────────────

function FavoriteCities() {
    const [user, setUser] = useState<{ id: number; name: string } | null>(null)
    const [favorites, setFavorites] = useState<FavoriteCity[]>([])
    const [weatherMap, setWeatherMap] = useState<Record<string, CityWeather>>({})
    const [adding, setAdding] = useState(false)
    const [input, setInput] = useState('')
    const [suggestions, setSuggestions] = useState<Suggestion[]>([])
    const [suggestionsLoading, setSuggestionsLoading] = useState(false)
    const [addError, setAddError] = useState('')
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)

    // Lê usuário logado
    useEffect(() => {
        try {
            const raw = localStorage.getItem('weather_now_user')
            if (raw) setUser(JSON.parse(raw) as { id: number; name: string })
        } catch {
            setUser(null)
        }
    }, [])

    // Carrega favoritos ao ter usuário
    useEffect(() => {
        if (!user) return
        setFavorites(loadFavorites(user.id))
    }, [user])

    // Fecha dropdown ao clicar fora
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setSuggestions([])
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Busca clima de cada cidade favorita
    const fetchWeatherForCities = useCallback(async (cities: FavoriteCity[]) => {
        const hour = new Date().getHours()
        const results: Record<string, CityWeather> = {}
        await Promise.all(
            cities.map(async (city) => {
                try {
                    const data = await getWeather(city.latitude, city.longitude)
                    const temp = Math.round(data.current.temperature_2m)
                    const condition = getWeatherCondition(data.current.weather_code)
                    const iconUrl = getWeatherIconUrl(condition.toLowerCase(), hour)
                    results[city.id] = { temp, condition, iconUrl }
                } catch {
                    results[city.id] = { temp: 0, condition: 'Desconhecido', iconUrl: '' }
                }
            })
        )
        setWeatherMap((prev) => ({ ...prev, ...results }))
    }, [])

    useEffect(() => {
        if (favorites.length > 0) fetchWeatherForCities(favorites)
    }, [favorites, fetchWeatherForCities])

    // Busca sugestões com debounce
    function handleInputChange(value: string) {
        setInput(value)
        setAddError('')
        if (debounceRef.current) clearTimeout(debounceRef.current)
        if (!value.trim()) { setSuggestions([]); return }
        setSuggestionsLoading(true)
        debounceRef.current = setTimeout(async () => {
            try {
                const results = await getCitySuggestions(value)
                setSuggestions(results.slice(0, 5) as Suggestion[])
            } catch {
                setSuggestions([])
            } finally {
                setSuggestionsLoading(false)
            }
        }, 350)
    }

    // Selecionar sugestão
    function handleSelectSuggestion(s: Suggestion) {
        if (!user) return
        const id = `${s.latitude}_${s.longitude}`
        if (favorites.some((f) => f.id === id)) {
            setAddError('Essa cidade já está na lista.')
            setSuggestions([])
            setInput('')
            return
        }
        const newCity: FavoriteCity = {
            id,
            name: s.name,
            displayName: s.admin1 ? `${s.name}, ${s.admin1}` : s.name,
            latitude: s.latitude,
            longitude: s.longitude,
        }
        const updated = [...favorites, newCity]
        setFavorites(updated)
        saveFavorites(user.id, updated)
        setInput('')
        setSuggestions([])
        setAdding(false)
    }

    function handleRemove(cityId: string) {
        if (!user) return
        const updated = favorites.filter((f) => f.id !== cityId)
        setFavorites(updated)
        saveFavorites(user.id, updated)
    }

    // ── render ────────────────────────────────────────────────────────────────

    return (
        <section className="section-box" style={{ marginTop: '20px' }}>
            <div className="section-head">
                <h3>Meus locais</h3>
                {user && (
                    <button
                        onClick={() => { setAdding((v) => !v); setAddError(''); setInput(''); setSuggestions([]) }}
                        style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: adding ? 'var(--text-muted)' : '#fff',
                            background: adding ? 'transparent' : 'var(--accent, #3b82f6)',
                            border: adding ? '1px solid var(--border-soft)' : 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            padding: '4px 12px',
                        }}
                    >
                        {adding ? '✕ Cancelar' : '+ Adicionar cidade'}
                    </button>
                )}
            </div>

            {/* Formulário com autocomplete */}
            {adding && user && (
                <div ref={wrapperRef} style={{ position: 'relative', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => handleInputChange(e.target.value)}
                            placeholder="Digite o nome da cidade..."
                            style={{
                                flex: 1,
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid var(--border-soft)',
                                background: 'var(--bg-panel-strong)',
                                color: 'var(--text-primary)',
                                fontSize: '14px',
                            }}
                        />
                    </div>

                    {/* Dropdown de sugestões — abre para cima para não empurrar layout */}
                    {(suggestions.length > 0 || suggestionsLoading) && (
                        <div style={{
                            position: 'absolute',
                            bottom: '100%',
                            left: 0,
                            right: 0,
                            background: 'var(--bg-panel-strong)',
                            border: '1px solid var(--border-soft)',
                            borderRadius: '8px',
                            boxShadow: '0 -4px 16px rgba(0,0,0,0.12)',
                            zIndex: 100,
                            overflow: 'hidden',
                            marginBottom: '4px',
                        }}>
                            {suggestionsLoading && (
                                <div style={{ padding: '10px 14px', fontSize: '13px', color: 'var(--text-muted)' }}>
                                    Buscando...
                                </div>
                            )}
                            {suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    onMouseDown={() => handleSelectSuggestion(s)}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        width: '100%',
                                        padding: '10px 14px',
                                        background: 'none',
                                        border: 'none',
                                        borderBottom: i < suggestions.length - 1 ? '1px solid var(--border-soft)' : 'none',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        color: 'var(--text-primary)',
                                        fontSize: '14px',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-soft)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                                >
                                    <span style={{ fontWeight: 500 }}>{s.name}</span>
                                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                        {s.admin1 ?? s.country ?? ''}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {addError && (
                <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '8px' }}>
                    {addError}
                </p>
            )}

            {/* Não logado */}
            {!user && (
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', padding: '8px 0' }}>
                    <a href="/login" style={{ color: 'var(--accent)' }}>Entre na sua conta</a> para salvar cidades favoritas.
                </p>
            )}

            {/* Lista vazia */}
            {user && favorites.length === 0 && !adding && (
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', padding: '8px 0' }}>
                    Nenhuma cidade salva ainda. Clique em "+ Adicionar cidade" para começar.
                </p>
            )}

            {/* Cards de favoritos */}
            {favorites.length > 0 && (
                <div className="favorites-row">
                    {favorites.map((city) => {
                        const wx = weatherMap[city.id]
                        return (
                            <div key={city.id} className="favorite-card" style={{ position: 'relative' }}>
                                <button
                                    onClick={() => handleRemove(city.id)}
                                    title="Remover"
                                    style={{
                                        position: 'absolute',
                                        top: '6px',
                                        right: '6px',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: 'var(--text-muted)',
                                        fontSize: '14px',
                                        lineHeight: 1,
                                        padding: '2px 4px',
                                    }}
                                >
                                    ✕
                                </button>
                                <div>
                                    <div style={{ textTransform: 'uppercase', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                                        {city.name}
                                    </div>
                                    <div style={{ fontSize: '28px', fontWeight: 700, marginTop: '4px' }}>
                                        {wx ? `${wx.temp}°` : '…'}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {wx?.iconUrl ? (
                                        <img src={wx.iconUrl} alt={wx.condition} width={40} height={40} />
                                    ) : (
                                        <span style={{ fontSize: '24px', opacity: 0.4 }}>⋯</span>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </section>
    )
}

export default FavoriteCities
