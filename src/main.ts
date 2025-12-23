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
    }
    
    private solveCurrentEquation(): void {
        const equation = this.equationInput.value.trim();
        
        if (!equation) {
            this.showMessage('请输入方程', 'error');
            return;
        }
        
        try {
            const result = this.solver.solveEquation(equation);
            this.showMessage(`<strong>解:</strong> ${result}`, 'success');
        } catch (error: any) {
            this.showMessage(`<strong>错误:</strong> ${error.message}`, 'error');
        }
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