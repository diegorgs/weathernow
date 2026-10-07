export async function getWeather(latitude: number, longitude: number) {

    const URL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m,precipitation_probability,visibility,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=America%2FSao_Paulo`

    const response = await fetch(URL)

    const data = await response.json()

    return data
}

export async function getCityCoordinates(city: string) {

    const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`
    )

    const data = await response.json()

    return data.results[0]
}