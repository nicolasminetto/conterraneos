import dados from "../dados/comunidade.json";
import { estimativaPublica } from "./privacidade.js";

/**
 * Contagem bruta de um bairro. Se o visitante tem conta, marcou o opt-in e declarou morar
 * ali, ele entra na conta: é o mesmo caminho que os dados reais seguiriam.
 */
export function contagemBruta(cidade, bairro, perfil) {
  const base = dados.cidades[cidade]?.[bairro] ?? 0;
  const contaVoce = perfil?.noMapa && perfil.cidade === cidade && perfil.bairro === bairro;
  return base + (contaVoce ? 1 : 0);
}

export function totalDaCidade(cidade) {
  return Object.values(dados.cidades[cidade] ?? {}).reduce((a, b) => a + b, 0);
}

/** Lista de bairros da cidade com a estimativa pública, sem desenho (para o Leaflet e listas). */
export function bairrosComEstimativa(geo, cidade, perfil) {
  return geo.features.map(({ properties: { id, nome, lat, lng } }) => ({
    id,
    nome,
    lat,
    lng,
    estimativa: estimativaPublica(contagemBruta(cidade, id, perfil))
  }));
}
