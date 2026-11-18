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

const BASE = 'https://cdn.jsdelivr.net/npm/@bybas/weather-icons@2.0.0/production/fill/all'

const STAT_ICONS: Record<string, string> = {
    temperature: `${BASE}/thermometer.svg`,
    humidity:    `${BASE}/humidity.svg`,
    wind:        `${BASE}/wind.svg`,
    rain:        `${BASE}/rain.svg`,
    visibility:  `${BASE}/mist.svg`,
    uv:          `${BASE}/uv-index.svg`,
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
        { key: 'temperature' as const, label: 'Temperatura', value: `${temperature}°C` },
        { key: 'humidity' as const,    label: 'Umidade',      value: `${humidity}%` },
        { key: 'wind' as const,        label: 'Vento',        value: `${windSpeed} km/h` },
        { key: 'rain' as const,        label: 'Chance de chuva', value: `${rainProbability}%` },
        { key: 'visibility' as const,  label: 'Visibilidade', value: `${visibility} km` },
        { key: 'uv' as const,          label: 'UV',           value: `${uvIndex} UV` },
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
                    <img src={STAT_ICONS[stat.key]} alt={stat.label} className="icon" width={52} height={52} />
                    <span className="label">{stat.label}</span>
                    <span className="value">{stat.value}</span>
                </button>
            ))}
        </>
    )
}

export default WeatherStats