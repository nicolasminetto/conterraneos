import { Link, useParams } from "react-router-dom";
import { cidadePorId } from "../dados/cidades.js";
import { encontrosDoBairro } from "../dados/encontros.js";
import { bairroDoGeo, useGeo } from "../lib/useGeo.js";
import { contagemBruta } from "../lib/comunidade.js";
import { estimativaPublica, MINIMO_POR_BAIRRO, textoEstimativa } from "../lib/privacidade.js";
import { linkStreetView } from "../lib/streetview.js";
import { useCaderno } from "../lib/caderno.jsx";
import { useConta } from "../lib/conta.jsx";
import NaoEncontrada from "./NaoEncontrada.jsx";
import "../estilos/app.css";

export default function Bairro() {
  const { cidade: cidadeId, bairro: bairroId } = useParams();
  const cidade = cidadePorId(cidadeId);
  const geo = useGeo(cidade ? cidade.id : "toronto");
  const { registro } = useConta();
  const { anotado, anotar, apagar } = useCaderno();

  if (!cidade) return <NaoEncontrada />;
  if (!geo) return <p className="carregando">Abrindo {cidade.nome}…</p>;
  const bairro = bairroDoGeo(geo, bairroId);
  if (!bairro) return <NaoEncontrada />;

  const estimativa = estimativaPublica(contagemBruta(cidade.id, bairro.id, registro));
  const { grupos, eventos, pontos } = encontrosDoBairro(cidade.id, bairro, estimativa);
  const jaAnotado = anotado(cidade.id, bairro.id);
  const moraAqui = registro?.cidade === cidade.id && registro?.bairro === bairro.id;

  return (
    <article className="pagina bairro">
      <Link to={`/mapa/${cidade.id}?bairro=${bairro.id}`} className="bairro__voltar">
        ← Mapa de {cidade.nome}
      </Link>
      <header className="bairro__cabeca">
        <p className="rotulo">
          {cidade.nome} · {cidade.pais}
        </p>
        <h1 className="pagina__titulo">{bairro.nome}</h1>
        <p className="bairro__numero">
          {textoEstimativa(estimativa)} <span className="aviso-ficticio">dados fictícios</span>
        </p>
        {moraAqui && (
          <p className="bairro__voce mao">
            {registro.noMapa ? "Você mora aqui e entra nessa conta." : "Você mora aqui, mas escolheu não entrar na conta."}
          </p>
        )}
        <div className="bairro__acoes">
          <button
            type="button"
            className={jaAnotado ? "botao botao--linha" : "botao"}
            aria-pressed={jaAnotado}
            onClick={() =>
              jaAnotado
                ? apagar(cidade.id, bairro.id)
                : anotar({ cidade: cidade.id, bairro: bairro.id, nome: bairro.nome, estimativa, lat: bairro.lat, lng: bairro.lng })
            }
          >
            {jaAnotado ? "✓ No caderno" : "Anotar no caderno"}
          </button>
          <a className="botao botao--linha" href={linkStreetView(bairro)} target="_blank" rel="noopener noreferrer">
            Ver no Street View ↗<span className="so-leitor"> (abre em nova aba)</span>
          </a>
        </div>
      </header>

      {estimativa === null ? (
        <section className="bairro__vazio pautado">
          <h2>Ainda pouca gente por aqui</h2>
          <p>
            Com menos de {MINIMO_POR_BAIRRO} brasileiros no mapa, este bairro não mostra números nem grupos,
            pra ninguém ser identificado. Os bairros vizinhos podem ter mais movimento.
          </p>
          <Link to={`/mapa/${cidade.id}`} className="link-seta">
            Ver bairros vizinhos no mapa
          </Link>
        </section>
      ) : (
        <div className="bairro__colunas">
          <section aria-labelledby="grupos-titulo">
            <h2 id="grupos-titulo">Grupos</h2>
            <ul className="cartoes">
              {grupos.map((g) => (
                <li key={g.nome} className="cartao">
                  <p className="rotulo">{g.tipo}</p>
                  <h3>{g.nome}</h3>
                  <p>{g.sobre}</p>
                  <p className="cartao__meta">{g.membros} membros</p>
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="eventos-titulo">
            <h2 id="eventos-titulo">Eventos</h2>
            <ul className="agenda">
              {eventos.map((e) => (
                <li key={e.nome}>
                  <span className="agenda__quando">{e.quando}</span>
                  <span className="agenda__nome">{e.nome}</span>
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="pontos-titulo">
            <h2 id="pontos-titulo">Pontos de encontro</h2>
            <ul className="pontos">
              {pontos.map((p) => (
                <li key={p.nome}>
                  <p className="mao pontos__nome">{p.nome}</p>
                  <p className="pontos__meta">
                    {p.tipo} · {p.detalhe}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
      <p className="bairro__rodape aviso-ficticio">
        Grupos, eventos e lugares desta página são inventados para a demonstração.
      </p>
    </article>
  );
}
