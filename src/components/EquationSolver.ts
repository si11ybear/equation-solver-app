export class EquationSolver {
    private variables: string[] = ['x', 'y', 'z', 'a', 'b', 'c'];
    
    // 主求解函数
    public solveEquation(equation: string): string {
        try {
            // 清理方程字符串
            const cleanedEquation = this.cleanEquation(equation);
            
            // 识别方程类型
            const equationType = this.identifyEquationType(cleanedEquation);
            
            // 根据类型求解
            switch (equationType) {
                case 'linearOne':
                    return this.solveLinearOneEquation(cleanedEquation);
                case 'linearTwo':
                    return this.solveLinearTwoEquation(cleanedEquation);
                case 'linearThree':
                    return this.solveLinearThreeEquation(cleanedEquation);
                case 'quadratic':
                    return this.solveQuadraticEquation(cleanedEquation);
                case 'factoring':
                    return this.solveFactoringEquation(cleanedEquation);
                default:
                    return '无法识别方程类型';
            }
        } catch (error) {
            return `求解错误: ${error.message}`;
        }
    }
    
    // 清理方程字符串
    private cleanEquation(equation: string): string {
        return equation
            .replace(/\s+/g, '')  // 移除所有空格
            .replace(/×/g, '*')   // 替换乘号
            .replace(/÷/g, '/')   // 替换除号
            .toLowerCase();        // 转为小写
    }
    
    // 识别方程类型
    private identifyEquationType(equation: string): string {
        // 检查是否有等号
        if (!equation.includes('=')) {
            throw new Error('方程必须包含等号');
        }
        
        // 分离左右两边
        const [left, right] = equation.split('=');
        
        // 提取所有变量
        const variables = this.extractVariables(equation);
        const uniqueVars = [...new Set(variables)];
        
        // 检查是否是因式分解形式
        if (equation.includes('(') && equation.includes(')')) {
            const factorPattern = /\([^)]+\)\([^)]+\)=0/;
            if (factorPattern.test(equation)) {
                return 'factoring';
            }
        }
        
        // 根据变量数量判断类型
        if (uniqueVars.length === 1) {
            // 检查是否是一元二次
            const varName = uniqueVars[0];
            const quadraticPattern = new RegExp(`${varName}\\s*\\^\\s*2|${varName}\\s*²|${varName}\\s*\\*\\s*${varName}`);
            if (quadraticPattern.test(equation)) {
                return 'quadratic';
            }
            return 'linearOne';
        } else if (uniqueVars.length === 2) {
            return 'linearTwo';
        } else if (uniqueVars.length === 3) {
            return 'linearThree';
        }
        
        throw new Error('无法识别的方程类型');
    }
    
    // 提取方程中的变量
    private extractVariables(equation: string): string[] {
        const variables: string[] = [];
        const varPattern = /[a-z]/gi;
        let match;
        
        while ((match = varPattern.exec(equation)) !== null) {
            variables.push(match[0].toLowerCase());
        }
        
        return variables;
    }
    
    // 解析一元一次方程 ax + b = 0
    private solveLinearOneEquation(equation: string): string {
        console.log('求解方程:', equation);
        const [left, right] = equation.split('=');
        const varName = this.extractVariables(equation)[0];
        console.log('变量:', varName);
        console.log('左边:', left, '右边:', right);
        
        // 标准化方程到 ax + b = 0 形式
        let a = 0, b = 0;
        
        // 解析左边
        const leftCoeff = this.parseExpression(left, varName);
        console.log('左边解析结果:', leftCoeff);
        a += leftCoeff.coefficient;
        b += leftCoeff.constant;
        
        // 解析右边
        const rightCoeff = this.parseExpression(right, varName);
        console.log('右边解析结果:', rightCoeff);
        a -= rightCoeff.coefficient;
        b -= rightCoeff.constant;
        
        console.log('最终 a:', a, 'b:', b);
        
        // 检查是否有解
        if (a === 0) {
            if (b === 0) {
                return `${varName} 为任意实数 (无穷多解)`;
            } else {
                return '无解';
            }
        }
        
        const solution = -b / a;
        console.log('解:', solution);
        console.log('解:', this.formatNumber(solution));
        return `${varName} = ${this.formatNumber(solution)}`;
    }
    
    // 解析表达式获取系数和常数
    private parseExpression(expr: string, varName: string): { coefficient: number, constant: number } {
        let coefficient = 0;
        let constant = 0;
        
        // 将表达式分解为项
        const terms = this.splitTerms(expr);
        
        for (const term of terms) {
            if (term.includes(varName)) {
                const coeff = this.parseCoefficient(term, varName);
                coefficient += coeff;
            } else {
                const constVal = this.parseConstant(term);
                constant += constVal;
            }
        }
        
        return { coefficient, constant };
    }
    
    // 解析系数
    private parseCoefficient(term: string, varName: string): number {
        // 去除空格
        term = term.trim();
        
        // 如果项不包含变量名，返回0
        if (!term.includes(varName)) {
            return 0;
        }
        
        // 移除变量名
        const coeffStr = term.replace(new RegExp(`${varName}\\s*$`), '').trim();
        
        if (coeffStr === '' || coeffStr === '+') {
            return 1;
        } else if (coeffStr === '-') {
            return -1;
        } else {
            const coeff = parseFloat(coeffStr);
            // 检查 parseFloat 的结果
            if (isNaN(coeff)) {
                console.error(`无法解析系数: "${coeffStr}" 来自项: "${term}"`);
                return 0;
            }
            return coeff;
        }
    }
    
    // 解析常数
    private parseConstant(term: string): number {
        if (term === '' || term === '+' || term === '-') {
            return 0;
        }
        return parseFloat(term) || 0;
    }
    
    // 分割表达式为项
    private splitTerms(expr: string): string[] {
        if (!expr) return [];
        
        expr = expr.trim();
        if (expr === '') return [];
        
        const terms: string[] = [];
        let currentTerm = '';
        let inParentheses = 0;
        
        // 确保表达式以符号开头
        if (expr[0] !== '+' && expr[0] !== '-') {
            expr = '+' + expr;
        }
        
        for (let i = 0; i < expr.length; i++) {
            const char = expr[i];
            
            if (char === '(') {
                inParentheses++;
                currentTerm += char;
            } else if (char === ')') {
                inParentheses--;
                currentTerm += char;
            } else if ((char === '+' || char === '-') && inParentheses === 0) {
                if (currentTerm !== '') {
                    terms.push(currentTerm);
                }
                currentTerm = char;
            } else {
                currentTerm += char;
            }
        }
        
        if (currentTerm !== '') {
            terms.push(currentTerm);
        }
        
        return terms;
    }
    
    // 求解一元二次方程
    private solveQuadraticEquation(equation: string): string {
        const [left, right] = equation.split('=');
        const varName = this.extractVariables(equation)[0];
        
        // 解析为 ax^2 + bx + c = 0 形式
        const coeffs = this.parseQuadraticExpression(left, right, varName);
        const a = coeffs.a;
        const b = coeffs.b;
        const c = coeffs.c;
        
        // 检查是否为二次方程
        if (Math.abs(a) < 1e-10) {
            return this.solveLinearOneEquation(equation);
        }
        
        // 计算判别式
        const discriminant = b * b - 4 * a * c;
        
        if (discriminant > 0) {
            // 两个不同实根
            const sqrtD = Math.sqrt(discriminant);
            const x1 = (-b + sqrtD) / (2 * a);
            const x2 = (-b - sqrtD) / (2 * a);
            
            return `${varName}₁ = ${this.formatNumber(x1)}, ${varName}₂ = ${this.formatNumber(x2)}`;
        } else if (Math.abs(discriminant) < 1e-10) {
            // 重根
            const x = -b / (2 * a);
            return `${varName}₁ = ${varName}₂ = ${this.formatNumber(x)}`;
        } else {
            // 复数根
            const realPart = -b / (2 * a);
            const imagPart = Math.sqrt(-discriminant) / (2 * a);
            
            return `${varName}₁ = ${this.formatNumber(realPart)} + ${this.formatNumber(imagPart)}i, ` +
                   `${varName}₂ = ${this.formatNumber(realPart)} - ${this.formatNumber(imagPart)}i`;
        }
    }
    
    // 解析二次表达式
    private parseQuadraticExpression(left: string, right: string, varName: string): { a: number, b: number, c: number } {
        let a = 0, b = 0, c = 0;
        
        // 解析左右两边
        const leftTerms = this.splitTerms(left);
        const rightTerms = this.splitTerms(right);
        
        // 处理左边
        for (const term of leftTerms) {
            const coeff = this.parseTermCoefficient(term, varName);
            if (term.includes(`${varName}^2`) || term.includes(`${varName}²`) || 
                term.includes(`${varName}*${varName}`) || term.includes(`${varName}*${varName}`)) {
                a += coeff;
            } else if (term.includes(varName)) {
                b += coeff;
            } else {
                c += coeff;
            }
        }
        
        // 处理右边
        for (const term of rightTerms) {
            const coeff = this.parseTermCoefficient(term, varName);
            if (term.includes(`${varName}^2`) || term.includes(`${varName}²`) || 
                term.includes(`${varName}*${varName}`) || term.includes(`${varName}*${varName}`)) {
                a -= coeff;
            } else if (term.includes(varName)) {
                b -= coeff;
            } else {
                c -= coeff;
            }
        }
        
        return { a, b, c };
    }
    
    // 解析项的系数
    private parseTermCoefficient(term: string, varName: string): number {
        if (term === varName) {
            return 1;
        } else if (term === `-${varName}`) {
            return -1;
        } else if (term.includes(varName)) {
            const withoutVar = term.replace(new RegExp(`\\s*${varName}\\s*\\^?\\s*\\d*`), '');
            if (withoutVar === '' || withoutVar === '+' || withoutVar === '-') {
                return withoutVar === '-' ? -1 : 1;
            }
            return parseFloat(withoutVar) || 0;
        } else {
            return parseFloat(term) || 0;
        }
    }
    
    // 求解二元一次方程
    private solveLinearTwoEquation(equation: string): string {
        // 二元一次方程需要两个方程组成方程组
        // 这里我们假设输入格式为: equation1, equation2
        const equations = equation.split(',').map(eq => eq.trim());
        
        if (equations.length < 2) {
            return '二元一次方程需要两个方程，请用逗号分隔';
        }
        
        const eq1 = equations[0];
        const eq2 = equations[1];
        
        const vars = [...new Set(this.extractVariables(eq1 + eq2))];
        if (vars.length !== 2) {
            return '二元一次方程需要两个不同的变量';
        }
        
        const [x, y] = vars;
        
        // 解析系数矩阵
        const coeffs1 = this.parseLinearEquation(eq1, [x, y]);
        const coeffs2 = this.parseLinearEquation(eq2, [x, y]);
        
        // 求解线性方程组
        return this.solveLinearSystem([coeffs1, coeffs2], [x, y]);
    }
    
    // 求解三元一次方程
    private solveLinearThreeEquation(equation: string): string {
        const equations = equation.split(',').map(eq => eq.trim());
        
        if (equations.length < 3) {
            return '三元一次方程需要三个方程，请用逗号分隔';
        }
        
        const eq1 = equations[0];
        const eq2 = equations[1];
        const eq3 = equations[2];
        
        const vars = [...new Set(this.extractVariables(eq1 + eq2 + eq3))];
        if (vars.length !== 3) {
            return '三元一次方程需要三个不同的变量';
        }
        
        const [x, y, z] = vars;
        
        const coeffs1 = this.parseLinearEquation(eq1, [x, y, z]);
        const coeffs2 = this.parseLinearEquation(eq2, [x, y, z]);
        const coeffs3 = this.parseLinearEquation(eq3, [x, y, z]);
        
        return this.solveLinearSystem([coeffs1, coeffs2, coeffs3], [x, y, z]);
    }
    
    // 解析线性方程
    private parseLinearEquation(equation: string, vars: string[]): { [key: string]: number } {
        const [left, right] = equation.split('=');
        const result: { [key: string]: number } = {};
        
        // 初始化所有系数为0
        vars.forEach(v => result[v] = 0);
        result['constant'] = 0;
        
        // 解析左边
        this.addCoefficientsFromExpression(left, result, vars, 1);
        
        // 解析右边
        this.addCoefficientsFromExpression(right, result, vars, -1);
        
        return result;
    }
    
    // 从表达式添加系数
    private addCoefficientsFromExpression(expr: string, coeffs: { [key: string]: number }, vars: string[], sign: number): void {
        const terms = this.splitTerms(expr);
        
        for (const term of terms) {
            let found = false;
            
            for (const v of vars) {
                if (term.includes(v)) {
                    const coeff = this.parseTermCoefficient(term, v) * sign;
                    coeffs[v] += coeff;
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                const constVal = this.parseConstant(term) * sign;
                coeffs['constant'] += constVal;
            }
        }
    }
    
    // 求解线性方程组
    private solveLinearSystem(equations: Array<{ [key: string]: number }>, vars: string[]): string {
        const n = vars.length;
        
        // 构建增广矩阵
        const matrix: number[][] = [];
        for (let i = 0; i < n; i++) {
            const row: number[] = [];
            for (let j = 0; j < n; j++) {
                row.push(equations[i][vars[j]] || 0);
            }
            row.push(-(equations[i]['constant'] || 0));
            matrix.push(row);
        }
        
        // 高斯消元法
        for (let i = 0; i < n; i++) {
            // 寻找主元
            let maxRow = i;
            for (let j = i + 1; j < n; j++) {
                if (Math.abs(matrix[j][i]) > Math.abs(matrix[maxRow][i])) {
                    maxRow = j;
                }
            }
            
            // 交换行
            [matrix[i], matrix[maxRow]] = [matrix[maxRow], matrix[i]];
            
            // 如果主元为0，则无解或有无穷多解
            if (Math.abs(matrix[i][i]) < 1e-10) {
                // 检查是否无解
                for (let j = i; j < n; j++) {
                    if (Math.abs(matrix[i][j]) > 1e-10) {
                        return '方程组无解';
                    }
                }
                if (Math.abs(matrix[i][n]) > 1e-10) {
                    return '方程组无解';
                }
                return '方程组有无穷多解';
            }
            
            // 归一化
            const pivot = matrix[i][i];
            for (let j = i; j <= n; j++) {
                matrix[i][j] /= pivot;
            }
            
            // 消元
            for (let j = 0; j < n; j++) {
                if (j !== i) {
                    const factor = matrix[j][i];
                    for (let k = i; k <= n; k++) {
                        matrix[j][k] -= factor * matrix[i][k];
                    }
                }
            }
        }
        
        // 提取解
        const solutions: string[] = [];
        for (let i = 0; i < n; i++) {
            const value = matrix[i][n];
            solutions.push(`${vars[i]} = ${this.formatNumber(value)}`);
        }
        
        return solutions.join(', ');
    }
    
    // 求解因式分解方程
    private solveFactoringEquation(equation: string): string {
        const [left, right] = equation.split('=');
        
        if (right !== '0') {
            return '因式分解方程右边必须为0';
        }
        
        // 提取括号内的表达式
        const factorPattern = /\(([^)]+)\)/g;
        const factors: string[] = [];
        let match;
        
        while ((match = factorPattern.exec(left)) !== null) {
            factors.push(match[1]);
        }
        
        if (factors.length === 0) {
            return '未找到因式分解形式';
        }
        
        const solutions: number[] = [];
        const varName = this.extractVariables(factors[0])[0] || 'x';
        
        for (const factor of factors) {
            const solution = this.solveLinearOneEquation(`${factor} = 0`);
            if (solution.includes('=')) {
                const value = parseFloat(solution.split('=')[1].trim());
                if (!isNaN(value)) {
                    solutions.push(value);
                }
            }
        }
        
        if (solutions.length === 0) {
            return '无法求解';
        }
        
        const uniqueSolutions = [...new Set(solutions)].sort((a, b) => a - b);
        const solutionStrings = uniqueSolutions.map((sol, i) => 
            `${varName}${uniqueSolutions.length > 1 ? `₁` : ''} = ${this.formatNumber(sol)}`
        );
        
        return solutionStrings.join(', ');
    }
    
    // 格式化数字
    private formatNumber(num: number): string {
        if (Math.abs(num) < 1e-10) {
            return '0';
        }
        
        // 如果是整数，显示整数形式
        if (Math.abs(Math.round(num) - num) < 1e-10) {
            return Math.round(num).toString();
        }
        
        // 尝试显示为分数
        const fraction = this.decimalToFraction(num);
        if (fraction) {
            return fraction;
        }
        
        // 保留两位小数
        return num.toFixed(2);
    }
    
    // 小数转分数
    private decimalToFraction(decimal: number): string | null {
        const tolerance = 1.0E-6;
        let h1 = 1, h2 = 0;
        let k1 = 0, k2 = 1;
        let b = decimal;
        let iteration = 0;
        const maxIterations = 20;
        
        do {
            iteration++;
            if (iteration > maxIterations || !isFinite(b)) {
                // 回退到精确小数表示
                return decimal.toFixed(6).replace(/\.?0+$/, '');
            }
            
            const a = Math.floor(b);
            let aux = h1;
            h1 = a * h1 + h2;
            h2 = aux;
            aux = k1;
            k1 = a * k1 + k2;
            k2 = aux;
            
            const remainder = b - a;
            if (Math.abs(remainder) < tolerance) {
                break;
            }
            
            b = 1 / remainder;
        } while (Math.abs(decimal - h1 / k1) > decimal * tolerance);
        
        if (k1 === 0) {
            return null;
        }
        
        // 化简分数
        const gcd = this.greatestCommonDivisor(Math.abs(h1), Math.abs(k1));
        h1 /= gcd;
        k1 /= gcd;
        
        if (k1 < 0) { // 确保分母为正
            h1 = -h1;
            k1 = -k1;
        }
        
        if (k1 === 1) {
            return h1.toString();
        } else {
            return `${h1}/${k1}`;
        }
    }
    
    // 计算最大公约数
    private greatestCommonDivisor(a: number, b: number): number {
        a = Math.abs(a);
        b = Math.abs(b);
        
        while (b !== 0) {
            const temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
    // 获取使用说明
    public getInstructions(): string {
        return `输入方程格式说明：
        
一元一次方程: ax + b = 0
    示例: 2x + 3 = 0, x - 5 = 0

一元二次方程: ax² + bx + c = 0
    示例: x^2 - 5x + 6 = 0, 2x² + 3x - 2 = 0

二元一次方程组: 用逗号分隔两个方程
    示例: 2x + 3y = 5, x - y = 1

三元一次方程组: 用逗号分隔三个方程
    示例: x + y + z = 6, 2x - y + z = 3, x + 2y - z = 4

因式分解方程: (x - a)(x - b) = 0
    示例: (x - 2)(x + 3) = 0

支持的变量: x, y, z, a, b, c
支持运算符: +, -, *, /, ^, ²
注意: 方程必须包含等号`;
    }
}