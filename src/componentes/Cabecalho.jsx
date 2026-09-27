import { Link, NavLink } from "react-router-dom";
import { useConta } from "../lib/conta.jsx";

export default function Cabecalho() {
  const { perfil } = useConta();
  return (
    <header className="cabecalho">
      <Link to="/" className="marca" aria-label="Conterrâneos, página inicial">
        <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
          <circle cx="16" cy="16" r="13" fill="none" stroke="var(--acento)" strokeWidth="3" />
          <circle cx="16" cy="16" r="7.5" fill="none" stroke="var(--acento)" strokeWidth="2" strokeDasharray="2 2.2" />
          <circle cx="16" cy="16" r="2.6" fill="var(--tinta)" />
        </svg>
        <span>Conterrâneos</span>
      </Link>
      <nav aria-label="Principal">
        <ul>
          <li>
            <NavLink to="/mapa">Mapa</NavLink>
          </li>
          <li>
            <NavLink to="/sobre">Como funciona</NavLink>
          </li>
          <li>
            {perfil ? (
              <NavLink to="/perfil" className="cabecalho__conta">
                {perfil.nome.split(" ")[0]}
              </NavLink>
            ) : (
              <NavLink to="/entrar" className="cabecalho__conta">
                Entrar
              </NavLink>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
