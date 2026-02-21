export function obtenerNivelDecodificacion(poas, llave) {
    if (llave === '92028127' && poas >= 1.0) return 'MAGISTRAL';
    if (llave === '92028127') return 'ELITE';
    return 'DEGRADADO';
}

export async function inyectarSoberania() {
    const rawCeleron = localStorage.getItem('celeronShorState');
    const parsed = rawCeleron ? JSON.parse(rawCeleron) : null;

    const poas = Number(localStorage.getItem('poas') || parsed?.poas || 0);
    const ultima_llave = String(
        localStorage.getItem('ultima_llave') ||
        parsed?.periodKey ||
        localStorage.getItem('shorPeriodKey') ||
        ''
    );

    return {
        poas,
        ultima_llave
    };
}
