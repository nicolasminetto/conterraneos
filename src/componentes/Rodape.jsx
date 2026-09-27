import { Link } from "react-router-dom";

export default function Rodape() {
  return (
    <footer className="rodape">
      <div className="rodape__miolo">
        <p className="rodape__marca">Conterrâneos</p>
        <p className="rodape__aviso">
          Protótipo de portfólio. Todas as contagens, grupos e eventos são fictícios. Os limites de
          bairro são reais: City of Toronto Open Data, CSO (Irlanda) e OpenStreetMap.
        </p>
        <nav aria-label="Rodapé">
          <Link to="/mapa">Mapa</Link>
          <Link to="/sobre">Como funciona e privacidade</Link>
          <a href="https://github.com/nicolasminetto">GitHub</a>
          <a href="https://www.linkedin.com/in/nicolas-minetto-658938ab/">LinkedIn</a>
        </nav>
        <p className="rodape__autor">Feito por Nícolas Minetto</p>
      </div>
    </footer>
  );
}
