import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { cidadePorId } from "../dados/cidades.js";
import { useGeo } from "../lib/useGeo.js";
import { bairrosEmSvg } from "../lib/projecao.js";
import { corDaEstimativa } from "../lib/escala.js";
import { useCaderno } from "../lib/caderno.jsx";
import { useConta } from "../lib/conta.jsx";
import Bilhetes from "../componentes/Bilhetes.jsx";
import NotaCaderno from "../componentes/NotaCaderno.jsx";

const LADO = 560;

/** Cena 4: o movimento-assinatura. Tocar num bairro deixa uma anotação no caderno ao lado. */
export default function CadernoDemo() {
  const [cidadeId, setCidadeId] = useState("dublin");
  const [foco, setFoco] = useState(null);
  const [ultima, setUltima] = useState(null);
  const geo = useGeo(cidadeId);
  const { perfil, registro } = useConta();
  const { notas, anotar, anotado } = useCaderno();
  const cidade = cidadePorId(cidadeId);

  const { bairros, caixa } = useMemo(
    () => (geo ? bairrosEmSvg(geo, cidadeId, LADO, LADO, { margem: 12, perfil: registro }) : { bairros: [], caixa: [0, 0, LADO, LADO] }),
    [geo, cidadeId, registro]
  );
  const ordenados = useMemo(
    () => bairros.filter((b) => b.estimativa !== null).sort((a, b) => b.estimativa - a.estimativa),
    [bairros]
  );

  function anotarBairro(b) {
    anotar({ cidade: cidadeId, bairro: b.id, nome: b.nome, estimativa: b.estimativa, lat: b.lat, lng: b.lng });
    setUltima(`${cidadeId}/${b.id}`);
  }

  return (
    <section className="caderno-demo" aria-labelledby="caderno-titulo">
      <div className="caderno-demo__cabeca">
        <p className="rotulo">Seu caderno</p>
        <h2 id="caderno-titulo">Toque num bairro. Ele vai pro caderno.</h2>
      </div>

      <div className="caderno-demo__livro">
        <div className="pagina-livro pagina-livro--mapa">
          <Bilhetes atual={cidadeId} aoEscolher={(id) => (setCidadeId(id), setFoco(null))} />
          <div className="mini-mapa">
            <svg viewBox={caixa.join(" ")} role="img" aria-label={`Mapa de ${cidade.nome} por concentração de brasileiros`}>
              {bairros.map((b) => (
                <path
                  key={b.id}
                  d={b.d}
                  fill={corDaEstimativa(b.estimativa)}
                  className={[
                    "mini-mapa__bairro",
                    b.estimativa === null && "sem-dados",
                    anotado(cidadeId, b.id) && "anotado",
                    foco?.id === b.id && "em-foco"
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onPointerEnter={() => setFoco(b)}
                  onClick={() => anotarBairro(b)}
                />
              ))}
            </svg>
            <p className="mini-mapa__dica" aria-live="polite">
              {foco ? (
                <>
                  <strong>{foco.nome}</strong> ·{" "}
                  {foco.estimativa === null ? "poucos dados" : `≈ ${foco.estimativa} brasileiros`}
                </>
              ) : (
                geo ? `${bairros.length} ${cidade.unidade} de ${cidade.nome}` : "Desenhando o mapa…"
              )}
            </p>
          </div>
          <label className="mini-mapa__lista">
            <span className="so-leitor">Ou escolha um bairro na lista</span>
            <select
              value=""
              onChange={(e) => {
                const b = bairros.find((x) => x.id === e.target.value);
                if (b) anotarBairro(b);
              }}
            >
              <option value="">Ou escolha na lista…</option>
              {ordenados.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nome} (≈ {b.estimativa})
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="pagina-livro pagina-livro--notas pautado">
          <p className="mao pagina-livro__titulo">Bairros pra visitar</p>
          {notas.length === 0 ? (
            <p className="mao pagina-livro__vazio">
              Nada anotado ainda. Toque num bairro colorido do mapa.
            </p>
          ) : (
            <ol className="notas">
              {notas.map((nota, i) => (
                <NotaCaderno
                  key={`${nota.cidade}/${nota.bairro}`}
                  nota={nota}
                  numero={i + 1}
                  nova={ultima === `${nota.cidade}/${nota.bairro}`}
                />
              ))}
            </ol>
          )}
          {notas.length > 0 && (
            <p className="pagina-livro__rodape">
              O caderno fica salvo neste navegador e aparece também no{" "}
              <Link to={perfil ? "/perfil" : "/mapa"}>{perfil ? "seu perfil" : "mapa completo"}</Link>.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
