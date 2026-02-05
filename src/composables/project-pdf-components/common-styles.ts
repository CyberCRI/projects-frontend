export const cardListStyles = /* CSS */ `
.card-list {
    --card-width: 3.4cm;
    margin-top: .6cm;
    display: grid;
    gap: 0.6cm;
    grid-template-columns: repeat(auto-fill, var(--card-width));
}

.card-list-title {
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: .4cm;
    color: #1d727c;
    font-weight: bold;
}

.card-item {
    width: var(--card-width);
    height: auto;
    padding: .2cm;
    border: 1px solid #1d727c;
    border-radius: .2cm;
    text-align: center;
    font-size: 1rem;
    display: flex;
    gap: .2cm;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    break-inside: avoid;
}
`

export const tiptapContentStyles = /* CSS */ `
.tiptap-content pre.lpi-code-block code.hljs {
  display: block;
  overflow-x: auto;
  padding: 1em;
}
.tiptap-content pre.lpi-code-block code.hljs, .tiptap-content pre.lpi-code-block code.hljs > * {
  font-family: monospace;
  font-size: calc(var(--font-base-scale, 1) * 1rem);
  tab-size: 2;
}
.tiptap-content pre.lpi-code-block.tab-4 code.hljs, .tiptap-content pre.lpi-code-block.tab-4 code.hljs > * {
  tab-size: 4;
}
.tiptap-content pre.lpi-code-block.theme-light {
  /*!
    Theme: GitHub
    Description: Light theme as seen on github.com
    Author: github.com
    Maintainer: @Hirse
    Updated: 2021-05-15

    Outdated base version: https://github.com/primer/github-syntax-light
    Current colors taken from GitHub's CSS
    */
}
.tiptap-content pre.lpi-code-block.theme-light .hljs {
  color: #24292e;
  background: #fff;
}
.tiptap-content pre.lpi-code-block.theme-light .hljs-doctag,
.tiptap-content pre.lpi-code-block.theme-light .hljs-keyword,
.tiptap-content pre.lpi-code-block.theme-light .hljs-meta .hljs-keyword,
.tiptap-content pre.lpi-code-block.theme-light .hljs-template-tag,
.tiptap-content pre.lpi-code-block.theme-light .hljs-template-variable,
.tiptap-content pre.lpi-code-block.theme-light .hljs-type,
.tiptap-content pre.lpi-code-block.theme-light .hljs-variable.language_ {
  /* prettylights-syntax-keyword */
  color: #d73a49;
}
.tiptap-content pre.lpi-code-block.theme-light .hljs-title,
.tiptap-content pre.lpi-code-block.theme-light .hljs-title.class_,
.tiptap-content pre.lpi-code-block.theme-light .hljs-title.class_.inherited__,
.tiptap-content pre.lpi-code-block.theme-light .hljs-title.function_ {
  /* prettylights-syntax-entity */
  color: #6f42c1;
}
.tiptap-content pre.lpi-code-block.theme-light .hljs-attr,
.tiptap-content pre.lpi-code-block.theme-light .hljs-attribute,
.tiptap-content pre.lpi-code-block.theme-light .hljs-literal,
.tiptap-content pre.lpi-code-block.theme-light .hljs-meta,
.tiptap-content pre.lpi-code-block.theme-light .hljs-number,
.tiptap-content pre.lpi-code-block.theme-light .hljs-operator,
.tiptap-content pre.lpi-code-block.theme-light .hljs-variable,
.tiptap-content pre.lpi-code-block.theme-light .hljs-selector-attr,
.tiptap-content pre.lpi-code-block.theme-light .hljs-selector-class,
.tiptap-content pre.lpi-code-block.theme-light .hljs-selector-id {
  /* prettylights-syntax-constant */
  color: #005cc5;
}
.tiptap-content pre.lpi-code-block.theme-light .hljs-regexp,
.tiptap-content pre.lpi-code-block.theme-light .hljs-string,
.tiptap-content pre.lpi-code-block.theme-light .hljs-meta .hljs-string {
  /* prettylights-syntax-string */
  color: #032f62;
}
.tiptap-content pre.lpi-code-block.theme-light .hljs-built_in,
.tiptap-content pre.lpi-code-block.theme-light .hljs-symbol {
  /* prettylights-syntax-variable */
  color: #e36209;
}
.tiptap-content pre.lpi-code-block.theme-light .hljs-comment,
.tiptap-content pre.lpi-code-block.theme-light .hljs-code,
.tiptap-content pre.lpi-code-block.theme-light .hljs-formula {
  /* prettylights-syntax-comment */
  color: #6a737d;
}
.tiptap-content pre.lpi-code-block.theme-light .hljs-name,
.tiptap-content pre.lpi-code-block.theme-light .hljs-quote,
.tiptap-content pre.lpi-code-block.theme-light .hljs-selector-tag,
.tiptap-content pre.lpi-code-block.theme-light .hljs-selector-pseudo {
  /* prettylights-syntax-entity-tag */
  color: #22863a;
}
.tiptap-content pre.lpi-code-block.theme-light .hljs-subst {
  /* prettylights-syntax-storage-modifier-import */
  color: #24292e;
}
.tiptap-content pre.lpi-code-block.theme-light .hljs-section {
  /* prettylights-syntax-markup-heading */
  color: #005cc5;
  font-weight: bold;
}
.tiptap-content pre.lpi-code-block.theme-light .hljs-bullet {
  /* prettylights-syntax-markup-list */
  color: #735c0f;
}
.tiptap-content pre.lpi-code-block.theme-light .hljs-emphasis {
  /* prettylights-syntax-markup-italic */
  color: #24292e;
  font-style: italic;
}
.tiptap-content pre.lpi-code-block.theme-light .hljs-strong {
  /* prettylights-syntax-markup-bold */
  color: #24292e;
  font-weight: bold;
}
.tiptap-content pre.lpi-code-block.theme-light .hljs-addition {
  /* prettylights-syntax-markup-inserted */
  color: #22863a;
  background-color: #f0fff4;
}
.tiptap-content pre.lpi-code-block.theme-light .hljs-deletion {
  /* prettylights-syntax-markup-deleted */
  color: #b31d28;
  background-color: #ffeef0;
}
.tiptap-content pre.lpi-code-block.theme-light {
  /*
    .hljs-char.escape_,
    .hljs-link,
    .hljs-params,
    .hljs-property,
    .hljs-punctuation,
    .hljs-tag {
        purposely ignored

    } */
}
.tiptap-content pre.lpi-code-block.theme-dark {
  /*!
        Theme: GitHub Dark
        Description: Dark theme as seen on github.com
        Author: github.com
        Maintainer: @Hirse
        Updated: 2021-05-15

        Outdated base version: https://github.com/primer/github-syntax-dark
        Current colors taken from GitHub's CSS
    */
}
.tiptap-content pre.lpi-code-block.theme-dark .hljs {
  color: #c9d1d9;
  background: #0d1117;
}
.tiptap-content pre.lpi-code-block.theme-dark .hljs-doctag,
.tiptap-content pre.lpi-code-block.theme-dark .hljs-keyword,
.tiptap-content pre.lpi-code-block.theme-dark .hljs-meta .hljs-keyword,
.tiptap-content pre.lpi-code-block.theme-dark .hljs-template-tag,
.tiptap-content pre.lpi-code-block.theme-dark .hljs-template-variable,
.tiptap-content pre.lpi-code-block.theme-dark .hljs-type,
.tiptap-content pre.lpi-code-block.theme-dark .hljs-variable.language_ {
  /* prettylights-syntax-keyword */
  color: #ff7b72;
}
.tiptap-content pre.lpi-code-block.theme-dark .hljs-title,
.tiptap-content pre.lpi-code-block.theme-dark .hljs-title.class_,
.tiptap-content pre.lpi-code-block.theme-dark .hljs-title.class_.inherited__,
.tiptap-content pre.lpi-code-block.theme-dark .hljs-title.function_ {
  /* prettylights-syntax-entity */
  color: #d2a8ff;
}
.tiptap-content pre.lpi-code-block.theme-dark .hljs-attr,
.tiptap-content pre.lpi-code-block.theme-dark .hljs-attribute,
.tiptap-content pre.lpi-code-block.theme-dark .hljs-literal,
.tiptap-content pre.lpi-code-block.theme-dark .hljs-meta,
.tiptap-content pre.lpi-code-block.theme-dark .hljs-number,
.tiptap-content pre.lpi-code-block.theme-dark .hljs-operator,
.tiptap-content pre.lpi-code-block.theme-dark .hljs-variable,
.tiptap-content pre.lpi-code-block.theme-dark .hljs-selector-attr,
.tiptap-content pre.lpi-code-block.theme-dark .hljs-selector-class,
.tiptap-content pre.lpi-code-block.theme-dark .hljs-selector-id {
  /* prettylights-syntax-constant */
  color: #79c0ff;
}
.tiptap-content pre.lpi-code-block.theme-dark .hljs-regexp,
.tiptap-content pre.lpi-code-block.theme-dark .hljs-string,
.tiptap-content pre.lpi-code-block.theme-dark .hljs-meta .hljs-string {
  /* prettylights-syntax-string */
  color: #a5d6ff;
}
.tiptap-content pre.lpi-code-block.theme-dark .hljs-built_in,
.tiptap-content pre.lpi-code-block.theme-dark .hljs-symbol {
  /* prettylights-syntax-variable */
  color: #ffa657;
}
.tiptap-content pre.lpi-code-block.theme-dark .hljs-comment,
.tiptap-content pre.lpi-code-block.theme-dark .hljs-code,
.tiptap-content pre.lpi-code-block.theme-dark .hljs-formula {
  /* prettylights-syntax-comment */
  color: #8b949e;
}
.tiptap-content pre.lpi-code-block.theme-dark .hljs-name,
.tiptap-content pre.lpi-code-block.theme-dark .hljs-quote,
.tiptap-content pre.lpi-code-block.theme-dark .hljs-selector-tag,
.tiptap-content pre.lpi-code-block.theme-dark .hljs-selector-pseudo {
  /* prettylights-syntax-entity-tag */
  color: #7ee787;
}
.tiptap-content pre.lpi-code-block.theme-dark .hljs-subst {
  /* prettylights-syntax-storage-modifier-import */
  color: #c9d1d9;
}
.tiptap-content pre.lpi-code-block.theme-dark .hljs-section {
  /* prettylights-syntax-markup-heading */
  color: #1f6feb;
  font-weight: bold;
}
.tiptap-content pre.lpi-code-block.theme-dark .hljs-bullet {
  /* prettylights-syntax-markup-list */
  color: #f2cc60;
}
.tiptap-content pre.lpi-code-block.theme-dark .hljs-emphasis {
  /* prettylights-syntax-markup-italic */
  color: #c9d1d9;
  font-style: italic;
}
.tiptap-content pre.lpi-code-block.theme-dark .hljs-strong {
  /* prettylights-syntax-markup-bold */
  color: #c9d1d9;
  font-weight: bold;
}
.tiptap-content pre.lpi-code-block.theme-dark .hljs-addition {
  /* prettylights-syntax-markup-inserted */
  color: #aff5b4;
  background-color: #033a16;
}
.tiptap-content pre.lpi-code-block.theme-dark .hljs-deletion {
  /* prettylights-syntax-markup-deleted */
  color: #ffdcd7;
  background-color: #67060c;
}
.tiptap-content pre.lpi-code-block.theme-dark .hljs-char.escape_,
.tiptap-content pre.lpi-code-block.theme-dark .hljs-link,
.tiptap-content pre.lpi-code-block.theme-dark .hljs-params,
.tiptap-content pre.lpi-code-block.theme-dark .hljs-property,
.tiptap-content pre.lpi-code-block.theme-dark .hljs-punctuation,
.tiptap-content pre.lpi-code-block.theme-dark .hljs-tag {
  /* purposely ignored */
}
.tiptap-content .tiptap-table-wrapper {
  max-width: 100%;
  overflow-x: auto;
  position: relative;
  word-break: break-word;
}
.tiptap-content .tiptap-table-wrapper table.auto-width {
  width: auto;
}
.tiptap-content table {
  border-collapse: collapse;
  table-layout: fixed;
  overflow: hidden;
  margin: 0 auto;
  padding: 0;
  border: 0;
  font: inherit;
  font-size: 100%;
  vertical-align: baseline;
  width: fit-content;
}
.tiptap-content table th {
  background-color: #f1f1f1;
  padding: 0.5rem 0.75rem;
  color: #101010;
  font-weight: bold;
}
.tiptap-content table td,
.tiptap-content table th {
  border: 1px solid #d4d4d4 !important;
  min-width: 1em;
  padding: 3px 5px;
  vertical-align: top;
  box-sizing: border-box;
  position: relative;
  hyphens: auto;
}
.tiptap-content table td {
  border: 1px solid #d4d4d4;
  padding: 0.75rem 1rem;
}
.tiptap-content table > * {
  margin-bottom: 0;
}
.tiptap-content table .selectedCell::after {
  z-index: 2;
  position: absolute;
  content: "";
  inset: 0;
  background: rgba(200, 200, 255, 0.4);
  pointer-events: none;
}
.tiptap-content table .column-resize-handle {
  position: absolute;
  right: -2px;
  top: 0;
  bottom: -2px;
  width: 4px;
  background-color: #adf;
  pointer-events: none;
}
.tiptap-content .tableWrapper {
  padding: 1rem 0;
  overflow-x: auto;
}
.tiptap-content .resize-cursor {
  cursor: ew-resize;
  cursor: col-resize;
}
.tiptap-content a {
  color: #1d727c !important;
  cursor: pointer;
  text-decoration: none;
  overflow-wrap: break-word;
}
.tiptap-content a:hover {
  text-decoration: underline;
}
.tiptap-content h1 {
  font-size: calc(var(--font-base-scale, 1) * 2.1875rem);
  font-weight: 700;
  margin-bottom: 1.5rem;
  margin-top: 0.75rem;
  line-height: 1.2;
}
.tiptap-content h2 {
  font-size: calc(var(--font-base-scale, 1) * 1.5rem);
  font-weight: 700;
  margin-bottom: 0.75rem;
  line-height: 1.2;
}
.tiptap-content h3 {
  font-size: calc(var(--font-base-scale, 1) * 1.375rem);
  font-weight: 700;
  letter-spacing: 0;
  margin-bottom: 0.75rem;
  line-height: 1.2;
}
.tiptap-content h4 {
  font-size: calc(var(--font-base-scale, 1) * 1.25rem);
  font-weight: 700;
  line-height: 1.2;
}
.tiptap-content p {
  margin-bottom: 0.5rem;
}
.tiptap-content u {
  text-decoration: underline;
}
.tiptap-content strong {
  font-weight: 700;
}
.tiptap-content blockquote {
  margin: 20px 0;
  font-style: italic;
  border-left: 4px solid #1d727c;
  padding-left: 20px;
  color: #101010;
}
.tiptap-content img {
  border-radius: 4px;
  height: auto;
  max-width: 100%;
}
.tiptap-content em {
  font-style: italic;
}
.tiptap-content ul {
  list-style-type: disc;
}
.tiptap-content ol {
  list-style-type: numeric;
}
.tiptap-content ul li,
.tiptap-content ol li {
  margin-left: 35px;
  margin-bottom: 15px;
  margin-top: 15px;
}
.tiptap-content .custom-image-small {
  width: 25%;
}
.tiptap-content .custom-image-medium {
  width: 50%;
}
.tiptap-content .custom-image-large {
  width: 75%;
}
.tiptap-content .custom-image-full {
  width: 100%;
}
.tiptap-content .custom-image-original {
  width: auto;
  max-width: 100%;
}
.tiptap-content > * {
  margin-bottom: 0.75rem;
}

.custom-video-wrapper {
  margin: 0 auto;
  height: 0;
  padding-bottom: 56.25%;
  position: relative;
}
.custom-video-wrapper.custom-video-wrapper-left {
  margin-left: 0;
}
.custom-video-wrapper.custom-video-wrapper-right {
  margin-right: 0;
}

table .custom-video-ctn {
  min-width: 16rem;
}

.editor .custom-video-wrapper::after {
  content: "";
  position: absolute;
  z-index: 100;
  inset: 0;
}

.ProseMirror-focused .ProseMirror-selectednode .custom-video-wrapper::after {
  color: white;
  font-size: calc(var(--font-base-scale, 1) * 1rem);
  text-align: center;
  padding: 15%;
  background-color: rgba(0, 0, 0, 0.5);
  pointer-events: none;
}

.custom-video {
  position: absolute;
  z-index: 1;
  inset: 0;
  background: black url("data:image/gif;base64,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") center center no-repeat;
}

.custom-video-wrapper-small .custom-video,
.custom-video-wrapper-medium .custom-video,
.custom-video-wrapper-large .custom-video,
.custom-video-wrapper-full .custom-video {
  width: 100% !important;
  height: 100% !important;
}

.custom-video-wrapper-small {
  width: 25%;
  padding-bottom: 14.0625%;
}

.custom-video-wrapper-medium {
  width: 50%;
  padding-bottom: 28.125%;
}

.custom-video-wrapper-large {
  width: 75%;
  padding-bottom: 42.1875%;
}

.custom-video-wrapper-full {
  width: 100%;
  padding-bottom: 56.25%;
}

.custom-video-wrapper.custom-video-wrapper-custom {
  position: relative;
  display: inline-block;
  width: auto;
  padding-bottom: 0;
}
.custom-video-wrapper.custom-video-wrapper-custom .custom-video {
  position: static;
}

.ProseMirror {
  /* Makes the editor clickable on all allocated space */
  min-height: 100px;
}
.ProseMirror:focus-within, .ProseMirror:focus-visible {
  outline: none;
}

.content--open h1 {
  font-size: calc(var(--font-base-scale, 1) * 1.5rem);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 8px;
}
.content--open h2 {
  font-size: calc(var(--font-base-scale, 1) * 1.375rem);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 8px;
}
.content--open h3 {
  font-size: calc(var(--font-base-scale, 1) * 1.25rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0;
  margin-bottom: 8px;
}
.content--open h4 {
  font-size: calc(var(--font-base-scale, 1) * 0.875rem);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 8px;
}
.content--open p {
  font-size: calc(var(--font-base-scale, 1) * 0.875rem);
  margin-bottom: 1.5rem;
}
`

export const lpiLogo = /* HTML */ `
  <img
    class="lpi-logo"
    src="data:image/png;base64,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"
  />
`
