// calc.js
const screen = document.getElementById('screen');
const keys = Array.from(document.querySelectorAll('.key'));

let expr = ""; // full expression string
let error = false;

function updateScreen(text) {
  screen.textContent = text === "" ? "0" : text;
}

function isOperator(ch) {
  return ['+', '-', '*', '/', '%'].includes(ch);
}

function sanitizeAppend(char) {
  if (error) {
    expr = "";
    error = false;
  }
  if (char === '.') {
    // prevent multiple decimals in the current number
    const m = expr.match(/([0-9.]+)$/);
    const lastNumber = m ? m[0] : "";
    if (lastNumber.includes('.')) return;
    if (lastNumber === "") {
      expr += "0.";
      return;
    }
    expr += '.';
    return;
  }

  if (char === '%') {
    // only allow percent after a number
    if (expr === "") return;
    const last = expr[expr.length - 1];
    if (isOperator(last) || last === '.') return;
    expr += '%';
    return;
  }

  if (isOperator(char)) {
    if (expr === "" && char === '-') {
      expr = "-";
      return;
    }
    if (expr === "") return;
    const last = expr[expr.length - 1];
    if (isOperator(last)) {
      // replace operator (except allow minus as unary after operator)
      if (char === '-' && last !== '-') {
        // allow unary minus after operator by appending
        expr += '-';
        return;
      }
      // replace last operator(s) with new operator
      expr = expr.slice(0, -1) + char;
      return;
    }
    expr += char;
    return;
  }

  // number
  expr += char;
}

function handleNumber(value) {
  sanitizeAppend(String(value));
  updateScreen(expr);
}

function handleDecimal() {
  sanitizeAppend('.');
  updateScreen(expr);
}

function handleOperator(op) {
  sanitizeAppend(op);
  updateScreen(expr);
}

function handlePercent() {
  sanitizeAppend('%');
  updateScreen(expr);
}

function handleClear() {
  expr = "";
  error = false;
  updateScreen(expr);
}

function handleDelete() {
  if (error) {
    expr = "";
    error = false;
    updateScreen(expr);
    return;
  }
  if (expr.length === 0) return;
  expr = expr.slice(0, -1);
  updateScreen(expr);
}

function tokenize(s) {
  const tokens = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (ch === ' ') { i++; continue; }
    if (ch === '+' || ch === '*' || ch === '/' ) {
      tokens.push({type: 'op', value: ch});
      i++; continue;
    }
    if (ch === '-') {
      // determine unary or binary: unary if at start or previous token is op
      const prev = tokens[tokens.length - 1];
      if (!prev || (prev.type === 'op')) {
        // parse number with leading minus
        let j = i + 1;
        let num = '-';
        while (j < s.length && /[0-9.]/.test(s[j])) {
          num += s[j];
          j++;
        }
        if (num === '-') {
          // lone minus treated as operator
          tokens.push({type: 'op', value: '-'});
          i++;
        } else {
          tokens.push({type: 'num', value: num});
          i = j;
        }
        continue;
      } else {
        tokens.push({type: 'op', value: '-'});
        i++; continue;
      }
    }
    if (/[0-9.]/.test(ch)) {
      let j = i;
      let num = '';
      while (j < s.length && /[0-9.]/.test(s[j])) {
        num += s[j];
        j++;
      }
      tokens.push({type: 'num', value: num});
      i = j;
      continue;
    }
    if (ch === '%') {
      tokens.push({type: 'percent', value: '%'});
      i++; continue;
    }
    // unknown char -> skip
    i++;
  }
  return tokens;
}

function toRPN(tokens) {
  const out = [];
  const ops = [];
  const precedence = {'+': 1, '-': 1, '*': 2, '/': 2};
  for (let t of tokens) {
    if (t.type === 'num') {
      out.push(t);
    } else if (t.type === 'percent') {
      // percent is postfix unary: push as operator with special handling
      out.push(t);
    } else if (t.type === 'op') {
      while (ops.length) {
        const top = ops[ops.length - 1];
        if (top.type === 'op' && precedence[top.value] >= precedence[t.value]) {
          out.push(ops.pop());
        } else {
          break;
        }
      }
      ops.push(t);
    }
  }
  while (ops.length) out.push(ops.pop());
  return out;
}

function evalRPN(rpn) {
  const stack = [];
  for (let token of rpn) {
    if (token.type === 'num') {
      stack.push(Number(token.value));
    } else if (token.type === 'percent') {
      if (stack.length === 0) return null;
      const a = stack.pop();
      stack.push(a / 100);
    } else if (token.type === 'op') {
      if (stack.length < 2) return null;
      const b = stack.pop();
      const a = stack.pop();
      let res;
      switch (token.value) {
        case '+': res = a + b; break;
        case '-': res = a - b; break;
        case '*': res = a * b; break;
        case '/':
          if (b === 0) return undefined;
          res = a / b; break;
        default: return null;
      }
      stack.push(res);
    }
  }
  if (stack.length !== 1) return null;
  return stack[0];
}

function formatNumber(n) {
  if (!isFinite(n)) return String(n);
  const rounded = parseFloat(Number(n).toPrecision(12));
  return String(rounded);
}

function handleEquals() {
  if (error) {
    expr = "";
    error = false;
    updateScreen(expr);
    return;
  }
  if (expr.trim() === "") return;
  const tokens = tokenize(expr);
  if (!tokens || tokens.length === 0) {
    error = true;
    updateScreen("Error");
    return;
  }
  const rpn = toRPN(tokens);
  const result = evalRPN(rpn);
  if (result === undefined) {
    error = true;
    updateScreen("Error");
    return;
  }
  if (result === null || Number.isNaN(result)) {
    error = true;
    updateScreen("Error");
    return;
  }
  expr = formatNumber(result);
  updateScreen(expr);
}

keys.forEach(key => {
  key.addEventListener('click', () => {
    const action = key.dataset.action;
    const value = key.dataset.value;
    const op = key.dataset.op;

    switch (action) {
      case 'number':
        handleNumber(value);
        break;
      case 'decimal':
        handleDecimal();
        break;
      case 'clear':
        handleClear();
        break;
      case 'delete':
        handleDelete();
        break;
      case 'percent':
        handlePercent();
        break;
      case 'operator':
        handleOperator(op);
        break;
      case 'equals':
        handleEquals();
        break;
      default:
        break;
    }
  });
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Backspace') {
    handleDelete();
    e.preventDefault();
    return;
  }
  if (e.key === 'Escape') {
    handleClear();
    return;
  }
  if (e.key === 'Enter' || e.key === '=') {
    handleEquals();
    return;
  }
  if (/\d/.test(e.key)) {
    handleNumber(e.key);
    return;
  }
  if (e.key === '.') {
    handleDecimal();
    return;
  }
  if (['+', '-', '*', '/'].includes(e.key)) {
    handleOperator(e.key);
    return;
  }
  if (e.key === '%') {
    handlePercent();
    return;
  }
});

updateScreen(expr);
