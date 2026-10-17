import Navbar from '../../components/Navbar/Navbar'
import WeatherCard from '../../components/WeatherCard/WeatherCard'
import WeatherStats from '../../components/WeatherStats/WeatherStats'
import type { HoursForecast } from '../../types/weather'
import { useEffect, useState } from 'react'
import { getWeather } from '../../services/api'
import HourlyForecast from '../../components/HourlyForecast/HourlyForecast'
import { useContext } from 'react'
import { CityContext } from '../../context/CityContext'

type HourMetric = {
    hour: string
    temperature: number
    condition: string
    humidity: number
    windSpeed: number
    rainProbability: number
    visibility: number
}

function formatSelectedDate(dateString: string) {
    const date = new Date(`${dateString}T12:00:00`)

    return new Intl.DateTimeFormat('pt-BR', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
    }).format(date)
}

function getWeatherCondition(code: number) {
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

    return 'Condição desconhecida'
}

function Home() {
    const [temperature, setTemperature] = useState<number>(24)
    const [humidity, setHumidity] = useState<number>(72)
    const [windSpeed, setWindSpeed] = useState<number>(13)
    const [rainProbability, setRainProbability] = useState<number>(35)
    const [visibility, setVisibility] = useState<number>(16)
    const [condition, setCondition] = useState<string>('Parcialmente nublado')
    const [hours, setHours] = useState<HoursForecast[]>([])
    const [hourlyMetrics, setHourlyMetrics] = useState<HourMetric[]>([])
    const [selectedDayIndex, setSelectedDayIndex] = useState(0)
    const [selectedHourIndex, setSelectedHourIndex] = useState(0)
    const [selectedHourLabel, setSelectedHourLabel] = useState('Agora')
    const [selectedDateLabel, setSelectedDateLabel] = useState('Hoje')
    const [selectedMetric, setSelectedMetric] = useState<'humidity' | 'wind' | 'rain' | 'visibility' | null>(null)
    const [currentHourIndex, setCurrentHourIndex] = useState(0)
    const [forecastData, setForecastData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const context = useContext(CityContext)
    const city = context?.city

    useEffect(() => {
        async function loadWeather() {
            try {
                if (!city) {
                    setLoading(false)
                    return
                }

                const data = await getWeather(city.latitude, city.longitude)

                const currentTime = data.current.time
                const currentHour = currentTime.slice(0, 13) + ':00'
                const currentIndex = data.hourly.time.indexOf(currentHour)

                const currentCondition = getWeatherCondition(data.current.weather_code)

                setTemperature(Math.round(data.current.temperature_2m))
                setHumidity(data.current.relative_humidity_2m)
                setWindSpeed(data.current.wind_speed_10m)
                setCondition(currentCondition)
                setSelectedHourLabel('Agora')
                setSelectedHourIndex(0)
                setSelectedDayIndex(0)
                setSelectedDateLabel(formatSelectedDate(data.daily.time[0]))
                setSelectedMetric(null)
                setCurrentHourIndex(currentIndex)
                setForecastData(data)
                setRainProbability(data.hourly.precipitation_probability[currentIndex])
                setVisibility(data.hourly.visibility[currentIndex] / 1000)

                const hourlyForecast: HourMetric[] = data.hourly.time
                    .slice(currentIndex, currentIndex + 9)
                    .map((time: string, index: number) => {
                        const sourceIndex = currentIndex + index

                        return {
                            hour: time.slice(11, 16),
                            temperature: data.hourly.temperature_2m[sourceIndex],
                            condition: getWeatherCondition(
                                data.hourly.weather_code[sourceIndex]
                            ),
                            humidity: data.current.relative_humidity_2m,
                            windSpeed: data.current.wind_speed_10m,
                            rainProbability: data.hourly.precipitation_probability[sourceIndex],
                            visibility: data.hourly.visibility[sourceIndex] / 1000,
                        }
                    })

                setHours(
                    hourlyForecast.map(({ hour, temperature, condition }) => ({
                        hour,
                        temperature,
                        condition,
                    }))
                )
                setHourlyMetrics(hourlyForecast)
            } catch (error) {
                console.error('ERRO AO CARREGAR TEMPO:', error)
                setError('Não foi possível carregar os dados do tempo.')
            } finally {
                setLoading(false)
            }
        }

        loadWeather()
    }, [city])

    const handleHourSelect = (hour: HoursForecast, index: number) => {
        setSelectedHourIndex(index)
        setSelectedHourLabel(hour.hour)
        setSelectedMetric(null)

        const currentHourStats = hourlyMetrics[index]

        if (currentHourStats) {
            setTemperature(Math.round(currentHourStats.temperature))
            setCondition(currentHourStats.condition)
            setHumidity(currentHourStats.humidity)
            setWindSpeed(currentHourStats.windSpeed)
            setRainProbability(currentHourStats.rainProbability)
            setVisibility(currentHourStats.visibility)
        }
    }

    const handleDaySelect = (dayIndex: number) => {
        if (!forecastData) {
            return
        }

        const targetDate = forecastData.daily.time[dayIndex]
        const startIndex = dayIndex === 0
            ? currentHourIndex
            : forecastData.hourly.time.findIndex((time: string) => time.startsWith(targetDate))

        if (startIndex === -1) {
            return
        }

        const nextHours: HourMetric[] = forecastData.hourly.time
            .slice(startIndex, startIndex + 9)
            .map((time: string, index: number) => {
                const sourceIndex = startIndex + index

                return {
                    hour: time.slice(11, 16),
                    temperature: forecastData.hourly.temperature_2m[sourceIndex],
                    condition: getWeatherCondition(
                        forecastData.hourly.weather_code[sourceIndex]
                    ),
                    humidity: forecastData.current.relative_humidity_2m,
                    windSpeed: forecastData.current.wind_speed_10m,
                    rainProbability: forecastData.hourly.precipitation_probability[sourceIndex],
                    visibility: forecastData.hourly.visibility[sourceIndex] / 1000,
                }
            })

        const firstHour = nextHours[0]

        setSelectedDayIndex(dayIndex)
        setSelectedHourIndex(0)
        setSelectedHourLabel(firstHour?.hour ?? '00:00')
        setSelectedDateLabel(formatSelectedDate(forecastData.daily.time[dayIndex]))
        setSelectedMetric(null)
        setTemperature(Math.round(firstHour?.temperature ?? forecastData.current.temperature_2m))
        setCondition(firstHour?.condition ?? getWeatherCondition(forecastData.current.weather_code))
        setHumidity(forecastData.current.relative_humidity_2m)
        setWindSpeed(forecastData.current.wind_speed_10m)
        setRainProbability(firstHour?.rainProbability ?? forecastData.hourly.precipitation_probability[currentHourIndex])
        setVisibility((firstHour?.visibility ?? forecastData.hourly.visibility[currentHourIndex] / 1000))
        setHours(nextHours.map(({ hour, temperature, condition }) => ({ hour, temperature, condition })))
        setHourlyMetrics(nextHours)
    }

    const metricDisplay = selectedMetric
        ? {
            humidity: { label: 'Umidade', value: `${humidity}%`, icon: '💧' },
            wind: { label: 'Vento', value: `${windSpeed} km/h`, icon: '💨' },
            rain: { label: 'Chance de chuva', value: `${rainProbability}%`, icon: '🌧️' },
            visibility: { label: 'Visibilidade', value: `${visibility} km`, icon: '👁️' },
        }[selectedMetric]
        : null

    const weekly = [
        { day: 'Hoje', min: 18, max: 24, condition: 'parcialmente nublado' },
        { day: 'Amanhã', min: 19, max: 25, condition: 'parcialmente nublado' },
        { day: 'Quarta', min: 20, max: 24, condition: 'chuva' },
        { day: 'Quinta', min: 18, max: 23, condition: 'nublado' },
        { day: 'Sexta', min: 20, max: 25, condition: 'céu limpo' },
        { day: 'Sábado', min: 21, max: 27, condition: 'parcialmente nublado' },
        { day: 'Domingo', min: 20, max: 24, condition: 'chuva' },
    ]

    const calendar = [
        ['Seg', '1', '☁️', '27°'],
        ['Ter', '2', '☁️', '28°'],
        ['Qua', '3', '☀️', '26°'],
        ['Qui', '4', '☀️', '28°'],
        ['Sex', '5', '⛅', '25°'],
        ['Sáb', '6', '🌧️', '24°'],
        ['Dom', '7', '☁️', '24°'],
    ]

    if (loading) {
        return <p className="p-8 text-slate-700">Carregando...</p>
    }

    if (error) {
        return <p className="p-8 text-red-600">{error}</p>
    }

    return (
        <div className="weather-page">
            <Navbar />

            <main className="weather-shell">
                <div className="top-header">
                    <div className="header-city">
                        <span className="eyebrow">Capital</span>
                        <h1>{city?.name ?? 'São Paulo'}</h1>
                        <span className="header-date">{selectedDateLabel}</span>
                    </div>

                    <div className="header-meta">
                        <span>São Paulo</span>
                        <span>Atualizado há 8 min</span>
                    </div>
                </div>

                <section className="weather-main-card">
                    <WeatherCard
                        temperature={temperature}
                        condition={condition}
                        label={selectedHourLabel}
                        metric={metricDisplay}
                    />

                    <div className="weather-stats-grid">
                        <WeatherStats
                            humidity={humidity}
                            windSpeed={windSpeed}
                            rainProbability={rainProbability}
                            visibility={visibility}
                            selectedMetric={selectedMetric}
                            onMetricSelect={(metric) => setSelectedMetric((current) => (current === metric ? null : metric))}
                        />
                    </div>
                </section>

                <section className="section-box">
                    <div className="section-head">
                        <h3>Previsão por hora</h3>
                    </div>

                    <HourlyForecast
                        hours={hours}
                        selectedIndex={selectedHourIndex}
                        onHourSelect={handleHourSelect}
                    />
                </section>

                <section className="section-box">
                    <div className="section-head">
                        <h3>Próximos 7 dias</h3>
                    </div>

                    <div className="week-list">
                        {weekly.map((day, index) => (
                            <button
                                key={day.day}
                                type="button"
                                className={`week-row ${selectedDayIndex === index ? 'active-day' : ''}`}
                                onClick={() => handleDaySelect(index)}
                                style={{ cursor: 'pointer', border: selectedDayIndex === index ? '1px solid rgba(96,165,250,0.28)' : '1px solid rgba(148,163,184,0.06)', textAlign: 'left' }}
                            >
                                <div className="day">{day.day}</div>
                                <div className="rain">{day.condition === 'chuva' ? '35% chance de chuva' : '10% chance de chuva'}</div>
                                <div className="temps">
                                    <span>{day.condition === 'céu limpo' ? '☀️' : day.condition === 'chuva' ? '🌧️' : '⛅'}</span>
                                    <span style={{ marginLeft: '10px' }}>{day.min}° / {day.max}°</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

                <section className="section-box">
                    <div className="section-head">
                        <h3>Calendário</h3>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>Maio 2025</span>
                    </div>

                    <div className="calendar-grid">
                        {['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'].map((day) => (
                            <div key={day} className="calendar-head">{day}</div>
                        ))}

                        {calendar.map((item, index) => (
                            <div key={`${item[1]}-${index}`} className={`calendar-day ${index === 2 ? 'active' : ''}`}>
                                <div className="icon">{item[2]}</div>
                                <div>{item[1]}</div>
                                <div className="temp">{item[3]}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="section-box">
                    <div className="section-head">
                        <h3>Mapa meteorológico</h3>
                    </div>

                    <div className="map-box">
                        <div className="map-marker" />
                    </div>
                </section>

                <div className="alert-row">
                    <div className="alert-card primary">
                        <div className="title">⚠️ Atenção moderada</div>
                        <div className="body">Possibilidade de temporal forte até 16h com rajadas de vento.</div>
                    </div>
                    <div className="alert-card secondary">
                        <div className="title">⚠️ Atenção moderada</div>
                        <div className="body">Risco de alagamento e queda de energia em algumas regiões.</div>
                    </div>
                    <div className="alert-card success">
                        <div className="title">✅ Sem riscos</div>
                        <div className="body">Clima estável durante a noite com temperaturas amenas.</div>
                    </div>
                </div>

                <section className="section-box" style={{ marginTop: '20px' }}>
                    <div className="section-head">
                        <h3>Meus locais</h3>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>+ Adicionar cidade</span>
                    </div>

                    <div className="favorites-row">
                        <div className="favorite-card">
                            <div>
                                <div className="name">São Paulo</div>
                                <div className="temp">24°</div>
                            </div>
                            <div className="fake-icon">☁️</div>
                        </div>

                        <div className="favorite-card">
                            <div>
                                <div className="name">Rio</div>
                                <div className="temp">28°</div>
                            </div>
                            <div className="fake-icon">☀️</div>
                        </div>

                        <div className="favorite-card">
                            <div>
                                <div className="name">Curitiba</div>
                                <div className="temp">21°</div>
                            </div>
                            <div className="fake-icon">🌧️</div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Home

