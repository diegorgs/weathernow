import type { HoursForecast } from '../../types/weather'
import { getWeatherIconUrl } from '../../utils/weatherIcons'

type HoursForecastProps = {
    hours: HoursForecast[]
    selectedIndex?: number
    onHourSelect?: (hour: HoursForecast, index: number) => void
}

function getHourNumber(label: string): number {
    const match = label.match(/(\d{1,2})/)
    return match ? Number(match[1]) : new Date().getHours()
}

function HourlyForecast({ hours, selectedIndex = 0, onHourSelect }: HoursForecastProps) {
    const data = hours.length ? hours : [
        { hour: 'Agora', temperature: 24, condition: 'parcialmente nublado' },
        { hour: '10h', temperature: 25, condition: 'parcialmente nublado' },
        { hour: '12h', temperature: 27, condition: 'claro' },
        { hour: '14h', temperature: 27, condition: 'claro' },
        { hour: '16h', temperature: 25, condition: 'parcialmente nublado' },
        { hour: '18h', temperature: 23, condition: 'chuva' },
        { hour: '20h', temperature: 22, condition: 'chuva' },
        { hour: '22h', temperature: 21, condition: 'nublado' },
        { hour: '00h', temperature: 20, condition: 'nublado' },
    ]

    return (
        <div className="hour-grid">
            {data.map((hour, index) => {
                const isActive = selectedIndex === index
                const iconUrl = getWeatherIconUrl(hour.condition, getHourNumber(hour.hour))

                return (
                    <button
                        type="button"
                        key={`${hour.hour}-${index}`}
                        className={`hour-item ${isActive ? 'active' : ''}`}
                        onClick={() => onHourSelect?.(hour, index)}
                        style={{ cursor: 'pointer' }}
                    >
                        <span className="time">{hour.hour}</span>
                        <img src={iconUrl} alt={hour.condition} className="mini-icon-svg" width={32} height={32} />
                        <span className="temp">{Math.round(hour.temperature)}°</span>
                    </button>
                )
            })}
        </div>
    )
}

export default HourlyForecast
