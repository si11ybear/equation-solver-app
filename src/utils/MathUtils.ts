export function isQuadraticEquation(equation: string): boolean {
    const quadraticRegex = /^(-?\d*\.?\d*)x\^2\s*([+-]\s*\d*\.?\d*)x\s*([+-]\s*\d*\.?\d*)=0$/;
    return quadraticRegex.test(equation.replace(/\s/g, ''));
}

export function isLinearEquation(equation: string): boolean {
    const linearRegex = /^(-?\d*\.?\d*)x\s*([+-]\s*\d*\.?\d*)=0$/;
    return linearRegex.test(equation.replace(/\s/g, ''));
}

export function parseCoefficients(equation: string): number[] {
    const terms = equation.split('=');
    const leftSide = terms[0].trim();
    const regex = /(-?\d*\.?\d*)x\^2|(-?\d*\.?\d*)x|(-?\d*\.?\d*)/g;
    const coefficients = [];
    let match;

    while ((match = regex.exec(leftSide)) !== null) {
        coefficients.push(parseFloat(match[0]) || 0);
    }

    return coefficients;
}