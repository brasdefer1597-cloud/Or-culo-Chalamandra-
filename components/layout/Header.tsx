interface HeaderProps {
  clarity: number;
  level: string;
}

export function Header({ clarity, level }: HeaderProps) {
  return (
    <header className="header">
      <h1>EL ORÁCULO DE CHALAMANDRA</h1>
      <p className="subtitle">Ingeniería + folklore táctico para decidir con precisión.</p>
      <div className="statusRow">
        <div className="levelPill">Nivel actual: <strong>{level}</strong></div>
        <div className="clarityWrapper">
          <span>Claridad</span>
          <div className="clarityTrack">
            <div className="clarityFill" style={{ width: `${clarity}%` }} />
          </div>
          <span>{clarity}%</span>
        </div>
      </div>
    </header>
  );
}
