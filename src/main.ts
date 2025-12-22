// src/main.ts
import { EquationSolver } from './components/EquationSolver';
import { EquationGenerator } from './components/EquationGenerator';

const equationSolver = new EquationSolver();
const equationGenerator = new EquationGenerator();

function initApp() {
    // 初始化应用程序界面
    const appContainer = document.getElementById('app');
    if (appContainer) {
        appContainer.innerHTML = `
            <h1>方程求解器</h1>
            <div>
                <h2>输入方程</h2>
                <input type="text" id="equationInput" placeholder="输入方程" />
                <button id="solveButton">求解</button>
                <h3>结果: <span id="result"></span></h3>
            </div>
            <div>
                <h2>生成方程</h2>
                <select id="equationType">
                    <option value="LINEAR_ONE">一元一次方程</option>
                    <option value="LINEAR_MULTI">多元一次方程</option>
                    <option value="QUADRATIC">一元二次方程</option>
                    <option value="FACTORING">因式分解</option>
                    <option value="MULTIPLICATION">乘法</option>
                </select>
                <button id="generateButton">生成方程</button>
                <h3>生成的方程: <span id="generatedEquation"></span></h3>
            </div>
        `;

        document.getElementById('solveButton')?.addEventListener('click', () => {
            const equation = (document.getElementById('equationInput') as HTMLInputElement).value;
            const result = equationSolver.solveEquation(equation);
            document.getElementById('result')!.innerText = result.toString();
        });

        document.getElementById('generateButton')?.addEventListener('click', () => {
            const type = (document.getElementById('equationType') as HTMLSelectElement).value;
            const generatedEquation = equationGenerator.generateEquation(type);
            document.getElementById('generatedEquation')!.innerText = generatedEquation;
        });
    }
}

window.onload = initApp;