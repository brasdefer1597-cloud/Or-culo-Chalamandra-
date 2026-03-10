interface HeaderProps {
  clarity: number;
  level: string;
}

export function Header({ clarity, level }: HeaderProps) {
  return (
    <header className="header">
      <h1 className="glitch-text">CHALAMANDRA MAGISTRAL</h1>
      <p className="subtitle">Sifón de Sabiduría & Decodificación Estratégica</p>
      <div className="statusRow">
        <div className="levelPill">
          <span>Rango: </span>
          <strong>{level}</strong>
        </div>
        <div className="clarityWrapper">
          <span>Sincronía</span>
          <div className="clarityTrack">
            <div className="clarityFill" style={{ width: `${clarity}%` }} />
          </div>
          <span>{clarity}%</span>
        </div>
      </div>
    </header>
  );
}
