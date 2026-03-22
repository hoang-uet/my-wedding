/**
 * FloralOverlay — Decorative floral modules for the wedding invitation.
 *
 * Z-INDEX STRATEGY (strict layering):
 *   z-0   : Section backgrounds
 *   z-[1] : Floral decorations (this file) — ALWAYS below content
 *   z-[2] : Floral decorations with slight elevation (overlapping edges)
 *   z-10+ : Text content, buttons, interactive elements
 *   z-800 : FloatingBar
 *   z-900 : MusicButton
 *
 * ANIMATION VARIABLES:
 *   --floral-sway-duration : 6–8s  (gentle wind sway)
 *   --floral-float-duration: 8–12s (slow vertical drift)
 *   --floral-fade-delay    : per-element stagger for scroll reveal
 *
 * Each floral module is pointer-events-none to never block interaction.
 */

import { useEffect, useRef, useState } from 'react'
import orchidBouquet from '../../assets/orchid-bouquet.png'
import orchidSingle from '../../assets/orchid-single.png'
import orchidBranch from '../../assets/orchid-branch.png'

/* ─── Scroll-triggered fade-in hook ─── */
function useFloralReveal(delay = 0) {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        // Respect reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setVisible(true)
            return
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setVisible(true), delay)
                    observer.disconnect()
                }
            },
            { threshold: 0.15 },
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [delay])

    return { ref, visible }
}

/* ═══════════════════════════════════════════════════════════════
   1. CORNER ORCHID CLUSTER — Top-right / Bottom-left of sections
   Used on: FamilyInfo (top-right), EventDetails (enhanced), RSVPForm
   ═══════════════════════════════════════════════════════════════ */
export function CornerOrchidCluster({
    position = 'top-right',
    size = 120,
    delay = 0,
}: {
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
    size?: number
    delay?: number
}) {
    const { ref, visible } = useFloralReveal(delay)

    const positionStyles: React.CSSProperties = {
        'top-right': { top: -12, right: -16 },
        'top-left': { top: -12, left: -16 },
        'bottom-right': { bottom: -12, right: -16 },
        'bottom-left': { bottom: -12, left: -16 },
    }[position]

    const flipX = position.includes('left') ? -1 : 1
    const flipY = position.includes('bottom') ? -1 : 1

    return (
        <div
            ref={ref}
            className="absolute pointer-events-none"
            style={{
                ...positionStyles,
                zIndex: 1,
                width: size,
                height: size,
                opacity: visible ? 0.55 : 0,
                transform: `scaleX(${flipX}) scaleY(${flipY})`,
                transition: 'opacity 1.2s ease',
            }}
        >
            <img
                src={orchidSingle}
                alt=""
                aria-hidden="true"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    animation: visible ? 'floralSway 7s ease-in-out infinite' : 'none',
                    transformOrigin: position.includes('right') ? 'bottom right' : 'bottom left',
                }}
            />
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════
   2. ORCHID BRANCH DIVIDER — Horizontal between sections
   Used between: WeddingPhotoDivider→FamilyInfo, OurStory→Calendar
   ═══════════════════════════════════════════════════════════════ */
