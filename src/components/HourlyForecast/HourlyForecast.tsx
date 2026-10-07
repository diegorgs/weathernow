import type { HoursForecast } from '../../types/weather'

type HoursForecastProps = {
    hours: HoursForecast[]
}

function HourlyForecast({ hours }: HoursForecastProps) {
    return (
        <div className="grid gap-4 md:grid-cols-9">
            {hours.map((hour) => (
                <div 
                key={hour.hour} 
                    className="flex flex-col items-center justify-center rounded-2xl bg-gray-50 px-5 py-20 shadow-sm">
                    
                    <div className="text-center">
                        <p>{hour.hour}</p>
                        <br></br>
                        <p>{hour.condition}</p>
                        <p>
                            {hour.temperature}°
                        </p>
                    </div>

                </div>
            ))}
        </div>
    )
}

export default HourlyForecast