import { html } from 'https://unpkg.com/htm/preact/standalone.module.js'

export function Header({ title, children }) {
  return html`
    <header>
      <h1>${title}</h1>
      ${children}
    </header>
  `
}
