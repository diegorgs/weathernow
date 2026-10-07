import Navbar from '../../components/Navbar/Navbar'
import WeeklyForecast from '../../components/WeeklyForecast/WeeklyForecast'

import type { DailyForecast } from '../../types/weather'

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


function Semana() {

    const [days, setDays] = useState<DailyForecast[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)


    useEffect(() => {

        async function loadWeather() {

            try {

                const data = await getWeather()


                const dailyForecast = data.daily.time.map(
                    (date: string, index: number) => ({

                        day: new Date(date).toLocaleDateString(
                            'pt-BR',
                            { weekday: 'long' }
                        ),

                        min: data.daily.temperature_2m_min[index],

                        max: data.daily.temperature_2m_max[index],

                        condition: getWeatherCondition(
                            data.daily.weather_code[index]
                        )

                    })
                )


                setDays(dailyForecast)

            } catch {

                setError("Não foi possível carregar os dados do tempo.")

            } finally {

                setLoading(false)

            }

        }

        loadWeather()

    }, [])


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
                        Próximos 7 dias
                    </p>

                </section>


                <section className="mt-8 rounded-2xl bg-white p-4 shadow-sm">

                    <WeeklyForecast days={days} />

                </section>

            </main>

        </div>

    )
}

export default Semana