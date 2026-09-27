import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import terraTopo from "world-atlas/land-110m.json";
import { CIDADES, ORIGEM } from "../dados/cidades.js";
import { carregarGeo } from "../lib/useGeo.js";
import { bairrosEmSvg } from "../lib/projecao.js";
import { corNoEscuro, intensidade } from "../lib/escala.js";
import { totalDaCidade } from "../lib/comunidade.js";
import { useCenaPresa } from "../lib/rolagem.js";
import Carimbo from "../componentes/Carimbo.jsx";

// Cinco etapas numa cena presa: partida, rotas, Toronto, Dublin, Oslo.
const ETAPAS = 5;
const LARGURA = 1000;
const ALTURA = 620;
const LENTE = 800;

const projecao = geoNaturalEarth1().fitExtent(
  [
    [60, 40],
    [LARGURA - 60, ALTURA - 40]
  ],
  { type: "MultiPoint", coordinates: [[-88, -28], [22, 63]] }
);
const caminho = geoPath(projecao);
const terra = caminho(feature(terraTopo, terraTopo.objects.land));
const ponto = (c) => projecao([c.lng, c.lat]);

// Cada rota começa um pouco depois da anterior, como três voos saindo em sequência.
const ROTAS = CIDADES.map((cidade, i) => ({
  cidade,
  d: caminho({
    type: "LineString",
    coordinates: [
      [ORIGEM.lng, ORIGEM.lat],
      [cidade.lng, cidade.lat]
    ]
  }),
  inicio: 0.05 + i * 0.05,
  duracao: 0.2
}));

/**
 * Os bairros mais cheios costumam ser vizinhos, então os nomes não cabem em cima deles.
 * Os rótulos vão para uma coluna à direita do grupo, um embaixo do outro, com uma linha
 * até o ponto, como uma anotação de margem.
 */
function posicionarRotulos(destaques) {
  if (!destaques.length) return [];
  const x = Math.min(LENTE - 290, Math.max(...destaques.map((b) => b.x)) + 70);
  const ordem = [...destaques].sort((a, b) => a.y - b.y);
  const meio = ordem.reduce((s, b) => s + b.y, 0) / ordem.length;
  const passo = 46;
  return ordem.map((bairro, i) => ({ bairro, x, y: meio + (i - (ordem.length - 1) / 2) * passo }));
}

const milhar = (n) => (Math.round(n / 100) * 100).toLocaleString("pt-BR");

function LenteDaCidade({ cidade, indice }) {
  const [bairros, setBairros] = useState(null);

  useEffect(() => {
    let ativo = true;
    carregarGeo(cidade.id).then((geo) => {
      if (ativo) setBairros(bairrosEmSvg(geo, cidade.id, LENTE, LENTE, { margem: 28 }).bairros);
    });
    return () => {
      ativo = false;
    };
  }, [cidade.id]);

  const resumo = useMemo(() => {
    if (!bairros) return null;
    const visiveis = bairros.filter((b) => b.estimativa !== null);
    const destaques = [...visiveis].sort((a, b) => b.estimativa - a.estimativa).slice(0, 3);
    return { visiveis: visiveis.length, total: bairros.length, destaques, rotulos: posicionarRotulos(destaques) };
  }, [bairros]);

  return (
    <div className="viagem__lente" style={{ "--ini": 0.4 + indice * 0.2 }} data-cidade={cidade.id}>
      <svg viewBox={`0 0 ${LENTE} ${LENTE}`} className="viagem__cidade" aria-hidden="true">
        {bairros?.map((b) => (
          <path
            key={b.id}
            d={b.d}
            pathLength="1"
            fill={b.estimativa === null ? "none" : corNoEscuro(intensidade(b.estimativa))}
            className={b.estimativa === null ? "sem-dados" : undefined}
          />
        ))}
        {resumo?.rotulos.map(({ bairro: b, x, y }) => (
          <g key={b.id} className="viagem__anotacao">
            <path d={`M${b.x} ${b.y} L${x - 10} ${y - 8}`} />
            <circle cx={b.x} cy={b.y} r="4.5" />
            <text x={x} y={y}>
              {b.nome}
            </text>
          </g>
        ))}
      </svg>
      <div className="viagem__legenda viagem__legenda--cidade">
        <p className="rotulo">
          Chegada {indice + 1} de 3 · {cidade.pais}
        </p>
        <h3>{cidade.nome}</h3>
        {resumo && (
          <p>
            ≈ {milhar(totalDaCidade(cidade.id))} brasileiros espalhados por {resumo.visiveis} dos{" "}
            {resumo.total} {cidade.unidade}. Mais gente em{" "}
            {resumo.destaques.map((b) => b.nome).join(", ").replace(/, ([^,]*)$/, " e $1")}.
          </p>
        )}
        <p className="aviso-ficticio">Contagens fictícias, bairros reais</p>
      </div>
    </div>
  );
}

