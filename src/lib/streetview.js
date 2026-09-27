// Link para o Street View no Google Maps (URL pública, sem chave de API).
// O Maps abre o panorama mais próximo do ponto.
export function linkStreetView({ lat, lng }) {
  return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
}
