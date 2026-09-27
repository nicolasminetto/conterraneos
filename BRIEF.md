# BRIEF — Mapa de Comunidade de Brasileiros no Exterior

Fonte: "Briefing Técnico — Mapa de Comunidade de Brasileiros no Exterior", 27/09/2026, @Nícolas.
Status: **aprovado em 27/09/2026 (com três cidades: Toronto, Dublin, Oslo).**

## Entrevista

**1. O que é e pra quem é?**
Plataforma de intercâmbio que ajuda brasileiros que vão morar fora a encontrar comunidade na
cidade de destino. Feature central: mapa com heatmap da concentração de brasileiros por
bairro/zona e atalho para o Street View do bairro. Protótipo de portfólio, dados mockados.
Visitante: recrutadores e devs avaliando visualização de dados geoespaciais + UX de produto
(e, na ficção do produto, o brasileiro prestes a se mudar).

**2. Vibe (3–5 palavras) + referências de fora da internet**
"Caderno de viagem: pessoal, anotado, acolhedor."
Referências: guia de bolso impresso (tipo Lonely Planet), passaporte carimbado, bilhete de metrô.

**3. Caminho do visitante**
Landing (proposta de valor → como funciona → CTA de cadastro) → Cadastro/Login →
**Mapa da cidade** (heatmap, filtro de cidade, painel do bairro com Street View) →
Página do bairro (grupos, eventos, pontos de encontro) → Perfil (opt-in/opt-out) →
Sobre/Como funciona (privacidade em linguagem simples).

**4. O que ele precisa ACREDITAR no final?**
"Mudar de país não precisa significar começar do zero: alguém já abriu o caminho."

**5. Energia e O momento**
Pico: **A viagem**. A cena fica presa na tela e uma linha pontilhada sai do Brasil e cruza o
oceano até a cidade de destino. Na chegada, o zoom entra na cidade e os bairros aparecem.
Curva de energia: a definir na jornada em cenas.

**6. O que essa página faz que nenhuma outra faz?**
**Anotar no caderno.** Clicar num bairro deixa uma anotação à mão no caderno, com o nome, a
contagem estimada e um carimbo de "visitado". As anotações se acumulam e viram um roteiro que
dá pra abrir no Street View, um bairro por vez. É estado compartilhado: o que o visitante anota
no mapa aparece na página do bairro e no perfil.

**7. Materiais existentes**
Nenhum asset visual. Toda ilustração (rota, carimbos, mapa a traço) é SVG feito em código.
Dados de concentração mockados (plausíveis, fictícios, sinalizados como tal na interface).
**Cidades da demo** (os dados ficam organizados por cidade, pra dar pra incluir outras depois sem
mexer no código):
- **Toronto:** 158 neighbourhoods oficiais (Open Data Toronto).
- **Dublin:** 53 áreas de Dublin City, resultado da junção das 162 Electoral Divisions do CSO 2022
  pelo nome-base (ex.: Rathmines West A–F → Rathmines West). Os códigos postais D1–D24 não têm
  polígono público.
- **Oslo** (Noruega): 17 bydeler oficiais (OpenStreetMap, ODbL).

---

## Jornada em cenas (Landing)

| # | Cena | Vê | Sente | Passa a acreditar | Energia | Família de efeito |
|---|---|---|---|---|---|---|
| 1 | **Capa do caderno** (Hero) | Página pautada ocupando a tela; o título se escreve a traço, ancorado embaixo à esquerda; três carimbos (Toronto, Dublin, Oslo) caem no canto de cima; CTA "Abrir meu caderno" | Curiosidade, intimidade | "Isso foi feito à mão, com cuidado" | média | Traço que se desenha + carimbo |
| 2 | **Antes de ir** (o problema) | Uma coluna estreita à direita com as perguntas que todo brasileiro faz antes de mudar ("onde morar?", "vou conhecer alguém?"), que aparecem como notas na margem | Reconhecimento, um aperto | "Alguém entende o que eu estou sentindo" | calma | Revelações na margem |
| 3 | **A viagem** ⚡ PICO | Cena presa por 5 telas: o fundo escurece até um mar noturno, uma linha pontilhada sai de São Paulo e se divide em três rotas (Toronto, Dublin, Oslo). Depois a câmera entra em cada cidade, uma tela por cidade: os bairros se desenham a traço e as manchas de concentração se acendem | Frio na barriga que vira alívio | "Não vou começar do zero" | INTENSA | Cena fixa longa + fundo que viaja + desenho de rota |
| 4 | **Seu caderno** (como funciona + assinatura) | Página dupla em tela cheia: à esquerda, o mapa real de uma das cidades em miniatura, com bilhetes pra trocar de cidade; à direita, o caderno. Clicar num bairro deixa uma anotação à mão com carimbo "visitado", e as anotações viram um roteiro de Street View | Brincadeira, controle | "Eu consigo usar isso agora" | média | Movimento-assinatura (JS próprio) |
| 5 | **O que a gente nunca mostra** (privacidade) | Comparação lado a lado: um alfinete individual riscado × a mancha do bairro. Três regras curtas: só total por bairro, mínimo de 5 pessoas, você escolhe aparecer | Confiança | "Posso entrar sem me expor" | calma | Revelações laterais |
| 6 | **Chegada** (CTA + rodapé) | Fundo azul-caneta, título centralizado "Alguém já abriu o caminho." e UMA chamada: abrir o mapa; rodapé com aviso de dados fictícios | Fechamento | Vontade de explorar o mapa | média | Fundo que viaja |

