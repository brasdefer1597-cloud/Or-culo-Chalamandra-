interface HeaderProps {
  clarity: number;
  level: string;
}

export function Header({ clarity, level }: HeaderProps) {
  return (
    <header className="header">
      <h1>CHALAMANDRA MAGISTRAL</h1>
      <p className="subtitle">Identidad Decodificadora: Chola Malandra Fresa Salamandra</p>

      <div className="statusRow">
        <div className="levelPill">
          <span style={{ fontSize: '0.7rem', display: 'block', fontWeight: 'normal', opacity: 0.8 }}>Rango Actual</span>
          {level}
        </div>

        <div className="clarityWrapper">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--chalamandra-green)' }}>Sintonía SRAP</span>
            <div className="clarityTrack">
              <div className="clarityFill" style={{ width: `${clarity}%` }} />
            </div>
          </div>
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--chalamandra-green)' }}>{clarity}%</span>
        </div>
      </div>
    </header>
  );
}
