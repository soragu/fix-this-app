import App from "./app";
import "./style.css";

// const app = document.querySelector<HTMLDivElement>('#app')!

// app.innerHTML = `
//   <h1>Hello Vite!</h1>
//   <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
// `

const root = document.getElementById("app");
if (root) {
  new App(root);
}
