declare const katex: any;

import { EquationSolver } from './components/EquationSolver';
import { EquationGenerator } from './components/EquationGenerator';

class EquationApp {
    private solver: EquationSolver;
    private generator: EquationGenerator;
    private equationInput!: HTMLInputElement;
    private solveButton!: HTMLButtonElement;
    private generateButton!: HTMLButtonElement;
    private equationTypeSelect!: HTMLSelectElement;
    private solutionDiv!: HTMLElement;
    private generatedEquationDiv!: HTMLElement;
    private katexLoaded: boolean = false;
    private equationDisplay!: HTMLElement; // 新增：用于显示渲染后的方程
            // 添加示例方程数据
    private examples: Array<{ equation: string; description?: string }> = [
        { equation: "2x + 3 = 0", description:"一元一次方程" },
        { equation: "x^2 - 5x + 6 = 0", description: "一元二次方程"},
        { equation: "2x + 3y = 5, x - y = 1", description: "二元一次方程组" },
        { equation: "x + y + z = 6, 2x - y + z = 3, x + 2y - z = 4", description: "三元一次方程组" }
    ];


    constructor() {
        this.solver = new EquationSolver();
        this.generator = new EquationGenerator();
        console.log('EquationApp 初始化...');
        this.initializeElements();
        this.setupEventListeners();
        console.log('EquationApp 初始化完成');
    }
    
    private initializeElements(): void {
        this.equationInput = document.getElementById('equationInput') as HTMLInputElement;
        this.solveButton = document.getElementById('solveButton') as HTMLButtonElement;
        this.generateButton = document.getElementById('generateButton') as HTMLButtonElement;
        this.equationTypeSelect = document.getElementById('equationType') as HTMLSelectElement;
        this.solutionDiv = document.getElementById('solution') as HTMLElement;
        this.generatedEquationDiv = document.getElementById('generatedEquation') as HTMLElement;
        this.equationDisplay = document.getElementById('equationDisplay') as HTMLElement;
        this.loadKatex();
        this.initExampleEquations();
    }

    private loadKatex(): void {
        // 检查是否已加载
        if (typeof katex !== 'undefined') {
            this.katexLoaded = true;
            return;
        }
        
        // 动态加载 KaTeX
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
        document.head.appendChild(link);
        
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
        script.onload = () => {
            this.katexLoaded = true;
            this.renderCurrentEquation(); // 渲染当前输入框中的方程
            this.initExampleEquations();
        };
        script.onerror = () => {
            console.warn('KaTeX 加载失败，将使用纯文本显示');
        };
        document.head.appendChild(script);
    }

    // 初始化示例方程
    private initExampleEquations(): void {
        const examplesList = document.getElementById('equationExamples');
        if (!examplesList) return;
        
        // 清空现有内容
        examplesList.innerHTML = '';
        
        // 动态生成示例
        this.examples.forEach((example, index) => {
            const li = document.createElement('li');
            li.className = 'example';
            li.dataset.equation = example.equation;
            
            // 创建 KaTeX 容器
            const katexSpan = document.createElement('span');
            katexSpan.className = 'katex-example';
            katexSpan.id = `example-${index}`;
            
            // 创建描述文字
            if (example.description) {
                const desc = document.createElement('span');
                desc.className = 'example-desc';
                desc.textContent = ` (${example.description})`;
                li.appendChild(katexSpan);
                li.appendChild(desc);
            } else {
                li.appendChild(katexSpan);
            }
            
            // 添加点击事件
            li.addEventListener('click', () => {
                this.equationInput.value = example.equation;
                this.equationInput.focus();
                // 触发输入事件以渲染预览
                this.renderCurrentEquation();
            });
            
            examplesList.appendChild(li);
            
            // 渲染 KaTeX
            this.renderExampleEquation(katexSpan, example.equation);
        });
    }

