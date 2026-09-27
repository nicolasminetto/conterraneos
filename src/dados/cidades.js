// As três cidades da demo. Os polígonos de cada uma só são baixados quando a cidade é aberta.
export const ORIGEM = { nome: "São Paulo", lat: -23.55, lng: -46.63 };

export const CIDADES = [
  {
    id: "toronto",
    nome: "Toronto",
    pais: "Canadá",
    lat: 43.6532,
    lng: -79.3832,
    zoom: 11,
    unidade: "neighbourhoods",
    fonte: "City of Toronto Open Data (158 neighbourhoods)",
    carregar: () => import("./geo/toronto.json")
  },
  {
    id: "dublin",
    nome: "Dublin",
    pais: "Irlanda",
    lat: 53.3498,
    lng: -6.2603,
    zoom: 12,
    unidade: "áreas",
    fonte: "CSO Electoral Divisions 2022, agrupadas em 53 áreas",
    carregar: () => import("./geo/dublin.json")
  },
  {
    id: "oslo",
    nome: "Oslo",
    pais: "Noruega",
    lat: 59.9139,
    lng: 10.7522,
    zoom: 11,
    unidade: "bydeler",
    fonte: "OpenStreetMap (16 bydeler, sem Marka)",
    carregar: () => import("./geo/oslo.json")
  }
];

export function cidadePorId(id) {
  return CIDADES.find((c) => c.id === id);
}
