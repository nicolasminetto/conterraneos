// Regras de privacidade do mapa. Valem para os dados fictícios e valeriam para os reais.

/** Abaixo disso, o bairro aparece como "poucos dados", sem número. */
export const MINIMO_POR_BAIRRO = 5;

/**
 * Transforma a contagem bruta no número que pode ser mostrado. Abaixo do mínimo, devolve
 * null. Acima de 20, arredonda para múltiplos de 5, para que a entrada ou a saída de uma
 * pessoa não seja perceptível.
 */
export function estimativaPublica(total) {
  if (total < MINIMO_POR_BAIRRO) return null;
  return total < 20 ? total : Math.round(total / 5) * 5;
}

/** Frase pronta a partir da estimativa pública (o valor devolvido por estimativaPublica). */
export function textoEstimativa(n) {
  if (n === null) return "Poucos dados";
  return `≈ ${n.toLocaleString("pt-BR")} brasileiros`;
}