    // 渲染示例方程
    private renderExampleEquation(element: HTMLElement, equation: string): void {
        if (this.katexLoaded && katex) {
            try {
                // 处理多个方程
                const equations = equation.split(',').map(eq => eq.trim());
                
                if (equations.length === 1) {
                    // 单个方程
                    const latex = this.convertToLatex(equation);
                    katex.render(latex, element, {
                        displayMode: true,
                        throwOnError: false
                    });
                } else {
                    // 多个方程 - 使用 displayMode: true 并手动换行
                    const latexArray = equations.map(eq => this.convertToLatex(eq));
                    
                    // 使用 \begin{cases} 环境实现垂直排列
                    if (equations.length === 2) {
                        const latex = `\\begin{cases}
                            ${latexArray[0]} \\\\
                            ${latexArray[1]}
                        \\end{cases}`;
                        
                        katex.render(latex, element, {
                            displayMode: true,  // 注意这里改为 true
                            throwOnError: false
                        });
                    } else if (equations.length === 3) {
                        const latex = `\\begin{cases}
                            ${latexArray[0]} \\\\
                            ${latexArray[1]} \\\\
                            ${latexArray[2]}
                        \\end{cases}`;
                        
                        katex.render(latex, element, {
                            displayMode: true,
                            throwOnError: false
                        });
                    } else {
                        // 更多方程使用 aligned 环境
                        const latex = latexArray.join(' \\\\ ');
                        katex.render(`\\begin{aligned}
                            ${latex}
                        \\end{aligned}`, element, {
                            displayMode: true,
                            throwOnError: false
                        });
                    }
                }
            } catch (error) {
                element.textContent = equation;
            }
        } else {
            element.textContent = equation;
        }
    }

    private renderEquation(element: HTMLElement, equation: string): void {
        if (this.katexLoaded && katex) {
            try {
                katex.render(equation, element, {
                    displayMode: true,
                    throwOnError: false,
                    errorColor: '#cc0000'
                });
            } catch (error) {
                // 如果渲染失败，显示纯文本
                element.textContent = equation;
            }
        } else {
            // KaTeX 未加载，显示纯文本
            element.textContent = equation;
        }
    }

    private renderCurrentEquation(): void {
        if (this.equationDisplay) {
            const equation = this.equationInput.value.trim();
            if (equation) {
                const latexEquation = this.convertToLatex(equation);
                this.renderEquation(this.equationDisplay, latexEquation);
            }
        }
    }

    private convertToLatex(equation: string): string {
        // 将普通方程转换为 LaTeX
        return equation
            .replace(/(\d+)([a-z])/g, '$1$2')      // 系数和变量
            .replace(/\^(\d+)/g, '^{$1}')         // 指数
            .replace(/\*/g, '\\cdot ')            // 乘号
            .replace(/sqrt\(([^)]+)\)/g, '\\sqrt{$1}')  // 平方根
            .replace(/(\d+)\/(\d+)/g, '\\frac{$1}{$2}') // 分数
            .replace(/pi/g, '\\pi')               // π
            .replace(/theta/g, '\\theta')         // θ
            .replace(/([a-z]+)\(/g, '\\text{$1}(') // 函数名
            .replace(/([a-z])([a-z])/g, '$1$2')  // 多个变量
            .replace(/=/g, ' = ');                 // 等号
    }


