import Link from 'next/link';

interface HeaderProps {
  clarity: number;
  level: string;
}

export function Header({ clarity, level }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-top-row">
        <h1>EL ORÁCULO DE CHALAMANDRA</h1>
        <nav style={{ marginLeft: 'auto' }}>
          <Link href="/favorites" className="nav-link">
            Preguntas Guardadas
          </Link>
        </nav>
      </div>
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
