import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { corDaEstimativa } from "../lib/escala.js";

// Tiles padrão do OpenStreetMap (sem chave). O CSS tira a cor para o mapa parecer papel.
const TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const CREDITOS = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

function estilo(bairro, selecionado, anotado) {
  const semDados = bairro.estimativa === null;
  const ativo = bairro.id === selecionado;
  return {
    fillColor: corDaEstimativa(bairro.estimativa),
    fillOpacity: semDados ? 0.35 : 0.78,
    color: ativo ? "#1B2433" : anotado ? "#2446A8" : semDados ? "#8a909c" : "#FFFFFF",
    weight: ativo ? 3 : anotado ? 2.5 : 1,
    dashArray: semDados && !ativo ? "3 3" : null
  };
}

/**
 * Mapa coroplético: cada bairro pintado pela estimativa pública. Não existe nenhum ponto
 * individual por baixo, só os polígonos dos bairros.
 */
export default function MapaLeaflet({ geo, bairros, selecionado, anotado, aoSelecionar }) {
  const elemento = useRef(null);
  const mapa = useRef(null);
  const camada = useRef(null);
  const retorno = useRef(aoSelecionar);
  retorno.current = aoSelecionar;

  // Cria o mapa uma vez.
  useEffect(() => {
    const m = L.map(elemento.current, { zoomControl: false, attributionControl: true });
    L.control.zoom({ position: "bottomright", zoomInTitle: "Aproximar", zoomOutTitle: "Afastar" }).addTo(m);
    L.tileLayer(TILES, { attribution: CREDITOS, maxZoom: 19 }).addTo(m);
    m.attributionControl.setPrefix(false);
    mapa.current = m;
    return () => m.remove();
  }, []);

  // Troca a camada de bairros quando a cidade muda.
  useEffect(() => {
    if (!geo || !mapa.current) return;
    const porId = new Map(bairros.map((b) => [b.id, b]));
    const nova = L.geoJSON(geo, {
      style: (f) => estilo(porId.get(f.properties.id), null, false),
      onEachFeature(f, layer) {
        const b = porId.get(f.properties.id);
        layer.bairroId = b.id;
        layer.bindTooltip(
          `<strong>${b.nome}</strong><br>${b.estimativa === null ? "Poucos dados" : `≈ ${b.estimativa} brasileiros`}`,
          { sticky: true, direction: "top", className: "dica-mapa" }
        );
        layer.on("click", () => retorno.current(b.id));
      }
    }).addTo(mapa.current);
    camada.current?.remove();
    camada.current = nova;
    mapa.current.fitBounds(nova.getBounds(), { padding: [16, 16] });
    return () => {
      nova.remove();
      if (camada.current === nova) camada.current = null;
    };
    // bairros muda junto com geo (e com o opt-in); refazer a camada nos dois casos é barato.
  }, [geo, bairros]);

  // Destaque do bairro escolhido e dos anotados.
  useEffect(() => {
    const c = camada.current;
    if (!c) return;
    const porId = new Map(bairros.map((b) => [b.id, b]));
    c.eachLayer((layer) => {
      const b = porId.get(layer.bairroId);
      layer.setStyle(estilo(b, selecionado, anotado(b.id)));
      if (b.id === selecionado) {
        layer.bringToFront();
        const limites = layer.getBounds();
        if (!mapa.current.getBounds().contains(limites)) {
          mapa.current.flyToBounds(limites, { maxZoom: 14, duration: 0.6 });
        }
      }
    });
  }, [selecionado, anotado, bairros, geo]);

  return <div ref={elemento} className="mapa-leaflet" />;
}
