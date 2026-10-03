type WeatherStatsProps = {
    humidity: number
    windSpeed: number
    rainProbability: number
    visibility: number
}

function WeatherStats({ humidity, windSpeed, rainProbability, visibility }: WeatherStatsProps) {
    return (
        <>
            <div className="flex items-center justify-center rounded-2xl bg-gray-50 p-5">
                <div className="text-center">
                    <span className="text-2xl">💧</span>

                    <p className="mt-2 text-sm text-gray-500">
                        Umidade
                    </p>

                    <p className="mt-1 text-xl font-semibold text-gray-900">
                        {humidity}%
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-center rounded-2xl bg-gray-50 p-5">
                <div className="text-center">
                    <span className="text-2xl">💨</span>

                    <p className="mt-2 text-sm text-gray-500">
                        Vento
                    </p>

                    <p className="mt-1 text-xl font-semibold text-gray-900">
                        {windSpeed} km/h
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-center rounded-2xl bg-gray-50 p-5">
                <div className="text-center">
                    <span className="text-2xl">🌧️</span>

                    <p className="mt-2 text-sm text-gray-500">
                        Prob. de chuva
                    </p>

                    <p className="mt-1 text-xl font-semibold text-gray-900">
                        {rainProbability}%
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-center rounded-2xl bg-gray-50 p-5">
                <div className="text-center">
                    <span className="text-2xl">👁️</span>

                    <p className="mt-2 text-sm text-gray-500">
                        Visibilidade
                    </p>

                    <p className="mt-1 text-xl font-semibold text-gray-900">
                        {visibility} km
                    </p>
                </div>
            </div>
        </>
    )
}

export default WeatherStats