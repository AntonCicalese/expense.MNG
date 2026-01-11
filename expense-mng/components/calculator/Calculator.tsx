import { evaluateRPN, shuntingYard } from "@/lib/expressionLogic";
import { Display } from "./Display";
import { useState } from 'react';
import { Keypad } from "./Keypad";


export function Calculator() {
    const MAX_NUM_LENGTH = 20

    const [expression, setExpression] = useState<string>('0')
    const [previous, setPrevious] = useState<string>('')

    const[alreadyPlacedDot, setAlreadyPlacedDot] = useState<boolean>(false)

    function appendNumber(num: string) {
        if (expression[0] == '-') {
            if (/[0-9]/.test(num)) {
                setAlreadyPlacedDot(false)
                setExpression(num)
            }
            return
        }
        if (!(/[+\-×÷]/.test(num) && expression[expression.length-1] == '(' || /[+\-×÷]/.test(expression[expression.length-1]) && num == ')')) {
            if(num == '.') {
                if (!alreadyPlacedDot) {
                    setExpression(expression === '0' ? "0." : expression + num)
                    setAlreadyPlacedDot(true)
                }
                return
            }
            if (expression[0] == 'E' || expression[0] == 'N') { // If calculator in ERROR or NaN
                if (/[0-9.]/.test(num)) {
                    setExpression(num)
                }
                return
            }

            // Enforce max length for the current number
            if (/[0-9]/.test(num)) {
                const currentLen = getCurrentNumberLength(expression);
                if (currentLen >= MAX_NUM_LENGTH) {
                    return;
                }
            }

            if (isSameTypeAsLastCharacter(num)) {
                if (!/[+\-×÷]/.test(num)) {
                    setExpression(expression === '0' ? num : expression + num)
                } else {
                    setAlreadyPlacedDot(false)
                }
                return
            }
            setExpression(expression === '0' ? "0" : expression + " " + num)
        }
    }

    function getCurrentNumberLength(expr: string): number {
        // Split by space -> last token is the current number or operator
        const parts = expr.split(" ");
        const last = parts[parts.length - 1] || "";

        // If last token is not a number (e.g. it's +, -, ×, ÷, or "("), length is 0
        if (!/[0-9.]+/.test(last)) return 0;

        // Count digits and dots in the last token
        return last.length;
    }


    function deleteNumber() {
        if (expression[expression.length - 2] == ' ') {
            setExpression(expression.substring(0, expression.length - 2))
            return
        }
        if(expression[expression.length - 1] == '.') {
            setAlreadyPlacedDot(false)
        }
        setExpression(expression.substring(0, expression.length - 1))
    }

    function isSameTypeAsLastCharacter(char: string) {
        return ((/[0-9.()]/.test(char) && /[0-9.()]/.test(expression[expression.length - 1])) || (/[+\-×÷]/.test(char) && /[+\-×÷]/.test(expression[expression.length - 1])))
    }

    function compute() {
        try {
            setPrevious(expression)
            let result = evaluateRPN(shuntingYard(expression)).toString()
            if (result.length <= MAX_NUM_LENGTH) {
                setAlreadyPlacedDot(result.includes('.'))
                setExpression(result)
            } else {
                setExpression("ERROR")
                console.error("Output number too long")
            }
        } catch {
            console.error("Computation failed")
            setExpression("ERROR")
        }
    }

    function deleteAll() {
        if (expression != '0') {
            setAlreadyPlacedDot(false)
            setExpression("0")
        } else {
            setPrevious('')
        }
        
    }

    return (
        <div className="w-full bg-background shadow-sm backdrop-blur-xl border border-background-light/50 rounded-2xl p-4 flex flex-col gap-3">
            <header className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium uppercase tracking-wide text-subheader">
                    Calculator
                </span>
            </header>
            
            <Display expression={expression} previous={previous} />

            <section>
                <Keypad
                    onNumberClick={appendNumber}
                    onComputeClick={compute}
                    onDeleteClick={deleteNumber}
                    onDeleteAllClick={deleteAll}
                />
            </section>
        </div>
    )

}



