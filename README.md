# Conterrâneos

Protótipo de uma plataforma que ajuda brasileiros que vão morar fora a escolher bairro olhando
para onde a comunidade já está. O mapa pinta cada bairro de **Toronto, Dublin e Oslo** pela
concentração de brasileiros, e cada bairro abre no **Google Street View**.

Peça de portfólio: visualização de dados geoespaciais, UX de produto e privacidade desde o
desenho. **As contagens, os grupos e os eventos são fictícios. Os limites dos bairros são reais.**

## Como rodar

```bash
npm install
npm run dev        # desenvolvimento (Vite)
npm run preview    # build + roda no runtime local da Cloudflare (wrangler dev)
npm run deploy     # build + publica no Cloudflare Workers
```

O deploy é um Worker só com Static Assets ([`wrangler.jsonc`](wrangler.jsonc)), em modo SPA:
rotas como `/mapa/dublin` devolvem o `index.html` e o React Router resolve. Os arquivos com
hash em `/assets/` recebem cache de um ano ([`public/_headers`](public/_headers)).

## O que tem

| Tela | O que faz |
|---|---|
| Início | Landing contada pela rolagem: a viagem de São Paulo às três cidades é uma cena presa de 5 telas |
| Mapa | Coroplético em Leaflet por bairro, lista acessível com busca, painel com Street View |
| Bairro | Grupos, eventos e pontos de encontro (fictícios) |
| Cadastro | Nome, e-mail, origem, cidade e bairro de uma lista, e opt-in do mapa **desligado por padrão** |
| Perfil | Caderno de bairros anotados, liga/desliga da contagem, apagar dados |
| Sobre | Como funciona e a política de privacidade em linguagem simples |

## Privacidade no código

As regras do briefing estão em [`src/lib/privacidade.js`](src/lib/privacidade.js) e valem para
os dados fictícios como valeriam para os reais:

- **Nenhum ponto individual.** Só existem polígonos de bairro; não há coordenada de pessoa em lugar nenhum.
- **Mínimo de 5 por bairro.** Abaixo disso, o bairro aparece como "poucos dados", sem número.
- **Arredondamento.** Acima de 20, a contagem vai para múltiplos de 5, então a entrada ou a saída de uma pessoa não aparece.
- **Opt-in de verdade.** Quem marca a opção vira +1 no bairro declarado (e sai na hora ao desmarcar), seguindo o mesmo caminho que os dados reais seguiriam.
- **Sem geolocalização.** O bairro é escolhido numa lista fechada.

## Decisões de arquitetura

- **React + Vite, CSS próprio com tokens.** Sem biblioteca de UI; a identidade "caderno de viagem"
  está em [`src/estilos/base.css`](src/estilos/base.css).
- **Rolagem sem biblioteca.** [`src/lib/rolagem.js`](src/lib/rolagem.js) publica o avanço da cena
  presa em `--p` (0 a 1) e o CSS deriva tudo dele (rotas, lentes, cores) sem re-render do React.
  Com movimento reduzido, nada fica preso e tudo aparece no estado final.
- **Dois mapas, um dado.** A landing desenha SVG com `d3-geo` (mapa-múndi + bairros); o app usa
  Leaflet com tiles do OpenStreetMap. Os dois leem o mesmo GeoJSON.
- **Polígonos carregados sob demanda.** Cada cidade é um `import()` separado; o Leaflet só baixa na tela do mapa.
- **Estado compartilhado.** Conta e caderno são contextos persistidos no navegador: anotar na
  landing aparece no mapa, na página do bairro e no perfil.
- **Dados fictícios reproduzíveis.** [`scripts/gerar-dados.mjs`](scripts/gerar-dados.mjs) gera as
  contagens com semente fixa, a partir de bairros "polo" e decaimento pela distância.

## Fontes dos limites de bairro

- Toronto: [City of Toronto Open Data](https://open.toronto.ca/dataset/neighbourhoods/), 158 neighbourhoods.
- Dublin: [CSO Electoral Divisions 2022](https://data.cso.ie/) (Dublin City), 162 divisões agrupadas em 53 áreas pelo nome-base.
- Oslo: [OpenStreetMap](https://www.openstreetmap.org/copyright) (ODbL), 16 bydeler; Marka (floresta) ficou de fora.

Geometrias simplificadas com mapshaper. Mapa-múndi: Natural Earth via `world-atlas`.

---

Feito por **Nícolas Minetto** · [GitHub](https://github.com/nicolasminetto) ·
[LinkedIn](https://www.linkedin.com/in/nicolas-minetto-658938ab/)
