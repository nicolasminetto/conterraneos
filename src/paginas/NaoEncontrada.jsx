import { Link } from "react-router-dom";

export default function NaoEncontrada() {
  return (
    <div className="pagina">
      <p className="rotulo">Erro 404</p>
      <h1 className="pagina__titulo">Esse endereço não está no caderno.</h1>
      <p className="pagina__intro">
        Talvez o link esteja errado, ou o bairro não exista nessa cidade.
      </p>
      <p style={{ marginTop: "var(--e-4)" }}>
        <Link className="botao" to="/mapa">
          Voltar pro mapa
        </Link>
      </p>
    </div>
  );
}
