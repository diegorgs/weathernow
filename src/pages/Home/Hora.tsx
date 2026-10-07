import Navbar from '../../components/Navbar/Navbar'
import HourlyForecast from '../../components/HourlyForecast/HourlyForecast'

const hours = [
    {
        hour: "01:00",
        temperature: 25,
        condition: "Ensolarado"
    },
    {
        hour: "04:00",
        temperature: 24,
        condition: "Nublado"
    },
    {
        hour: "07:00",
        temperature: 23,
        condition: "Chuva"
    },
    {
        hour: "10:00",
        temperature: 22,
        condition: "Chuva"
    },
    {
        hour: "13:00",
        temperature: 21,
        condition: "Chuva"
    },
    {
        hour: "16:00",
        temperature: 20,
        condition: "Nublado"
    },
    {
        hour: "19:00",
        temperature: 20,
        condition: "Nublado"
    },
    {
        hour: "22:00",
        temperature: 20,
        condition: "Nublado"
    },
    {
        hour: "00:00",
        temperature: 20,
        condition: "Nublado"
    }
]


function Hora() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="mx-auto max-w-6xl px-6 py-8">
                <section>
                    <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
                        São Paulo
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        Previsão por hora.
                    </p>
                </section>


                <section className="mt-8 rounded-2xl bg-white p-4 shadow-sm">
                            <HourlyForecast hours={hours} />
                </section>

            </main>

        </div>
    )
}

export default Hora