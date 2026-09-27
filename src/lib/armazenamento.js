// localStorage pode falhar (aba anônima, cota, bloqueio): nunca deixar isso quebrar a página.
export function ler(chave, padrao) {
  try {
    const valor = localStorage.getItem(chave);
    return valor === null ? padrao : JSON.parse(valor);
  } catch {
    return padrao;
  }
}

export function gravar(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    /* sem persistência, o estado continua em memória */
  }
}
