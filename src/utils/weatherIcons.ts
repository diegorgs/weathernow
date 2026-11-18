// Meteocons via jsDelivr — estilo "fill" animado
// Preview: https://basmilius.github.io/weather-icons/index-fill.html
const BASE = 'https://cdn.jsdelivr.net/npm/@bybas/weather-icons@2.0.0/production/fill/all'

export type IconSet = { day: string; night: string }

const ICONS: Record<string, IconSet> = {
    'ceu limpo':              { day: `${BASE}/clear-day.svg`,             night: `${BASE}/clear-night.svg` },
    'claro':                  { day: `${BASE}/clear-day.svg`,             night: `${BASE}/clear-night.svg` },
    'principalmente limpo':   { day: `${BASE}/partly-cloudy-day.svg`,     night: `${BASE}/partly-cloudy-night.svg` },
    'parcialmente nublado':   { day: `${BASE}/partly-cloudy-day.svg`,     night: `${BASE}/partly-cloudy-night.svg` },
    'nublado':                { day: `${BASE}/overcast-day.svg`,          night: `${BASE}/overcast-night.svg` },
    'chuva':                  { day: `${BASE}/rain.svg`,                  night: `${BASE}/rain.svg` },
    'chuva fraca':            { day: `${BASE}/drizzle.svg`,               night: `${BASE}/drizzle.svg` },
    'pancadas de chuva':      { day: `${BASE}/partly-cloudy-day-rain.svg`,night: `${BASE}/partly-cloudy-night-rain.svg` },
    'trovoada':               { day: `${BASE}/thunderstorms-day.svg`,     night: `${BASE}/thunderstorms-night.svg` },
    'neblina':                { day: `${BASE}/fog-day.svg`,               night: `${BASE}/fog-night.svg` },
    'neve':                   { day: `${BASE}/snow.svg`,                  night: `${BASE}/snow.svg` },
    'granizo':                { day: `${BASE}/hail.svg`,                  night: `${BASE}/hail.svg` },
    'ventania':               { day: `${BASE}/wind.svg`,                  night: `${BASE}/wind.svg` },
}

const FALLBACK: IconSet = {
    day:   `${BASE}/clear-day.svg`,
    night: `${BASE}/clear-night.svg`,
}

function normalize(condition: string) {
    return condition
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .trim()
}

export function getWeatherIconUrl(condition: string, hour: number): string {
    const isNight = hour >= 18 || hour <= 5
    const key = normalize(condition)
    const set = ICONS[key] ?? FALLBACK
    return isNight ? set.night : set.day
}
