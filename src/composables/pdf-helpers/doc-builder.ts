export class Container {
  content: string[]
  styles: Set<string>
  parent: Container | null = null

  constructor(parent: Container | null = null) {
    this.parent = parent
    this.content = []
    this.styles = new Set()
  }

  add(cb: () => void) {
    cb.call(this)
    return this
  }

  addContainer(ContainerClass: typeof Container): Container {
    const container = new ContainerClass(this)
    return container
  }

  render(): Container {
    this.forwardContentToParent()
    this.forwardStylesToParent()
    return this.parent
  }
  getContent(): string {
    return this.content.join('\n')
  }

  getStyles(): string {
    return Array.from(this.styles).join('\n')
  }

  forwardStylesToParent() {
    if (this.parent) {
      this.styles.forEach((style) => this.parent.styles.add(style))
    }
  }
  forwardContentToParent() {
    if (this.parent) {
      this.parent.content.push(this.getContent())
    }
  }
}

export class Page extends Container {
  constructor(parent: Container) {
    super(parent)
    this.styles.add(/* CSS */ `
        .chapter {
          border-bottom: 0.15cm solid #1d727c;
          padding-top: .4cm;
          padding-bottom: .8cm;
        }
        .chapter:last-of-type {
          border-bottom: none;
        }
        `)
  }

  override getContent(): string {
    return /* HTML */ `
        <section class="chapter">${super.getContent()}</section>
      </html> `
  }
}

export class Doc extends Container {
  constructor() {
    super(null)
    this.styles.add(`
      html, body {
          margin: 0;
          padding: 0;
          font-family: Ubuntu, Arial, sans-serif;
          font-size: 0.3cm;
      }`)
  }
  override getContent(): string {
    const stylesString = this.getStyles()
    const contentString = this.content.join('\n')
    return `
        <html>
          <head><meta charset="UTF-8"><style>${stylesString}</style></head>
          <body>${contentString}</body>
      </html> `
  }
}
