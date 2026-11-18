import type { DailyForecast } from '../../types/weather'
import { getWeatherIconUrl } from '../../utils/weatherIcons'

type WeeklyForecastProps = {
    days: DailyForecast[]
}

function WeeklyForecast({ days }: WeeklyForecastProps) {
    const data = days.length ? days : [
        { day: 'Hoje', min: 18, max: 24, condition: 'parcialmente nublado' },
        { day: 'Amanhã', min: 19, max: 25, condition: 'parcialmente nublado' },
        { day: 'Quarta', min: 19, max: 23, condition: 'chuva' },
        { day: 'Quinta', min: 18, max: 24, condition: 'nublado' },
        { day: 'Sexta', min: 17, max: 23, condition: 'céu limpo' },
        { day: 'Sábado', min: 20, max: 25, condition: 'parcialmente nublado' },
        { day: 'Domingo', min: 18, max: 24, condition: 'chuva' },
    ]

    // Previsão semanal sempre usa horário diurno (12h)
    const DAYTIME_HOUR = 12

    return (
        <div className="week-list">
            {data.map((day) => (
                <div key={day.day} className="week-row">
                    <div className="day">{day.day}</div>
                    <div className="rain">{Math.round((day.min + day.max) / 2) >= 24 ? '30% chance de chuva' : '15% chance de chuva'}</div>
                    <div className="temps">
                        <img
                            src={getWeatherIconUrl(day.condition, DAYTIME_HOUR)}
                            alt={day.condition}
                            className="week-icon-svg"
                            width={28}
                            height={28}
                        />
                        <span style={{ marginLeft: '10px' }}>{day.min}° / {day.max}°</span>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default WeeklyForecast
