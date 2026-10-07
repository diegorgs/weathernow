import Navbar from '../../components/Navbar/Navbar'
/*import Maps from '../../components/Maps/Maps'*/

function Maps() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="mx-auto max-w-6xl px-6 py-8">
                <section>
                    <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
                        São Paulo
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        Mapa de previsão.
                    </p>
                </section>

                <section className="mt-8 rounded-2xl bg-white p-4 shadow-sm">

                </section>

            </main>

        </div>
    )
}

export default Maps