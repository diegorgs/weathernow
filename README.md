# WeatherNow

Aplicação web de previsão do tempo desenvolvida com React, TypeScript e Vite. O sistema consulta dados meteorológicos em tempo real, permite buscar e selecionar cidades, visualizar diferentes métricas e consultar notícias relacionadas ao clima.

## Funcionalidades

- Condições atuais: temperatura, umidade, vento, índice UV, visibilidade e chance de chuva.
- Previsão por hora e previsão semanal.
- Gráficos interativos das principais métricas meteorológicas.
- Busca de cidades, estados, países e regiões com sugestões enquanto o usuário digita.
- Histórico das últimas cidades pesquisadas.
- Favoritos de cidades por usuário.
- Detecção automática da localização do navegador.
- Cidade padrão usada quando a localização não é autorizada ou não está disponível.
- Mapa meteorológico interativo do Windy.
- Notícias climáticas do GNews, com filtro Brasil ou cidade selecionada.
- Login e cadastro de usuários com API FastAPI e JWT.
- Preferências de usuário e configurações de notificação.
- Tema claro e tema escuro, com preferência salva no navegador.
- Ícones meteorológicos com suporte visual diurno e noturno.
- Alertas críticos para chuvas fortes, trovoadas e ventos.

## Tecnologias

### Frontend

- React 19
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS 4
- Oxlint

### Backend

- Python 3.11+
- FastAPI
- SQLAlchemy
- PyMySQL
- Pydantic Settings
- JWT
- Passlib/Bcrypt
- MySQL ou MariaDB

### APIs e serviços

- Open-Meteo: dados meteorológicos e geocodificação.
- Windy: mapa meteorológico.
- GNews: notícias climáticas.
- MySQL: autenticação e dados do usuário.

## Requisitos para executar

### Opção recomendada

- Windows 10/11
- Node.js 20.19+ ou 22.12+
- npm
- Python 3.11+
- Docker Desktop, para subir o MySQL

### Alternativa sem Docker

- MySQL 8 ou MariaDB instalado e configurado manualmente

Para verificar os programas instalados:

```powershell
node --version
npm --version
python --version
docker --version
```

## Instalação

Abra o PowerShell na pasta do projeto e instale as dependências do frontend:

```powershell
npm install
```

## Configuração do banco de dados

A forma mais simples é usar o Docker Compose incluído no projeto.

Na raiz do projeto:

```powershell
docker compose up -d
```

O MySQL ficará disponível em `localhost:3306` com estas credenciais padrão:

```text
Banco: weather_now
Usuário: weather_user
Senha: weather_pass
```

Para verificar se o banco está em execução:

```powershell
docker compose ps
```

## Configuração do backend

Entre na pasta do backend e crie o ambiente virtual:

```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Copie o arquivo de exemplo e ajuste as configurações quando necessário:

```powershell
Copy-Item .env.example .env
```

O arquivo `backend/.env` pode ser configurado assim:

```env
APP_NAME=WeatherNow API
DATABASE_URL=mysql+pymysql://weather_user:weather_pass@localhost:3306/weather_now
SECRET_KEY=altere-esta-chave-para-um-valor-secreto
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
GNEWS_API_KEY=sua_chave_gnews
```

O `GNEWS_API_KEY` é opcional para cadastro/login e previsão do tempo, mas é necessário para carregar notícias.

Inicie a API:

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Documentação da API:

- Swagger: http://localhost:8000/docs
- Health check: http://localhost:8000/health

As tabelas do banco são criadas automaticamente pelo SQLAlchemy na inicialização.

## Configuração das notícias no frontend

Se a aplicação consultar o GNews diretamente pelo navegador, crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_GNEWS_KEY=sua_chave_gnews
```

Depois reinicie o servidor Vite.

Não coloque uma chave real em um repositório público. O projeto pode ser executado sem notícias caso a chave não esteja configurada.

## Executando o frontend

Em outro terminal, volte à raiz do projeto e execute:

```powershell
cd ..
npm run dev
```

Acesse:

```text
http://localhost:5173
```

Para usar a localização atual, permita o acesso à localização no navegador. Caso seja negado ou indisponível, o sistema usa uma localização padrão.

## Resumo rápido

Com Docker instalado:

```powershell
# Terminal 1: banco
docker compose up -d

# Terminal 2: backend
cd backend
python -m venv .venv
.venv\Scripts\activate
python -m pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 3: frontend
npm install
npm run dev
```

## Páginas

| Caminho | Conteúdo |
| --- | --- |
| `/` | Condições atuais, métricas, gráfico, favoritos e notícias |
| `/login` | Login ou cadastro |
| `/configuracoes` | Preferências e histórico |
| `/hora` | Previsão por hora |
| `/semana` | Previsão diária para os próximos dias |
| `/mapa` | Mapa meteorológico do Windy |

## Scripts do frontend

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Verifica os tipos e gera a versão de produção em `dist/` |
| `npm run preview` | Serve localmente a versão de produção |
| `npm run lint` | Executa o Oxlint |

## Uso sem MySQL

O frontend pode ser executado independentemente do backend para usar clima, busca de cidades e notícias por APIs públicas. O cadastro/login possui modo demonstrativo no navegador quando o backend não está disponível.

## Uso sem Docker

Instale o MySQL ou MariaDB manualmente, crie o banco `weather_now` e configure `DATABASE_URL` em `backend/.env` com as credenciais correspondentes.

## Solução de problemas

- Se aparecer erro de conexão com MySQL, confirme se o Docker está em execução e se a porta `3306` está livre.
- Se o backend não iniciar, confirme que o ambiente virtual foi ativado e que `requirements.txt` foi instalado.
- Se o cadastro não estiver disponível, confira se a API está em `http://localhost:8000`.
- Se as notícias não aparecerem, configure `GNEWS_API_KEY` no backend ou `VITE_GNEWS_KEY` no frontend.
- Se a localização não estiver disponível, permita a localização no navegador ou utilize a busca por cidade.
