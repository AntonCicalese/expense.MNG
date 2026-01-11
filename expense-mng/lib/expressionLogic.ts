const PRIORITY: Record<string, number> = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2
}

function adaptExpression(expression: string): string {
  let result = "";

  for (let i = 0; i < expression.length; i++) {
    const curr = expression[i];
    const next = i + 1 < expression.length ? expression[i + 1] : "";

    result += curr;

    // If we have a number (or decimal) immediately followed by '(',
    // insert implicit multiplication as " × "
    if (/[0-9.]/.test(curr) && next == "(") {
      result += " × ";
    }
    if(curr == '(' && /[0-9.]/.test(next) || /[0-9.]/.test(curr) && next == ")") {
        result += " "
    }
  }

  console.log("Adapted expression: " + result)
  return result
}


export function shuntingYard(expression: string): string[] {
    expression = adaptExpression(expression)

    let output: string[] = []
    let operators: string[] = []
    let tokens = expression.split(" ")

    for (let i = 0; i<tokens.length; i++) {
        let token = tokens[i]

        if (/[0-9.]+/.test(token)) {
            // Number
            output.push(token)
        } else {
            // Operator
            if (token == "(") {
                operators.push(token)
            } else if (token == ")") {
                while (operators.length > 0 && operators[operators.length - 1] != "(") {
                    output.push(operators.pop()!) // il ! dice a TypeScript che il risultato dell'operazione e non nullo
                }
                operators.pop() // Rimuovo la "("
            } else {
                while (operators.length > 0 && operators[operators.length - 1] != '(' && PRIORITY[token] <= PRIORITY[operators[operators.length - 1]]) {
                    output.push(operators.pop()!) // il ! dice a TypeScript che il risultato dell'operazione e non nullo
                }
                operators.push(token)
            }
            
        }
        
    }
    // Sposta gli operatori rimanenti in output
    while (operators.length > 0) {
        if (operators[operators.length - 1] === '(') {
            throw new Error("Mismatched parentheses");
        }
        output.push(operators.pop()!);
    }

    console.log(output)

    return output
}

export function evaluateRPN(RPN: string[]): number {
    let stack: number[] = []

    for (let i = 0; i<RPN.length; i++) {
        let value = RPN[i]

        if(/[0-9.]/.test(value)) {
            // Number
            stack.push(parseFloat(value))
        } else {
            // Operator
            let n2 = stack.pop()!
            let n1 = stack.pop()!

            switch(value) {
                case '+': stack.push(n1 + n2); break
                case '-': stack.push(n1 - n2); break
                case '×': stack.push(n1 * n2); break
                case '÷': 
                    if (n2 == 0) throw new Error("Divisione per Zero")
                    stack.push(n1 / n2)
                    break
            }
        }
    }

    if (Number.isNaN(stack[0])) {
        throw new Error("Something went wrong");
    }
    return stack[0]
}