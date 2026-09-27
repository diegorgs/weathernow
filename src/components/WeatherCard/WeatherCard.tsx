function WeatherCard() {
    return (
        <div className="flex h-full items-center justify-center rounded-2xl bg-white p-8">
            <div className="flex flex-col items-center justify-center text-center">
                <span className="text-7xl font-semibold tracking-tight text-gray-900">
                    24°
                </span>

                <span className="mt-2 text-lg text-gray-500">
                    Parcialmente nublado
                </span>
            </div>
        </div>
    )
}

export default WeatherCard