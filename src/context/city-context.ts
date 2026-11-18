import { createContext } from 'react'

export type City = {
    name: string
    latitude: number
    longitude: number
}

export type CityContextType = {
    city: City | null
    setCity: React.Dispatch<React.SetStateAction<City | null>>
}

export const CityContext = createContext<CityContextType | null>(null)
