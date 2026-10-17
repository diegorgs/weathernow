type WeatherStatsProps = {
    temperature: number
    humidity: number
    windSpeed: number
    rainProbability: number
    visibility: number
    uvIndex: number
    selectedMetric?: 'temperature' | 'humidity' | 'wind' | 'rain' | 'visibility' | 'uv' | null
    onMetricSelect?: (metric: 'temperature' | 'humidity' | 'wind' | 'rain' | 'visibility' | 'uv') => void
}

function WeatherStats({
    temperature,
    humidity,
    windSpeed,
    rainProbability,
    visibility,
    uvIndex,
    selectedMetric,
    onMetricSelect,
}: WeatherStatsProps) {
    const stats = [
        { key: 'temperature' as const, icon: '🌡️', label: 'Temperatura', value: `${temperature}°C` },
        { key: 'humidity' as const, icon: '💧', label: 'Umidade', value: `${humidity}%` },
        { key: 'wind' as const, icon: '💨', label: 'Vento', value: `${windSpeed} km/h` },
        { key: 'rain' as const, icon: '🌧️', label: 'Chance de chuva', value: `${rainProbability}%` },
        { key: 'visibility' as const, icon: '👁️', label: 'Visibilidade', value: `${visibility} km` },
        { key: 'uv' as const, icon: '☀️', label: 'UV', value: `${uvIndex} UV` },
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