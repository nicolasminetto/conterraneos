import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { gravar, ler } from "./armazenamento.js";

// O caderno guarda os bairros que o visitante anotou. Ele é compartilhado entre a landing,
// o mapa, a página do bairro e o perfil: anotar num lugar faz a nota aparecer em todos.
const CHAVE = "conterraneos:caderno";
const CadernoContexto = createContext(null);

const chaveDa = (nota) => `${nota.cidade}/${nota.bairro}`;

export function ProvedorCaderno({ children }) {
  const [notas, setNotas] = useState(() => ler(CHAVE, []));

  useEffect(() => {
    gravar(CHAVE, notas);
  }, [notas]);

  const valor = useMemo(() => {
    const anotado = (cidade, bairro) => notas.some((n) => n.cidade === cidade && n.bairro === bairro);
    return {
      notas,
      anotado,
      anotar(nota) {
        setNotas((atuais) =>
          atuais.some((n) => chaveDa(n) === chaveDa(nota))
            ? atuais
            : [...atuais, { ...nota, em: new Date().toISOString() }]
        );
      },
      apagar(cidade, bairro) {
        setNotas((atuais) => atuais.filter((n) => chaveDa(n) !== `${cidade}/${bairro}`));
      },
      limpar: () => setNotas([])
    };
  }, [notas]);

  return <CadernoContexto.Provider value={valor}>{children}</CadernoContexto.Provider>;
}

export function useCaderno() {
  return useContext(CadernoContexto);
}
