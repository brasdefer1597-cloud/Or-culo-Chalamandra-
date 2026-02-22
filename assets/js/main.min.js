// ELEMENTOS DOM - cacheados para reducir búsquedas repetidas
const DOM = {
    form: document.getElementById('oracle-form'),
    method: document.getElementById('method'),
    context: document.getElementById('context'),
    situation: document.getElementById('situation'),
    resultSection: document.getElementById('result-section'),
    questionsOutput: document.getElementById('questions-output'),
    ctaSection: document.getElementById('cta-section'),
    emailCta: document.getElementById('email-cta'),
    subscribeCta: document.getElementById('subscribe-cta'),
    emailForm: document.getElementById('email-form'),
    userEmail: document.getElementById('user-email'),
    generateBtn: document.getElementById('generate-btn'),
    clarityBar: document.getElementById('clarity-progress'),
    clarityLabel: document.getElementById('clarity-label'),
    userLevel: document.getElementById('user-level')
};

const CONFIG = {
    geminiModel: 'gemini-1.5-flash',
    clarityMilestone: 3,
    requestTimeoutMs: 12000,
    minSubmitIntervalMs: 1200,
    maxRetries: 1,
    retryBaseDelayMs: 450,
    circuitWindowMs: 60000,
    circuitFailureThreshold: 4,
    queryStorageKey: 'oracleQueryCount',
    methodsStorageKey: 'oracleMethodsUsed',
    telemetryStorageKey: 'oracleTelemetryBuffer',
    telemetryBufferLimit: 60,
    systemInstruction: `Eres la Sabiduría de Chalamandra, una guía experta en marcos de pensamiento. Tu tono es sereno, inteligente, directo y empoderador (estilo Malandra Fresa pero en modo Mentora).
Al recibir el [Método] y el [Contexto], genera 3-5 preguntas potentes que obliguen al usuario a salir de su sesgo cognitivo.
Ejemplo para '6 Sombreros' en 'Decisión Laboral': 'Sombrero Negro: ¿Cuál es el riesgo oculto que tu ambición no te está dejando ver?'`
};

const safeStorage = {
    getString(key, fallback = '') {
        try {
            const value = localStorage.getItem(key);
            return typeof value === 'string' ? value : fallback;
        } catch {
            return fallback;
        }
    },

    getNumber(key, fallback = 0) {
        const value = Number(this.getString(key, String(fallback)));
        return Number.isFinite(value) && value >= 0 ? value : fallback;
    },

    getArray(key, fallback = []) {
        try {
            const raw = this.getString(key);
            if (!raw) return fallback;
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : fallback;
        } catch {
            return fallback;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.warn('No se pudo persistir en localStorage', error);
        }
    }
};

const telemetry = {
    push(eventName, payload = {}) {
        const event = {
            eventName,
            ts: Date.now(),
            payload
        };

        const buffer = safeStorage.getArray(CONFIG.telemetryStorageKey, []);
        buffer.push(event);

        if (buffer.length > CONFIG.telemetryBufferLimit) {
            buffer.splice(0, buffer.length - CONFIG.telemetryBufferLimit);
        }

        safeStorage.set(CONFIG.telemetryStorageKey, JSON.stringify(buffer));

        if (typeof window !== 'undefined' && window.__ORACLE_DEBUG_TELEMETRY__) {
            console.info('[oracle.telemetry]', event);
        }
    }
};

const parser = {
    email(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },

    questionLines(text) {
        if (!text || typeof text !== 'string') return [];

        const cleaned = text
            .split('\n')
            .map((line) => line.replace(/^[-*\d.)\s]+/, '').trim())
            .filter(Boolean)
            .map((line) => line.replace(/\s+/g, ' ').trim())
            .filter((line) => line.length >= 8);

        return [...new Set(cleaned)].slice(0, 7);
    }
};

const ui = {
    show(element) {
        if (element) element.classList.remove('hidden');
    },

    hide(element) {
        if (element) element.classList.add('hidden');
    },

    scrollTo(element) {
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },

    setGeneratingState(isGenerating) {
        if (!DOM.generateBtn) return;
        DOM.generateBtn.innerText = isGenerating ? 'DECODIFICANDO...' : 'Generar preguntas personalizadas';
        DOM.generateBtn.disabled = isGenerating;
    },

    renderQuestions(lines, source) {
        if (!DOM.questionsOutput) return;

        DOM.questionsOutput.replaceChildren();

        const wrapper = document.createElement('div');
        wrapper.className = 'questions-block';

        const title = document.createElement('div');
        title.className = 'hat-title';

        const titleSpan = document.createElement('span');
        titleSpan.textContent = source === 'fallback' ? 'Decodificación estratégica (modo respaldo)' : 'Decodificación estratégica';
        title.appendChild(titleSpan);

        const list = document.createElement('ul');
        list.className = 'questions-list';

        lines.forEach((line) => {
            const item = document.createElement('li');
            item.textContent = line;
            list.appendChild(item);
        });

        wrapper.append(title, list);
        DOM.questionsOutput.appendChild(wrapper);
    }
};

