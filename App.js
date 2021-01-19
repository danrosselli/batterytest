import { html, render } from 'https://unpkg.com/htm/preact/standalone.module.js'

// New import:
import { Header } from './Header.js';
import { Graph } from './Graph.js';

function App() {
  // Fragments doesn't exist anymore :)
  return html`
    <${Header} title="Battery Charge-Discharge"></${Header}>
    <${Graph} />
  `
}

render(html`<${App} />`, document.getElementById('app'));
