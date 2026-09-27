function Navbar() {
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
                            href="/"
                            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
                        >
                            Tempo
                        </a>

                        <a
                            href="/previsao"
                            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
                        >
                            Previsão
                        </a>

                        <a
                            href="/"
                            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
                        >
                            ...
                        </a>
                    </div>

                    <button
                        type="button"
                        aria-label="Pesquisar"
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