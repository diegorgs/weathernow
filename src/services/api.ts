import type { NewsArticle } from '../types/news'

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

const GNEWS_URL = 'https://gnews.io/api/v4/search'
const GNEWS_KEY = import.meta.env.VITE_GNEWS_KEY as string | undefined
const NEWS_CACHE_MINUTES = 30
const TERMOS_CLIMA = 'chuva OR temporal OR tempestade OR "previsão do tempo" OR "onda de calor" OR "frente fria" OR meteorologia OR alagamento OR Inmet OR granizo OR geada'
const TERMOS_CIDADE = '(chuva OR temporal OR tempestade OR "previsão do tempo" OR "onda de calor" OR "frente fria" OR alagamento)'

// Palavras que indicam notícia de tempo de verdade. "clima" sozinho fica de fora:
// aparece em "clima de tensão", "clima íntimo" etc.
const PALAVRAS_TEMPO = /\b(chuvas?|chuvos[ao]|temporal|temporais|tempestades?|previsao do tempo|meteorolog\w*|onda de calor|calor|frio|frente fria|massa de ar|alagamentos?|enchentes?|inundac\w*|inmet|granizo|geadas?|ventanias?|vendaval|rajadas?|trovoadas?|trovao|trovoes|ciclone|seca|estiagem|umidade|temperaturas?|defesa civil|climatempo|el nino|la nina|neve)\b/

function normalizarTexto(texto: string) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

function ehNoticiaDeTempo(artigo: NewsArticle) {
    return PALAVRAS_TEMPO.test(normalizarTexto(`${artigo.title} ${artigo.description}`))
}

function removerRepetidas(artigos: NewsArticle[]) {
    const vistos = new Set<string>()
    return artigos.filter((artigo) => {
        const chave = normalizarTexto(artigo.title).replace(/[^a-z0-9]/g, '')
        if (vistos.has(chave)) return false
        vistos.add(chave)
        return true
    })
}

type NewsCache = {
    savedAt: number
    articles: NewsArticle[]
}

function readNewsCache(key: string): NewsCache | null {
    try {
        const raw = localStorage.getItem(key)
        return raw ? (JSON.parse(raw) as NewsCache) : null
    } catch {
        return null
    }
}

export async function getClimateNews(cidade?: string): Promise<NewsArticle[]> {
    const cacheKey = `weather-now-news-v2-${(cidade ?? 'brasil').toLowerCase()}`
    const cache = readNewsCache(cacheKey)

    if (cache && Date.now() - cache.savedAt < NEWS_CACHE_MINUTES * 60 * 1000) {
        return cache.articles
    }

    if (!GNEWS_KEY) {
        throw new Error('Configure VITE_GNEWS_KEY no arquivo .env.local e reinicie o npm run dev.')
    }

    const busca = cidade
        ? `${TERMOS_CIDADE} AND "${cidade.replace(/"/g, '')}"`
        : TERMOS_CLIMA

    const params = new URLSearchParams({
        q: busca,
        lang: 'pt',
        country: 'br',
        max: '10',
        sortby: 'publishedAt',
        in: 'title,description',
        apikey: GNEWS_KEY,
    })

    try {
        const response = await fetch(`${GNEWS_URL}?${params}`)

        if (!response.ok) {
            const mensagens: Record<number, string> = {
                401: 'Chave do GNews inválida. Confira o VITE_GNEWS_KEY no .env.local.',
                403: 'Limite diário do GNews atingido. Tente amanhã.',
                429: 'Muitas requisições ao GNews. Aguarde alguns segundos.',
            }
            throw new Error(mensagens[response.status] ?? 'Não foi possível carregar as notícias.')
        }

        const data = await response.json()
        const todos: NewsArticle[] = (data.articles ?? []).map((artigo: any) => ({
            title: artigo.title ?? '',
            description: artigo.description ?? '',
            url: artigo.url ?? '',
            image: artigo.image ?? null,
            publishedAt: artigo.publishedAt ?? '',
            source: { name: artigo.source?.name ?? '' },
        }))
        const articles = removerRepetidas(todos.filter(ehNoticiaDeTempo))

        try {
            localStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), articles }))
        } catch {
            // sem espaço no localStorage: segue sem cache
        }

        return articles
    } catch (error) {
        if (cache) {
            return cache.articles
        }

        throw error instanceof Error ? error : new Error('Não foi possível carregar as notícias.')
    }
}
