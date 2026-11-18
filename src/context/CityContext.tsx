import { useEffect, useState } from 'react'
import { CityContext, type City } from './city-context'
import { getCityFromCoordinates } from '../services/api'

const DEFAULT_CITY: City = {
    name: 'São José dos Campos',
    latitude: -23.18,
    longitude: -45.88,
}

export function CityProvider({ children }: { children: React.ReactNode }) {
    const [city, setCity] = useState<City | null>(() => {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            return DEFAULT_CITY
        }

        return null
    })

    useEffect(() => {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
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