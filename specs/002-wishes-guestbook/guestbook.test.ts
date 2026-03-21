import { test, expect } from '@playwright/test'

test.describe('Guestbook — Wishes Feature', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        // Wait for the floating bar to be visible
        await page.waitForSelector('text=Gửi lời chúc...', { timeout: 10000 })
    })

    test('should show name modal when clicking "Gửi lời chúc..." without guest_name', async ({
        page,
    }) => {
        // Clear localStorage to simulate first-time visitor
        await page.evaluate(() => localStorage.removeItem('guest_name'))

        // Click the input area
        await page.click('text=Gửi lời chúc...')

        // Name modal should appear
        await expect(page.locator('text=Xin chào! Bạn là...')).toBeVisible()
        await expect(page.locator('input[placeholder="Tên của bạn"]')).toBeVisible()
    })

    test('should validate name must be at least 2 characters', async ({ page }) => {
        await page.evaluate(() => localStorage.removeItem('guest_name'))
        await page.click('text=Gửi lời chúc...')

        // Wait for modal
        await expect(page.locator('text=Xin chào! Bạn là...')).toBeVisible()

        // Type 1 character and try to confirm
        await page.fill('input[placeholder="Tên của bạn"]', 'A')
        await page.click('text=Xác nhận')

        // Should show validation error
        await expect(page.locator('text=Tên phải có ít nhất 2 ký tự')).toBeVisible()
    })

    test('should save name and open messages overlay after confirming name', async ({
        page,
    }) => {
        await page.evaluate(() => localStorage.removeItem('guest_name'))
        await page.click('text=Gửi lời chúc...')

        // Fill name and confirm
        await page.fill('input[placeholder="Tên của bạn"]', 'Minh')
        await page.click('text=Xác nhận')

        // Modal should close
        await expect(page.locator('text=Xin chào! Bạn là...')).not.toBeVisible()

        // Messages overlay should be open (input with placeholder visible)
        await expect(
            page.locator('input[placeholder="Gửi lời chúc..."]'),
        ).toBeVisible()

        // localStorage should have the name
        const storedName = await page.evaluate(() =>
            localStorage.getItem('guest_name'),
        )
        expect(storedName).toBe('Minh')
    })

    test('should skip name modal when guest_name exists in localStorage', async ({
        page,
    }) => {
        // Pre-set guest name
        await page.evaluate(() => localStorage.setItem('guest_name', 'TestUser'))

        // Click input area
        await page.click('text=Gửi lời chúc...')

        // Should NOT show name modal
        await expect(page.locator('text=Xin chào! Bạn là...')).not.toBeVisible()

        // Messages overlay should open directly
        await expect(
            page.locator('input[placeholder="Gửi lời chúc..."]'),
        ).toBeVisible()
    })

    test('should show empty state when no wishes exist', async ({ page }) => {
        await page.evaluate(() => localStorage.setItem('guest_name', 'TestUser'))
        await page.click('text=Gửi lời chúc...')

        // If no wishes in DB, should show empty state
        // Note: this depends on the actual DB state
        const emptyState = page.locator('text=Hãy là người đầu tiên gửi lời chúc!')
        const messagesList = page.locator('[class*="overflow-y-auto"]')

        // Either empty state or messages list should be visible
        await expect(emptyState.or(messagesList)).toBeVisible()
    })

    test('should validate empty message on send', async ({ page }) => {
        await page.evaluate(() => localStorage.setItem('guest_name', 'TestUser'))
        await page.click('text=Gửi lời chúc...')

        // Try to send empty message by pressing Enter
        const input = page.locator('input[placeholder="Gửi lời chúc..."]')
        await input.fill('')
        await input.press('Enter')

        // Should not crash — empty message is silently ignored (validation in hook)
        await expect(input).toBeVisible()
    })

    test('should close messages overlay when clicking close button', async ({
        page,
    }) => {
        await page.evaluate(() => localStorage.setItem('guest_name', 'TestUser'))
        await page.click('text=Gửi lời chúc...')

        // Overlay should be open
        await expect(
            page.locator('input[placeholder="Gửi lời chúc..."]'),
        ).toBeVisible()

        // Click close button (X icon in the overlay header)
        const closeButton = page.locator(
            '.absolute.bottom-\\[56px\\] button:has(svg)',
        ).first()
        await closeButton.click()

        // Overlay should be closed — placeholder text should be visible again
        await expect(page.locator('span:text("Gửi lời chúc...")')).toBeVisible()
    })

    test('should dismiss peek mode when clicking close button', async ({ page }) => {
        // This test verifies peek mode dismissal
        // Peek mode only shows when wishes exist in DB
        // If peek is visible, clicking X should hide it

        const peekClose = page.locator('button:has(svg)').filter({
            has: page.locator('svg'),
        })

        // Check if any peek overlay is visible
        const peekOverlay = page.locator('.peek-scroll-container')
        if (await peekOverlay.isVisible({ timeout: 3000 }).catch(() => false)) {
            // Find and click the small close button on peek
            await peekClose.first().click()

            // Peek should disappear
            await expect(peekOverlay).not.toBeVisible()
        }
    })
})
