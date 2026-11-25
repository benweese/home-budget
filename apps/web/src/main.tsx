import "@home-budget/ui-tokens/tokens.css";
import "@home-budget/ui-tokens/base.css";
import "./app.css";
import "./components/components.css";
import { render } from "preact";
import { App } from "./App.tsx";

const root = document.getElementById("app");
if (root) render(<App />, root);
