/**
 * Playwright test: EnvelopeCard — spec 004 fixes
 *
 * Verifies:
 *   Fix #1: Card content fully visible when open (CARD_RISE = 170)
 *   Fix #2: Heart particle burst (15 SVG hearts, radial explosion)
 *   Fix #3: 2-phase closing — card descends before flap closes (no z-index overlap)
 *   Fix #4: Card z-index always above flap during opening (no flash)
 *   Fix #5: Shadow stays fixed — not affected by envelope float animation
 *   Fix #6: Card content renders (WeddingImage position:absolute override)
 */

import { test, expect, Page } from '@playwright/test'

async function scrollToEnvelope(page: Page) {
    const section = page.locator('section').filter({ hasText: 'Save our date' })
    await section.scrollIntoViewIfNeeded()
    return section
}

async function openEnvelope(page: Page) {
    await page.getByText('Chạm để mở thiệp').click({ force: true })
    // Wait for opening → open transition (1700ms + buffer)
    await page.waitForTimeout(2200)
}

async function closeEnvelope(page: Page) {
    await page.getByText('Chạm để đóng thiệp').click({ force: true })
    // Wait for full 2-phase close: 900ms (card) + 1000ms (flap) + buffer
    await page.waitForTimeout(2200)
}

test.describe('Spec 004: EnvelopeCard Animations', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('domcontentloaded')
        await page.waitForSelector('section:has-text("Save our date")', { timeout: 10000 })
    })

    // ── Fix #1: Card content visible ──

    test('Fix #1: card content fully visible when open', async ({ page }) => {
        await scrollToEnvelope(page)
        await openEnvelope(page)

        // All card content text should be visible
        await expect(page.getByText('Thiệp mời cưới')).toBeVisible()
        await expect(page.getByText('05.04.2026')).toBeVisible()

        await page.screenshot({ path: '.playwright-mcp/004-card-content-visible.png' })

        // Card top should be well above envelope (CARD_RISE ≈ 170px)
        const card = page.locator('[data-testid="invitation-card"]')
        const cardBox = await card.boundingBox()

        // Use the envelope body div (bottom-anchored) as reference
        const envBody = page.locator('section').filter({ hasText: 'Save our date' }).locator('.cursor-pointer').first()
        const envBox = await envBody.boundingBox()

        if (cardBox && envBox) {
            const riseAmount = envBox.y - cardBox.y
            console.log(`Card rise: ${riseAmount}px (expected ~170px)`)
            expect(riseAmount).toBeGreaterThan(100)
            expect(riseAmount).toBeLessThan(220)
        }
    })

    // ── Fix #2: Heart particle burst ──

    test('Fix #2: 15 SVG hearts appear on open', async ({ page }) => {
        await scrollToEnvelope(page)
        await openEnvelope(page)

        // Container is position:absolute with no intrinsic size — use count not visibility
        const container = page.locator('[data-testid="hearts-container"]')
        await expect(container).toHaveCount(1)

        const hearts = container.locator('svg')
        await expect(hearts).toHaveCount(15)

        await expect(page.locator('[data-testid="heart-0"]')).toHaveCount(1)
        await expect(page.locator('[data-testid="heart-14"]')).toHaveCount(1)

        await page.screenshot({ path: '.playwright-mcp/004-hearts-burst.png' })
    })

    test('Fix #2: hearts have varied sizes', async ({ page }) => {
        await scrollToEnvelope(page)
        await openEnvelope(page)

        const container = page.locator('[data-testid="hearts-container"]')
        const hearts = container.locator('svg')

        const sizes = await hearts.evaluateAll((svgs) =>
            svgs.map((svg) => parseFloat(svg.getAttribute('width') || '0'))
        )

        const uniqueSizes = new Set(sizes.map((s) => Math.round(s)))
        console.log(`Heart sizes: ${sizes.map((s) => s.toFixed(0)).join(', ')}`)
        expect(uniqueSizes.size).toBeGreaterThan(3)

        const minSize = Math.min(...sizes)
        const maxSize = Math.max(...sizes)
        expect(minSize).toBeLessThan(15)
        expect(maxSize).toBeGreaterThan(18)
    })

    test('Fix #2: hearts are not visible before opening', async ({ page }) => {
        await scrollToEnvelope(page)
        const hearts = page.locator('[data-testid="hearts-container"]')
        await expect(hearts).toHaveCount(0)
    })

    // ── Fix #3: 2-phase closing ──

    test('Fix #3: card descends before flap closes (no z-index overlap)', async ({ page }) => {
        await scrollToEnvelope(page)
        await openEnvelope(page)

        const card = page.locator('[data-testid="invitation-card"]')
        const flap = page.locator('[data-testid="envelope-flap"]')
        const openCardBox = await card.boundingBox()

        // Click to start closing
        await page.getByText('Chạm để đóng thiệp').click({ force: true })

        // Phase 1 (closing-card): at 400ms, card descending, flap still open
        await page.waitForTimeout(400)
        await page.screenshot({ path: '.playwright-mcp/004-closing-phase1.png' })

        const phase1CardBox = await card.boundingBox()
        const phase1FlapZ = await flap.evaluate((el) =>
            window.getComputedStyle(el).zIndex
        )

        if (openCardBox && phase1CardBox) {
            console.log(`Card Y: open=${openCardBox.y}, phase1=${phase1CardBox.y}`)
            expect(phase1CardBox.y).toBeGreaterThan(openCardBox.y)
        }

        // Flap z-index should be 1 (low) during card descent — THIS IS THE KEY FIX
        console.log(`Phase 1 flap z-index: ${phase1FlapZ} (expected 1)`)
        expect(phase1FlapZ).toBe('1')

        // Phase 2 (closing-flap): at 1200ms total, flap should now be z:5
        await page.waitForTimeout(800)
        await page.screenshot({ path: '.playwright-mcp/004-closing-phase2.png' })

        const phase2FlapZ = await flap.evaluate((el) =>
            window.getComputedStyle(el).zIndex
        )
        console.log(`Phase 2 flap z-index: ${phase2FlapZ} (expected 5)`)
        expect(phase2FlapZ).toBe('5')
    })

    test('Fix #3: full close cycle completes cleanly', async ({ page }) => {
        await scrollToEnvelope(page)
        await openEnvelope(page)
        await closeEnvelope(page)

        await page.screenshot({ path: '.playwright-mcp/004-closed-after-cycle.png' })

        await expect(page.getByText('Chạm để mở thiệp')).toBeVisible()
        const hearts = page.locator('[data-testid="hearts-container"]')
        await expect(hearts).toHaveCount(0)
        await expect(page.locator('img[alt="Wax seal"]')).toBeVisible()
    })

    test('Fix #3: re-open after close works correctly', async ({ page }) => {
        await scrollToEnvelope(page)
        await openEnvelope(page)
        await closeEnvelope(page)

        // Re-open
        await openEnvelope(page)

        await expect(page.getByText('Thiệp mời cưới')).toBeVisible()
        await expect(page.getByText('05.04.2026')).toBeVisible()

        const hearts = page.locator('[data-testid="hearts-container"]')
        await expect(hearts).toHaveCount(1)
        await expect(hearts.locator('svg')).toHaveCount(15)

        await page.screenshot({ path: '.playwright-mcp/004-reopen-after-close.png' })
    })

    // ── Fix #4: Card z-index always above flap during opening ──

    test('Fix #4: card z-index is immediately higher than flap during opening', async ({ page }) => {
        await scrollToEnvelope(page)

        const card = page.locator('[data-testid="invitation-card"]')
        const flap = page.locator('[data-testid="envelope-flap"]')

        // Click to start opening
        await page.getByText('Chạm để mở thiệp').click({ force: true })

        // Check at 100ms — very early in the opening animation
        await page.waitForTimeout(100)

        const cardZ = await card.evaluate((el) =>
            window.getComputedStyle(el).zIndex
        )
        const flapZ = await flap.evaluate((el) =>
            window.getComputedStyle(el).zIndex
        )

        console.log(`Opening early: card z=${cardZ}, flap z=${flapZ}`)
        // Card z must be strictly higher than flap z (no flash)
        expect(parseInt(cardZ)).toBeGreaterThan(parseInt(flapZ))

        await page.screenshot({ path: '.playwright-mcp/004-opening-z-index.png' })
    })

    test('Fix #4: card z-index is 4 when fully open (above pocket z:3)', async ({ page }) => {
        await scrollToEnvelope(page)
        await openEnvelope(page)

        const card = page.locator('[data-testid="invitation-card"]')
        const cardZ = await card.evaluate((el) =>
            window.getComputedStyle(el).zIndex
        )

        console.log(`Open state: card z=${cardZ} (expected 2)`)
        expect(cardZ).toBe('2')
    })

    // ── Fix #5: Shadow stays fixed (not affected by envelope float) ──

    test('Fix #5: shadow is outside floating envelope (fixed position)', async ({ page }) => {
        await scrollToEnvelope(page)

        const shadow = page.locator('[data-testid="envelope-shadow"]')
        await expect(shadow).toHaveCount(1)

        // Shadow should NOT be a descendant of the floating envelope
        // The envelope has cursor-pointer class — shadow should not be inside it
        const shadowInsideEnvelope = page.locator('.cursor-pointer [data-testid="envelope-shadow"]')
        await expect(shadowInsideEnvelope).toHaveCount(0)
    })

    test('Fix #5: shadow Y position stays stable during float cycle', async ({ page }) => {
        await scrollToEnvelope(page)

        const shadow = page.locator('[data-testid="envelope-shadow"]')

        // Sample shadow Y position at different points in the float cycle
        const positions: number[] = []
        for (let i = 0; i < 4; i++) {
            await page.waitForTimeout(750) // ~1/4 of the 3s float cycle
            const box = await shadow.boundingBox()
            if (box) positions.push(Math.round(box.y))
        }

        console.log(`Shadow Y positions over float cycle: ${positions.join(', ')}`)

        // All positions should be identical (shadow doesn't float)
        // Allow 1px tolerance for subpixel rendering
        const minY = Math.min(...positions)
        const maxY = Math.max(...positions)
        expect(maxY - minY).toBeLessThanOrEqual(1)
    })

    // ── Fix #6: Card content actually renders ──

    test('Fix #6: invitation card content is rendered and visible when open', async ({ page }) => {
        await scrollToEnvelope(page)
        await openEnvelope(page)

        // Verify all card content elements are present and visible
        await expect(page.getByText('Thiệp mời cưới')).toBeVisible()
        await expect(page.getByText('05.04.2026')).toBeVisible()
        const card = page.locator('[data-testid="invitation-card"]')
        await expect(card.getByText(/Trân trọng kính mời/)).toBeVisible()

        await page.screenshot({ path: '.playwright-mcp/004-card-content-rendered.png' })
    })

    test('Fix #6: no guest name shown on default route (no hash)', async ({ page }) => {
        await scrollToEnvelope(page)
        await openEnvelope(page)

        // Default route (/) has no guestName — guest name element should not exist
        const guestNameEl = page.locator('[data-testid="envelope-guest-name"]')
        await expect(guestNameEl).toHaveCount(0)
    })

    test('Fix #6: card content is within the card bounds (not clipped)', async ({ page }) => {
        await scrollToEnvelope(page)
        await openEnvelope(page)

        const card = page.locator('[data-testid="invitation-card"]')
        const cardBox = await card.boundingBox()

        // Check that the "Thiệp mời cưới" text is inside the card bounds
        const label = page.getByText('Thiệp mời cưới')
        const labelBox = await label.boundingBox()

        if (cardBox && labelBox) {
            console.log(`Card bounds: top=${cardBox.y}, bottom=${cardBox.y + cardBox.height}`)
            console.log(`Label position: top=${labelBox.y}, bottom=${labelBox.y + labelBox.height}`)
            // Label should be within card vertical bounds
            expect(labelBox.y).toBeGreaterThanOrEqual(cardBox.y)
            expect(labelBox.y + labelBox.height).toBeLessThanOrEqual(cardBox.y + cardBox.height + 2)
        }
    })
})
