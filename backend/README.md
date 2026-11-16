# WeatherNow Backend

## Requisitos

- Python 3.11+
- MySQL ou MariaDB
- pip

## Instalação

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Linux/macOS
.venv\Scripts\activate      # Windows
pip install -r requirements.txt
```

## Variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e ajuste os valores.

```bash
copy .env.example .env
```

## Rodar o backend

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Banco de dados

O projeto usa SQLAlchemy com MySQL. O banco pode ser criado pela aplicação automaticamente quando o servidor subir.

### Se quiser criar manualmente no MySQL:

```sql
CREATE DATABASE weather_now;
CREATE USER IF NOT EXISTS 'weather_user'@'localhost' IDENTIFIED BY 'weather_pass';
GRANT ALL PRIVILEGES ON weather_now.* TO 'weather_user'@'localhost';
FLUSH PRIVILEGES;
```

## Funcionalidades incluídas

- cadastro de usuário
- login com JWT
- salvamento do histórico de cidades da última sessão
- preferências do usuário para e-mail diário (ativado/desativado + horário)

## Endpoints principais

- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`
- POST `/api/user/session`
- GET `/api/user/session`
- GET `/api/user/preferences`
- POST `/api/user/preferences`