export default function Viagem() {
  const secao = useRef(null);
  const palco = useRef(null);
  const marcadores = useRef({});

  useCenaPresa(secao, ETAPAS);

  // Cada lente se abre a partir do ponto da cidade no mapa-múndi. Como o mapa se ajusta à
  // tela (meet), a posição real do ponto só existe depois de medir.
  useLayoutEffect(() => {
    const medir = () => {
      const base = palco.current.getBoundingClientRect();
      for (const cidade of CIDADES) {
        const alvo = marcadores.current[cidade.id]?.getBoundingClientRect();
        const lente = palco.current.querySelector(`[data-cidade="${cidade.id}"]`);
        if (!alvo || !lente) continue;
        lente.style.setProperty("--x", `${alvo.left + alvo.width / 2 - base.left}px`);
        lente.style.setProperty("--y", `${alvo.top + alvo.height / 2 - base.top}px`);
      }
    };
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(palco.current);
    return () => observador.disconnect();
  }, []);

  const [ox, oy] = ponto(ORIGEM);

  return (
    <section className="viagem" ref={secao} aria-labelledby="viagem-titulo">
      <div className="viagem__palco" ref={palco}>
        <svg
          className="viagem__mundo"
          viewBox={`0 0 ${LARGURA} ${ALTURA}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Mapa com rotas de São Paulo para Toronto, Dublin e Oslo"
        >
          <path className="viagem__terra" d={terra} />
          {ROTAS.map(({ cidade, d, inicio, duracao }) => (
            <g key={cidade.id} style={{ "--ini": inicio, "--dur": duracao }} className="viagem__rota">
              <mask id={`revela-${cidade.id}`} maskUnits="userSpaceOnUse">
                <path d={d} pathLength="1" className="viagem__revela" />
              </mask>
              <path d={d} className="viagem__pontilhado" mask={`url(#revela-${cidade.id})`} />
            </g>
          ))}
          <g className="viagem__origem" transform={`translate(${ox} ${oy})`}>
            <circle r="14" className="viagem__pulso" />
            <circle r="6" />
            <text x="14" y="26">
              {ORIGEM.nome}
            </text>
          </g>
          {ROTAS.map(({ cidade, inicio, duracao }) => {
            const [x, y] = ponto(cidade);
            return (
              <g
                key={cidade.id}
                className="viagem__destino"
                style={{ "--chegada": inicio + duracao }}
                transform={`translate(${x} ${y})`}
              >
                <circle r="5" ref={(el) => (marcadores.current[cidade.id] = el)} />
                <Carimbo
                  texto={cidade.nome}
                  detalhe={cidade.pais}
                  tamanho={58}
                  x={-29}
                  y={-66}
                  className="viagem__carimbo"
                />
              </g>
            );
          })}
        </svg>

        <div className="viagem__legenda" data-e="0">
          <p className="rotulo">Partida</p>
          <h2 id="viagem-titulo">São Paulo, 23h40.</h2>
          <p>Uma mala, um endereço anotado num papel e a pergunta que não sai da cabeça: e se eu não conhecer ninguém?</p>
        </div>
        <div className="viagem__legenda" data-e="1">
          <p className="rotulo">Três rotas</p>
          <h2>Tem brasileiro nas três pontas.</h2>
          <p>Toronto, Dublin e Oslo: cidades diferentes, o mesmo começo. Quem chegou antes já sabe onde fica a padaria, a pelada e o grupo do bairro.</p>
        </div>

        {CIDADES.map((cidade, i) => (
          <LenteDaCidade key={cidade.id} cidade={cidade} indice={i} />
        ))}
      </div>
    </section>
  );
}
