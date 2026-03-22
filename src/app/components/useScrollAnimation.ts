import { useEffect, useRef } from 'react'

/**
 * Animation variant configs.
 * Each variant defines initial state, final state, and timing.
 * All properties are GPU-accelerated (transform + opacity only).
 */
type AnimationVariant = 'fadeInUp' | 'fadeInScale' | 'revealLine'

interface VariantConfig {
    initial: { opacity: string; transform: string }
    final: { opacity: string; transform: string }
    duration: number
    easing: string
}

const VARIANTS: Record<AnimationVariant, VariantConfig> = {
    fadeInUp: {
        initial: { opacity: '0', transform: 'translateY(16px)' },
        final: { opacity: '1', transform: 'translateY(0)' },
        duration: 700,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // --ease-out-quad
    },
    fadeInScale: {
        initial: { opacity: '0', transform: 'scale(0.95)' },
        final: { opacity: '1', transform: 'scale(1)' },
        duration: 800,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)', // --ease-out-expo
    },
    revealLine: {
        initial: { opacity: '1', transform: 'scaleX(0)' },
        final: { opacity: '1', transform: 'scaleX(1)' },
        duration: 600,
        easing: 'cubic-bezier(0.65, 0, 0.35, 1)', // --ease-in-out-cubic
    },
}

interface ScrollAnimationOptions {
    variant?: AnimationVariant
    delay?: number
    threshold?: number
    /** @deprecated Use `delay` instead. Kept for backwards compatibility. */
    stagger?: number
}

export function useScrollAnimation(options?: ScrollAnimationOptions) {
    const ref = useRef<HTMLDivElement>(null)

    const variant = options?.variant ?? 'fadeInUp'
    const delay = options?.delay ?? options?.stagger ?? 0
    const threshold = options?.threshold ?? 0.15

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const config = VARIANTS[variant]

        if (prefersReduced) {
            el.style.opacity = config.final.opacity
            el.style.transform = config.final.transform
            return
        }

        // Set initial state
        el.style.opacity = config.initial.opacity
        el.style.transform = config.initial.transform
        el.style.willChange = 'transform, opacity'

        // revealLine needs transformOrigin center
        if (variant === 'revealLine') {
            el.style.transformOrigin = 'center'
        }

        el.style.transition = `opacity ${config.duration}ms ${config.easing}, transform ${config.duration}ms ${config.easing}`

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const applyFinal = () => {
                            el.style.opacity = config.final.opacity
                            el.style.transform = config.final.transform
                            // Clean up will-change after animation completes
                            setTimeout(() => {
                                el.style.willChange = 'auto'
                            }, config.duration + delay)
                        }

                        if (delay > 0) {
                            setTimeout(applyFinal, delay)
                        } else {
                            applyFinal()
                        }
                        observer.unobserve(entry.target)
                    }
                })
            },
            {
                threshold,
                rootMargin: '0px 0px -50px 0px',
            },
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [variant, delay, threshold])

    return ref
}

export function useChildrenStagger(staggerMs = 100, variant: AnimationVariant = 'fadeInUp') {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const config = VARIANTS[variant]
        const children = Array.from(el.children) as HTMLElement[]

        children.forEach((child) => {
            if (prefersReduced) {
                child.style.opacity = config.final.opacity
                child.style.transform = config.final.transform
                return
            }
            child.style.opacity = config.initial.opacity
            child.style.transform = config.initial.transform
            child.style.willChange = 'transform, opacity'
            child.style.transition = `opacity ${config.duration}ms ${config.easing}, transform ${config.duration}ms ${config.easing}`
        })

        if (prefersReduced) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        children.forEach((child, i) => {
                            const childDelay = i * staggerMs
                            setTimeout(() => {
                                child.style.opacity = config.final.opacity
                                child.style.transform = config.final.transform
                                // Clean up will-change
                                setTimeout(() => {
                                    child.style.willChange = 'auto'
                                }, config.duration)
                            }, childDelay)
                        })
                        observer.unobserve(entry.target)
                    }
                })
            },
            { threshold: 0.15, rootMargin: '0px 0px -50px 0px' },
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [staggerMs, variant])

    return ref
}
