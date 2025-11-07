    const display = document.getElementById('display');

    function clearDisplay() {
      display.textContent = '0';
    }

    function deleteLast() {
      display.textContent = display.textContent.slice(0, -1) || '0';
    }

    function appendChar(char) {
      if (display.textContent === '0') display.textContent = '';
      display.textContent += char;
    }

    function calculate() {
      try {
        const result = safeEvaluate(display.textContent);
        display.textContent = result;
      } catch {
        display.textContent = 'Error';
      }
    }

    function safeEvaluate(expr) {
      const numbers = [];
      const ops = [];
      const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };

      function applyOp() {
        const b = numbers.pop();
        const a = numbers.pop();
        const op = ops.pop();
        if (op === '+') numbers.push(a + b);
        else if (op === '-') numbers.push(a - b);
        else if (op === '*') numbers.push(a * b);
        else if (op === '/') numbers.push(a / b);
      }

      let num = '';
      for (let i = 0; i < expr.length; i++) {
        const ch = expr[i];

        if (!isNaN(ch) || ch === '.') {
          num += ch;
        } else if (ch in precedence) {
          if (num) {
            numbers.push(parseFloat(num));
            num = '';
          }
          while (ops.length && precedence[ops[ops.length - 1]] >= precedence[ch]) {
            applyOp();
          }
          ops.push(ch);
        }
      }
      if (num) numbers.push(parseFloat(num));

      while (ops.length) applyOp();
      return numbers[0];
    }