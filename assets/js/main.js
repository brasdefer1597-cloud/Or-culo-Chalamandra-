const DOM = {
    form: document.getElementById('oracle-form'),
    situation: document.getElementById('situation'),
    method: document.getElementById('method'),
    generateBtn: document.getElementById('generate-btn'),
    resultSection: document.getElementById('result-section'),
    resultOutput: document.getElementById('result-output'),
    goSrap: document.getElementById('go-srap')
};

const TECHNICAL_PATTERN = /(error|bug|api|servidor|latencia|red|ca[ií]da|timeout|dns|infra|deploy|backend|frontend)/i;
const SRAP_DELAY_MS = 5000;
const DEFAULT_BUTTON_LABEL = 'Generar Preguntas';
const SRAP_BUTTON_LABEL = 'SRAP: Entrando en Presencia...';

function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function applyContext(question, situation) {
    return question
        .replaceAll('[contexto]', situation)
        .replaceAll('[Opción A]', 'la opción A que estás considerando')
        .replaceAll('[Opción B]', 'la opción B que estás considerando');
}

function pickQuestions(groupQuestions, max = 2) {
    return groupQuestions.slice(0, max);
}

function buildQuestions(method, situation) {
    const methodData = QUESTION_BANK[method];
    if (!methodData) return [];

    return Object.entries(methodData).map(([groupName, questions]) => {
        const selected = pickQuestions(questions).map((q) => applyContext(q, situation));
        return { groupName, selected };
    });
}

function renderResults(method, situation) {
    const blocks = buildQuestions(method, situation);

    DOM.resultOutput.innerHTML = blocks.map(({ groupName, selected }) => `
        <article class="result-block">
            <h3>${groupName}</h3>
            <ul>${selected.map((q) => `<li>${q}</li>`).join('')}</ul>
        </article>
    `).join('');

    const shouldRouteToSrap = TECHNICAL_PATTERN.test(situation);
    DOM.goSrap.classList.toggle('hidden', !shouldRouteToSrap);
    DOM.resultSection.classList.remove('hidden');
}

async function handleSubmit(event) {
    event.preventDefault();
    const situation = DOM.situation.value.trim();
    const method = DOM.method.value;

    if (!situation || !method) {
        alert('Completa el caos y selecciona un framework antes de generar preguntas.');
        return;
    }

    DOM.generateBtn.disabled = true;
    DOM.generateBtn.textContent = SRAP_BUTTON_LABEL;

    await wait(SRAP_DELAY_MS);
    renderResults(method, situation);

    DOM.generateBtn.disabled = false;
    DOM.generateBtn.textContent = DEFAULT_BUTTON_LABEL;
}

DOM.form.addEventListener('submit', handleSubmit);
