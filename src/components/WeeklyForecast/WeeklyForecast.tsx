import type { DailyForecast } from '../../types/weather'

type WeeklyForecastProps = {
    days: DailyForecast[]
}

const weekIcons: Record<string, { day: string; night: string }> = {
    'ceu limpo': { day: '☀️', night: '🌙' },
    'principalmente limpo': { day: '🌤️', night: '🌙' },
    'parcialmente nublado': { day: '⛅', night: '☁️' },
    nublado: { day: '☁️', night: '☁️' },
    chuva: { day: '🌧️', night: '🌧️' },
    'pancadas de chuva': { day: '🌦️', night: '🌧️' },
}

function normalizeCondition(condition: string) {
    return condition
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
}

function getWeekNightAwareIcon(condition: string) {
    const hour = new Date().getHours()
    const isNight = hour >= 18 || hour <= 5
    const variant = weekIcons[normalizeCondition(condition)] ?? { day: '☀️', night: '🌙' }
    return isNight ? variant.night : variant.day
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

    return (
        <div className="week-list">
            {data.map((day) => (
                <div key={day.day} className="week-row">
                    <div className="day">{day.day}</div>
                    <div className="rain">{Math.round((day.min + day.max) / 2) >= 24 ? '30% chance de chuva' : '15% chance de chuva'}</div>
                    <div className="temps">
                        <span>{getWeekNightAwareIcon(day.condition)}</span>
                        <span style={{ marginLeft: '10px' }}>{day.min}° / {day.max}°</span>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default WeeklyForecast