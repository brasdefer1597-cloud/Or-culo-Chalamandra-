/**
 * El cierre del bucle: Donde el valor se convierte en fidelidad.
 */
export function CtaSection() {
  return (
    <section className="card ctaSection" style={{ borderStyle: 'dashed', borderColor: 'var(--chalamandra-gold)' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>¿Sientes la Sintonía?</h3>
      <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '24px' }}>
        No dejes que estos códigos se pierdan en el ruido. Únete a la red de decodificadores.
      </p>
      <div className="ctaButtons">
        <a className="btn btnPrimary" href="https://chalamandra.substack.com" target="_blank" rel="noreferrer">
          SUSCRIBIRSE A CÓDIGOS CHALAMANDRA
        </a>
        <a className="btn btnSecondary" href="https://ko-fi.com/s/335aa2b7f2" target="_blank" rel="noreferrer">
          APOYAR EL ORÁCULO
        </a>
      </div>
    </section>
  );
}
