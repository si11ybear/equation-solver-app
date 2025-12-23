export class EquationGenerator {
    generateEquation(type: string): string {
        switch (type) {
            case 'LINEAR_ONE':
                return this.generateLinearOneEquation();
            case 'LINEAR_2':
                return this.generateLinearSystem2();
            case 'LINEAR_3':
                return this.generateLinearSystem3();
            case 'QUADRATIC':
                return this.generateQuadraticEquation();
            case 'FACTORING':
                return this.generateFactoringEquation();
            // case 'MULTIPLICATION':
            //     return this.generateMultiplicationEquation();
            default:
                throw new Error('Unsupported equation type');
        }
    }

private generateLinearOneEquation(): string {
    let a = this.getRandomInt(-10, 10);
    let b = this.getRandomInt(-10, 10);
    
    // 确保方程有意义
    if (a === 0) {
        a = 1;
    }
    
    // 随机选择一种形式
    const form = Math.floor(Math.random() * 3);
    
    switch (form) {
        case 0: // 标准形式: ax + b = 0
            return this.generateStandardForm(a, b);
        case 1: // 简化形式: ax = c
            return this.generateSimpleForm(a, b);
        case 2: // 两边形式: ax = bx + c
            return this.generateBothSidesForm(a, b);
        default:
            return this.generateStandardForm(a, b);
    }
}

private generateStandardForm(a: number, b: number): string {
    let leftSide = '';
    
    // x项
    if (a > 0) {
        leftSide = a === 1 ? 'x' : `${a}x`;
    } else {
        leftSide = a === -1 ? '-x' : `-${Math.abs(a)}x`;
    }
    
    // 常数项
    if (b !== 0) {
        if (b > 0) {
            leftSide += ` + ${b}`;
        } else {
            leftSide += ` - ${Math.abs(b)}`;
        }
    }
    
    return `${leftSide} = 0`;
}

private generateSimpleForm(a: number, b: number): string {
    const c = -b; // ax = c
    let rightSide = '';
    
    if (c > 0) {
        rightSide = c.toString();
    } else if (c < 0) {
        rightSide = `-${Math.abs(c)}`;
    } else {
        rightSide = '0';
    }
    
    // 左式
    let leftSide = '';
    if (a > 0) {
        leftSide = a === 1 ? 'x' : `${a}x`;
    } else {
        leftSide = a === -1 ? '-x' : `-${Math.abs(a)}x`;
    }
    
    return `${leftSide} = ${rightSide}`;
}

private generateBothSidesForm(a: number, b: number): string {
    const m = this.getRandomInt(-5, 5);
    const n = this.getRandomInt(-5, 5);
    
    // 确保至少有一个x项
    if (a === 0 && m === 0) {
        a = 1;
    }
    
    let leftSide = '';
    if (a > 0) {
        leftSide = a === 1 ? 'x' : `${a}x`;
    } else if (a < 0) {
        leftSide = a === -1 ? '-x' : `-${Math.abs(a)}x`;
    }
    
    if (b !== 0) {
        if (b > 0) {
            leftSide += ` + ${b}`;
        } else {
            leftSide += ` - ${Math.abs(b)}`;
        }
    }
    
    let rightSide = '';
    if (m !== 0) {
        if (m > 0) {
            rightSide = m === 1 ? 'x' : `${m}x`;
        } else {
            rightSide = m === -1 ? '-x' : `-${Math.abs(m)}x`;
        }
    }
    
    if (n !== 0) {
        if (rightSide === '') {
            rightSide = n.toString();
        } else {
            if (n > 0) {
                rightSide += ` + ${n}`;
            } else {
                rightSide += ` - ${Math.abs(n)}`;
            }
        }
    }
    
    if (rightSide === '') {
        rightSide = '0';
    }
    
    return `${leftSide} = ${rightSide}`;
}

    private generateLinearMultiEquation(): string {
        const a1 = this.getRandomInt(1, 10);
        const b1 = this.getRandomInt(-10, 10);
        const a2 = this.getRandomInt(1, 10);
        const b2 = this.getRandomInt(-10, 10);
        return `${a1}x + ${b1}y = ${b2}`;
    }

    private generateLinearSystem2(): string {
    const a1 = this.getRandomInt(-10, 10);
    const b1 = this.getRandomInt(-10, 10);
    const c1 = this.getRandomInt(-20, 20);
    const a2 = this.getRandomInt(-10, 10);
    const b2 = this.getRandomInt(-10, 10);
    const c2 = this.getRandomInt(-20, 20);
    
    const formatLinearEquation = (a: number, b: number, c: number): string => {
        const terms: string[] = [];
        
        // 处理x项
        if (a !== 0) {
            const sign = a > 0 ? '' : '−';
            const coeff = Math.abs(a) === 1 ? '' : Math.abs(a).toString();
            terms.push(`${sign}${coeff}x`);
        }
        
        // 处理y项
        if (b !== 0) {
            if (terms.length === 0) {
                // 第一项
                const sign = b > 0 ? '' : '−';
                const coeff = Math.abs(b) === 1 ? '' : Math.abs(b).toString();
                terms.push(`${sign}${coeff}y`);
            } else {
                // 非第一项
                const sign = b > 0 ? ' + ' : ' − ';
                const coeff = Math.abs(b) === 1 ? '' : Math.abs(b).toString();
                terms.push(`${sign}${coeff}y`);
            }
        }
        
        // 处理常数项
        if (c !== 0) {
            if (terms.length === 0) {
                terms.push(c.toString());
            } else {
                const sign = c > 0 ? ' + ' : ' − ';
                terms.push(`${sign}${Math.abs(c)}`);
            }
        }
        
        // 如果没有项，返回0
        if (terms.length === 0) {
            return '0';
        }
        
        return terms.join('');
    };
    
    const equation1 = formatLinearEquation(a1, b1, c1);
    const equation2 = formatLinearEquation(a2, b2, c2);
    
    return `
    ${equation1} = 0
    ${equation2} = 0
`;
}

private generateLinearSystem3(): string {
    const coeffs = [
        [5, -4, 1, -2],
        [1, 3, 5, -1],
        [-5, 2, -2, 11]
    ];
    
    const formatEquation = (a: number, b: number, c: number, d: number): string => {
        const terms: string[] = [];
        const variables = ['x', 'y', 'z'];
        const coefficients = [a, b, c];
        
        for (let i = 0; i < 3; i++) {
            if (coefficients[i] !== 0) {
                if (terms.length === 0) {
                    // 第一项
                    const sign = coefficients[i] > 0 ? '' : '-';
                    const coeff = Math.abs(coefficients[i]) === 1 ? '' : Math.abs(coefficients[i]).toString();
                    terms.push(`${sign}${coeff}${variables[i]}`);
                } else {
                    // 非第一项
                    const sign = coefficients[i] > 0 ? '+' : '-';
                    const coeff = Math.abs(coefficients[i]) === 1 ? '' : Math.abs(coefficients[i]).toString();
                    terms.push(`${sign}${coeff}${variables[i]}`);
                }
            }
        }
        
        // 处理常数项
        if (d !== 0) {
            const sign = d > 0 ? '+' : '-';
            terms.push(`${sign}${Math.abs(d)}`);
        }
        
        return terms.join('');
    };
    
    const equations = coeffs.map(coeff => 
        `${formatEquation(coeff[0], coeff[1], coeff[2], coeff[3])} = 0`
    );
    
    return `
    ${equations[0]} 
    ${equations[1]}
    ${equations[2]}
`;
}

    private generateQuadraticEquation(): string {
        const a = this.getRandomInt(1, 10);
        const b = this.getRandomInt(-10, 10);
        const c = this.getRandomInt(-10, 10);
        
        const formatTerm = (coeff: number, variable: string = '', isFirst: boolean = false): string => {
            if (coeff === 0) return '';
            
            const absCoeff = Math.abs(coeff);
            let sign = '';
            if (!isFirst) {
                sign = coeff > 0 ? ' + ' : ' - ';
            } else if (coeff < 0) {
                sign = '-';
            }
            
            const coeffStr = absCoeff === 1 && variable ? '' : absCoeff;
            return `${sign}${coeffStr}${variable}`;
        };
        
        const aTerm = formatTerm(a, 'x²', true);
        const bTerm = formatTerm(b, 'x');
        const cTerm = formatTerm(c);
        
        return `${aTerm}${bTerm}${cTerm} = 0`;
    }

    private generateFactoringEquation(): string {
        // 生成两个整数根
        const root1 = this.getRandomInt(-5, 5);
        const root2 = this.getRandomInt(-5, 5);
        
        // 避免根为0或相同的根
        if (root1 === 0 || root2 === 0 || root1 === root2) {
            return this.generateFactoringEquation();
        }
        
        // 生成一元二次方程的标准形式 ax^2 + bx + c = 0
        // 从因式分解形式 (x - r1)(x - r2) = 0
        const a = 1; // 可以随机化a的值
        const b = -(root1 + root2);
        const c = root1 * root2;
        
        // 生成方程
        return this.formatQuadraticEquation(a, b, c);
    }
    private formatQuadraticEquation(a: number, b: number, c: number): string {
        const terms: string[] = [];
        
        // 处理x^2项
        if (a !== 0) {
            if (a > 0) {
                terms.push(a === 1 ? 'x²' : `${a}x²`);
            } else {
                terms.push(a === -1 ? '-x²' : `-${Math.abs(a)}x²`);
            }
        }
        
        // 处理x项
        if (b !== 0) {
            if (b > 0) {
                if (terms.length === 0) {
                    terms.push(b === 1 ? 'x' : `${b}x`);
                } else {
                    terms.push(b === 1 ? '+ x' : `+ ${b}x`);
                }
            } else {
                terms.push(b === -1 ? '- x' : `- ${Math.abs(b)}x`);
            }
        }
        
        // 处理常数项
        if (c !== 0) {
            if (c > 0) {
                if (terms.length === 0) {
                    terms.push(c.toString());
                } else {
                    terms.push(`+ ${c}`);
                }
            } else {
                terms.push(`- ${Math.abs(c)}`);
            }
        }
        
        // 如果没有项，则为0
        if (terms.length === 0) {
            return '0 = 0';
        }
        
        return `${terms.join(' ')} = 0`;
    }
    

    private generateMultiplicationEquation(): string {
        const a = this.getRandomInt(1, 10);
        const b = this.getRandomInt(1, 10);
        return `${a} * ${b} = ?`;
    }

    private getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}