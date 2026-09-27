import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Cabecalho from "./componentes/Cabecalho.jsx";
import Rodape from "./componentes/Rodape.jsx";
import Inicio from "./paginas/Inicio.jsx";

// O mapa puxa o Leaflet; as outras telas só carregam quando alguém chega nelas.
const Mapa = lazy(() => import("./paginas/Mapa.jsx"));
const Bairro = lazy(() => import("./paginas/Bairro.jsx"));
const Entrar = lazy(() => import("./paginas/Entrar.jsx"));
const Perfil = lazy(() => import("./paginas/Perfil.jsx"));
const Sobre = lazy(() => import("./paginas/Sobre.jsx"));
const NaoEncontrada = lazy(() => import("./paginas/NaoEncontrada.jsx"));

function VoltarAoTopo() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const telaCheia = pathname.startsWith("/mapa") && pathname.split("/").length <= 3;

  return (
    <>
      <a className="pular" href="#conteudo">
        Pular para o conteúdo
      </a>
      <VoltarAoTopo />
      <Cabecalho />
      <main id="conteudo">
        <Suspense fallback={<p className="carregando">Abrindo o caderno…</p>}>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/mapa" element={<Mapa />} />
            <Route path="/mapa/:cidade" element={<Mapa />} />
            <Route path="/mapa/:cidade/:bairro" element={<Bairro />} />
            <Route path="/entrar" element={<Entrar />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="*" element={<NaoEncontrada />} />
          </Routes>
        </Suspense>
      </main>
      {!telaCheia && <Rodape />}
    </>
  );
}