const state = {
    queryCount: safeStorage.getNumber(CONFIG.queryStorageKey),
    methodsUsed: new Set(safeStorage.getArray(CONFIG.methodsStorageKey)),
    pendingController: null,
    lastSubmitAt: 0,
    breakerFailures: [],
    sessionId: `sess-${Math.random().toString(36).slice(2, 10)}`
};

function sleep(ms) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, ms);
    });
}

function jitteredBackoff(attempt) {
    const jitter = Math.floor(Math.random() * 180);
    return CONFIG.retryBaseDelayMs * (attempt + 1) + jitter;
}

function saveState() {
    safeStorage.set(CONFIG.queryStorageKey, String(state.queryCount));
    safeStorage.set(CONFIG.methodsStorageKey, JSON.stringify(Array.from(state.methodsUsed)));
}

function currentLevel() {
    return state.methodsUsed.size >= 3 ? 'Estratega' : 'Iniciado';
}

function paintProgress() {
    const progress = Math.min(100, Math.round((state.queryCount / CONFIG.clarityMilestone) * 100));

    if (DOM.clarityBar) DOM.clarityBar.style.width = `${progress}%`;
    if (DOM.clarityLabel) DOM.clarityLabel.textContent = `${progress}%`;
    if (DOM.userLevel) DOM.userLevel.textContent = currentLevel();
}

function getGeminiApiKey() {
    return window.GEMINI_API_KEY || safeStorage.getString('GEMINI_API_KEY') || '';
}

function circuitOpen() {
    const now = Date.now();
    state.breakerFailures = state.breakerFailures.filter((ts) => now - ts <= CONFIG.circuitWindowMs);
    return state.breakerFailures.length >= CONFIG.circuitFailureThreshold;
}

function registerFailure() {
    state.breakerFailures.push(Date.now());
}

function resetFailures() {
    state.breakerFailures = [];
}

function makeFallbackQuestions({ method, context }) {
    const bank = typeof QUESTION_BANK === 'object' ? QUESTION_BANK[method] : null;

    if (!bank) {
        return [
            `¿Cuál es el criterio de éxito más claro para resolver "${context}"?`,
            '¿Qué riesgo crítico no estás midiendo todavía?',
            '¿Qué micro-acción ejecutable en 72h validará tu decisión?'
        ];
    }

    const picked = Object.values(bank)
        .flatMap((questions) => questions.slice(0, 2))
        .slice(0, 6)
        .map((question) => question.replace('[contexto]', context));

    const sanitized = parser.questionLines(picked.join('\n'));
    if (sanitized.length) return sanitized;

    return [
        `¿Qué evidencia concreta necesitas para actuar sobre "${context}"?`,
        '¿Qué escenario debes proteger primero?',
        '¿Qué decisión reversible puedes tomar hoy?'
    ];
}

