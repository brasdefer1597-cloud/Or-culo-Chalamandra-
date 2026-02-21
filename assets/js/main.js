import { inyectarSoberania, obtenerNivelDecodificacion } from './services/soberania.js';
import { procesarHistoriaOraculo } from './processors/OracleProcessor.js';

const DOM = {
    storyForm: document.getElementById('story-form'),
    storyInput: document.getElementById('raw-story'),
    form: document.getElementById('oracle-form'),
    keyInput: document.getElementById('period-key'),
    processorStatus: document.getElementById('processor-status'),
    factorizationRate: document.getElementById('factorization-rate'),
    output: document.getElementById('display'),
    processPanel: document.getElementById('process-panel'),
    processStage: document.getElementById('process-stage'),
    hardwareStatus: document.getElementById('hardware-status'),
    keyValidation: document.getElementById('key-validation'),
    tempWindow: document.getElementById('temp-window'),
    fidelityCount: document.getElementById('fidelity-count')
};

const LOCKED_MESSAGE = 'Procesador Ocupado. Regresa cuando el Celeron respire';
const TEMP_KEY_TTL_MS = 60 * 60 * 1000;
const PROCESS_STAGES = [
    'Gira el Mandala... (De Bono / 7 colores)',
    'Excavando Raíces... (5 Porqués + Shor)',
    'Ejecutando Jugada Posicional... (Ajedrez Criminal)',
    'Filtrando Realismo... (Disney + VQE)',
    'Coreografía de Prioridad... (Covey)'
];

let stageIntervalId = null;
let lastStory = '';

function readCeleronState() {
    const fallback = {
        status: 'busy',
        periodKey: '',
        factorizationRate: 0
    };

    try {
        const raw = localStorage.getItem('celeronShorState');
        if (!raw) {
            return {
                ...fallback,
                status: localStorage.getItem('shorStatus') || 'busy',
                periodKey: localStorage.getItem('shorPeriodKey') || '',
                factorizationRate: Number(localStorage.getItem('shorFactorizationRate') || 0)
            };
        }

        const parsed = JSON.parse(raw);
        return {
            status: parsed.status || fallback.status,
            periodKey: parsed.periodKey || '',
            factorizationRate: Number(parsed.factorizationRate || 0)
        };
    } catch (error) {
        console.error('Estado del Celeron corrupto:', error);
        return fallback;
    }
}

