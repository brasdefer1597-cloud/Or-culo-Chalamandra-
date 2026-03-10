export function CtaSection() {
  return (
    <section className="card ctaSection" style={{textAlign: 'center'}}>
      <h3 style={{marginTop: 0}}>¿Deseas profundizar en los Códigos?</h3>
      <p style={{marginBottom: '25px', opacity: 0.8}}>La decodificación es solo el inicio del Sifón.</p>
      <div className="ctaButtons">
        <a className="btn btnPrimary" href="https://chalamandra.substack.com" target="_blank" rel="noreferrer">
          SUSCRIBIRSE AL SUBSTACK
        </a>
        <a className="btn btnSecondary" href="https://ko-fi.com/s/335aa2b7f2" target="_blank" rel="noreferrer">
          CONTRIBUIR AL ORÁCULO
        </a>
      </div>
    </section>
  );
}
