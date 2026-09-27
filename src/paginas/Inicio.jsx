import { useRef } from "react";
import { Link } from "react-router-dom";
import { CIDADES } from "../dados/cidades.js";
import { useEntradas } from "../lib/rolagem.js";
import { useConta } from "../lib/conta.jsx";
import { MINIMO_POR_BAIRRO } from "../lib/privacidade.js";
import Carimbo from "../componentes/Carimbo.jsx";
import Viagem from "../landing/Viagem.jsx";
import CadernoDemo from "../landing/CadernoDemo.jsx";
import "../estilos/landing.css";

const PERGUNTAS = [
  "Em que bairro eu moro?",
  "Vou conhecer alguém?",
  "Onde acho pão de queijo?",
  "Tem pelada no fim de semana?",
  "É seguro andar à noite ali?"
];

const DATAS = ["12 MAR", "03 AGO", "28 JAN"];

// Casas de uma quadra, para o desenho de "pino individual" da cena de privacidade.
const PINOS = [
  [46, 58], [92, 40], [130, 84], [70, 120], [150, 140], [112, 168], [60, 176], [170, 60]
];

export default function Inicio() {
  const raiz = useRef(null);
  const { perfil } = useConta();
  useEntradas(raiz);

  return (
    <div ref={raiz} className="inicio">
      {/* 1. Capa do caderno */}
      <section className="capa pautado" aria-labelledby="capa-titulo">
        <div className="capa__margem" aria-hidden="true" />
        <div className="capa__carimbos" aria-hidden="true">
          {CIDADES.map((c, i) => (
            <Carimbo
              key={c.id}
              texto={c.nome}
              detalhe={DATAS[i]}
              tamanho={132}
              className={`capa__carimbo capa__carimbo--${i + 1}`}
              cor={i === 1 ? "var(--caneta)" : "var(--acento)"}
            />
          ))}
        </div>
        <div className="capa__texto">
          <p className="rotulo capa__rotulo">Toronto · Dublin · Oslo</p>
          <h1 id="capa-titulo" className="capa__titulo">
            <span className="capa__linha">Mudar de país não é</span>{" "}
            <span className="capa__linha">
              começar do <mark className="capa__marca">zero</mark>.
            </span>
          </h1>
          <p className="capa__sub">
            Veja em que bairros os brasileiros já moram, anote os que chamam a sua atenção e passeie
            por cada um no Street View antes de fazer a mala.
          </p>
          <div className="capa__acoes">
            <Link className="botao" to={perfil ? "/mapa" : "/entrar"}>
              {perfil ? "Abrir o mapa" : "Abrir meu caderno"}
            </Link>
            <Link className="link-seta" to="/mapa">
              Ver o mapa sem cadastro
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Antes de ir */}
      <section className="antes" aria-labelledby="antes-titulo">
        <div className="antes__texto" data-entra="subir">
          <p className="rotulo">Antes de ir</p>
          <h2 id="antes-titulo">Todo mundo faz as mesmas perguntas. Poucos têm pra quem perguntar.</h2>
          <p>
            Grupos de mensagem com milhares de pessoas, respostas soltas, endereço nenhum. A
            primeira decisão, onde morar, costuma ser tomada no escuro.
          </p>
        </div>
        <ul className="antes__notas" aria-label="Perguntas comuns antes da mudança">
          {PERGUNTAS.map((p, i) => (
            <li key={p} className="mao" data-entra="nota" style={{ "--atraso": `${i * 110}ms` }}>
              {p}
            </li>
          ))}
        </ul>
      </section>

      {/* 3. A viagem (pico) */}
      <Viagem />

      {/* 4. Seu caderno (movimento-assinatura) */}
      <CadernoDemo />

      {/* 5. O que a gente nunca mostra */}
      <section className="nunca" aria-labelledby="nunca-titulo">
        <div className="nunca__texto" data-entra="subir">
          <p className="rotulo">Privacidade</p>
          <h2 id="nunca-titulo">O mapa mostra bairros. Nunca pessoas.</h2>
          <ul className="nunca__regras">
            <li>
              <strong>Só o total do bairro.</strong> Ninguém aparece como um ponto no mapa, nem
              pra quem está logado.
            </li>
            <li>
              <strong>Mínimo de {MINIMO_POR_BAIRRO} pessoas.</strong> Com menos que isso, o bairro
              aparece como "poucos dados", sem número.
            </li>
            <li>
              <strong>Você escolhe aparecer.</strong> Entrar na contagem é opcional, vem desligado
              e dá pra sair a qualquer momento.
            </li>
          </ul>
          <Link to="/sobre" className="link-seta">
            Como tratamos os dados
          </Link>
        </div>

        <div className="nunca__comparacao">
          <figure className="nunca__quadro nunca__quadro--nao" data-entra="esquerda">
            <svg viewBox="0 0 220 220" aria-hidden="true">
              <path d="M0 100 H220 M0 150 H220 M40 0 V220 M110 0 V220 M180 0 V220" className="nunca__ruas" />
              {PINOS.map(([x, y]) => (
                <path
                  key={`${x}-${y}`}
                  d={`M${x} ${y} c-7 -10 -9 -14 -9 -18 a9 9 0 0 1 18 0 c0 4 -2 8 -9 18z`}
                  className="nunca__pino"
                />
              ))}
              <path d="M22 26 L198 196 M198 30 L26 192" className="nunca__risco" pathLength="1" />
            </svg>
            <figcaption>
              <strong>Nunca:</strong> um alfinete por pessoa.
            </figcaption>
          </figure>
          <figure className="nunca__quadro nunca__quadro--sim" data-entra="direita">
            <svg viewBox="0 0 220 220" aria-hidden="true">
              <path d="M0 100 H220 M0 150 H220 M40 0 V220 M110 0 V220 M180 0 V220" className="nunca__ruas" />
              <path
                d="M28 44 L120 22 L196 58 L188 148 L134 196 L44 184 L18 112 Z"
                className="nunca__bairro"
              />
              <text x="106" y="118" textAnchor="middle" className="nunca__numero">
                ≈ 120
              </text>
            </svg>
            <figcaption>
              <strong>Sempre:</strong> o bairro inteiro, arredondado.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 6. Chegada */}
      <section className="chegada" data-entra="fundo" aria-labelledby="chegada-titulo">
        <svg className="chegada__rota" viewBox="0 0 1200 200" preserveAspectRatio="none" aria-hidden="true">
          <path d="M-20 170 C 260 40, 520 210, 760 90 S 1120 40, 1220 120" />
        </svg>
        <div className="chegada__miolo">
          <p className="rotulo">Chegada</p>
          <h2 id="chegada-titulo">Alguém já abriu o caminho.</h2>
          <p>Escolha a cidade, veja os bairros e comece o seu caderno.</p>
          <Link className="botao" to="/mapa">
            Abrir o mapa
          </Link>
        </div>
      </section>
    </div>
  );
}
