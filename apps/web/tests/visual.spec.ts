import { expect, test } from '@playwright/test'
import fs from 'node:fs/promises'
import path from 'node:path'

const shotDir = path.resolve('artifacts/design-audit/screenshots')

async function ensureShotDir() {
  await fs.mkdir(shotDir, { recursive: true })
}

async function noHorizontalOverflow(page: import('@playwright/test').Page) {
  const widths = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))
  expect(widths.scrollWidth).toBeLessThanOrEqual(widths.clientWidth + 1)
}

async function expectSectionBelowStickyHeader(page: import('@playwright/test').Page, selector: string) {
  await page.waitForTimeout(650)
  const top = await page.locator(selector).evaluate((el) => el.getBoundingClientRect().top)
  expect(top).toBeGreaterThanOrEqual(70)
}

test.beforeEach(async ({ page }) => {
  await ensureShotDir()
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /Brand systems/i })).toBeVisible()
})

test('desktop proof, navigation, planner, cloud boundary, route preview and console', async ({ page }) => {
  const runtimeErrors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text())
  })
  page.on('pageerror', (error) => runtimeErrors.push(error.message))

  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')
  await noHorizontalOverflow(page)

  await page.screenshot({ path: path.join(shotDir, 'desktop-1440-full.png'), fullPage: true })
  await page.locator('#top').screenshot({ path: path.join(shotDir, 'desktop-1440-hero.png') })
  await page.locator('.site-header').screenshot({ path: path.join(shotDir, 'desktop-1440-nav.png') })
  await page.locator('footer').screenshot({ path: path.join(shotDir, 'desktop-1440-footer.png') })

  await expect(page.getByText('Not subscription lock-in.')).toBeVisible()
  await expect(page.getByText(/nothing left to take away/i)).toBeVisible()

  const cloudBoundary = page.getByLabel('Cloud operating layer status')
  await expect(cloudBoundary).toContainText('Not configured')
  await expect(cloudBoundary).toContainText('publishable key')
  await cloudBoundary.screenshot({ path: path.join(shotDir, 'desktop-cloud-offline.png') })

  await page.goto('/')
  await page.getByRole('link', { name: 'Create a brand' }).first().click()
  await expect(page.locator('#studio')).toBeInViewport()
  await expectSectionBelowStickyHeader(page, '#studio')
  await expect(page.getByRole('heading', { name: 'Ask for the outcome.' })).toBeVisible()
  await page.screenshot({ path: path.join(shotDir, 'desktop-1440-primary-action.png') })

  await page.getByRole('button', { name: 'Social campaign' }).click()
  await expect(page.locator('#outcome')).toHaveValue(/Instagram campaign system/)
  await page.getByRole('button', { name: /Show the route/i }).click()
  await expect(page.getByText('Adapt the social system')).toBeVisible()
  await expect(page.getByText('Build search architecture')).toBeVisible()
  await expect(page.getByText('Preview · no publish')).toBeVisible()
  await page.locator('.route-preview').screenshot({ path: path.join(shotDir, 'route-preview.png') })

  const proof = page.getByRole('link', { name: /Open brand book/i })
  await expect(proof).toHaveAttribute('href', '/demo-brand-book.html')
  const response = await page.request.get('/demo-brand-book.html')
  expect(response.ok()).toBeTruthy()
  expect(runtimeErrors).toEqual([])
})

test('SEO metadata and structured data stay specific and claim-safe', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/PARÉ — Sovereign Brand Software/)
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /sovereign in-house brand software/i)
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Brand systems, reduced to what matters/i)
  const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() || '{}')
  expect(schema['@type']).toBe('SoftwareApplication')
  expect(schema.name).toBe('PARÉ')
  expect(schema).not.toHaveProperty('aggregateRating')
  expect(schema).not.toHaveProperty('offers')
})

test('tablet layout', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 })
  await page.goto('/')
  await noHorizontalOverflow(page)
  await page.screenshot({ path: path.join(shotDir, 'tablet-768-full.png'), fullPage: true })
  await expect(page.getByRole('link', { name: 'Create a brand' }).first()).toBeVisible()
  await expect(page.getByLabel('Cloud operating layer status')).toBeVisible()
})

test('mobile layout, cloud boundary, anchor offset and keyboard focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await noHorizontalOverflow(page)
  await page.screenshot({ path: path.join(shotDir, 'mobile-390-full.png'), fullPage: true })
  await page.locator('.site-header').screenshot({ path: path.join(shotDir, 'mobile-390-nav.png') })
  await expect(page.getByLabel('Cloud operating layer status')).toContainText('Not configured')

  await page.goto('/')
  await page.getByRole('link', { name: 'Create a brand' }).first().click()
  await expectSectionBelowStickyHeader(page, '#studio')
  await expect(page.getByRole('heading', { name: 'Ask for the outcome.' })).toBeVisible()
  await page.screenshot({ path: path.join(shotDir, 'mobile-390-primary-action.png') })

  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.locator('.skip-link')).toBeFocused()
  const focusOutline = await page.locator('.skip-link').evaluate((el) => getComputedStyle(el).outlineStyle)
  expect(focusOutline).not.toBe('none')
})

test('reduced motion disables smooth scrolling', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const behavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)
  expect(behavior).toBe('auto')
})

test('cloud client is RPC-only for Brand Studio data', async () => {
  const serviceSource = await fs.readFile(path.resolve('src/lib/cloud/service.ts'), 'utf8')
  expect(serviceSource).not.toMatch(/\.from\(['"]brand_studio/i)
  expect(serviceSource).toContain("rpc('brand_studio_list_organizations')")
  expect(serviceSource).toContain("rpc('brand_studio_create_organization'")
  expect(serviceSource).toContain("rpc('brand_studio_create_project'")
  expect(serviceSource).toContain("rpc('brand_studio_create_work_order'")
})
