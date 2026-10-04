import Navbar from '../../components/Navbar/Navbar'
import WeeklyForecast from '../../components/WeeklyForecast/WeeklyForecast'

const days = [
    {
        day: "Segunda",
        min: 18,
        max: 27,
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


function Previsao() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="mx-auto max-w-6xl px-6 py-8">

                <section className="mt-8 rounded-2xl bg-white p-4 shadow-sm">
                    <div className="grid gap-4 md:grid-cols-2">
                            <WeeklyForecast days={days} />          
                            
                        <div className="grid grid-cols-2 gap-4">
                  
                        </div>

                    </div>
                </section>

            </main>

        </div>
    )
}

export default Previsao