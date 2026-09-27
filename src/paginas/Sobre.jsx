import { Link } from "react-router-dom";
import { CIDADES } from "../dados/cidades.js";
import { MINIMO_POR_BAIRRO } from "../lib/privacidade.js";
import "../estilos/app.css";

const PASSOS = [
  {
    titulo: "Escolha a cidade",
    texto: "Toronto, Dublin ou Oslo. O mapa pinta cada bairro conforme a quantidade de brasileiros que moram ali."
  },
  {
    titulo: "Anote no caderno",
    texto: "Toque num bairro e anote. O caderno vira um roteiro de bairros pra conhecer."
  },
  {
    titulo: "Passeie antes de ir",
    texto: "Cada anotação abre o Street View no Google Maps, direto no bairro. Dá pra ver a rua antes de assinar o aluguel."
  }
];

export default function Sobre() {
  return (
    <div className="pagina sobre">
      <header className="sobre__cabeca">
        <p className="rotulo">Como funciona</p>
        <h1 className="pagina__titulo">Um mapa de onde a comunidade já está.</h1>
        <p className="pagina__intro">
          Conterrâneos ajuda quem vai morar fora a escolher bairro olhando pra onde os brasileiros já
          moram, e a encontrar os grupos, eventos e lugares de cada bairro.
        </p>
      </header>

      <ol className="sobre__passos">
        {PASSOS.map((p, i) => (
          <li key={p.titulo}>
            <span className="sobre__num mao" aria-hidden="true">
              {i + 1}
            </span>
            <h2>{p.titulo}</h2>
            <p>{p.texto}</p>
          </li>
        ))}
      </ol>

      <section className="sobre__privacidade" aria-labelledby="privacidade-titulo">
        <h2 id="privacidade-titulo">Privacidade, em linguagem simples</h2>
        <dl>
          <dt>O que pedimos</dt>
          <dd>Nome, e-mail, cidade de origem, cidade atual e bairro, escolhido numa lista. Nada além disso.</dd>
          <dt>O que nunca pedimos</dt>
          <dd>Endereço, número de telefone ou a localização do seu aparelho.</dd>
          <dt>O que o mapa mostra</dt>
          <dd>
            Só o total de cada bairro, arredondado. Nenhuma pessoa aparece como um ponto, nem pra quem
            está logado. Bairro com menos de {MINIMO_POR_BAIRRO} pessoas aparece como "poucos dados".
          </dd>
          <dt>Entrar na contagem</dt>
          <dd>
            É opcional e vem desligado. Você liga no cadastro ou no perfil, e desliga quando quiser. Desligou,
            saiu da conta na hora.
          </dd>
          <dt>Apagar tudo</dt>
          <dd>No perfil, "Apagar meus dados" remove conta e caderno.</dd>
        </dl>
      </section>

      <section className="sobre__prototipo" aria-labelledby="prototipo-titulo">
        <h2 id="prototipo-titulo">Sobre este protótipo</h2>
        <p>
          Este é um projeto de portfólio. <strong>As contagens, os grupos, os eventos e os lugares são fictícios.</strong>{" "}
          O cadastro fica só no seu navegador; não existe servidor. Os limites dos bairros são reais:
        </p>
        <ul>
          {CIDADES.map((c) => (
            <li key={c.id}>
              <strong>{c.nome}:</strong> {c.fonte}
            </li>
          ))}
        </ul>
        <p>
          Com dados reais, o tratamento de dados pessoais de brasileiros pode cair na LGPD e nas leis de
          privacidade de cada país. Isso exigiria revisão jurídica antes de qualquer lançamento.
        </p>
        <Link className="botao" to="/mapa">
          Abrir o mapa
        </Link>
      </section>
    </div>
  );
}
