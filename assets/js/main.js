const CONFIG = {
    geminiModel: 'gemini-1.5-flash',
    freeQueryLimit: 3,
    storageKeys: {
        queryCount: 'oracleQueryCount',
        methodsUsed: 'oracleMethodsUsed',
        telemetry: 'oracleTelemetry',
        apiKey: 'GEMINI_API_KEY'
    },
    systemInstruction: `Eres la Sabiduría de Chalamandra, una guía experta en marcos de pensamiento. Tu tono es sereno, inteligente, directo y empoderador (estilo Malandra Fresa pero en modo Mentora).
Al recibir el [Método] y el [Contexto], genera 3-5 preguntas potentes que obliguen al usuario a salir de su sesgo cognitivo.
Ejemplo para '6 Sombreros' en 'Decisión Laboral': 'Sombrero Negro: ¿Cuál es el riesgo oculto que tu ambición no te está dejando ver?'`
};

const DOM = {
    form: document.getElementById('oracle-form'),
    method: document.getElementById('method'),
    context: document.getElementById('context'),
    situation: document.getElementById('situation'),
    generateBtn: document.getElementById('generate-btn'),
    resultSection: document.getElementById('result-section'),
    questionsOutput: document.getElementById('questions-output'),
    ctaSection: document.getElementById('cta-section'),
    emailCta: document.getElementById('email-cta'),
    subscribeCta: document.getElementById('subscribe-cta'),
    emailForm: document.getElementById('email-form'),
    userEmail: document.getElementById('user-email'),
    clarityBar: document.getElementById('clarity-progress'),
    clarityLabel: document.getElementById('clarity-label'),
    userLevel: document.getElementById('user-level'),
    paywallModal: document.getElementById('paywall-modal'),
    closePaywallBtn: document.getElementById('close-paywall')
};

const requiredNodes = ['form', 'method', 'context', 'situation', 'generateBtn', 'resultSection', 'questionsOutput', 'ctaSection', 'emailCta', 'subscribeCta', 'emailForm', 'userEmail'];

const utils = {
    show(node) {
        if (node) node.classList.remove('hidden');
    },
    hide(node) {
        if (node) node.classList.add('hidden');
    },
    scrollTo(node) {
        node?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    parseJSON(raw, fallback) {
        try {
            const parsed = JSON.parse(raw);
            return parsed ?? fallback;
        } catch {
            return fallback;
        }
    },
    escapeHTML(text) {
        return String(text).replace(/[&<>"']/g, (char) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[char]);
    },
    normalizeQuestions(rawText) {
        return rawText
            .split('\n')
            .map((line) => line.replace(/^[-*\d.)\s]+/, '').trim())
            .filter(Boolean)
            .slice(0, 8);
    }
};

const store = {
    getQueryCount() {
        return Number(localStorage.getItem(CONFIG.storageKeys.queryCount) || 0);
    },
    setQueryCount(count) {
        localStorage.setItem(CONFIG.storageKeys.queryCount, String(count));
    },
    getMethodsUsed() {
        const value = utils.parseJSON(localStorage.getItem(CONFIG.storageKeys.methodsUsed), []);
        return new Set(Array.isArray(value) ? value : []);
    },
    setMethodsUsed(set) {
        localStorage.setItem(CONFIG.storageKeys.methodsUsed, JSON.stringify(Array.from(set)));
    },
    getApiKey() {
        return window.GEMINI_API_KEY || localStorage.getItem(CONFIG.storageKeys.apiKey) || '';
    },
    getTelemetry() {
        return utils.parseJSON(localStorage.getItem(CONFIG.storageKeys.telemetry), {
            generated: 0,
            failures: 0,
            avgLatencyMs: 0,
            lastError: null,
            lastMethod: null
        });
    },
    setTelemetry(next) {
        localStorage.setItem(CONFIG.storageKeys.telemetry, JSON.stringify(next));
    }
};

const state = {
    queryCount: store.getQueryCount(),
    methodsUsed: store.getMethodsUsed(),
    isLoading: false
};

const telemetry = {
    trackSuccess({ method, latencyMs }) {
        const current = store.getTelemetry();
        const total = current.generated + 1;
        const avgLatencyMs = Math.round(((current.avgLatencyMs * current.generated) + latencyMs) / total);
        store.setTelemetry({
            ...current,
            generated: total,
            avgLatencyMs,
            lastError: null,
            lastMethod: method
        });
    },
    trackError(error) {
        const current = store.getTelemetry();
        store.setTelemetry({
            ...current,
            failures: current.failures + 1,
            lastError: String(error?.message || error)
        });
    }
};

const view = {
    getUserLevel() {
        return state.methodsUsed.size >= 3 ? 'Estratega' : 'Iniciado';
    },
    updateLevel() {
        if (DOM.userLevel) DOM.userLevel.textContent = this.getUserLevel();
    },
    updateClarity() {
        if (!DOM.clarityBar || !DOM.clarityLabel) return;
        const percent = Math.min(100, Math.round((state.queryCount / CONFIG.freeQueryLimit) * 100));
        DOM.clarityBar.style.width = `${percent}%`;
        DOM.clarityLabel.textContent = `${percent}%`;
    },
    setLoading(isLoading) {
        state.isLoading = isLoading;
        DOM.generateBtn.disabled = isLoading;
        DOM.generateBtn.textContent = isLoading ? 'DECODIFICANDO...' : 'Generar preguntas personalizadas';
    },
    renderQuestions(rawText) {
        const lines = utils.normalizeQuestions(rawText).map(utils.escapeHTML);
        const html = lines.length
            ? `<div class="questions-block"><div class="hat-title"><span>Decodificación estratégica</span></div><ul class="questions-list">${lines.map((line) => `<li>${line}</li>`).join('')}</ul></div>`
            : `<div class="questions-block"><p>${utils.escapeHTML(rawText)}</p></div>`;

        DOM.questionsOutput.innerHTML = html;
        utils.show(DOM.resultSection);
        utils.show(DOM.ctaSection);
        utils.scrollTo(DOM.resultSection);
    },
    showPaywall() {
        utils.show(DOM.paywallModal);
    },
    hidePaywall() {
        utils.hide(DOM.paywallModal);
    }
};

const geminiService = {
    async generate({ method, context, situation }) {
        const apiKey = store.getApiKey();
        if (!apiKey) {
            throw new Error('Falta la API key de Gemini. Define window.GEMINI_API_KEY o localStorage.GEMINI_API_KEY');
        }

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.geminiModel}:generateContent?key=${apiKey}`;
        const payload = {
            system_instruction: { parts: [{ text: CONFIG.systemInstruction }] },
            contents: [{
                role: 'user',
                parts: [{
                    text: `Método: ${method}\nContexto: ${context}\nSituación: ${situation}\n\nEntrega solo preguntas de alto impacto.`
                }]
            }]
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Gemini API error (${response.status}): ${await response.text()}`);
        }

        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error('No se recibió contenido desde Gemini');
        return text;
    }
};

