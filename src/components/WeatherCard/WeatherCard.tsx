type WeatherCardProps = {
    temperature: number
    condition: string
    label?: string
    metric?: {
        label: string
        value: string
        icon: string
    } | null
}

const weatherVariants: Record<string, { day: string; night: string }> = {
    claro: { day: '☀️', night: '🌙' },
    'céu limpo': { day: '☀️', night: '🌙' },
    'principalmente limpo': { day: '🌤️', night: '🌙' },
    'parcialmente nublado': { day: '⛅', night: '☁️' },
    nublado: { day: '☁️', night: '☁️' },
    chuva: { day: '🌧️', night: '🌧️' },
    'pancadas de chuva': { day: '🌦️', night: '🌧️' },
    trovoada: { day: '⛈️', night: '⛈️' },
    neblina: { day: '🌫️', night: '🌫️' },
    neve: { day: '❄️', night: '❄️' },
}

function getWeatherIcon(condition: string, hour: number) {
    const key = condition.toLowerCase()
    const isNight = hour >= 18 || hour <= 5
    const variant = weatherVariants[key] ?? { day: '☀️', night: '🌙' }

    if (isNight) {
        return variant.night
    }

    return variant.day
}

function WeatherCard({ temperature, condition, label = 'Agora', metric = null }: WeatherCardProps) {
    const hourMatch = label.match(/(\d{1,2})/)
    const hour = hourMatch ? Number(hourMatch[1]) : new Date().getHours()
    const isNight = hour >= 18 || hour <= 5
    const icon = getWeatherIcon(condition, hour)

    const cardStyle = isNight ? {
        background: 'linear-gradient(135deg, #07172b 0%, #0b1f3b 30%, #123663 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)'
    } : undefined

    const textTone = isNight ? { color: '#e2e8f0' } : undefined
    const subTextTone = isNight ? { color: 'rgba(226, 232, 240, 0.8)' } : undefined
    const tempTone = isNight ? { color: '#f8fafc' } : undefined

    if (metric) {
        return (
            <div className="weather-left" style={cardStyle}>
                <div className="topline" style={subTextTone}>
                    <span>{label}</span>
                </div>

                <div className="weather-temp-row">
                    <span className="weather-temp" style={tempTone}>{metric.value}</span>
                    <span className="weather-icon" style={textTone}>{metric.icon}</span>
                </div>

                <div className="weather-subtitle" style={subTextTone}>{metric.label}</div>
                <div className="weather-feel" style={subTextTone}>Condição: {condition}</div>
            </div>
        )
    }

    return (
        <div className="weather-left" style={cardStyle}>
            <div className="topline" style={subTextTone}>
                <span>{label}</span>
            </div>

            <div className="weather-temp-row">
                <span className="weather-temp" style={tempTone}>{temperature}°</span>
                <span className="weather-icon" style={textTone}>{icon}</span>
            </div>

            <div className="weather-subtitle" style={subTextTone}>{condition}</div>
            <div className="weather-feel" style={subTextTone}>Sensação {Math.round(temperature + 1)}°</div>
        </div>
    )
}

export default WeatherCard


