import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { CIDADES, cidadePorId } from "../dados/cidades.js";
import { bairroDoGeo, useGeo } from "../lib/useGeo.js";
import { contagemBruta } from "../lib/comunidade.js";
import { estimativaPublica } from "../lib/privacidade.js";
import { linkStreetView } from "../lib/streetview.js";
import { useConta } from "../lib/conta.jsx";
import { useCaderno } from "../lib/caderno.jsx";
import { CampoNoMapa, CamposLocal } from "../componentes/CamposPerfil.jsx";
import NotaCaderno from "../componentes/NotaCaderno.jsx";
import "../estilos/app.css";

function Privacidade({ perfil, atualizar }) {
  const geo = useGeo(perfil.cidade);
  const bairro = bairroDoGeo(geo, perfil.bairro);
  const estimativa = estimativaPublica(contagemBruta(perfil.cidade, perfil.bairro, perfil));

  let situacao = "Você não entra em nenhuma contagem.";
  if (perfil.noMapa && bairro) {
    situacao =
      estimativa === null
        ? `Você conta em ${bairro.nome}, mas o bairro ainda tem menos de 5 pessoas: o mapa mostra "poucos dados".`
        : `Você é um dos ≈ ${estimativa} brasileiros de ${bairro.nome}. Ninguém sabe qual.`;
  }

  return (
    <section className="perfil__bloco" aria-labelledby="privacidade-titulo">
      <h2 id="privacidade-titulo">Privacidade</h2>
      <CampoNoMapa marcado={Boolean(perfil.noMapa)} mudar={(noMapa) => atualizar({ noMapa })} />
      <p className="perfil__situacao mao" aria-live="polite">
        {situacao}
      </p>
    </section>
  );
}

function Dados({ perfil, atualizar }) {
  const [editando, setEditando] = useState(false);
  const [rascunho, setRascunho] = useState(perfil);
  const geo = useGeo(perfil.cidade);
  const bairro = bairroDoGeo(geo, perfil.bairro);
  const mudar = (m) => setRascunho((r) => ({ ...r, ...m }));

  if (!editando) {
    return (
      <section className="perfil__bloco" aria-labelledby="dados-titulo">
        <h2 id="dados-titulo">Dados</h2>
        <dl className="perfil__dados">
          <dt>Nome</dt>
          <dd>{perfil.nome}</dd>
          <dt>E-mail</dt>
          <dd>{perfil.email}</dd>
          <dt>De</dt>
          <dd>{perfil.origem}</dd>
          <dt>Mora em</dt>
          <dd>
            {bairro?.nome ?? "…"}, {cidadePorId(perfil.cidade)?.nome}
          </dd>
        </dl>
        <button type="button" className="botao botao--linha botao--pequeno" onClick={() => (setRascunho(perfil), setEditando(true))}>
          Editar dados
        </button>
      </section>
    );
  }

  return (
    <section className="perfil__bloco" aria-labelledby="dados-titulo">
      <h2 id="dados-titulo">Editar dados</h2>
      <form
        className="formulario"
        onSubmit={(e) => {
          e.preventDefault();
          atualizar({ nome: rascunho.nome.trim(), origem: rascunho.origem.trim(), cidade: rascunho.cidade, bairro: rascunho.bairro });
          setEditando(false);
        }}
      >
        <div className="campo">
          <label htmlFor="editar-nome">Nome</label>
          <input id="editar-nome" value={rascunho.nome} onChange={(e) => mudar({ nome: e.target.value })} required />
        </div>
        <div className="campo">
          <label htmlFor="editar-origem">Cidade de origem no Brasil</label>
          <input id="editar-origem" value={rascunho.origem} onChange={(e) => mudar({ origem: e.target.value })} required />
        </div>
        <CamposLocal valores={rascunho} mudar={mudar} />
        <div className="formulario__acoes">
          <button type="submit" className="botao botao--pequeno">
            Salvar
          </button>
          <button type="button" className="botao botao--linha botao--pequeno" onClick={() => setEditando(false)}>
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}

export default function Perfil() {
  const { perfil, atualizar, sair, apagarTudo } = useConta();
  const { notas, limpar } = useCaderno();
  const navegar = useNavigate();
  if (!perfil) return <Navigate to="/entrar" replace />;

  const porCidade = CIDADES.map((c) => ({ cidade: c, notas: notas.filter((n) => n.cidade === c.id) })).filter(
    (g) => g.notas.length
  );

  return (
    <div className="pagina perfil">
      <header>
        <p className="rotulo">Perfil</p>
        <h1 className="pagina__titulo">Oi, {perfil.nome.split(" ")[0]}.</h1>
      </header>

      <div className="perfil__grade">
        <section className="perfil__caderno pautado" aria-labelledby="caderno-titulo">
          <h2 id="caderno-titulo" className="mao">
            Meu caderno
          </h2>
          {porCidade.length === 0 ? (
            <p className="mao perfil__vazio">
              Nenhum bairro anotado. <Link to="/mapa">Abra o mapa</Link> e toque em "Anotar no caderno".
            </p>
          ) : (
            porCidade.map(({ cidade, notas: lista }) => (
              <div key={cidade.id} className="perfil__roteiro">
                <div className="perfil__roteiro-cabeca">
                  <h3>
                    Roteiro em {cidade.nome} <span>({lista.length})</span>
                  </h3>
                  <a href={linkStreetView(lista[0])} target="_blank" rel="noopener noreferrer" className="link-seta">
                    Começar pelo Street View ↗<span className="so-leitor"> (abre em nova aba)</span>
                  </a>
                </div>
                <ol className="notas">
                  {lista.map((nota, i) => (
                    <NotaCaderno key={nota.bairro} nota={nota} numero={i + 1} />
                  ))}
                </ol>
              </div>
            ))
          )}
          {notas.length > 0 && (
            <button type="button" className="perfil__limpar" onClick={limpar}>
              Apagar todas as anotações
            </button>
          )}
        </section>

        <div className="perfil__coluna">
          <Privacidade perfil={perfil} atualizar={atualizar} />
          <Dados perfil={perfil} atualizar={atualizar} />
          <section className="perfil__bloco" aria-labelledby="conta-titulo">
            <h2 id="conta-titulo">Conta</h2>
            <div className="formulario__acoes">
              <button type="button" className="botao botao--linha botao--pequeno" onClick={() => (sair(), navegar("/"))}>
                Sair
              </button>
              <button
                type="button"
                className="botao botao--linha botao--pequeno perfil__perigo"
                onClick={() => {
                  if (window.confirm("Apagar conta e caderno deste navegador? Não dá pra desfazer.")) {
                    apagarTudo();
                    limpar();
                    navegar("/");
                  }
                }}
              >
                Apagar meus dados
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
