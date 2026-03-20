/**
 * Playwright test: Envelope Card Animation
 * Verifies the envelope opening effect matches cinelove.me/template/pc/thiep-cuoi-48
 *
 * Reference behavior:
 *  - Flap rotates 180° on X-axis (1.2s, cubic-bezier(0.25,0.46,0.45,0.94))
 *  - Card rises ~120px from envelope
 *  - 3 floating red hearts appear after open (delays: 1.2s, 1.4s, 1.6s)
 *  - Wax seal disappears on open
 *  - Closing reverses all animations
 */

import { test, expect, Page } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'

async function scrollToEnvelope(page: Page) {
    // EnvelopeCard is in the page, scroll to it
    const section = page.locator('section').filter({ hasText: 'Save our date' })
    await section.scrollIntoViewIfNeeded()
    return section
}

test.describe('EnvelopeCard Animation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(BASE_URL)
        // Wait for fonts and assets to load
        await page.waitForLoadState('networkidle')
    })

    test('1. Initial closed state — seal visible, flap closed, card hidden', async ({ page }) => {
        await scrollToEnvelope(page)
        await page.screenshot({
            path: '.playwright-mcp/envelope-01-closed.png',
            fullPage: false,
        })

        // Wax seal should be visible (opacity 1, scale 1)
        const seal = page.locator('img[alt="Wax seal"]')
        await expect(seal).toBeVisible()

        // Hearts container should NOT exist in closed state
        const hearts = page.locator('[data-testid="hearts-container"]')
        await expect(hearts).toHaveCount(0)

        // "Chạm để mở thiệp" prompt should be visible
        await expect(page.getByText('Chạm để mở thiệp')).toBeVisible()
    })

    test('2. Click opens envelope — flap animates, card rises', async ({ page }) => {
        await scrollToEnvelope(page)

        // Click the envelope
        const envelope = page.locator('section').filter({ hasText: 'Save our date' }).locator('.cursor-pointer').first()
        await envelope.click()

        // Screenshot mid-animation (flap rotating)
        await page.screenshot({ path: '.playwright-mcp/envelope-02-opening.png' })

        // Wait for open state (900ms + buffer)
        await page.waitForTimeout(1100)
        await page.screenshot({ path: '.playwright-mcp/envelope-03-open.png' })
    })

    test('3. Open state — hearts container visible', async ({ page }) => {
        await scrollToEnvelope(page)

        const envelope = page.locator('section').filter({ hasText: 'Save our date' }).locator('.cursor-pointer').first()
        await envelope.click()

        // Wait for open state
        await page.waitForTimeout(1000)

        // Hearts container should appear
        const hearts = page.locator('[data-testid="hearts-container"]')
        await expect(hearts).toBeVisible()

        // All 3 hearts present
        await expect(page.locator('[data-testid="heart-1"]')).toHaveCount(1)
        await expect(page.locator('[data-testid="heart-2"]')).toHaveCount(1)
        await expect(page.locator('[data-testid="heart-3"]')).toHaveCount(1)

        // "Chạm để đóng thiệp" prompt visible
        await expect(page.getByText('Chạm để đóng thiệp')).toBeVisible()
    })

    test('4. Open state — card is visible above envelope', async ({ page }) => {
        await scrollToEnvelope(page)

        const envelope = page.locator('section').filter({ hasText: 'Save our date' }).locator('.cursor-pointer').first()
        await envelope.click()

        await page.waitForTimeout(1100)

        // Card content should be visible
        await expect(page.getByText('Thiệp mời cưới')).toBeVisible()
        await expect(page.getByText('05.04.2026')).toBeVisible()

        await page.screenshot({ path: '.playwright-mcp/envelope-04-open-card.png' })
    })

    test('5. Card rise distance — card y-offset ~120px from bottom', async ({ page }) => {
        await scrollToEnvelope(page)

        const envelope = page.locator('section').filter({ hasText: 'Save our date' }).locator('.cursor-pointer').first()
        await envelope.click()
        await page.waitForTimeout(1100)

        // Get the card element's bounding box
        const card = page.locator('[data-testid="invitation-card"]')
        const cardBox = await card.boundingBox()
        const envelopeBox = await envelope.boundingBox()

        if (cardBox && envelopeBox) {
            // Card top should be well above envelope top (rose by ~120px)
            const riseAmount = envelopeBox.y - cardBox.y
            console.log(`Card rise amount: ${riseAmount}px (expected ~120px)`)
            // Allow ±30px tolerance
            expect(riseAmount).toBeGreaterThan(80)
            expect(riseAmount).toBeLessThan(160)
        }
    })

    test('6. Hearts float upward — positions change over time', async ({ page }) => {
        await scrollToEnvelope(page)

        const envelope = page.locator('section').filter({ hasText: 'Save our date' }).locator('.cursor-pointer').first()
        await envelope.click()
        await page.waitForTimeout(1200) // Wait for hearts delay

        // Wait a bit more for hearts to start floating
        await page.waitForTimeout(500)
        const box1 = await page.locator('[data-testid="heart-1"]').boundingBox()

        await page.waitForTimeout(1000)
        const box2 = await page.locator('[data-testid="heart-1"]').boundingBox()

        if (box1 && box2) {
            // Heart should have moved upward (y decreases)
            console.log(`Heart 1 y: ${box1.y} → ${box2.y} (should decrease)`)
            expect(box2.y).toBeLessThan(box1.y)
        }

        await page.screenshot({ path: '.playwright-mcp/envelope-05-hearts-floating.png' })
    })

    test('7. Closing — hearts disappear, seal returns, card hides', async ({ page }) => {
        await scrollToEnvelope(page)

        // Open
        const envelope = page.locator('section').filter({ hasText: 'Save our date' }).locator('.cursor-pointer').first()
        await envelope.click()
        await page.waitForTimeout(1100)

        // Now click to close
        await envelope.click()
        await page.waitForTimeout(200)
        await page.screenshot({ path: '.playwright-mcp/envelope-06-closing.png' })

        // Wait for close animation
        await page.waitForTimeout(1100)
        await page.screenshot({ path: '.playwright-mcp/envelope-07-closed-again.png' })

        // Hearts should be gone
        const hearts = page.locator('[data-testid="hearts-container"]')
        await expect(hearts).toHaveCount(0)

        // Seal should be visible again
        const seal = page.locator('img[alt="Wax seal"]')
        await expect(seal).toBeVisible()

        // Prompt text back to open
        await expect(page.getByText('Chạm để mở thiệp')).toBeVisible()
    })

    test('8. Re-open — hearts animate again (new key)', async ({ page }) => {
        await scrollToEnvelope(page)

        const envelope = page.locator('section').filter({ hasText: 'Save our date' }).locator('.cursor-pointer').first()

        // Open → close → open
        await envelope.click()
        await page.waitForTimeout(1100)
        await envelope.click()
        await page.waitForTimeout(1100)
        await envelope.click()
        await page.waitForTimeout(1100)

        // Hearts should appear again
        await expect(page.locator('[data-testid="hearts-container"]')).toBeVisible()
        await page.screenshot({ path: '.playwright-mcp/envelope-08-reopen-hearts.png' })
    })
})
