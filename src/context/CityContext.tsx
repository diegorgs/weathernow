import { createContext, useEffect, useState } from 'react'
import { getCityFromCoordinates } from '../services/api'

type City = {
    name: string
    latitude: number
    longitude: number
}

type CityContextType = {
    city: City | null
    setCity: React.Dispatch<React.SetStateAction<City | null>>
}

export const CityContext = createContext<CityContextType | null>(null)

const DEFAULT_CITY: City = {
    name: 'São Paulo',
    latitude: -23.55,
    longitude: -46.63,
}

export function CityProvider({ children }: { children: React.ReactNode }) {
    const [city, setCity] = useState<City | null>(null)

    useEffect(() => {
        if (!navigator.geolocation) {
            setCity(DEFAULT_CITY)
            return
        }

        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                try {
                    const cityInfo = await getCityFromCoordinates(coords.latitude, coords.longitude)

                    setCity({
                        name: cityInfo.name || 'Localização atual',
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                    })
                } catch {
                    setCity({
                        name: 'Localização atual',
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                    })
                }
            },
            () => {
                setCity(DEFAULT_CITY)
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000,
            }
        )
    }, [])

    return (
        <CityContext.Provider value={{ city, setCity }}>
            {children}
        </CityContext.Provider>
    )
}