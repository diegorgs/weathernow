export type WeatherData = {
    temperature: number
    condition: string
    humidity: number
    windSpeed: number
    rainProbability: number
    visibility: number
}

export type DailyForecast = {
    day: string
    min: number
    max: number
    condition: string
}

export type HoursForecast = {
    hour: string
    temperature: number
    condition: string
}