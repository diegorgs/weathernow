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

const weatherIcons: Record<string, string> = {
    claro: '☀️',
    'céu limpo': '☀️',
    'principalmente limpo': '🌤️',
    'parcialmente nublado': '⛅',
    nublado: '☁️',
    chuva: '🌧️',
    'pancadas de chuva': '🌦️',
    trovoada: '⛈️',
    neblina: '🌫️',
    neve: '❄️',
}

function WeatherCard({ temperature, condition, label = 'Agora', metric = null }: WeatherCardProps) {
    const icon = weatherIcons[condition.toLowerCase()] ?? '☀️'

    if (metric) {
        return (
            <div className="weather-left">
                <div className="topline">
                    <span>{label}</span>
                    <span>{metric.icon}</span>
                </div>

                <div className="weather-temp-row">
                    <span className="weather-temp">{metric.value}</span>
                    <span className="weather-icon">{metric.icon}</span>
                </div>

                <div className="weather-subtitle">{metric.label}</div>
                <div className="weather-feel">Condição: {condition}</div>
            </div>
        )
    }

    return (
        <div className="weather-left">
            <div className="topline">
                <span>{label}</span>
                <span>{icon}</span>
            </div>

            <div className="weather-temp-row">
                <span className="weather-temp">{temperature}°</span>
                <span className="weather-icon">{icon}</span>
            </div>

            <div className="weather-subtitle">{condition}</div>
            <div className="weather-feel">Sensação {Math.round(temperature + 1)}°</div>
        </div>
    )
}

export default WeatherCard


