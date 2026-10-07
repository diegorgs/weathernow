const URL = 'https://api.open-meteo.com/v1/forecast?latitude=-23.5505&longitude=-46.6333&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m,precipitation_probability,visibility,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=America%2FSao_Paulo'

export async function getWeather() {
    const response = await fetch(URL)

    const data = await response.json()

    return data
}