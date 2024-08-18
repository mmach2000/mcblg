import * as file from 'node:fs';

const T_DESIGN_THEME_CSS = 'src/style/tdesign-theme.css';

function replaceCssSelector() {
  const fileContent = file.readFileSync(T_DESIGN_THEME_CSS, 'utf8');
  const replacedContent = fileContent.replace(/:root\[theme-mode="(\w+)".+/g, ':root[theme-mode="$1"], :root[data-theme="$1"] {');
  file.writeFileSync(T_DESIGN_THEME_CSS, replacedContent, 'utf8');
}

replaceCssSelector();
