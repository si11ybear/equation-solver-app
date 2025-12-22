export class EquationGenerator {
    generateEquation(type: string): string {
        switch (type) {
            case 'LINEAR_ONE':
                return this.generateLinearOneEquation();
            case 'LINEAR_MULTI':
                return this.generateLinearMultiEquation();
            case 'QUADRATIC':
                return this.generateQuadraticEquation();
            case 'FACTORING':
                return this.generateFactoringEquation();
            case 'MULTIPLICATION':
                return this.generateMultiplicationEquation();
            default:
                throw new Error('Unsupported equation type');
        }
    }

    private generateLinearOneEquation(): string {
        const a = this.getRandomInt(1, 10);
        const b = this.getRandomInt(-10, 10);
        return `${a}x + ${b} = 0`;
    }

    private generateLinearMultiEquation(): string {
        const a1 = this.getRandomInt(1, 10);
        const b1 = this.getRandomInt(-10, 10);
        const a2 = this.getRandomInt(1, 10);
        const b2 = this.getRandomInt(-10, 10);
        return `${a1}x + ${b1}y = ${b2}`;
    }

    private generateQuadraticEquation(): string {
        const a = this.getRandomInt(1, 10);
        const b = this.getRandomInt(-10, 10);
        const c = this.getRandomInt(-10, 10);
        return `${a}x^2 + ${b}x + ${c} = 0`;
    }

    private generateFactoringEquation(): string {
        const a = this.getRandomInt(1, 10);
        const b = this.getRandomInt(1, 10);
        return `(${a}x + ${b})(${a}x - ${b}) = 0`;
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