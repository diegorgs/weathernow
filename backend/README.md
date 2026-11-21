# WeatherNow Backend

## Requisitos

- Python 3.11+
- pip
- Docker Desktop ou MySQL/MariaDB

## Instalacao no Windows

```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

## Banco com Docker

Na raiz do projeto:

```powershell
docker compose up -d
docker compose ps
```

Credenciais padrao:

```text
Banco: weather_now
Usuario: weather_user
Senha: weather_pass
Porta: 3306
```

## Configuracao

Edite `backend/.env` conforme necessario:

```env
APP_NAME=WeatherNow API
DATABASE_URL=mysql+pymysql://weather_user:weather_pass@localhost:3306/weather_now
SECRET_KEY=altere-esta-chave-para-um-valor-secreto
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
GNEWS_API_KEY=
```

A chave do GNews e opcional para o backend, mas necessaria para o endpoint de noticias quando usada com essa API.

## Executar

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- API: http://localhost:8000
- Swagger: http://localhost:8000/docs
- Verificacao: http://localhost:8000/health

O SQLAlchemy cria as tabelas automaticamente na primeira inicializacao.

## Funcionalidades

- Cadastro de usuario
- Login com JWT
- Historico de cidades por usuario
- Preferencias do usuario
- Cache de noticias climaticas
- Endpoint de saude da aplicacao
