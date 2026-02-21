import { inyectarSoberania, obtenerNivelDecodificacion } from '../services/soberania.js';

export async function procesarHistoriaOraculo(historia) {
    const { poas, ultima_llave } = await inyectarSoberania();
    const nivel = obtenerNivelDecodificacion(poas, ultima_llave);

    if (nivel === 'MAGISTRAL') {
        return {
            nivel,
            metodologia: 'TRIPLE FILTRO (Bono + Disney + Covey)',
            analisis: 'Excavación profunda completada. Raíz detectada.',
            poas_aplicado: poas,
            status: 'Soberanía Total',
            historia
        };
    }

    if (nivel === 'ELITE') {
        return {
            nivel,
            metodologia: 'SOMBREROS + COVEY',
            analisis: 'Análisis consistente, pero aún sin excavación total de raíz.',
            poas_aplicado: poas,
            status: 'Soberanía Parcial',
            historia
        };
    }

    return {
        nivel,
        metodologia: 'BÁSICA',
        analisis: 'Sincronía insuficiente. La verdad está fragmentada.',
        poas_aplicado: poas,
        status: 'Modo Degradado',
        historia
    };
}
