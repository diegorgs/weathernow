import Navbar from '../../components/Navbar/Navbar'
import WeeklyForecast from '../../components/WeeklyForecast/WeeklyForecast'

const days = [
    {
        day: "Segunda",
        min: 27,
        max: 37,
        condition: "Ensolarado"
    },
    {
        day: "Terça",
        min: 19,
        max: 25,
        condition: "Nublado"
    },
    {
        day: "Quarta",
        min: 17,
        max: 23,
        condition: "Chuva"
    },
    {
        day: "Quinta",
        min: 17,
        max: 23,
        condition: "Chuva"
    },
    {
        day: "Sexta",
        min: 17,
        max: 23,
        condition: "Chuva"
    },
    {
        day: "Sábado",
        min: 17,
        max: 23,
        condition: "Chuva"
    },
    {
        day: "Domingo",
        min: 17,
        max: 23,
        condition: "Chuva"
    }
]


function Semana() {
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