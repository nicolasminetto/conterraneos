// Carimbo de passaporte em SVG: anel duplo, texto no arco e a data no meio.
export default function Carimbo({ texto, detalhe, cor = "var(--acento)", tamanho = 120, className = "", ...resto }) {
  const id = `arco-${texto.toLowerCase().replace(/[^a-z]/g, "")}`;
  return (
    <svg
      viewBox="0 0 120 120"
      width={tamanho}
      height={tamanho}
      className={`carimbo ${className}`}
      aria-hidden="true"
      {...resto}
    >
      <defs>
        <path id={id} d="M60 60 m-40 0 a40 40 0 1 1 80 0 a40 40 0 1 1 -80 0" />
      </defs>
      <g fill="none" stroke={cor}>
        <circle cx="60" cy="60" r="56" strokeWidth="3" />
        <circle cx="60" cy="60" r="49" strokeWidth="1.2" />
        <circle cx="60" cy="60" r="27" strokeWidth="1.2" strokeDasharray="2 3" />
      </g>
      <text fill={cor} fontFamily="var(--f-texto)" fontSize="11.5" fontWeight="600" letterSpacing="3">
        <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
          {texto.toUpperCase()} · {texto.toUpperCase()} ·
        </textPath>
      </text>
      <text x="60" y="65" fill={cor} fontFamily="var(--f-texto)" fontSize="12" fontWeight="600" textAnchor="middle">
        {detalhe}
      </text>
    </svg>
  );
}
