# 方程求解器应用程序

这是一个用于自动求解方程和生成练习题的手机应用程序。该应用程序支持多种类型的方程，包括一元一次方程、多元一次方程、一元二次方程、因式分解和乘法。

## 项目结构

```
equation-solver-app
├── src
│   ├── main.ts               # 应用程序的入口点
│   ├── components
│   │   ├── EquationSolver.ts  # 方程求解类
│   │   ├── EquationGenerator.ts # 方程生成类
│   │   └── EquationTypes.ts    # 方程类型定义
│   ├── utils
│   │   └── MathUtils.ts       # 数学实用函数
│   └── styles
│       └── app.css            # 应用程序样式
├── public
│   ├── index.html             # 主 HTML 文件
│   └── favicon.ico            # 应用程序图标
├── package.json                # npm 配置文件
├── tsconfig.json              # TypeScript 配置文件
└── README.md                  # 项目文档和使用说明
```

## 功能

- **自动求解方程**：用户可以输入方程，应用程序将自动求解并返回结果。
- **生成练习题**：用户可以选择方程类型，应用程序将生成相应的方程组作为练习题。

## 使用说明

1. 克隆该项目到本地：
   ```
   git clone <项目地址>
   ```

2. 安装依赖：
   ```
   npm install
   ```

3. 启动应用程序：
   ```
   npm start
   ```

4. 打开浏览器访问 `http://localhost:3000` 查看应用程序。

## 贡献

欢迎任何形式的贡献！请提交问题或拉取请求。

## 许可证

该项目使用 MIT 许可证。