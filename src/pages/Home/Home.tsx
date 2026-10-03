import Navbar from '../../components/Navbar/Navbar'
import WeatherCard from '../../components/WeatherCard/WeatherCard'
import WeatherStats from '../../components/WeatherStats/WeatherStats'

function Home() {
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
                            tempeature={50}
                            condition="Ensolarado"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <WeatherStats 
                                humidity={20}
                                windSpeed={45}
                                rainProbability={000}
                                visibility={001}
                            />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Home