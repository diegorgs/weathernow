import { getWeatherIconUrl } from '../../utils/weatherIcons'

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

function WeatherCard({ temperature, condition, label = 'Agora', metric = null }: WeatherCardProps) {
    const hourMatch = label.match(/(\d{1,2})/)
    const hour = hourMatch ? Number(hourMatch[1]) : new Date().getHours()
    const isNight = hour >= 18 || hour <= 5
    const iconUrl = getWeatherIconUrl(condition, hour)

    const cardStyle = isNight ? {
        background: 'linear-gradient(135deg, #07172b 0%, #0b1f3b 30%, #123663 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)'
    } : undefined

    const cardClassName = `weather-left${isNight ? ' night-weather-card' : ''}`

    if (metric) {
        return (
            <div className={cardClassName} style={cardStyle}>
                <div className="topline">
                    <span>{label}</span>
                </div>

                <div className="weather-temp-row">
                    <span className="weather-temp">{metric.value}</span>
                    <img src={metric.icon} alt={metric.label} className="weather-icon-svg" width={80} height={80} />
                </div>


                <div className="weather-subtitle">{metric.label}</div>
                <div className="weather-feel">Condição: {condition}</div>
            </div>
        )
    }

    return (
        <div className={cardClassName} style={cardStyle}>
            <div className="topline">
                <span>{label}</span>
            </div>

            <div className="weather-temp-row">
                <span className="weather-temp">{temperature}°</span>
                <img src={iconUrl} alt={condition} className="weather-icon-svg" width={80} height={80} />
            </div>

            <div className="weather-subtitle">{condition}</div>
            <div className="weather-feel">Sensação {Math.round(temperature + 1)}°</div>
        </div>
    )
}

export default WeatherCard


