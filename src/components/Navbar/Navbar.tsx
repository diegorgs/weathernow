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
                 <svg xmlns="http://w3.org" viewBox="0 0 64 64" width="64" height="64" fill="none">
                    <circle cx="24" cy="24" r="12" fill="#FFCC00"/>
                    <path d="M24 6V10M24 38V42M6 24H10M38 24H42M11.27 11.27L14.1 14.1M33.9 33.9L36.73 36.73M11.27 36.73L14.1 33.9M33.9 14.1L36.73 11.27" stroke="#FFCC00" stroke-width="3" stroke-linecap="round"/>
                    <path d="M48 38H22C17.5817 38 14 34.4183 14 30C14 25.8641 17.1643 22.4842 21.2407 22.043C22.6173 18.068 26.3986 15.2 30.8 15.2C36.4343 15.2 41 19.7657 41 25.4C41 25.9655 40.9555 26.5218 40.8693 27.0655C44.8214 28.0069 47.75 31.5739 47.75 35.875C47.75 36.5989 47.6913 37.3093 47.5772 38H48Z" fill="#E0F2FE" stroke="#0284C7" stroke-width="1" stroke-linejoin="round"/>
                </svg> 
                </a>
                <a href="/">Weather Now</a>
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