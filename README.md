# 方程求解器应用程序

这是一个用于自动求解方程和生成练习题的手机应用程序。该应用程序支持多种类型的方程，包括一元一次方程、二元一次方程组、三元一次方程组、一元二次方程、和因式分解。

## 项目结构

```bash
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
├── capacitor.config.ts       # Capacitor 配置文件
├── index.html                # 主 HTML 文件
├── package.json              # npm 配置文件
├── tsconfig.json             # TypeScript 配置文件
└── README.md                 # 项目文档和使用说明
```

## 功能

- **自动求解方程**：用户可以输入方程，应用程序将自动求解并返回结果。
- **生成练习题**：用户可以选择方程类型，应用程序将生成相应的方程组作为练习题。

## 本地运行

1. 克隆该项目到本地：
   ```bash
   git clone https://github.com/si11ybear/equation-solver-app.git
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 启动应用程序：
   ```bash
   npm run build # 编译
   npm run dev # 运行
   ```

4. 打开浏览器访问npm run dev中提示的域名，查看应用程序。

## 分发到apk

1. 安装 Capacitor
   ```bash
   # 在项目根目录执行
   npm install @capacitor/core @capacitor/cli
   npx cap init
   ```
   初始化时按提示填写：
   - App name: EquationSolverApp
   - Package ID: com.equationsolver.app
   - 选择 Web 目录: dist

2. 添加 Android 平台
   ```bash
   npm install @capacitor/android
   npx cap add android
   ```

3. 配置capacitor.config.ts

   ```ts
   import type { CapacitorConfig } from '@capacitor/cli';

   const config: CapacitorConfig = {
   appId: 'solver.sillybear',
   appName: '方程求解器',
   webDir: 'dist',
   server: {
      androidScheme: 'https'
   }
   };

   export default config;
   ```

4. 构建和同步（每次更改源代码后从这里开始执行）
   ```bash
   npm run build
   npx cap copy
   npx cap sync android
   ```

5. 打开 Android Studio 构建 APK
   ```bash
   # 使用 Android Studio
   npx cap open android
   ```

   打开Android Studio窗口后，等待一段时间让 Gradle 构建完成（第一次构建时可能需要更长时间），然后按照以下步骤生成 APK：
      1. Build/Generate APP Bundles or APK/Generate APKs
      2. 生成完成后，点击 locate 查看生成的 APK 文件位置