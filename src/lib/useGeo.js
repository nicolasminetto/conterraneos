import { useEffect, useState } from "react";
import { cidadePorId } from "../dados/cidades.js";

const cache = new Map();

/** Carrega (uma vez só) os polígonos dos bairros de uma cidade. */
export function carregarGeo(cidadeId) {
  if (!cache.has(cidadeId)) {
    cache.set(cidadeId, cidadePorId(cidadeId).carregar().then((m) => m.default));
  }
  return cache.get(cidadeId);
}

/** Polígonos da cidade pedida, ou null enquanto carregam (nunca os da cidade anterior). */
export function useGeo(cidadeId) {
  const [carregado, setCarregado] = useState({ id: null, geo: null });
  useEffect(() => {
    let ativo = true;
    carregarGeo(cidadeId).then((geo) => ativo && setCarregado({ id: cidadeId, geo }));
    return () => {
      ativo = false;
    };
  }, [cidadeId]);
  return carregado.id === cidadeId ? carregado.geo : null;
}

export function bairroDoGeo(geo, bairroId) {
  return geo?.features.find((f) => f.properties.id === bairroId)?.properties ?? null;
}
