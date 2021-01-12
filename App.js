import { html, render } from 'https://unpkg.com/htm/preact/standalone.module.js'

// New import:
import { Header } from './Header.js';
import { Clock } from './Clock.js';

function App() {
  // Fragments doesn't exist anymore :)
  return html`
    <${Header} title="This is my app">
      An example without Webpack and Babel
    </${Header}>
    <${Clock} />
    <div>
      Content of the page
    </div>
  `
}

render(html`<${App} />`, document.getElementById('app'));
