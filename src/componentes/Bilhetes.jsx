import { CIDADES } from "../dados/cidades.js";

/** Seletor de cidade em forma de bilhetes de metrô. */
export default function Bilhetes({ atual, aoEscolher, rotulo = "Cidade" }) {
  return (
    <div className="bilhetes" role="group" aria-label={rotulo}>
      {CIDADES.map((c) => (
        <button
          key={c.id}
          type="button"
          aria-pressed={c.id === atual}
          className="bilhete"
          onClick={() => aoEscolher(c.id)}
        >
          <span className="bilhete__cidade">{c.nome}</span>
          <span className="bilhete__pais">{c.pais}</span>
        </button>
      ))}
    </div>
  );
}
