const URL = 'https://api.open-meteo.com/v1/forecast?latitude=-23.5505&longitude=-46.6333&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=precipitation_probability,visibility&timezone=America%2FSao_Paulo'

export async function getWeather() {
    const response = await fetch(URL)

    const data = await response.json()

    return data
}