function persistProgress(method) {
    state.queryCount += 1;
    state.methodsUsed.add(method);
    store.setQueryCount(state.queryCount);
    store.setMethodsUsed(state.methodsUsed);
    view.updateClarity();
    view.updateLevel();
}

async function handleGenerate(event) {
    event.preventDefault();
    if (state.isLoading) return;

    const method = DOM.method.value;
    const context = DOM.context.value;
    const situation = DOM.situation.value.trim();

    if (!method || !context || !situation) {
        alert('Por favor, completa todos los campos');
        return;
    }

    if (state.queryCount >= CONFIG.freeQueryLimit) {
        view.showPaywall();
        return;
    }

    const start = performance.now();
    view.setLoading(true);

    try {
        const output = await geminiService.generate({ method, context, situation });
        view.renderQuestions(output);
        persistProgress(method);
        telemetry.trackSuccess({ method, latencyMs: Math.round(performance.now() - start) });
    } catch (error) {
        telemetry.trackError(error);
        console.error('Error en la conexión mística', error);
        alert('No se pudo conectar con Gemini. Revisa tu API key e intenta nuevamente.');
    } finally {
        view.setLoading(false);
    }
}

function handleEmailCta() {
    utils.show(DOM.emailForm);
    DOM.userEmail.focus();
}

function handleSubscribeCta() {
    window.open('https://chalamandra.substack.com', '_blank');
}

function handleEmailSubmit(event) {
    event.preventDefault();
    const email = DOM.userEmail.value.trim();

    if (!utils.validateEmail(email)) {
        alert('Por favor, introduce un email válido');
        return;
    }

    const subject = `🔮 Tu Decodificación: ${DOM.situation.value.trim() || 'Tu situación'}`;
    const body = `Has consultado al Oráculo. Aquí están las coordenadas de tu próxima gran decisión:\n\nMÉTODO: ${DOM.method.value}\nTUS PREGUNTAS DE PODER:\n${DOM.questionsOutput.innerText}\n\nTU MICRO-ACCIÓN (SRAP):\nNo dejes que la claridad se evapore. Tienes 72 horas para mover la primera pieza.\n\nMantén la frecuencia alta.\n— Chalamandra Magistral`;

    window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    utils.hide(DOM.emailForm);
    DOM.userEmail.value = '';
}

function hasRequiredDOM() {
    return requiredNodes.every((key) => DOM[key]);
}

function init() {
    if (!hasRequiredDOM()) {
        console.warn('Chalamandra init abortado: faltan nodos requeridos en el DOM.');
        return;
    }

    DOM.form.addEventListener('submit', handleGenerate);
    DOM.emailCta.addEventListener('click', handleEmailCta);
    DOM.subscribeCta.addEventListener('click', handleSubscribeCta);
    DOM.emailForm.addEventListener('submit', handleEmailSubmit);
    DOM.closePaywallBtn?.addEventListener('click', () => view.hidePaywall());

    view.updateClarity();
    view.updateLevel();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
