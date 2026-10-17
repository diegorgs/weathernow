import { useContext, useState } from 'react'
import { getCityCoordinates } from '../../services/api'
import { CityContext } from '../../context/CityContext'

function Navbar() {
    const [searchOpen, setSearchOpen] = useState(false)
    const [city, setCity] = useState('')

    const context = useContext(CityContext)

    async function searchCity() {
        if (!city.trim()) {
            return
        }

        const result = await getCityCoordinates(city)

        if (!result || !context) {
            return
        }

        context.setCity({
            name: result.name,
            latitude: result.latitude,
            longitude: result.longitude,
        })
        setSearchOpen(false)
    }

    return (
        <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
            <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
                <div className="flex items-center gap-3">
                    <a href="/" className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-lg shadow-sm">☀️</span>
                        <span>Weather Now</span>
                    </a>
                </div>

                <div className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
                    <a href="/" className="transition hover:text-sky-600">Clima</a>
                    <a href="/Hora" className="transition hover:text-sky-600">Tempo</a>
                    <a href="/Semana" className="transition hover:text-sky-600">Previsão</a>
                    <a href="/Mapa" className="transition hover:text-sky-600">Calendário</a>
                </div>

                <div className="flex items-center gap-3">
                    <form
                        className={`${searchOpen ? 'flex' : 'hidden'} items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 md:flex`}
                        onSubmit={(event) => {
                            event.preventDefault()
                            searchCity()
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Buscar cidade"
                            value={city}
                            onChange={(event) => setCity(event.target.value)}
                            className="w-36 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                        />
                    </form>

                    <button
                        type="button"
                        onClick={() => setSearchOpen(!searchOpen)}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-600"
                    >
                        Buscar
                    </button>

                    <button className="rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-700">
                        Entrar
                    </button>
                </div>
            </nav>
        </header>
    )
}

export default Navbar
