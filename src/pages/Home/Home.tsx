import Navbar from '../../components/Navbar/Navbar'
import WeatherCard from '../../components/WeatherCard/WeatherCard'
import WeatherStats from '../../components/WeatherStats/WeatherStats'
import type { WeatherData } from '../../types/weather'
import { useEffect, useState } from 'react'
import { getWeather } from '../../services/api'


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

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    


    useEffect(() => {
        async function loadWeather() {
            try {
                const data = await getWeather()

                const currentTime = data.current.time
                const currentHour = currentTime.slice(0, 13) + ":00"
                const currentIndex = data.hourly.time.indexOf(currentHour)

                setTemperature(data.current.temperature_2m)
                setHumidity(data.current.relative_humidity_2m)
                setWindSpeed(data.current.wind_speed_10m)

                setCondition(getWeatherCondition(data.current.weather_code))

                setRainProbability(data.hourly.precipitation_probability[currentIndex])

                setVisibility(data.hourly.visibility[currentIndex] / 1000)
            } catch {
                setError("Não foi possível carregar os dados do tempo.")
            } finally {
                setLoading(false)
            }
        }

        loadWeather()
    }, [])

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
                            temperature={weather.temperature}
                            condition={weather.condition}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <WeatherStats 
                                humidity={weather.humidity}
                                windSpeed={weather.windSpeed}
                                rainProbability={weather.rainProbability}
                                visibility={weather.visibility}
                            />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Home