import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { gravar, ler } from "./armazenamento.js";

// Conta de mentira: o cadastro fica só neste navegador. Não existe servidor nesta fase.
// `registro` é o cadastro salvo; `perfil` é o mesmo cadastro, mas só enquanto a sessão está aberta.
const CHAVE = "conterraneos:conta";
const ContaContexto = createContext(null);

export function ProvedorConta({ children }) {
  const [conta, setConta] = useState(() => ler(CHAVE, { registro: null, logado: false }));

  useEffect(() => {
    gravar(CHAVE, conta);
  }, [conta]);

  const valor = useMemo(() => {
    const { registro, logado } = conta;
    return {
      registro,
      perfil: logado ? registro : null,
      cadastrar: (dados) =>
        setConta({ registro: { ...dados, criadoEm: new Date().toISOString() }, logado: true }),
      /** Devolve true se o e-mail bate com o cadastro deste navegador. */
      entrar(email) {
        const bate = registro && registro.email.toLowerCase() === email.trim().toLowerCase();
        if (bate) setConta((c) => ({ ...c, logado: true }));
        return Boolean(bate);
      },
      atualizar: (mudancas) => setConta((c) => ({ ...c, registro: { ...c.registro, ...mudancas } })),
      sair: () => setConta((c) => ({ ...c, logado: false })),
      apagarTudo: () => setConta({ registro: null, logado: false })
    };
  }, [conta]);

  return <ContaContexto.Provider value={valor}>{children}</ContaContexto.Provider>;
}

export function useConta() {
  return useContext(ContaContexto);
}
