#!/usr/bin/env node
/*
 * Gera src/dados/comunidade.json: estimativas FICTÍCIAS de brasileiros por bairro.
 *
 * Os números são inventados, mas seguem uma lógica plausível: cada cidade tem alguns
 * bairros "polo" (onde a comunidade costuma se concentrar), a vizinhança dos polos
 * herda parte do peso, e o resto recebe um valor baixo e estável. O sorteio usa uma
 * semente fixa, então rodar o script de novo gera exatamente o mesmo arquivo.
 *
 * Uso: node scripts/gerar-dados.mjs
 */
import { readFile, writeFile } from "node:fs/promises";

const CIDADES = {
  toronto: {
    teto: 420,
    meiaVidaKm: 1.6,
    polos: {
      "084": 1, "172": 0.95, "171": 0.9, "083": 0.85, "092": 0.8, "081": 0.72, "110": 0.7,
      "086": 0.6, "080": 0.58, "090": 0.55, "107": 0.5, "094": 0.48, "115": 0.42, "113": 0.4,
      "163": 0.55, "164": 0.45, "168": 0.4, "078": 0.38, "085": 0.36, "162": 0.5, "095": 0.3
    }
  },
  dublin: {
    teto: 360,
    meiaVidaKm: 0.9,
    polos: {
      "north-city": 1, "rotunda": 0.95, "mountjoy": 0.9, "inns-quay": 0.85, "arran-quay": 0.8,
      "ushers": 0.78, "merchants-quay": 0.7, "ballybough": 0.66, "north-dock": 0.6,
      "mansion-house": 0.55, "royal-exchange": 0.5, "wood-quay": 0.48, "rathmines-west": 0.62,
      "rathmines-east": 0.46, "drumcondra-south": 0.44, "botanic": 0.4, "cabra-east": 0.38,
      "south-dock": 0.42, "saint-kevin-s": 0.4, "pembroke-west": 0.3
    }
  },
  oslo: {
    teto: 240,
    meiaVidaKm: 1.1,
    polos: {
      "grunerlokka": 1, "gamle-oslo": 0.9, "sagene": 0.7, "st-hanshaugen": 0.62, "frogner": 0.5,
      "sentrum": 0.35, "alna": 0.35, "bjerke": 0.3, "nordstrand": 0.2, "ullern": 0.18
    }
  }
};

// Mulberry32: gerador pseudoaleatório pequeno e determinístico.
function sorteador(semente) {
  return () => {
    semente |= 0;
    semente = (semente + 0x6d2b79f5) | 0;
    let t = Math.imul(semente ^ (semente >>> 15), 1 | semente);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function distanciaKm(a, b) {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

const saida = { aviso: "Dados fictícios, gerados por scripts/gerar-dados.mjs.", cidades: {} };

for (const [cidade, { teto, meiaVidaKm, polos }] of Object.entries(CIDADES)) {
  const geo = JSON.parse(await readFile(`src/dados/geo/${cidade}.json`, "utf8"));
  const bairros = geo.features.map((f) => f.properties);
  const aleatorio = sorteador(cidade.length * 7919 + bairros.length);
  const centros = Object.keys(polos).map((id) => {
    const b = bairros.find((x) => x.id === id);
    if (!b) throw new Error(`Polo desconhecido em ${cidade}: ${id}`);
    return { ...b, peso: polos[id] };
  });

  const contagens = {};
  for (const bairro of bairros) {
    // Peso = o polo mais forte ao alcance, decaindo pela metade a cada `meiaVidaKm`.
    let peso = 0;
    for (const polo of centros) {
      const influencia = polo.peso * Math.pow(0.5, distanciaKm(bairro, polo) / meiaVidaKm);
      if (influencia > 0.04) peso = Math.max(peso, influencia); // polo distante não conta
    }
    const ruido = 0.75 + aleatorio() * 0.5;
    const fundo = Math.floor(aleatorio() * 9); // de 0 a 8: muitos ficam abaixo do limite
    contagens[bairro.id] = Math.round(peso * teto * ruido) + fundo;
  }
  saida.cidades[cidade] = contagens;
}

await writeFile("src/dados/comunidade.json", JSON.stringify(saida, null, 1) + "\n");
for (const [cidade, c] of Object.entries(saida.cidades)) {
  const valores = Object.values(c);
  const abaixo = valores.filter((v) => v < 5).length;
  console.log(
    `${cidade}: ${valores.length} bairros, total ${valores.reduce((a, b) => a + b, 0)}, ` +
      `máx ${Math.max(...valores)}, ${abaixo} abaixo do limite`
  );
}
