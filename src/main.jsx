import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ProvedorConta } from "./lib/conta.jsx";
import { ProvedorCaderno } from "./lib/caderno.jsx";
import "./estilos/base.css";
import "./estilos/moldura.css";

createRoot(document.getElementById("raiz")).render(
  <StrictMode>
    <BrowserRouter>
      <ProvedorConta>
        <ProvedorCaderno>
          <App />
        </ProvedorCaderno>
      </ProvedorConta>
    </BrowserRouter>
  </StrictMode>
);
