import Navbar from '../../components/Navbar/Navbar'
import WeatherCard from '../../components/WeatherCard/WeatherCard'
import WeatherStats from '../../components/WeatherStats/WeatherStats'
import type { WeatherData, HoursForecast } from '../../types/weather'
import { useEffect, useState } from 'react'
import { getWeather } from '../../services/api'
import HourlyForecast from '../../components/HourlyForecast/HourlyForecast'
import { useContext } from 'react'
import { CityContext } from '../../context/CityContext'
import Maps from '../../components/Maps/Maps'


function getWeatherCondition(code: number) {
    if (code === 0) return "Céu limpo"
    if (code === 1) return "Principalmente limpo"
    if (code === 2) return "Parcialmente nublado"
    if (code === 3) return "Nublado"
    if (code === 45 || code === 48) return "Neblina"
    if (code >= 51 && code <= 57) return "Chuvisco"
    if (code >= 61 && code <= 67) return "Chuva"
    if (code >= 71 && code <= 77) return "Neve"
    if (code >= 80 && code <= 82) return "Pancadas de chuva"
    if (code >= 85 && code <= 86) return "Pancadas de neve"
    if (code >= 95) return "Trovoada"

    return "Condição desconhecida"
}

function Home() {
    const [temperature, setTemperature] = useState<number | null>(null)
    const [humidity, setHumidity] = useState<number | null>(null)
    const [windSpeed, setWindSpeed] = useState<number | null>(null)
    const [rainProbability, setRainProbability] = useState<number | null>(null)
    const [visibility, setVisibility] = useState<number | null>(null)
    const [condition, setCondition] = useState<string | null>(null)


    const [hours, setHours] = useState<HoursForecast[]>([])

    const context = useContext(CityContext)
    const city = context?.city

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadWeather() {
            try {
                if (!city) {
                    setLoading(true)
                    return
                }

                const data = await getWeather(city.latitude, city.longitude)

                const currentTime = data.current.time
                const currentHour = currentTime.slice(0, 13) + ":00"
                const currentIndex = data.hourly.time.indexOf(currentHour)

                setTemperature(Math.round(data.current.temperature_2m))
                setHumidity(data.current.relative_humidity_2m)
                setWindSpeed(data.current.wind_speed_10m)

                setCondition(getWeatherCondition(data.current.weather_code))

                setRainProbability(data.hourly.precipitation_probability[currentIndex])

                setVisibility(data.hourly.visibility[currentIndex] / 1000)

                const hourlyForecast = data.hourly.time
                    .slice(currentIndex, currentIndex + 9)
                    .map((time: string, index: number) => ({
                        hour: time.slice(11, 16),
                        temperature: data.hourly.temperature_2m[currentIndex + index],
                        condition: getWeatherCondition(
                            data.hourly.weather_code[currentIndex + index]
                        )
                    }))

                setHours(hourlyForecast)
            } catch (error) {
                console.error("ERRO AO CARREGAR TEMPO:", error)
                setError("Não foi possível carregar os dados do tempo.")
            
            } finally {
                setLoading(false)
            }
        }

        loadWeather()
    }, [city])

    const weather: WeatherData = {
        temperature: temperature!,
        condition: condition!,
        humidity: humidity!,
        windSpeed: windSpeed!,
        rainProbability: rainProbability!,
        visibility: visibility!
}

if (loading) {
    return <p>Carregando...</p>
    }

if (error) {
    return <p>{error}</p>
}

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="mx-auto max-w-6xl px-6 py-8">
                <section>
                    <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
                        São Paulo
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        Estado de São Paulo, Brasil
                    </p>
                </section>

                <section className="mt-8 rounded-2xl bg-white p-4 shadow-sm">
                    <div className="grid gap-4 md:grid-cols-2">
                        <WeatherCard 
                            temperature ={Math.round(weather.temperature)}
                            condition ={weather.condition}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <WeatherStats 
                                humidity={Math.round(weather.humidity)}
                                windSpeed={Math.round(weather.windSpeed)}
                                rainProbability={Math.round(weather.rainProbability)}
                                visibility={Math.round(weather.visibility)}
                            />
                        </div>
                    </div>
                </section>

                <section className="mt-8">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900">
                        Previsão por hora
                    </h2>

                    <HourlyForecast hours={hours} />
                </section>
                <Maps />
            </main>
        </div>
    )
}

export default Home