async function callGeminiOnce({ method, context, situation, signal }) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.geminiModel}:generateContent?key=${getGeminiApiKey()}`;
    const payload = {
        system_instruction: {
            parts: [{ text: CONFIG.systemInstruction }]
        },
        contents: [{
            role: 'user',
            parts: [{ text: `Método: ${method}\nContexto: ${context}\nSituación: ${situation}\n\nEntrega solo preguntas de alto impacto.` }]
        }]
    };

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal
    });

    if (!response.ok) {
        const detail = await response.text();
        throw new Error(`GEMINI_HTTP_${response.status}: ${detail}`);
    }

    const data = await response.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const parsed = parser.questionLines(raw);

    if (!parsed.length) {
        throw new Error('EMPTY_GEMINI_RESPONSE');
    }

    return parsed;
}

async function fetchGeminiQuestions({ method, context, situation }) {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
        throw new Error('MISSING_API_KEY');
    }

    if (circuitOpen()) {
        throw new Error('CIRCUIT_OPEN');
    }

    state.pendingController?.abort();
    state.pendingController = new AbortController();

    const timeoutId = window.setTimeout(() => {
        state.pendingController?.abort('TIMEOUT');
    }, CONFIG.requestTimeoutMs);

    try {
        let lastError;

        for (let attempt = 0; attempt <= CONFIG.maxRetries; attempt += 1) {
            try {
                const result = await callGeminiOnce({
                    method,
                    context,
                    situation,
                    signal: state.pendingController.signal
                });

                resetFailures();
                return result;
            } catch (error) {
                lastError = error;

                const isFinalAttempt = attempt >= CONFIG.maxRetries;
                if (isFinalAttempt) break;

                await sleep(jitteredBackoff(attempt));
            }
        }

        registerFailure();
        throw lastError || new Error('UNKNOWN_GEMINI_ERROR');
    } finally {
        clearTimeout(timeoutId);
        state.pendingController = null;
    }
}

function validateSubmission({ method, context, situation }) {
    if (!method || !context || !situation) {
        return 'Por favor, completa todos los campos.';
    }

    if (situation.length < 15) {
        return 'Describe un poco más tu situación (mínimo 15 caracteres).';
    }

    const now = Date.now();
    if (now - state.lastSubmitAt < CONFIG.minSubmitIntervalMs) {
        return 'Vas muy rápido en el pantano SRAP. Espera 1 segundo e intenta de nuevo.';
    }

    state.lastSubmitAt = now;
    return '';
}

const handlers = {
    async submitForm(event) {
        event.preventDefault();

        const method = DOM.method?.value || '';
        const context = DOM.context?.value || '';
        const situation = DOM.situation?.value.trim() || '';

        const validationError = validateSubmission({ method, context, situation });
        if (validationError) {
            alert(validationError);
            return;
        }

        ui.setGeneratingState(true);
        const startedAt = performance.now();

        try {
            let questions = [];
            let source = 'fallback';

            try {
                questions = await fetchGeminiQuestions({ method, context, situation });
                source = 'gemini';
            } catch (error) {
                console.warn('Gemini no disponible. Activando fallback local.', error);
                questions = makeFallbackQuestions({ method, context });
                telemetry.push('fallback_activated', {
                    reason: String(error?.message || 'unknown')
                });
            }

            ui.renderQuestions(questions, source);

            state.queryCount += 1;
            state.methodsUsed.add(method);
            saveState();
            paintProgress();

            ui.show(DOM.resultSection);
            ui.show(DOM.ctaSection);
            ui.scrollTo(DOM.resultSection);

            telemetry.push('question_generation_success', {
                sessionId: state.sessionId,
                method,
                context,
                source,
                questionCount: questions.length,
                latencyMs: Math.round(performance.now() - startedAt)
            });
        } catch (error) {
            telemetry.push('question_generation_failure', {
                sessionId: state.sessionId,
                method,
                context,
                error: String(error?.message || 'unknown')
            });
            alert('No se pudo generar la decodificación. Intenta de nuevo en unos segundos.');
        } finally {
            ui.setGeneratingState(false);
        }
    },

    showEmailForm() {
        ui.show(DOM.emailForm);
        DOM.userEmail?.focus();
        telemetry.push('email_form_opened', { sessionId: state.sessionId });
    },

    openSubstack() {
        telemetry.push('substack_click', { sessionId: state.sessionId });
        window.open('https://chalamandra.substack.com', '_blank', 'noopener,noreferrer');
    },

    submitEmail(event) {
        event.preventDefault();

        const email = DOM.userEmail?.value.trim() || '';
        if (!parser.email(email)) {
            alert('Por favor, introduce un email válido.');
            return;
        }

        const subject = `🔮 Tu Decodificación: ${DOM.situation?.value.trim() || 'Tu situación'}`;
        const body = `Has consultado al Oráculo. Aquí están las coordenadas de tu próxima gran decisión:\n\nMÉTODO: ${DOM.method?.value || ''}\nTUS PREGUNTAS DE PODER:\n${DOM.questionsOutput?.innerText || ''}\n\nTU MICRO-ACCIÓN (SRAP):\nNo dejes que la claridad se evapore. Tienes 72 horas para mover la primera pieza.\n\nMantén la frecuencia alta.\n— Chalamandra Magistral`;

        telemetry.push('email_mailto_generated', {
            sessionId: state.sessionId,
            domain: email.split('@')[1] || 'unknown'
        });

        window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        ui.hide(DOM.emailForm);
        if (DOM.userEmail) DOM.userEmail.value = '';
    }
};

function validateDOM() {
    if (!DOM.form || !DOM.method || !DOM.context || !DOM.situation || !DOM.questionsOutput) {
        console.error('No se pudo iniciar Oráculo: faltan nodos críticos del DOM.');
        return false;
    }

    return true;
}

function init() {
    if (!validateDOM()) return;

    DOM.form.addEventListener('submit', handlers.submitForm);
    DOM.emailCta?.addEventListener('click', handlers.showEmailForm);
    DOM.subscribeCta?.addEventListener('click', handlers.openSubstack);
    DOM.emailForm?.addEventListener('submit', handlers.submitEmail);

    paintProgress();
    telemetry.push('session_started', {
        sessionId: state.sessionId,
        path: window.location.pathname
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
