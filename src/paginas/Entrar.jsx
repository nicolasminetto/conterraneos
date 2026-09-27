import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useConta } from "../lib/conta.jsx";
import { CampoNoMapa, CamposLocal } from "../componentes/CamposPerfil.jsx";
import "../estilos/app.css";

function Cadastro() {
  const { cadastrar } = useConta();
  const navegar = useNavigate();
  const [dados, setDados] = useState({
    nome: "",
    email: "",
    origem: "",
    cidade: "toronto",
    bairro: "",
    noMapa: false
  });
  const mudar = (m) => setDados((d) => ({ ...d, ...m }));

  function enviar(e) {
    e.preventDefault();
    cadastrar({ ...dados, nome: dados.nome.trim(), origem: dados.origem.trim() });
    navegar(`/mapa/${dados.cidade}?bairro=${dados.bairro}`);
  }

  return (
    <form className="formulario" onSubmit={enviar}>
      <div className="campo">
        <label htmlFor="campo-nome">Nome</label>
        <input id="campo-nome" value={dados.nome} onChange={(e) => mudar({ nome: e.target.value })} required autoComplete="given-name" />
      </div>
      <div className="campo">
        <label htmlFor="campo-email">E-mail</label>
        <input id="campo-email" type="email" value={dados.email} onChange={(e) => mudar({ email: e.target.value })} required autoComplete="email" />
      </div>
      <div className="campo">
        <label htmlFor="campo-origem">Cidade de origem no Brasil</label>
        <input
          id="campo-origem"
          value={dados.origem}
          onChange={(e) => mudar({ origem: e.target.value })}
          placeholder="Ex.: Belo Horizonte"
          required
        />
      </div>
      <CamposLocal valores={dados} mudar={mudar} />
      <CampoNoMapa marcado={dados.noMapa} mudar={(noMapa) => mudar({ noMapa })} />
      <button type="submit" className="botao">
        Criar conta e abrir o mapa
      </button>
    </form>
  );
}

function Login() {
  const { entrar, registro } = useConta();
  const navegar = useNavigate();
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");

  function enviar(e) {
    e.preventDefault();
    if (entrar(email)) navegar("/perfil");
    else setErro(registro ? "Esse e-mail não bate com o cadastro deste navegador." : "Ainda não há conta criada neste navegador.");
  }

  return (
    <form className="formulario" onSubmit={enviar} noValidate>
      <div className="campo">
        <label htmlFor="login-email">E-mail</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => (setEmail(e.target.value), setErro(""))}
          required
          autoComplete="email"
          aria-invalid={Boolean(erro)}
          aria-describedby={erro ? "login-erro" : undefined}
        />
        {erro && (
          <p id="login-erro" className="campo__erro" role="alert">
            {erro}
          </p>
        )}
      </div>
      <button type="submit" className="botao">
        Entrar
      </button>
    </form>
  );
}

export default function Entrar() {
  const { perfil, registro } = useConta();
  const [aba, setAba] = useState(registro ? "login" : "cadastro");
  // Só redireciona quem já chegou logado; quem acabou de se cadastrar segue pro mapa.
  const [chegouLogado] = useState(Boolean(perfil));
  if (chegouLogado) return <Navigate to="/perfil" replace />;

  return (
    <div className="pagina entrar">
      <div className="entrar__texto">
        <p className="rotulo">Seu caderno</p>
        <h1 className="pagina__titulo">{aba === "cadastro" ? "Comece o seu caderno" : "Bem-vindo de volta"}</h1>
        <p className="pagina__intro">
          A conta guarda os bairros que você anotou e, se quiser, conta você no mapa do seu bairro.
        </p>
        <p className="entrar__prototipo">
          <strong>Protótipo:</strong> não existe servidor. O cadastro fica só neste navegador, sem senha.{" "}
          <Link to="/sobre">Como tratamos os dados</Link>
        </p>
      </div>
      <div className="entrar__caixa">
        <div className="abas" role="group" aria-label="Cadastro ou login">
          <button type="button" aria-pressed={aba === "cadastro"} onClick={() => setAba("cadastro")}>
            Criar conta
          </button>
          <button type="button" aria-pressed={aba === "login"} onClick={() => setAba("login")}>
            Já tenho conta
          </button>
        </div>
        <div>{aba === "cadastro" ? <Cadastro /> : <Login />}</div>
      </div>
    </div>
  );
}
