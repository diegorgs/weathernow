import json
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import NewsCache

router = APIRouter(prefix="/api/noticias", tags=["noticias"])

GNEWS_URL = "https://gnews.io/api/v4/search"
CACHE_MINUTES = 30
TERMOS_CLIMA = '(clima OR chuva OR temporal OR "previsão do tempo" OR "onda de calor" OR frio)'


def montar_busca(cidade: str | None) -> str:
    if not cidade:
        return TERMOS_CLIMA
    cidade_limpa = cidade.replace('"', "").strip()[:60]
    return f'(clima OR chuva OR temporal OR temperatura) AND "{cidade_limpa}"'


def buscar_no_gnews(busca: str) -> list[dict]:
    params = urllib.parse.urlencode({
        "q": busca,
        "lang": "pt",
        "country": "br",
        "max": 10,
        "sortby": "publishedAt",
        "apikey": settings.gnews_api_key,
    })
    request = urllib.request.Request(f"{GNEWS_URL}?{params}", headers={"User-Agent": "WeatherNow/1.0"})
    with urllib.request.urlopen(request, timeout=10) as response:
        data = json.loads(response.read().decode("utf-8"))

    return [
        {
            "title": artigo.get("title", ""),
            "description": artigo.get("description", ""),
            "url": artigo.get("url", ""),
            "image": artigo.get("image"),
            "publishedAt": artigo.get("publishedAt", ""),
            "source": {"name": (artigo.get("source") or {}).get("name", "")},
        }
        for artigo in data.get("articles", [])
    ]


@router.get("")
def listar_noticias(cidade: str | None = Query(default=None), db: Session = Depends(get_db)):
    chave_cache = (cidade or "brasil").strip().lower()
    cache = db.query(NewsCache).filter(NewsCache.query_key == chave_cache).first()

    if cache and datetime.utcnow() - cache.fetched_at < timedelta(minutes=CACHE_MINUTES):
        return json.loads(cache.payload)

    if not settings.gnews_api_key:
        raise HTTPException(status_code=503, detail="Configure GNEWS_API_KEY no arquivo backend/.env")

    try:
        artigos = buscar_no_gnews(montar_busca(cidade))
    except (urllib.error.URLError, TimeoutError, ValueError) as erro:
        if cache:
            return json.loads(cache.payload)
        raise HTTPException(status_code=502, detail="Não foi possível buscar as notícias no GNews") from erro

    if cache:
        cache.payload = json.dumps(artigos, ensure_ascii=False)
        cache.fetched_at = datetime.utcnow()
    else:
        db.add(NewsCache(query_key=chave_cache, payload=json.dumps(artigos, ensure_ascii=False), fetched_at=datetime.utcnow()))
    db.commit()

    return artigos
