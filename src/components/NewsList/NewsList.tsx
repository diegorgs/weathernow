import { useContext, useEffect, useState } from 'react'
import { getClimateNews } from '../../services/api'
import { CityContext } from '../../context/city-context'
import type { NewsArticle } from '../../types/news'

type Filtro = 'brasil' | 'cidade'

function tempoRelativo(iso: string) {
    const minutos = Math.round((Date.now() - new Date(iso).getTime()) / 60000)

    if (minutos < 1) return 'agora'
    if (minutos < 60) return `há ${minutos} min`
    if (minutos < 1440) return `há ${Math.round(minutos / 60)} h`

    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

function NewsList() {
    const city = useContext(CityContext)?.city
    const [filtro, setFiltro] = useState<Filtro>('brasil')
    const [news, setNews] = useState<NewsArticle[]>([])
    const [loading, setLoading] = useState(true)
    const [erro, setErro] = useState<string | null>(null)

    const cidade = filtro === 'cidade' ? city?.name : undefined

    useEffect(() => {
        let ativo = true

        setLoading(true)
        setErro(null)

        getClimateNews(cidade)
            .then((artigos) => {
                if (ativo) setNews(artigos)
            })
            .catch((error: Error) => {
                if (ativo) setErro(error.message)
            })
            .finally(() => {
                if (ativo) setLoading(false)
            })

        return () => {
            ativo = false
        }
    }, [cidade])

    const [destaque, ...resto] = news

    return (
        <section className="section-box scroll-mt-6.5" id="noticias">
            <div className="section-head news-head">
                <h3>Notícias climáticas</h3>

                <div className="news-filters">
                    <button
                        type="button"
                        className={`news-chip ${filtro === 'brasil' ? 'active' : ''}`}
                        onClick={() => setFiltro('brasil')}
                    >
                        Brasil
                    </button>
                    <button
                        type="button"
                        className={`news-chip ${filtro === 'cidade' ? 'active' : ''}`}
                        onClick={() => setFiltro('cidade')}
                        disabled={!city}
                    >
                        {city?.name ?? 'Minha cidade'}
                    </button>
                </div>
            </div>

            {loading && (
                <div className="news-grid">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="news-card news-skeleton loading-shimmer" />
                    ))}
                </div>
            )}

            {!loading && erro && <p className="news-message">{erro}</p>}

            {!loading && !erro && news.length === 0 && (
                <p className="news-message">Nenhuma notícia encontrada para {cidade ?? 'o Brasil'} agora.</p>
            )}

            {!loading && !erro && destaque && (
                <>
                    <a href={destaque.url} target="_blank" rel="noopener noreferrer" className="news-featured">
                        {destaque.image && <img src={destaque.image} alt="" loading="lazy" />}
                        <div className="news-body">
                            <span className="news-meta">
                                {destaque.source.name} · {tempoRelativo(destaque.publishedAt)}
                            </span>
                            <h4>{destaque.title}</h4>
                            <p>{destaque.description}</p>
                            <span className="news-link">Ler matéria ↗</span>
                        </div>
                    </a>

                    <div className="news-grid">
                        {resto.map((artigo) => (
                            <a
                                key={artigo.url}
                                href={artigo.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="news-card"
                            >
                                {artigo.image && <img src={artigo.image} alt="" loading="lazy" />}
                                <div className="news-body">
                                    <span className="news-meta">
                                        {artigo.source.name} · {tempoRelativo(artigo.publishedAt)}
                                    </span>
                                    <h4>{artigo.title}</h4>
                                </div>
                            </a>
                        ))}
                    </div>
                </>
            )}

            <p className="news-credit">Fonte: GNews</p>
        </section>
    )
}

export default NewsList