    private setupEventListeners(): void {
        this.solveButton.addEventListener('click', () => this.solveCurrentEquation());
        this.generateButton.addEventListener('click', () => this.generateEquation());
        
        this.equationInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.solveCurrentEquation();
            }
        });
        
        // 示例方程快捷键
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey) {
                switch(e.key) {
                    case 'i':
                        e.preventDefault();
                        this.equationInput.value = '2x + 3 = 0';
                        break;
                    case 'o':
                        e.preventDefault();
                        this.equationInput.value = 'x^2 - 5x + 6 = 0';
                        break;
                    case 'p':
                        e.preventDefault();
                        this.equationInput.value = '(x-2)(x+3)=0';
                        break;
                }
            }
        });

        // 添加输入框输入事件，实时渲染
        this.equationInput.addEventListener('input', () => {
            this.renderCurrentEquation();
        });
        
        // 添加生成的方程点击事件，也渲染 KaTeX
        this.generatedEquationDiv.addEventListener('click', (e) => {
            if ((e.target as HTMLElement).classList.contains('use-equation')) {
                setTimeout(() => this.renderCurrentEquation(), 100);
            }
        });
    }
    
    private solveCurrentEquation(): void {
        const equation = this.equationInput.value.trim();
        
        if (!equation) {
            this.showMessage('请输入方程', 'error');
            return;
        }
        
        try {
            const result = this.solver.solveEquation(equation);
            
            // 处理多个方程（用逗号分隔）
            const equations = equation.split(',').map(eq => eq.trim());
            
            // 生成多个方程的 LaTeX
            const latexEquations = equations.map(eq => this.convertToLatex(eq));
            
            // 构建显示 HTML
            let displayHtml = '<div class="equation-display">';
            
            // 如果有多个方程，用换行显示
            if (equations.length > 1) {
                displayHtml += '<div class="multiple-equations">';
                displayHtml += latexEquations.map((latex, index) => `
                    <div class="equation-item">
                        <div class="latex-equation" id="katex-equation-${index}"></div>
                    </div>
                `).join('');
                displayHtml += '</div>';
            } else {
                // 单个方程
                displayHtml += `<div class="latex-equation" id="katex-equation-0"></div>`;
            }
            
            displayHtml += `
                <div class="solution"><strong>解:</strong></div>
                <div class="latex-result" id="katex-result"></div>
            </div>`;
            
            this.solutionDiv.innerHTML = displayHtml;
            
            // 使用 KaTeX 渲染每个方程
            if (equations.length > 1) {
                latexEquations.forEach((latex, index) => {
                    this.renderEquation(
                        document.getElementById(`katex-equation-${index}`)!,
                        latex
                    );
                });
            } else {
                this.renderEquation(
                    document.getElementById('katex-equation-0')!,
                    latexEquations[0]
                );
            }
            
            // 渲染结果
            const latexResult = this.formatResultAsLatex(result);
            this.renderEquation(
                document.getElementById('katex-result')!,
                latexResult
            );
            
        } catch (error: any) {
            this.showMessage(`<strong>错误:</strong> ${error.message}`, 'error');
        }
    }

    private formatResultAsLatex(result: string): string {
        // 根据你的求解器返回结果格式化
        // 例如: "x = -3/2" 转为 "x = \\frac{-3}{2}"
        return result
            .replace(/([a-z])\s*=\s*(-?\d+)\/(\d+)/g, '$1 = \\frac{$2}{$3}')
            .replace(/([a-z])\s*=\s*(-?\d+)/g, '$1 = $2')
            .replace(/无解/g, '\\text{无解}')
            .replace(/任意实数/g, '\\mathbb{R}');
    }

    private generateEquation(): void {
        const type = this.equationTypeSelect.value;
        console.log('生成方程类型:', type);
        
        const equation = this.generator.generateEquation(type);
        console.log('生成的方程:', equation);
        
        this.generatedEquationDiv.innerHTML = `
            <div class="generated-equation">
                <strong>生成的方程:</strong> ${equation}
                <button class="use-equation">使用此方程</button>
            </div>
        `;
        
        const useButton = this.generatedEquationDiv.querySelector('.use-equation');
        if (useButton) {
            useButton.addEventListener('click', () => {
                console.log('使用生成的方程:', equation);
                this.equationInput.value = equation;
                this.equationInput.focus();
            });
        }
    }
    
    private showMessage(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
        console.log('显示消息:', message, '类型:', type);
        this.solutionDiv.innerHTML = `<div class="message ${type}">${message}</div>`;
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    console.log(123);
    new EquationApp();
});