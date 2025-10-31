// 1️⃣ DOM References & State
const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');
const keys = document.querySelectorAll('.key');
const themeToggle = document.getElementById('themeToggle');
let tokens = [];

// 2️⃣ Display Update
function updateDisplay() {
  expressionEl.textContent = tokens.join(' ') || '';
  try {
    const val = tokens.length ? safeEvaluate(tokens) : 0;
    resultEl.textContent = val === null ? 'Error' : val;
  } catch {
    resultEl.textContent = 'Error';
  }
}

// 3️⃣ Input Functions
function pushNumber(ch) {
  const last = tokens[tokens.length - 1];
  if (!last || /[+\-*/%]/.test(last))
    tokens.push(ch === '.' ? '0.' : ch);
  else if (ch !== '.' || !last.includes('.'))
    tokens[tokens.length - 1] += ch;
  updateDisplay();
}

function pushOperator(op) {
  const last = tokens[tokens.length - 1];
  if (!last && op === '-') return tokens.push('-');
  if (!last) return;
  if (/[+\-*/%]/.test(last)) tokens[tokens.length - 1] = op;
  else tokens.push(op);
  updateDisplay();
}

// 4️⃣ Action Buttons
function doClear() { tokens = []; updateDisplay(); }
function doDelete() {
  const last = tokens[tokens.length - 1];
  if (!last) return;
  if (/[+\-*/%]/.test(last)) tokens.pop();
  else tokens[tokens.length - 1] = last.slice(0, -1);
  updateDisplay();
}
function percentLast() {
  const last = tokens[tokens.length - 1];
  if (!last || /[+\-*/%]/.test(last)) return;
  tokens[tokens.length - 1] = String(parseFloat(last) / 100);
  updateDisplay();
}
function calculatePressed() {
  const val = safeEvaluate(tokens);
  if (val === null) return resultEl.textContent = 'Error';
  tokens = [String(val)];
  updateDisplay();
}

// 5️⃣ Evaluation Logic (no eval)
function safeEvaluate(arr) {
  const normalized = normalizeTokens(arr);
  const rpn = toRPN(normalized);
  return evalRPN(rpn);
}

function normalizeTokens(arr) {
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    const t = arr[i];
    if (t === '-' && (!out.length || /[+\-*/%]/.test(out[out.length - 1]))) {
      out.push(String(-parseFloat(arr[i + 1])));
      i++;
    } else out.push(t);
  }
  return out;
}

function toRPN(tokens) {
  const prec = { '+': 1, '-': 1, '*': 2, '/': 2 };
  const out = [], ops = [];
  tokens.forEach(t => {
    if (/[+\-*/%]/.test(t)) {
      while (ops.length && prec[ops[ops.length - 1]] >= prec[t])
        out.push(ops.pop());
      ops.push(t);
    } else out.push(t);
  });
  return out.concat(ops.reverse());
}

function evalRPN(rpn) {
  const st = [];
  for (const t of rpn) {
    if (/[+\-*/]/.test(t)) {
      const b = +st.pop(), a = +st.pop();
      if (t === '/' && b === 0) return null;
      st.push({ '+': a + b, '-': a - b, '*': a * b, '/': a / b }[t]);
    } else st.push(+t);
  }
  return st[0];
}

// 6️⃣ Event Listeners
keys.forEach(k => {
  k.onclick = () => {
    const v = k.dataset.value, a = k.dataset.action;
    if (a === 'clear') return doClear();
    if (a === 'delete') return doDelete();
    if (a === 'percent') return percentLast();
    if (a === 'calculate') return calculatePressed();
    if (v) /[0-9.]/.test(v) ? pushNumber(v) : pushOperator(v);
  };
});

window.onkeydown = e => {
  if (/^[0-9.]$/.test(e.key)) pushNumber(e.key);
  else if (['+', '-', '*', '/'].includes(e.key)) pushOperator(e.key);
  else if (e.key === 'Enter') calculatePressed();
  else if (e.key === 'Backspace') doDelete();
  else if (e.key === 'Escape') doClear();
};

// 7️⃣ Dark Mode Toggle
themeToggle.onclick = () => document.body.classList.toggle('dark');
