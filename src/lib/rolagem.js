import { useEffect } from "react";

export const movimentoReduzido = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Entradas: todo elemento com [data-entra] dentro de `raiz` ganha a classe "entrou" quando
 * aparece na tela (uma vez só). O CSS decide o efeito a partir do valor do atributo.
 */
export function useEntradas(raiz) {
  useEffect(() => {
    const alvos = raiz.current?.querySelectorAll("[data-entra]") ?? [];
    if (movimentoReduzido()) {
      alvos.forEach((el) => el.classList.add("entrou"));
      return;
    }
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("entrou");
          observador.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 }
    );
    alvos.forEach((el) => observador.observe(el));
    return () => observador.disconnect();
  }, [raiz]);
}

/**
 * Cena presa: `secao` é alta (várias telas) e tem um filho `position: sticky`. Enquanto a
 * pessoa rola por dentro dela, publica o avanço de 0 a 1 em `--p` e a etapa atual (0..n-1)
 * em `data-etapa`. Nada disso passa pelo React: o CSS lê a variável direto.
 */
export function useCenaPresa(secao, etapas, aoMudarEtapa) {
  useEffect(() => {
    const el = secao.current;
    // Com movimento reduzido, a cena não fica presa: o CSS mostra tudo no estado final.
    if (!el || movimentoReduzido()) return;
    let quadro = 0;
    let etapaAtual = -1;

    const medir = () => {
      quadro = 0;
      const caixa = el.getBoundingClientRect();
      const percurso = caixa.height - window.innerHeight;
      const p = percurso > 0 ? Math.min(1, Math.max(0, -caixa.top / percurso)) : 0;
      el.style.setProperty("--p", p.toFixed(4));
      const etapa = Math.min(etapas - 1, Math.floor(p * etapas));
      if (etapa !== etapaAtual) {
        etapaAtual = etapa;
        el.dataset.etapa = String(etapa);
        aoMudarEtapa?.(etapa);
      }
    };
    const agendar = () => {
      if (!quadro) quadro = requestAnimationFrame(medir);
    };

    medir();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
    };
  }, [secao, etapas, aoMudarEtapa]);
}
