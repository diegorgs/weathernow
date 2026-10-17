export async function getWeather(latitude: number, longitude: number) {

    const URL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,uv_index&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,visibility,wind_speed_10m,weather_code,uv_index&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=America%2FSao_Paulo`

    const response = await fetch(URL)

    const data = await response.json()

    return data
}

export async function getCitySuggestions(city: string) {
    const query = city.trim()

    if (!query) {
        return []
    }

    const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=pt&format=json`
    )

    const data = await response.json()
    return Array.isArray(data.results) ? data.results : []
}

export async function getCityCoordinates(city: string) {
    const query = city.trim()

    if (!query) {
        return null
    }

    const results = await getCitySuggestions(query)

    if (!results.length) {
        return null
    }

    const normalizedQuery = query.toLowerCase()

    const exactMatch = results.find((item: any) => {
        const name = (item?.name ?? '').toLowerCase()
        const country = (item?.country ?? '').toLowerCase()
        const admin = (item?.admin1 ?? '').toLowerCase()

        return (
            name === normalizedQuery ||
            `${name}, ${country}` === normalizedQuery ||
            `${name}, ${admin}` === normalizedQuery ||
            `${name}, ${admin}, ${country}` === normalizedQuery
        )
    })

    return exactMatch ?? results[0]
}

export async function getCityFromCoordinates(latitude: number, longitude: number) {
    const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=pt&format=json`
    )

    const data = await response.json()

    return data.results?.[0] ?? {
        name: 'Localização atual',
        latitude,
        longitude,
    }
}