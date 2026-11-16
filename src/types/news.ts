export type NewsArticle = {
    title: string
    description: string
    url: string
    image: string | null
    publishedAt: string
    source: { name: string }
}
