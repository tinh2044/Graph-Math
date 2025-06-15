<h1 align="center">
  Graph Math - Interactive Function
  <br>
  <img src="images/app.png" alt="Graph Math Logo">
</h1>
<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Ant Design](https://img.shields.io/badge/Ant_Design-0170FE?style=flat&logo=ant-design&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=flat&logo=redux&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=flat&logo=jest&logoColor=white)
![MIT License](https://img.shields.io/github/license/tinh2044/Graph-Math?style=flat&logo=github)

</div>

## Project Overview

Graph Math is a lightweight yet powerful graphing calculator built with React 19 + TypeScript. It lets you visualize mathematical functions instantly with an intuitive UI and supports advanced expression parsing, history management, and beautiful plotting through Plotly.js.

**Core Features:**

- **Live Plotting** – Real-time graph updates as you type
- **Multiple Chart Types** – Line, scatter, bar, polar …
- **Expression Support** – MathLive input & KaTeX display
- **Graph Library** – Save, rename, and revisit your favourite graphs
- **Theme Switch** – Light / Dark modes
- **Responsive Design** – Works seamlessly on desktop & mobile

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/tinh2044/Graph-Math.git
cd Graph-Math
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run in Development Mode

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 4. Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```text
src/
├── components/     # Reusable UI components
├── Layout/         # Layout wrappers
├── hooks/          # Custom React hooks
├── context/        # Context providers
├── redux/          # Redux slices & store
├── utils/          # Helper utilities
├── types/          # TS types
└── App.tsx         # Entry component
```

## Testing

Graph Math uses **Jest** + **Testing Library** with `ts-jest` for TypeScript support.

```bash
# Run tests once with coverage
npm test

# Watch mode
npm test -- --watch
```

Coverage reports will appear in the `coverage/` directory.

## Contributing

Contributions are welcome! Fork the repo and open a pull request.

1. Fork the project
2. Create your feature branch: `git checkout -b feature/awesome-feature`
3. Commit your changes: `git commit -m 'Add awesome feature'`
4. Push to the branch: `git push origin feature/awesome-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

<div align="center">
  <strong>⭐  If you find this project useful, please star the repo!</strong>
</div>

## Author

* **Nguyễn Chí Tình** – [GitHub Profile](https://github.com/tinh2044)