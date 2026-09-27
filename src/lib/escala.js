// Escala sequencial do mapa: do papel ao laranja marca-texto, em cinco faixas fixas.
export const FAIXAS = [
  { ate: 25, cor: "#FBE1C8", rotulo: "5–24" },
  { ate: 75, cor: "#F7BA88", rotulo: "25–74" },
  { ate: 150, cor: "#F38D4A", rotulo: "75–149" },
  { ate: 250, cor: "#DF5F17", rotulo: "150–249" },
  { ate: Infinity, cor: "#9A3C0A", rotulo: "250+" }
];

export const SEM_DADOS = "#F4F3EE";

/** Cor do bairro a partir da estimativa pública (null = poucos dados). */
export function corDaEstimativa(n) {
  if (n === null) return SEM_DADOS;
  return FAIXAS.find((f) => n < f.ate).cor;
}

/** De 0 a 1, para desenhos que precisam de intensidade contínua. */
export function intensidade(n, teto = 400) {
  if (n === null) return 0;
  return Math.min(1, Math.sqrt(n / teto));
}

// Sobre o mar noturno da landing, mais gente = mais claro: brasa → laranja → pêssego.
const NO_ESCURO = [
  [0x6b, 0x2a, 0x10],
  [0xf2, 0x6a, 0x1b],
  [0xff, 0xd2, 0xa8]
];

/** Cor para fundo escuro, de 0 (pouca gente) a 1 (muita). */
export function corNoEscuro(i) {
  const t = Math.min(1, Math.max(0, i)) * (NO_ESCURO.length - 1);
  const k = Math.min(NO_ESCURO.length - 2, Math.floor(t));
  const f = t - k;
  const [a, b] = [NO_ESCURO[k], NO_ESCURO[k + 1]];
  return `rgb(${a.map((v, j) => Math.round(v + (b[j] - v) * f)).join(",")})`;
}
