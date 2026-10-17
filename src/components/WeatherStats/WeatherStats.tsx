type WeatherStatsProps = {
    humidity: number
    windSpeed: number
    rainProbability: number
    visibility: number
    selectedMetric?: 'humidity' | 'wind' | 'rain' | 'visibility' | null
    onMetricSelect?: (metric: 'humidity' | 'wind' | 'rain' | 'visibility') => void
}

function WeatherStats({
    humidity,
    windSpeed,
    rainProbability,
    visibility,
    selectedMetric,
    onMetricSelect,
}: WeatherStatsProps) {
    const stats = [
        { key: 'humidity' as const, icon: '💧', label: 'Umidade', value: `${humidity}%` },
        { key: 'wind' as const, icon: '💨', label: 'Vento', value: `${windSpeed} km/h` },
        { key: 'rain' as const, icon: '🌧️', label: 'Chance de chuva', value: `${rainProbability}%` },
        { key: 'visibility' as const, icon: '👁️', label: 'Visibilidade', value: `${visibility} km` },
    ]

    return (
        <>
            {stats.map((stat) => (
                <button
                    key={stat.label}
                    type="button"
                    className={`weather-stat ${selectedMetric === stat.key ? 'selected' : ''}`}
                    onClick={() => onMetricSelect?.(stat.key)}
                    style={{ textAlign: 'left', cursor: 'pointer' }}
                >
                    <span className="icon">{stat.icon}</span>
                    <span className="label">{stat.label}</span>
                    <span className="value">{stat.value}</span>
                </button>
            ))}
        </>
    )
}

export default WeatherStats