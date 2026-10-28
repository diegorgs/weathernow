# WeatherNow

Aplicação web de previsão do tempo, desenvolvida com React e TypeScript. Consulte as condições atuais, explore previsões por hora e por dia e visualize um mapa meteorológico.

## Funcionalidades

- Consulta de temperatura, condição do tempo, umidade, vento, probabilidade de chuva, visibilidade e índice UV.
- Previsão por hora e previsão para os próximos dias.
- Gráfico diário interativo para diferentes métricas meteorológicas.
- Busca de cidades com sugestões de localização.
- Detecção da localização do navegador, com São Paulo como localização padrão se o acesso não estiver disponível.
- Mapa meteorológico incorporado do Windy, centralizado na localização selecionada.
- Tema claro ou escuro, com preferência salva no navegador.

## Tecnologias e serviços

- React 19, TypeScript e Vite.
- Tailwind CSS 4.
- [Open-Meteo](https://open-meteo.com/) para dados meteorológicos e geocodificação.
- [Windy](https://www.windy.com/) para o mapa meteorológico.

As APIs são acessadas diretamente pelo navegador; não é necessário configurar uma chave de API para executar o projeto. É necessária uma conexão com a internet para carregar os dados e o mapa.

## Requisitos

- Node.js 20.19+ ou 22.12+.
- npm.

## Como executar

Clone o repositório e entre na pasta:

```bash
git clone https://github.com/diegorgs/weathernow.git
cd weathernow
```

Instale as dependências e inicie o servidor de desenvolvimento:

```bash
npm install
npm run dev
```

Abra no navegador o endereço exibido pelo Vite, normalmente `http://localhost:5173`.

Para usar a localização atual, permita o acesso à localização quando solicitado pelo navegador. Se a permissão for negada ou a localização não estiver disponível, a aplicação usa São Paulo como padrão.

## Páginas

| Caminho | Conteúdo |
| --- | --- |
| `/` | Condições atuais, métricas, previsão por hora e gráfico |
| `/hora` | Previsão por hora |
| `/semana` | Previsão diária para os próximos dias |
| `/mapa` | Mapa meteorológico do Windy |

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Verifica os tipos TypeScript e gera a versão de produção em `dist/` |
| `npm run preview` | Serve localmente a versão de produção |
| `npm run lint` | Executa o Oxlint |
