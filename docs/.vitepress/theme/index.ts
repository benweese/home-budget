import DefaultTheme from "vitepress/theme-without-fonts";
// After VitePress's own CSS, so the tokens' root font (Dynamic Type) wins over VitePress's html rules.
import "@home-budget/ui-tokens/tokens.css";
import "@home-budget/ui-tokens/base.css";
import "./custom.css";

export default DefaultTheme;