function readTempKey() {
    try {
        const raw = localStorage.getItem('oraculoTemporalKey');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function issueOrRefreshTempKey(periodKey) {
    if (!periodKey) return null;
    const current = readTempKey();
    const now = Date.now();

    if (current && current.key === periodKey && current.expiresAt > now) {
        return current;
    }

    const temporal = {
        key: periodKey,
        issuedAt: now,
        expiresAt: now + TEMP_KEY_TTL_MS
    };
    localStorage.setItem('oraculoTemporalKey', JSON.stringify(temporal));
    return temporal;
}

function getRemainingWindowMs(temp) {
    if (!temp) return 0;
    return Math.max(0, temp.expiresAt - Date.now());
}

function formatMs(ms) {
    const total = Math.floor(ms / 1000);
    const m = String(Math.floor(total / 60)).padStart(2, '0');
    const s = String(total % 60).padStart(2, '0');
    return `${m}:${s}`;
}

function getFidelityCount() {
    return Number(localStorage.getItem('oracleValidKeyCount') || 0);
}

function setFidelityCount(value) {
    localStorage.setItem('oracleValidKeyCount', String(value));
}

function writeOutput(message, isSuccess = false, magistral = false) {
    DOM.output.classList.remove('hidden', 'error', 'success', 'oraculo-magistral', 'fidelidad-trigger');
    DOM.output.classList.add(isSuccess ? 'success' : 'error');
    if (magistral) {
        DOM.output.classList.add('oraculo-magistral');
    }
    DOM.output.textContent = message;
}

function renderFidelityReward(contentText) {
    DOM.output.classList.remove('hidden', 'error', 'success', 'oraculo-magistral');
    DOM.output.classList.add('success', 'fidelidad-trigger');
    DOM.output.innerHTML = `
        <h3>🏆 SOBERANÍA ALCANZADA</h3>
        <p>Has procesado 10 historias crudas. El Celeron te reconoce.</p>
        <p>${contentText.replace(/\n/g, '<br>')}</p>
        <a href="https://ko-fi.com/chalamandramagistral" target="_blank" rel="noopener noreferrer" class="boton-dorado">
            DESBLOQUEAR CONTRATO HITMAN (KO-FI)
        </a>
    `;
}

function startProcessCycle() {
    let stageIndex = 0;
    DOM.processPanel.classList.remove('hidden');
    DOM.processStage.textContent = PROCESS_STAGES[0];

    if (stageIntervalId) {
        clearInterval(stageIntervalId);
    }

    stageIntervalId = setInterval(() => {
        stageIndex = (stageIndex + 1) % PROCESS_STAGES.length;
        DOM.processStage.textContent = PROCESS_STAGES[stageIndex];
    }, 1200);
}

function stopProcessCycle() {
    if (stageIntervalId) {
        clearInterval(stageIntervalId);
        stageIntervalId = null;
    }
}

async function syncRadiationPanel() {
    const { poas, ultima_llave } = await inyectarSoberania();
    const nivel = obtenerNivelDecodificacion(poas, ultima_llave);

    DOM.hardwareStatus.textContent = `Sincronizando con Nodo Celeron (Xalapa)... POAS ${poas.toFixed(2)} // Nivel ${nivel}`;

    if (ultima_llave === '92028127') {
        DOM.keyValidation.textContent = 'Llave 92028127 detectada. Arsenal Chalamandra desbloqueado.';
    } else {
        DOM.keyValidation.textContent = 'Llave élite no detectada. Modo de lectura limitada.';
    }

    const count = getFidelityCount();
    DOM.fidelityCount.textContent = `Fidelidad Qbitz: ${count}/10 accesos válidos.`;

    return { poas, ultima_llave, nivel };
}

function syncProcessorState() {
    const celeronState = readCeleronState();
    const isReady = celeronState.status === 'complete';
    const rate = Number.isFinite(celeronState.factorizationRate) ? celeronState.factorizationRate : 0;

    DOM.factorizationRate.textContent = `${rate.toFixed(2)} factores/s`;

    if (isReady) {
        DOM.processorStatus.textContent = 'Procesador Libre. Llave del Periodo requerida';
        DOM.keyInput.disabled = false;
        DOM.keyInput.placeholder = 'Ingresa la Llave del Periodo o la Llave Temporal';
        stopProcessCycle();
        issueOrRefreshTempKey(celeronState.periodKey);
    } else {
        DOM.processorStatus.textContent = LOCKED_MESSAGE;
        DOM.keyInput.value = '';
        DOM.keyInput.placeholder = LOCKED_MESSAGE;
        DOM.keyInput.disabled = true;
    }

    const temp = readTempKey();
    const remaining = getRemainingWindowMs(temp);
    DOM.tempWindow.textContent = remaining > 0
        ? `Ventana de Tráfico: Llave temporal activa (${formatMs(remaining)} restantes).`
        : 'Ventana de Tráfico: sin llave temporal activa.';

    return celeronState;
}

function buildMagistralOutput(periodKey, decoderStatus) {
    return `RESULTADO DE DECODIFICACIÓN MAGISTRAL:\n\nPerspectiva: (Sombrero Verde) - Innovación Disruptiva detectada.\n\nRaíz: (5to Porqué) - Falta de autonomía financiera.\n\nJugada: (Ajedrez) - Movimiento de flanco; priorizar Quadrante II (Covey).\n\nEstado: Claridad Alcanzada (VQE: -1.0000).\n\nNivel de Decodificación: ${decoderStatus.nivel}\nMétodo Activo: ${decoderStatus.metodologia}\nDiagnóstico: ${decoderStatus.analisis}\nLlave Élite: ${periodKey}`;
}

function getContractRewardText(count) {
    return `CONTRATO DE HITMAN DESBLOQUEADO\n\nHas alcanzado ${count} validaciones de llave.`;
}

function init() {
    syncProcessorState();
    syncRadiationPanel();

    setInterval(() => {
        syncProcessorState();
        syncRadiationPanel();
    }, 1000);

    DOM.storyForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const story = DOM.storyInput.value.trim();

        if (!story) {
            writeOutput('Entrada vacía. Ingresa una historia o una Realidad Cruda para iniciar.');
            return;
        }

        lastStory = story;
        startProcessCycle();

        const decoderStatus = await procesarHistoriaOraculo(story);
        writeOutput(
            `Entrada recibida. Trifecta Cuántica inicializada.\n${decoderStatus.metodologia}: ${decoderStatus.analisis}`,
            true,
            decoderStatus.poas_aplicado >= 1.0
        );

        const celeronState = syncProcessorState();
        if (celeronState.status !== 'complete') {
            writeOutput(`ACCESO DENEGADO\n${LOCKED_MESSAGE}`);
        }
    });

    DOM.form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const celeronState = syncProcessorState();
        const isReady = celeronState.status === 'complete';

        if (!isReady) {
            writeOutput(`ACCESO DENEGADO\n${LOCKED_MESSAGE}`);
            return;
        }

        if (!lastStory) {
            writeOutput('Primero debes ingresar una Historia para activar la decodificación.');
            return;
        }

        const submittedKey = DOM.keyInput.value.trim();
        const expectedKey = String(celeronState.periodKey || '').trim();
        const temp = readTempKey();
        const temporalValida = temp && temp.key === submittedKey && getRemainingWindowMs(temp) > 0;

        if (!submittedKey) {
            writeOutput('Entrada vacía. Se requiere Llave del Periodo.');
            return;
        }

        if (submittedKey !== expectedKey && !temporalValida) {
            writeOutput('Llave inválida o expirada. La bóveda permanece sellada.');
            return;
        }

        const decoderStatus = await procesarHistoriaOraculo(lastStory);
        const newCount = getFidelityCount() + 1;
        setFidelityCount(newCount);

        const magistral = decoderStatus.poas_aplicado >= 1.0;
        if (newCount >= 10) {
            renderFidelityReward(`${buildMagistralOutput(submittedKey, decoderStatus)}\n\n${getContractRewardText(newCount)}`);
        } else {
            writeOutput(buildMagistralOutput(submittedKey, decoderStatus), true, magistral);
        }

        DOM.keyInput.value = '';
        syncRadiationPanel();
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
