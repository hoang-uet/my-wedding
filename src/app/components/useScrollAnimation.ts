import { useEffect, useRef } from 'react'

export function useScrollAnimation(options?: { threshold?: number; stagger?: number }) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        if (prefersReduced) {
            el.style.opacity = '1'
            el.style.transform = 'none'
            return
        }

        el.style.opacity = '0'
        el.style.transform = 'translateY(24px)'
        el.style.transition = 'opacity 600ms ease, transform 600ms ease'

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const staggerDelay = options?.stagger || 0
                        setTimeout(() => {
                            el.style.opacity = '1'
                            el.style.transform = 'translateY(0)'
                        }, staggerDelay)
                        observer.unobserve(entry.target)
                    }
                })
            },
            {
                threshold: options?.threshold || 0.15,
                rootMargin: '0px 0px -50px 0px',
            },
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [options?.threshold, options?.stagger])

    return ref
}

export function useChildrenStagger(staggerMs = 100) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        const children = Array.from(el.children) as HTMLElement[]
        children.forEach((child) => {
            if (prefersReduced) {
                child.style.opacity = '1'
                child.style.transform = 'none'
                return
            }
            child.style.opacity = '0'
            child.style.transform = 'translateY(24px)'
            child.style.transition = 'opacity 600ms ease, transform 600ms ease'
        })

        if (prefersReduced) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        children.forEach((child, i) => {
                            setTimeout(() => {
                                child.style.opacity = '1'
                                child.style.transform = 'translateY(0)'
                            }, i * staggerMs)
                        })
                        observer.unobserve(entry.target)
                    }
                })
            },
            { threshold: 0.15, rootMargin: '0px 0px -50px 0px' },
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [staggerMs])

    return ref
}
