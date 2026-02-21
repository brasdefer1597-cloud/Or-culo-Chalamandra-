import { inyectarSoberania, obtenerNivelDecodificacion } from './soberania';

export const procesarHistoriaOraculo = async (historia: string) => {
    const { poas, ultima_llave } = await inyectarSoberania();
    const nivel = obtenerNivelDecodificacion(poas, ultima_llave);

    if (nivel === 'MAGISTRAL') {
        return {
            metodologia: 'TRIPLE FILTRO (Bono + Disney + Covey)',
            analisis: 'Excavación profunda completada. Raíz detectada.',
            poas_aplicado: poas,
            status: 'Soberanía Total',
            historia
        };
    }

    return {
        metodologia: 'BÁSICA',
        analisis: 'Sincronía insuficiente. La verdad está fragmentada.',
        poas_aplicado: poas,
        status: 'Modo Degradado',
        historia
    };
};
