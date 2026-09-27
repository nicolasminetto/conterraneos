import { geoMercator, geoPath } from "d3-geo";
import { contagemBruta } from "./comunidade.js";
import { estimativaPublica } from "./privacidade.js";

/**
 * Projeta os bairros de uma cidade num retângulo e devolve o que o SVG precisa: o traçado
 * de cada bairro, a estimativa pública (null quando abaixo do mínimo) e a caixa que o
 * desenho realmente ocupa (para cortar a sobra de um mapa largo num quadro quadrado).
 */
export function bairrosEmSvg(geo, cidade, largura, altura, { margem = 16, perfil = null } = {}) {
  const projecao = geoMercator().fitExtent(
    [
      [margem, margem],
      [largura - margem, altura - margem]
    ],
    geo
  );
  const caminho = geoPath(projecao);
  const [[x0, y0], [x1, y1]] = caminho.bounds(geo);
  const caixa = [x0 - margem, y0 - margem, x1 - x0 + 2 * margem, y1 - y0 + 2 * margem];
  const bairros = geo.features.map((f) => {
    const { id, nome, lat, lng } = f.properties;
    const [x, y] = projecao([lng, lat]);
    return {
      id,
      nome,
      lat,
      lng,
      x,
      y,
      d: caminho(f),
      estimativa: estimativaPublica(contagemBruta(cidade, id, perfil))
    };
  });
  return { bairros, caixa };
}
