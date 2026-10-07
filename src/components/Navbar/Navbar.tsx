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
            longitude: result.longitude
        })
        console.log('CIDADE SALVA NO CONTEXT:', {
            name: result.name,
            latitude: result.latitude,
            longitude: result.longitude
        })
}
    return (
        <header className="border-b border-gray-200 bg-white">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

                <a
                    href="/"
                    className="text-xl font-bold text-gray-900"
                >
                    Weather Now
                </a>

                <div className="flex items-center gap-8">

                    <div className="hidden items-center gap-6 md:flex">

                        <a
                            href="/Hora"
                            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
                        >
                            Previsão por Hora
                        </a>

                        <a
                            href="/Semana"
                            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
                        >
                            Previsão da Semana
                        </a>

                        <a
                            href="/Mapa"
                            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
                        >
                            Mapa
                        </a>

                    </div>

                    {searchOpen && (
                        <input
                            type="text"
                            placeholder="Digite uma cidade..."
                            value={city}
                            onChange={(event) => setCity(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    searchCity()
                                }
                            }}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                    )}

                    <button
                        type="button"
                        aria-label="Pesquisar"
                        onClick={() => setSearchOpen(!searchOpen)}
                        className="text-gray-600 transition hover:text-blue-600"
                    >
                        Procurar
                    </button>

                    <button
                        type="button"
                        aria-label="Perfil"
                        className="text-gray-600 transition hover:text-blue-600"
                    >
                        👤
                    </button>

                </div>

            </nav>
        </header>
    )
}

export default Navbar