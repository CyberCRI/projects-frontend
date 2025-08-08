export async function ensureNavPanelIOpened(page: any): Promise<void> {
  const navPanel = await page.locator('.nav-panel-layout').first()

  const attrClass = await navPanel.getAttribute('class')

  const classArray = attrClass ? attrClass.split(' ') : []
  if (classArray.includes('no-nav')) {
    const toggleNavBtn = await navPanel.locator('.nav-panel-toggle-button-collapsed')
    await toggleNavBtn.click()
  }
}
