import { useEffect, useRef } from 'react'

interface ParallaxOptions {
    /** Parallax speed factor (0–1). Default 0.15 */
    speed?: number
    /** Max offset in px. Default 20 */
    maxOffset?: number
    /** Direction of movement relative to scroll. Default 'up' */
    direction?: 'up' | 'down'
}

/**
 * Lightweight parallax hook using IntersectionObserver + rAF.
 *
 * - rAF loop only runs while element is visible (zero cost when off-screen)
 * - Applies transform directly to DOM (bypasses React reconciliation)
 * - Respects prefers-reduced-motion
 */
export function useParallax(options?: ParallaxOptions) {
    const ref = useRef<HTMLDivElement>(null)

    const speed = options?.speed ?? 0.15
    const maxOffset = options?.maxOffset ?? 20
    const direction = options?.direction ?? 'up'

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (prefersReduced) return

        let rafId: number | null = null
        let isVisible = false

        const tick = () => {
            if (!isVisible) return

            const rect = el.getBoundingClientRect()
            const viewportH = window.innerHeight

            // 0 when element enters bottom, 1 when it exits top
            const progress = 1 - (rect.top + rect.height) / (viewportH + rect.height)
            // Map to -1..1 range centered at viewport middle
            const centered = (progress - 0.5) * 2

            let offset = centered * maxOffset * speed * 10
            offset = Math.max(-maxOffset, Math.min(maxOffset, offset))

            if (direction === 'down') offset = -offset

            el.style.transform = `translateY(${offset}px)`
            rafId = requestAnimationFrame(tick)
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        isVisible = true
                        el.style.willChange = 'transform'
                        rafId = requestAnimationFrame(tick)
                    } else {
                        isVisible = false
                        el.style.willChange = 'auto'
                        if (rafId !== null) {
                            cancelAnimationFrame(rafId)
                            rafId = null
                        }
                    }
                })
            },
            { threshold: 0, rootMargin: '50px 0px' },
        )

        observer.observe(el)

        return () => {
            observer.disconnect()
            if (rafId !== null) cancelAnimationFrame(rafId)
            el.style.willChange = 'auto'
        }
    }, [speed, maxOffset, direction])

    return ref
}