**Curva de energia:** média → calma → **INTENSA** → média → calma → média. Nenhuma cena vizinha
tem a mesma energia.

**Pico:** cena 3, a viagem de São Paulo a Toronto, Dublin e Oslo, com a cena presa por 5 telas de
rolagem (partida → três rotas → Toronto → Dublin → Oslo).

**Movimento-assinatura:** anotar no caderno (cena 4 na landing e painel do bairro no app).

## Telas do app (sem rolagem narrativa; seguem o mesmo piso de design)

- **Cadastro/Login:** nome, cidade de origem, cidade atual, bairro (escolhido numa lista, nunca
  por GPS). O opt-in do mapa é uma pergunta à parte, desmarcada por padrão, explicada em uma frase.
- **Mapa da cidade:** filtro de cidade em forma de bilhetes (Toronto · Dublin · Oslo); mapa Leaflet com o preenchimento por bairro em escala sequencial (a
  intensidade da cor mostra a concentração); bairro com menos de 5 pessoas aparece como "poucos
  dados", sem número. Clique no bairro → painel lateral (gaveta embaixo no celular) com a contagem
  estimada, "Anotar no caderno" e "Ver no Street View" (nova aba, nas coordenadas do centro do bairro).
- **Página do bairro:** grupos, eventos e pontos de encontro mockados, mais as anotações do visitante.
- **Perfil:** dados básicos, liga/desliga de "aparecer no mapa" e o caderno com o roteiro salvo.
- **Sobre:** a proposta e a política de privacidade em linguagem simples.

## Decisões de design (proposta)

- **Paleta (caderno de viagem, sem bege):** papel frio `#F4F3EE`, superfície `#E6E4DC`,
  tinta azul-grafite `#1B2433`, tinta suave `#5A6273`, caneta esferográfica `#2446A8` (anotações),
  mar noturno `#0F1B2D` (pico). **Acento único:** laranja marca-texto `#F26A1B` (CTA, rota, carimbo).
  A escala do mapa vai do papel até esse laranja (`#FBE6D4` → `#F26A1B` → `#8E3409`).
- **Tipografia:** Instrument Serif (display) + IBM Plex Sans (texto). Caveat só nas anotações do
  caderno: é um terceiro papel, restrito ao movimento-assinatura.
  Escala 15 / 18 / 24 / 36 / 56 / 88.
- **Comparação com o RetroPlay:** abertura, pico, assinatura e paleta são diferentes (4 de 5
  itens). A trava pede no mínimo 3.

## Restrições do briefing (não negociáveis)

- **Nunca** pin ou localização individual: toda visualização agregada por bairro/zona.
- Design já prevê o limite mínimo por área (ex.: contagem só com 5+ pessoas) e opt-in explícito,
  mesmo com dados mockados.
- Cadastro coleta só bairro/cidade autodeclarados, nunca endereço ou geolocalização do aparelho.
- Street View abre em nova aba (Google Maps), sem iframe nem API de mapa paga.
- Identidade visual própria, sem degradês genéricos de IA.
- Responsivo: celular, tablet, desktop.

## Stack (decidida)

React + Vite + Leaflet (heatmap via `leaflet.heat` ou choropleth por bairro), tiles gratuitos
sem token. Deploy estático (Vercel/Netlify). Dados mockados em JSON/GeoJSON no próprio repo.
