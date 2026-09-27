// Grupos, eventos e pontos de encontro FICTÍCIOS. São montados a partir de modelos e do id do
// bairro, então cada bairro sempre mostra a mesma lista. Nomes de lugares são inventados.

const GRUPOS = [
  { nome: "Brasileiros em {b}", tipo: "Grupo de mensagens", sobre: "Dúvidas do dia a dia, indicações e caronas." },
  { nome: "Pelada de domingo · {b}", tipo: "Esporte", sobre: "Futebol amador. Leva chuteira e água." },
  { nome: "Mães e pais BR de {b}", tipo: "Família", sobre: "Escola, pediatra, brincadeira em português." },
  { nome: "Corrida da manhã {b}", tipo: "Esporte", sobre: "5 km no ritmo de quem conversa." },
  { nome: "Clube do livro em português", tipo: "Cultura", sobre: "Um livro por mês, encontro na última sexta." },
  { nome: "Recém-chegados {b}", tipo: "Acolhimento", sobre: "Documentos, aluguel, banco: quem chegou antes ajuda." }
];

const EVENTOS = [
  { nome: "Roda de samba", quando: "Sábado, 17h" },
  { nome: "Feijoada coletiva", quando: "Domingo, 13h" },
  { nome: "Aula aberta de forró", quando: "Quinta, 19h30" },
  { nome: "Troca de livros e gibis", quando: "Sábado, 11h" },
  { nome: "Capoeira no parque", quando: "Domingo, 10h" },
  { nome: "Noite de currículo e entrevistas", quando: "Terça, 18h30" },
  { nome: "Jogo do Brasil no telão", quando: "Em dia de jogo" }
];

const PONTOS = [
  { nome: "Padaria Saudade", tipo: "Padaria", detalhe: "Pão de queijo às terças." },
  { nome: "Mercadinho Tropeiro", tipo: "Mercado", detalhe: "Farofa, guaraná e erva-mate." },
  { nome: "Café Varanda", tipo: "Café", detalhe: "Mesa comprida, bom pra trabalhar." },
  { nome: "Biblioteca do bairro", tipo: "Espaço público", detalhe: "Sala de grupos gratuita." },
  { nome: "Praça central", tipo: "Ao ar livre", detalhe: "Ponto de encontro das caminhadas." },
  { nome: "Barbearia Vila", tipo: "Serviço", detalhe: "Atendimento em português." }
];

function semente(texto) {
  let h = 2166136261;
  for (const c of texto) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

function escolher(lista, quantos, s) {
  const copia = [...lista];
  const saida = [];
  while (saida.length < quantos && copia.length) {
    s = Math.imul(s ^ (s >>> 13), 1274126177) >>> 0;
    saida.push(copia.splice(s % copia.length, 1)[0]);
  }
  return saida;
}

/** Quanto maior a comunidade, mais coisa acontecendo. Poucos dados = lista vazia. */
export function encontrosDoBairro(cidade, bairro, estimativa) {
  if (estimativa === null) return { grupos: [], eventos: [], pontos: [] };
  const s = semente(`${cidade}/${bairro.id}`);
  const tamanho = estimativa > 150 ? 3 : estimativa > 40 ? 2 : 1;
  const trocar = (item) => ({ ...item, nome: item.nome.replace("{b}", bairro.nome) });
  return {
    grupos: escolher(GRUPOS, tamanho + 1, s).map((g, i) => ({
      ...trocar(g),
      membros: Math.max(5, Math.round(estimativa * (0.35 - i * 0.08)))
    })),
    eventos: escolher(EVENTOS, tamanho, s + 1).map(trocar),
    pontos: escolher(PONTOS, tamanho, s + 2).map(trocar)
  };
}
