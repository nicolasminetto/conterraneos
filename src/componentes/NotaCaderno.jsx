import { Link } from "react-router-dom";
import { cidadePorId } from "../dados/cidades.js";
import { linkStreetView } from "../lib/streetview.js";
import { useCaderno } from "../lib/caderno.jsx";
import "../estilos/caderno.css";

/** Uma anotação à mão no caderno, com carimbo de "visitado" e atalho pro Street View. */
export default function NotaCaderno({ nota, numero, nova = false }) {
  const { apagar } = useCaderno();
  const cidade = cidadePorId(nota.cidade);
  return (
    <li className={`nota${nova ? " nota--nova" : ""}`}>
      <span className="nota__numero mao" aria-hidden="true">
        {numero}.
      </span>
      <div className="nota__texto">
        <Link to={`/mapa/${nota.cidade}/${nota.bairro}`} className="nota__nome mao">
          {nota.nome}
        </Link>
        <p className="nota__meta">
          {cidade?.nome} ·{" "}
          {nota.estimativa === null ? "poucos dados" : `≈ ${nota.estimativa} brasileiros`}
        </p>
        <p className="nota__acoes">
          <a href={linkStreetView(nota)} target="_blank" rel="noopener noreferrer">
            Ver no Street View<span className="so-leitor"> (abre em nova aba)</span> ↗
          </a>
          <button type="button" className="nota__apagar" onClick={() => apagar(nota.cidade, nota.bairro)}>
            Apagar<span className="so-leitor"> {nota.nome}</span>
          </button>
        </p>
      </div>
      <span className="nota__carimbo" aria-hidden="true">
        visitado
      </span>
    </li>
  );
}
