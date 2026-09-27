import { useCallback, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { cidadePorId } from "../dados/cidades.js";
import { useGeo } from "../lib/useGeo.js";
import { bairrosComEstimativa, totalDaCidade } from "../lib/comunidade.js";
import { FAIXAS, SEM_DADOS } from "../lib/escala.js";
import { MINIMO_POR_BAIRRO, textoEstimativa } from "../lib/privacidade.js";
import { linkStreetView } from "../lib/streetview.js";
import { useCaderno } from "../lib/caderno.jsx";
import { useConta } from "../lib/conta.jsx";
import Bilhetes from "../componentes/Bilhetes.jsx";
import MapaLeaflet from "../componentes/MapaLeaflet.jsx";
import "../estilos/app.css";

function Legenda() {
  return (
    <div className="legenda">
      <p className="rotulo">Brasileiros por bairro</p>
      <ul>
        {FAIXAS.map((f) => (
          <li key={f.rotulo}>
            <span className="legenda__cor" style={{ background: f.cor }} />
            {f.rotulo}
          </li>
        ))}
        <li>
          <span className="legenda__cor legenda__cor--vazia" style={{ background: SEM_DADOS }} />
          Menos de {MINIMO_POR_BAIRRO}: poucos dados
        </li>
      </ul>
    </div>
  );
}

function PainelBairro({ cidade, bairro, aoFechar }) {
  const { anotado, anotar, apagar } = useCaderno();
  const jaAnotado = anotado(cidade.id, bairro.id);
  return (
    <section className="painel-bairro" aria-labelledby="painel-titulo">
      <button type="button" className="painel-bairro__fechar" onClick={aoFechar}>
        <span aria-hidden="true">×</span>
        <span className="so-leitor">Fechar o painel do bairro</span>
      </button>
      <p className="rotulo">
        {cidade.nome} · {cidade.pais}
      </p>
      <h2 id="painel-titulo">{bairro.nome}</h2>
      <p className="painel-bairro__numero">{textoEstimativa(bairro.estimativa)}</p>
      {bairro.estimativa === null && (
        <p className="painel-bairro__nota">
          Menos de {MINIMO_POR_BAIRRO} pessoas aqui. Pra proteger quem mora no bairro, não mostramos o número.
        </p>
      )}
      <div className="painel-bairro__acoes">
        <button
          type="button"
          className={jaAnotado ? "botao botao--linha" : "botao"}
          aria-pressed={jaAnotado}
          onClick={() =>
            jaAnotado
              ? apagar(cidade.id, bairro.id)
              : anotar({ cidade: cidade.id, bairro: bairro.id, nome: bairro.nome, estimativa: bairro.estimativa, lat: bairro.lat, lng: bairro.lng })
          }
        >
          {jaAnotado ? "✓ No caderno" : "Anotar no caderno"}
        </button>
        <a className="botao botao--linha" href={linkStreetView(bairro)} target="_blank" rel="noopener noreferrer">
          Ver no Street View ↗<span className="so-leitor"> (abre em nova aba)</span>
        </a>
      </div>
      <Link className="link-seta" to={`/mapa/${cidade.id}/${bairro.id}`}>
        Grupos, eventos e pontos de encontro
      </Link>
    </section>
  );
}

export default function Mapa() {
  const { cidade: cidadeId } = useParams();
  const [busca, setBusca] = useSearchParams();
  const [filtro, setFiltro] = useState("");
  const navegar = useNavigate();
  const { perfil, registro } = useConta();
  const { notas, anotado } = useCaderno();
  const cidade = cidadeId && cidadePorId(cidadeId);
  const geo = useGeo(cidade ? cidade.id : "toronto");

  const bairros = useMemo(
    () => (geo && cidade ? bairrosComEstimativa(geo, cidade.id, registro) : []),
    [geo, cidade, registro]
  );
  const anotadoAqui = useCallback((id) => anotado(cidadeId, id), [anotado, cidadeId]);

  if (!cidade) {
    const padrao = cidadePorId(perfil?.cidade) ?? cidadePorId("toronto");
    return <Navigate to={`/mapa/${padrao.id}`} replace />;
  }

  const selecionadoId = busca.get("bairro");
  const selecionado = bairros.find((b) => b.id === selecionadoId) ?? null;
  const selecionar = (id) => setBusca(id ? { bairro: id } : {}, { replace: true });

  const termo = filtro.trim().toLowerCase();
  const lista = bairros
    .filter((b) => (termo ? b.nome.toLowerCase().includes(termo) : b.estimativa !== null))
    .sort((a, b) => (b.estimativa ?? -1) - (a.estimativa ?? -1))
    .slice(0, termo ? 30 : 8);
  const notasDaCidade = notas.filter((n) => n.cidade === cidade.id).length;

  return (
    <div className="tela-mapa">
      <aside className="tela-mapa__lado">
        <Bilhetes atual={cidade.id} aoEscolher={(id) => navegar(`/mapa/${id}`)} />
        <div>
          <h1 className="tela-mapa__titulo">Brasileiros em {cidade.nome}</h1>
          <p className="tela-mapa__resumo">
            ≈ {(Math.round(totalDaCidade(cidade.id) / 100) * 100).toLocaleString("pt-BR")} no mapa, em{" "}
            {bairros.length || "…"} {cidade.unidade}.{" "}
            <span className="aviso-ficticio">dados fictícios</span>
          </p>
        </div>

        {selecionado ? (
          <PainelBairro cidade={cidade} bairro={selecionado} aoFechar={() => selecionar(null)} />
        ) : (
          <section className="lista-bairros" aria-labelledby="lista-titulo">
            <label htmlFor="filtro-bairro" id="lista-titulo" className="rotulo">
              {termo ? "Resultado da busca" : "Onde há mais brasileiros"}
            </label>
            <input
              id="filtro-bairro"
              type="search"
              placeholder="Buscar bairro pelo nome"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              autoComplete="off"
            />
            <ol>
              {lista.map((b) => (
                <li key={b.id}>
                  <button type="button" onClick={() => selecionar(b.id)}>
                    <span>{b.nome}</span>
                    <span className="lista-bairros__num">{b.estimativa === null ? "poucos dados" : `≈ ${b.estimativa}`}</span>
                  </button>
                </li>
              ))}
              {termo && lista.length === 0 && <li className="lista-bairros__vazio">Nenhum bairro com esse nome.</li>}
            </ol>
          </section>
        )}

        <Legenda />

        <p className="tela-mapa__caderno">
          <span className="mao">
            {notasDaCidade === 0 ? "Nenhum bairro anotado aqui ainda." : `${notasDaCidade} ${notasDaCidade === 1 ? "bairro anotado" : "bairros anotados"} em ${cidade.nome}.`}
          </span>{" "}
          {perfil ? <Link to="/perfil">Ver meu caderno</Link> : <Link to="/entrar">Criar conta pra guardar o caderno</Link>}
        </p>
      </aside>

      <div className="tela-mapa__mapa">
        {geo ? (
          <MapaLeaflet
            geo={geo}
            bairros={bairros}
            selecionado={selecionadoId}
            anotado={anotadoAqui}
            aoSelecionar={selecionar}
          />
        ) : (
          <p className="carregando">Desenhando {cidade.nome}…</p>
        )}
      </div>
    </div>
  );
}
