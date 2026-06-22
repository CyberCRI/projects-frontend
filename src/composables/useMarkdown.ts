import { Remarkable } from 'remarkable'
import TurndownService from 'turndown'

export default function useMarkdown() {
  const md = new Remarkable()
  function md2html(s: string): string {
    try {
      return md.render(s)
    } catch {
      return s
    }
  }

  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    preformattedCode: true,
  })
  function html2md(s: string): string {
    return turndownService.turndown(s)
  }
  return {
    html2md,
    md2html,
  }
}
