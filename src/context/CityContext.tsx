import { createContext, useState } from 'react'

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

export function CityProvider({ children }: { children: React.ReactNode }) {
    const [city, setCity] = useState<City | null>(null)

    return (
        <CityContext.Provider value={{ city, setCity }}>
            {children}
        </CityContext.Provider>
    )
}