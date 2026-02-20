// ELEMENTOS DOM - Cacheado para mejor performance
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
    userLevel: document.getElementById('user-level'),
    paywallModal: document.getElementById('paywall-modal'),
    closePaywallBtn: document.getElementById('close-paywall')
};

const GEMINI_MODEL = 'gemini-1.5-flash';
const FREE_QUERY_LIMIT = 3;
const SYSTEM_INSTRUCTION = `Eres la Sabiduría de Chalamandra, una guía experta en marcos de pensamiento. Tu tono es sereno, inteligente, directo y empoderador (estilo Malandra Fresa pero en modo Mentora).
Al recibir el [Método] y el [Contexto], genera 3-5 preguntas potentes que obliguen al usuario a salir de su sesgo cognitivo.
Ejemplo para '6 Sombreros' en 'Decisión Laboral': 'Sombrero Negro: ¿Cuál es el riesgo oculto que tu ambición no te está dejando ver?'`;

function safeParseArray(value) {
    try {
        const parsed = JSON.parse(value || '[]');
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

// UTILIDADES
const utils = {
    show(element) {
        if (element) element.classList.remove('hidden');
    },

    hide(element) {
        if (element) element.classList.add('hidden');
    },

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    scrollToElement(element) {
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },

    escapeHTML(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };

        return text.replace(/[&<>"']/g, (char) => map[char]);
    },

    formatQuestionsAsList(text) {
        const lines = text
            .split('\n')
            .map((line) => line.replace(/^[-*\d.)\s]+/, '').trim())
            .filter(Boolean)
            .map((line) => this.escapeHTML(line));

        if (!lines.length) {
            return `<div class="questions-block"><p>${this.escapeHTML(text)}</p></div>`;
        }

        return `
            <div class="questions-block">
                <div class="hat-title"><span>Decodificación estratégica</span></div>
                <ul class="questions-list">
                    ${lines.map((line) => `<li>${line}</li>`).join('')}
                </ul>
            </div>
        `;
    }
};

const state = {
    queryCount: Number(localStorage.getItem('oracleQueryCount') || 0),
    methodsUsed: new Set(safeParseArray(localStorage.getItem('oracleMethodsUsed')))
};

function saveState() {
    localStorage.setItem('oracleQueryCount', String(state.queryCount));
    localStorage.setItem('oracleMethodsUsed', JSON.stringify(Array.from(state.methodsUsed)));
}

function getUserLevel() {
    return state.methodsUsed.size >= 3 ? 'Estratega' : 'Iniciado';
}

function updateLevelUI() {
    if (DOM.userLevel) {
        DOM.userLevel.textContent = getUserLevel();
    }
}

function updateClarityProgress() {
    const filled = Math.min(100, Math.round((state.queryCount / FREE_QUERY_LIMIT) * 100));
    if (DOM.clarityBar) {
        DOM.clarityBar.style.width = `${filled}%`;
    }

    if (DOM.clarityLabel) {
        DOM.clarityLabel.textContent = `${filled}%`;
    }
}

function showPaywall() {
    utils.show(DOM.paywallModal);
}

function hidePaywall() {
    utils.hide(DOM.paywallModal);
}

function getGeminiApiKey() {
    return window.GEMINI_API_KEY || localStorage.getItem('GEMINI_API_KEY') || '';
}

async function callGeminiAPI({ method, context, situation }) {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
        throw new Error('Falta la API key de Gemini. Define window.GEMINI_API_KEY o localStorage.GEMINI_API_KEY');
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
    const payload = {
        system_instruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }]
        },
        contents: [
            {
                role: 'user',
                parts: [
                    {
                        text: `Método: ${method}\nContexto: ${context}\nSituación: ${situation}\n\nEntrega solo preguntas de alto impacto.`
                    }
                ]
            }
        ]
    };

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Gemini API error (${response.status}): ${errorBody}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
        throw new Error('No se recibió contenido desde Gemini');
    }

    return text;
}

// MANEJADORES DE EVENTOS
const eventHandlers = {
    async handleFormSubmit(e) {
        e.preventDefault();

        const method = DOM.method?.value;
        const context = DOM.context?.value;
        const situation = DOM.situation?.value.trim();

        if (!method || !context || !situation) {
            alert('Por favor, completa todos los campos');
            return;
        }

        if (state.queryCount >= FREE_QUERY_LIMIT) {
            showPaywall();
            return;
        }

        DOM.generateBtn.innerText = 'DECODIFICANDO...';
        DOM.generateBtn.disabled = true;

        try {
            const rawQuestions = await callGeminiAPI({ method, context, situation });
            DOM.questionsOutput.innerHTML = utils.formatQuestionsAsList(rawQuestions);

            state.queryCount += 1;
            state.methodsUsed.add(method);
            saveState();
            updateClarityProgress();
            updateLevelUI();

            utils.show(DOM.resultSection);
            utils.show(DOM.ctaSection);
            utils.scrollToElement(DOM.resultSection);
        } catch (error) {
            console.error('Error en la conexión mística', error);
            alert('No se pudo conectar con Gemini. Revisa tu API key e intenta nuevamente.');
        } finally {
            DOM.generateBtn.innerText = 'Generar preguntas personalizadas';
            DOM.generateBtn.disabled = false;
        }
    },

    handleEmailCta() {
        utils.show(DOM.emailForm);
        DOM.userEmail.focus();
    },

    handleSubscribeCta() {
        window.open('https://chalamandra.substack.com', '_blank');
    },

    handleEmailSubmit(e) {
        e.preventDefault();

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
};

function hasRequiredDOM() {
    return !!(
        DOM.form &&
        DOM.method &&
        DOM.context &&
        DOM.situation &&
        DOM.resultSection &&
        DOM.questionsOutput &&
        DOM.ctaSection &&
        DOM.emailCta &&
        DOM.subscribeCta &&
        DOM.emailForm &&
        DOM.userEmail &&
        DOM.generateBtn
    );
}

// INICIALIZACIÓN
function init() {
    if (!hasRequiredDOM()) {
        console.warn('Chalamandra init abortado: faltan nodos requeridos en el DOM.');
        return;
    }

    DOM.form.addEventListener('submit', eventHandlers.handleFormSubmit);
    DOM.emailCta.addEventListener('click', eventHandlers.handleEmailCta);
    DOM.subscribeCta.addEventListener('click', eventHandlers.handleSubscribeCta);
    DOM.emailForm.addEventListener('submit', eventHandlers.handleEmailSubmit);
    DOM.closePaywallBtn?.addEventListener('click', hidePaywall);

    updateClarityProgress();
    updateLevelUI();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