export function OrchidBranchDivider({ delay = 0 }: { delay?: number }) {
    const { ref, visible } = useFloralReveal(delay)

    return (
        <div
            ref={ref}
            className="flex justify-center pointer-events-none"
            style={{
                margin: '-8px 0',
                position: 'relative',
                zIndex: 2,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 1s ease, transform 1s ease',
            }}
        >
            <img
                src={orchidBranch}
                alt=""
                aria-hidden="true"
                style={{
                    width: 140,
                    height: 'auto',
                    opacity: 0.5,
                    animation: visible ? 'floralFloat 10s ease-in-out infinite' : 'none',
                }}
            />
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════
   3. BOUQUET ACCENT — Larger cluster for section backgrounds
   Used on: RSVPForm background, WeddingGift accent
   ═══════════════════════════════════════════════════════════════ */
export function BouquetAccent({
    position = 'bottom-right',
    size = 160,
    delay = 0,
}: {
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
    size?: number
    delay?: number
}) {
    const { ref, visible } = useFloralReveal(delay)

    const positionStyles: React.CSSProperties = {
        'top-right': { top: -20, right: -30 },
        'top-left': { top: -20, left: -30 },
        'bottom-right': { bottom: -20, right: -30 },
        'bottom-left': { bottom: -20, left: -30 },
    }[position]

    const flipX = position.includes('left') ? -1 : 1
    const flipY = position.includes('bottom') ? -1 : 1

    return (
        <div
            ref={ref}
            className="absolute pointer-events-none"
            style={{
                ...positionStyles,
                zIndex: 1,
                width: size,
                height: size,
                opacity: visible ? 0.35 : 0,
                transform: `scaleX(${flipX}) scaleY(${flipY})`,
                transition: 'opacity 1.4s ease',
            }}
        >
            <img
                src={orchidBouquet}
                alt=""
                aria-hidden="true"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    animation: visible ? 'floralSway 8s ease-in-out infinite' : 'none',
                    transformOrigin: position.includes('right') ? 'center right' : 'center left',
                }}
            />
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════
   4. SVG VINE FRAME — Delicate vine lines that "hug" content edges
   Used on: Countdown section corners, Gallery section top
   ═══════════════════════════════════════════════════════════════ */
export function VineFrame({
    position = 'top-left',
    delay = 0,
}: {
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    delay?: number
}) {
    const { ref, visible } = useFloralReveal(delay)

    const flipX = position.includes('right') ? -1 : 1
    const flipY = position.includes('bottom') ? -1 : 1

    const positionStyles: React.CSSProperties = {
        'top-left': { top: 0, left: 0 },
        'top-right': { top: 0, right: 0 },
        'bottom-left': { bottom: 0, left: 0 },
        'bottom-right': { bottom: 0, right: 0 },
    }[position]

    return (
        <div
            ref={ref}
            className="absolute pointer-events-none"
            style={{
                ...positionStyles,
                zIndex: 1,
                opacity: visible ? 0.45 : 0,
                transform: `scaleX(${flipX}) scaleY(${flipY})`,
                transition: 'opacity 1s ease 0.2s',
            }}
        >
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                {/* Main vine */}
                <path
                    d="M0 30 Q15 28 25 18 Q35 8 50 5"
                    stroke="#9BAF88"
                    strokeWidth="1.2"
                    fill="none"
                    opacity="0.7"
                    style={{
                        animation: visible ? 'vineGrow 1.5s ease forwards' : 'none',
                    }}
                />
                <path
                    d="M8 0 Q10 15 18 25 Q26 35 30 50"
                    stroke="#9BAF88"
                    strokeWidth="1"
                    fill="none"
                    opacity="0.5"
                />
                {/* Leaves along vine */}
                <ellipse
                    cx="20"
                    cy="22"
                    rx="8"
                    ry="3"
                    fill="#9BAF88"
                    opacity="0.3"
                    transform="rotate(-35 20 22)"
                />
                <ellipse
                    cx="35"
                    cy="10"
                    rx="7"
                    ry="2.5"
                    fill="#9BAF88"
                    opacity="0.25"
                    transform="rotate(-15 35 10)"
                />
                <ellipse
                    cx="14"
                    cy="12"
                    rx="6"
                    ry="2.5"
                    fill="#9BAF88"
                    opacity="0.25"
                    transform="rotate(-50 14 12)"
                />
                {/* Small flower bud at vine end */}
                <circle cx="50" cy="5" r="4" fill="#F5E6E0" opacity="0.65" />
                <circle cx="46" cy="3" r="3" fill="#F5E6E0" opacity="0.55" />
                <circle cx="50" cy="5" r="1.5" fill="#E8C8A0" opacity="0.5" />
                {/* Tiny bud on vertical vine */}
                <circle cx="30" cy="50" r="3" fill="#F5E6E0" opacity="0.5" />
                <circle cx="30" cy="50" r="1.2" fill="#E8C8A0" opacity="0.4" />
            </svg>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════
   5. FLOATING PETALS — Very subtle background petals that drift
   Used on: Gallery section background
   ═══════════════════════════════════════════════════════════════ */
export function FloatingPetals() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className="absolute"
                    style={{
                        left: `${15 + i * 18}%`,
                        top: `${10 + (i % 3) * 30}%`,
                        animation: `petalDrift ${9 + i * 2}s ease-in-out infinite`,
                        animationDelay: `${i * 1.5}s`,
                    }}
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        style={{ opacity: 0.15 + (i % 3) * 0.05 }}
                    >
                        <ellipse
                            cx="8"
                            cy="8"
                            rx="6"
                            ry="3"
                            fill="#F5E6E0"
                            transform={`rotate(${i * 35} 8 8)`}
                        />
                    </svg>
                </div>
            ))}
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════
   6. GLOBAL ANIMATION STYLES — Injected once from App.tsx
   ═══════════════════════════════════════════════════════════════ */
export function FloralAnimationStyles() {
    return (
        <style>{`
            /* Gentle wind sway — used on corner orchids and bouquets */
            @keyframes floralSway {
                0%, 100% { transform: rotate(0deg) translateX(0); }
                25%      { transform: rotate(1.5deg) translateX(2px); }
                50%      { transform: rotate(-1deg) translateX(-1px); }
                75%      { transform: rotate(0.8deg) translateX(1px); }
            }

            /* Slow vertical float — used on branch dividers */
            @keyframes floralFloat {
                0%, 100% { transform: translateY(0); }
                50%      { transform: translateY(-4px); }
            }

            /* Petal drift — very slow diagonal movement */
            @keyframes petalDrift {
                0%, 100% {
                    transform: translate(0, 0) rotate(0deg);
                    opacity: 0.15;
                }
                25% {
                    transform: translate(6px, -8px) rotate(15deg);
                    opacity: 0.22;
                }
                50% {
                    transform: translate(-3px, -14px) rotate(-10deg);
                    opacity: 0.18;
                }
                75% {
                    transform: translate(4px, -6px) rotate(8deg);
                    opacity: 0.2;
                }
            }

            /* SVG vine path grow animation */
            @keyframes vineGrow {
                from { stroke-dashoffset: 80; stroke-dasharray: 80; }
                to   { stroke-dashoffset: 0; stroke-dasharray: 80; }
            }

            /* Reduced motion: disable all floral animations */
            @media (prefers-reduced-motion: reduce) {
                [class*="floral"], [style*="floralSway"], [style*="floralFloat"], [style*="petalDrift"] {
                    animation: none !important;
                }
            }
        `}</style>
    )
}
