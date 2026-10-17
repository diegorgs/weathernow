import Navbar from '../../components/Navbar/Navbar'
import WindyMap from '../../components/Maps/Maps'
import { useContext } from 'react'
import { CityContext } from '../../context/CityContext'

function Maps() {
    const context = useContext(CityContext)
    const cityName = context?.city?.name ?? 'São Paulo'

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="mx-auto max-w-6xl px-6 py-8">
                <section>
                    <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
                        {cityName}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        Mapa meteorológico em tempo real.
                    </p>
                </section>

                <section className="mt-8 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                    <WindyMap />
                </section>
            </main>
        </div>
    )
}

export default Maps