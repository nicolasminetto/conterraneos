import { useMemo } from "react";
import { CIDADES, cidadePorId } from "../dados/cidades.js";
import { useGeo } from "../lib/useGeo.js";

/**
 * Campos de cidade atual + bairro. O bairro vem de uma lista fechada: nunca pedimos
 * endereço nem a localização do aparelho.
 */
export function CamposLocal({ valores, mudar }) {
  const geo = useGeo(valores.cidade);
  const bairros = useMemo(
    () =>
      geo ? geo.features.map((f) => f.properties).sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")) : [],
    [geo]
  );
  const unidade = cidadePorId(valores.cidade)?.unidade;

  return (
    <>
      <div className="campo">
        <label htmlFor="campo-cidade">Cidade onde mora (ou vai morar)</label>
        <select
          id="campo-cidade"
          value={valores.cidade}
          onChange={(e) => mudar({ cidade: e.target.value, bairro: "" })}
          required
        >
          {CIDADES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}, {c.pais}
            </option>
          ))}
        </select>
      </div>
      <div className="campo">
        <label htmlFor="campo-bairro">Bairro</label>
        <select
          id="campo-bairro"
          value={valores.bairro}
          onChange={(e) => mudar({ bairro: e.target.value })}
          required
          disabled={!geo}
          aria-describedby="ajuda-bairro"
        >
          <option value="">{geo ? `Escolha entre os ${bairros.length} ${unidade}` : "Carregando…"}</option>
          {bairros.map((b) => (
            <option key={b.id} value={b.id}>
              {b.nome}
            </option>
          ))}
        </select>
        <p id="ajuda-bairro" className="campo__ajuda">
          Só o bairro. Nunca pedimos endereço nem a sua localização.
        </p>
      </div>
    </>
  );
}

/** O opt-in do mapa: desligado por padrão, explicado em uma frase. */
export function CampoNoMapa({ marcado, mudar }) {
  return (
    <div className="campo campo--escolha">
      <input id="campo-no-mapa" type="checkbox" checked={marcado} onChange={(e) => mudar(e.target.checked)} />
      <label htmlFor="campo-no-mapa">
        <strong>Contar comigo no mapa do meu bairro</strong>
        <span>
          Você vira +1 no total do bairro. Ninguém vê seu nome nem onde você mora, e dá pra desligar quando
          quiser no perfil.
        </span>
      </label>
    </div>
  );
}
