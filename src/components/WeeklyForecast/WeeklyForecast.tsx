import type { DailyForecast } from '../../types/weather'

type WeeklyForecastProps = {
    days: DailyForecast[]
}

function WeeklyForecast({ days }: WeeklyForecastProps) {
    return (
        <div className="grid gap-4 md:grid-cols-7">
            {days.map((day) => (
                <div 
                key={day.day} 
                    className="flex flex-col items-center justify-center rounded-2xl bg-gray-50 px-5 py-20 shadow-sm">
                    
                    <div className="text-center">
                        <p>{day.day}</p>
                        <br></br>
                        <p>{day.condition}</p>
                        <p>
                            {day.min}° / {day.max}°
                        </p>
                    </div>

                </div>
            ))}
        </div>
    )
}

export default WeeklyForecast