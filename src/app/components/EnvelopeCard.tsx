import { useState, useCallback, useRef, useMemo } from 'react'
import { weddingConfig, weddingImages } from './wedding-config'
import { WeddingImage } from './WeddingImage'
import waxSeal from '@/assets/wax-seal.png'
import orchidBouquet from '@/assets/orchid-bouquet.png'
import orchidSingle from '@/assets/orchid-single.png'

/**
 * Envelope + invitation card with 5 states:
 *   closed → opening → open → closing-card → closing-flap → closed
 *
 * Z-index layers (inside envelope):
 *   0: body   1: side flaps   1-2: card (1 closed, 2 open/opening/closing-card)   3: pocket   1-5: flap (5 closed/closing-flap, 1 open/closing-card)   10: seal   7: hearts
 *
 * Animation timings:
 *   - Idle: float up/down 20px (3s ease-in-out infinite)
 *   - Shadow: oval beneath, scaleX pulses in sync with float
 *   - Flap open: 1.2s, close: 0.8s
 *   - Card rise: 1s with 0.5s delay, descend: 0.6s with 0.1s delay
 *   - Closing: card descends first (900ms), THEN flap closes (1000ms)
 *   - Hearts: particle burst — 15 SVG hearts, radial explosion from wax seal
 */
type EnvelopeState = 'closed' | 'opening' | 'open' | 'closing-card' | 'closing-flap'

const ENV_W = 310
const ENV_H = 215
const FLAP_H = 108
const POCKET_H = 105
// Card rises nearly full height so all content (names, date, invitation) is visible above pocket
const CARD_RISE = 170

/* ── Heart Particle Burst ── */
const HEART_COLORS = ['#d00000', '#e63946', '#f4a0b5', '#ff6b81', '#c1121f']
const HEART_COUNT = 15

interface HeartParticle {
    id: number
    size: number
    color: string
    /** Pre-computed X offset (px) from cos(angle) * distance */
    x: number
    /** Pre-computed Y offset (px) from sin(angle) * distance — negative = upward */
    y: number
    delay: number
    duration: number
    drift: number
    sway: number
    rotation: number
}

function rand(min: number, max: number) {
    return Math.random() * (max - min) + min
}

function generateHearts(): HeartParticle[] {
    return Array.from({ length: HEART_COUNT }, (_, i) => {
        // Favor upward burst (70% upper hemisphere)
        const angle = Math.random() < 0.7
            ? rand(-Math.PI * 0.85, -Math.PI * 0.15) // upper arc
            : rand(Math.PI * 0.15, Math.PI * 0.85)   // lower arc (fewer)
        const distance = rand(70, 200)

        // Size distribution: 40% small, 40% medium, 20% large
        const sizeRoll = Math.random()
        const size = sizeRoll < 0.4 ? rand(8, 12) : sizeRoll < 0.8 ? rand(14, 20) : rand(22, 28)

        return {
            id: i,
            size,
            color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            delay: rand(0, 120),
            duration: rand(1800, 2600),
            drift: rand(30, 90),
            sway: rand(-25, 25),
            rotation: rand(-35, 35),
        }
    })
}

function HeartBurst() {
    const hearts = useMemo(() => generateHearts(), [])

    return (
        <div
            className="pointer-events-none"
            style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                zIndex: 7,
                overflow: 'visible',
            }}
            data-testid="hearts-container"
        >
            {hearts.map((h) => (
                <svg
                    key={h.id}
                    viewBox="0 0 24 24"
                    width={h.size}
                    height={h.size}
                    fill={h.color}
                    style={{
                        position: 'absolute',
                        left: -h.size / 2,
                        top: -h.size / 2,
                        '--hx': `${h.x}px`,
                        '--hy': `${h.y}px`,
                        '--h-drift': `${h.drift}px`,
                        '--h-sway': `${h.sway}px`,
                        '--h-rot': `${h.rotation}deg`,
                        animation: `heartBurst ${h.duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${h.delay}ms both`,
                        willChange: 'transform, opacity',
                        filter: `drop-shadow(0 1px 3px rgba(0,0,0,0.15))`,
                    } as React.CSSProperties}
                    data-testid={`heart-${h.id}`}
                >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
            ))}
        </div>
    )
}

interface EnvelopeCardProps {
    /** Called when user taps the envelope to open (first click). Use to trigger music. */
    onOpen?: () => void
}

export function EnvelopeCard({ onOpen }: EnvelopeCardProps) {
    const [state, setState] = useState<EnvelopeState>('closed')
    const [heartsKey, setHeartsKey] = useState(0)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const handleClick = useCallback(() => {
        if (state === 'opening' || state === 'closing-card' || state === 'closing-flap') return
        if (timerRef.current) clearTimeout(timerRef.current)

        if (state === 'closed') {
            onOpen?.() // Trigger music with envelope opening (user gesture satisfies autoplay policy)
            setState('opening')
            // 1.2s flap + 0.5s card delay = 1.7s total
            timerRef.current = setTimeout(() => {
                setState('open')
                setHeartsKey((k) => k + 1)
            }, 1700)
        } else {
            // Two-phase close: card descends first, THEN flap closes
            setState('closing-card')
            // Phase 1: card descends (0.1s delay + 0.6s animation ≈ 0.9s)
            timerRef.current = setTimeout(() => {
                setState('closing-flap')
                // Phase 2: flap closes (0.8s animation)
                timerRef.current = setTimeout(() => setState('closed'), 1000)
            }, 900)
        }
    }, [state, onOpen])

    const isClosed = state === 'closed'
    const isOpening = state === 'opening'
    const isOpen = state === 'open'
    const isClosingCard = state === 'closing-card'
    const isClosingFlap = state === 'closing-flap'
    // Flap stays open while card descends (closing-card), only closes in closing-flap
    const flapOpen = isOpening || isOpen || isClosingCard
    const showHearts = isOpen

    // Card position: CSS transition handles the smooth animation
    const cardY = isOpen || isOpening ? -CARD_RISE : 0

    // Wrapper grows to accommodate the card rising above.
    // During closing-card, keep expanded so layout doesn't jump while card descends.
    const wrapperH =
        isOpen || isOpening || isClosingCard ? ENV_H + CARD_RISE + 10 : ENV_H

    return (
        <section
            className="relative"
            style={{
                background: 'linear-gradient(180deg, #F5F0E8 0%, #EDE8DD 100%)',
                padding: '40px 20px 36px',
                overflowX: 'hidden',
                overflowY: 'visible',
            }}
        >
            {/* Paper texture */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    opacity: 0.025,
                    background:
                        'repeating-conic-gradient(#8B7355 0% 25%, transparent 0% 50%) 0 0 / 3px 3px',
                }}
            />

            {/* ── Orchid bouquet — top right (animated) ── */}
            <div
                className="absolute pointer-events-none"
                style={{
                    zIndex: 30,
                    top: '-10px',
                    right: '-20px',
                    width: '140px',
                    height: '155px',
                    transform: flapOpen
                        ? 'rotate(8deg) translate(-6px, 4px) scale(1.04)'
                        : 'rotate(12deg) translate(0, 0) scale(1)',
                    transition: 'transform 900ms cubic-bezier(0.34, 1.2, 0.64, 1)',
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.08))',
                }}
            >
                <img src={orchidBouquet} alt="" className="w-full h-full object-contain" />
            </div>

            {/* ── Single orchid — left (animated) ── */}
            <div
                className="absolute pointer-events-none"
                style={{
                    zIndex: 30,
                    top: '44%',
                    left: '-14px',
                    width: '105px',
                    height: '115px',
                    transform: flapOpen
                        ? 'rotate(-4deg) translateY(-50%) translate(6px, -8px) scale(1.06)'
                        : 'rotate(-8deg) translateY(-50%) translate(0, 0) scale(1)',
                    transition: 'transform 900ms cubic-bezier(0.34, 1.2, 0.64, 1)',
                    filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.06))',
                }}
            >
                <img src={orchidSingle} alt="" className="w-full h-full object-contain" />
            </div>

            {/* ── Title ── */}
            <h1
                className="text-center relative z-10"
                style={{
                    fontFamily: 'var(--font-script-hero)',
                    fontSize: '46px',
                    color: '#4A5D3A',
                    lineHeight: 1.1,
                    marginBottom: '18px',
                }}
            >
                Save our date
            </h1>

            {/* ═══════════════════════════════════════
          OUTER WRAPPER — expands when card rises
          ═══════════════════════════════════════ */}
            <div
                className="relative mx-auto"
                style={{
                    width: `${ENV_W}px`,
                    height: `${wrapperH}px`,
                    transition: isClosingCard || isClosingFlap
                        ? 'height 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.3s'
                        : 'height 800ms cubic-bezier(0.34, 1.2, 0.64, 1)',
                }}
            >
                {/* ═══════════════════════════════════
            ENVELOPE — anchored to bottom
            ═══════════════════════════════════ */}
                <div
                    className="absolute bottom-0 left-0 cursor-pointer"
                    style={{
                        width: `${ENV_W}px`,
                        height: `${ENV_H}px`,
                        animation: 'envelopeFloat 3s ease-in-out infinite',
                        overflow: 'visible',
                    }}
                    onClick={handleClick}
                >
                    {/* ── Oval shadow beneath envelope ── */}
                    <div
                        className="absolute pointer-events-none"
                        style={{
                            width: `${ENV_W * 1.14}px`,
                            height: '25px',
                            borderRadius: '50%',
                            background: 'rgba(0, 0, 0, 0.2)',
                            top: `${ENV_H + 50}px`,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            filter: 'blur(4px)',
                            boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
                            animation: 'shadowScale 3s ease-in-out infinite',
                            zIndex: 0,
                        }}
                    />

                    {/* Body background — z:0 */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: '#3C4E34',
                            borderRadius: '0 0 6px 6px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                            transition: 'box-shadow 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        }}
                    />

                    {/* Side flaps are part of the pocket element (solid side borders) */}

                    {/* ───────────────────────────────────
              INVITATION CARD
              Ref: position: relative; width: 90%; height: 90%; top: 5%
              Fully contained in envelope when closed (no overhang).
              z:1 closed (below pocket z:3), z:2 open (still below pocket).
              ─────────────────────────────────── */}
                    <div
                        className="absolute"
                        data-testid="invitation-card"
                        style={{
                            zIndex: isOpen || isOpening || isClosingCard ? 2 : 1,
                            left: '5%',
                            right: '5%',
                            top: '5%',
                            bottom: '5%',
                            transform: `translateY(${cardY}px)`,
                            transition: isClosingCard
                                ? 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s, z-index 0.1s'
                                : 'transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s, z-index 0.5s',
                            pointerEvents: isOpen ? 'auto' : 'none',
                        }}
                    >
                        <div
                            className="w-full h-full overflow-hidden relative"
                            style={{
                                borderRadius: '6px',
                                boxShadow: isOpen
                                    ? '0 4px 30px rgba(0,0,0,0.2)'
                                    : '0 2px 26px rgba(0,0,0,0.12)',
                                transition: 'box-shadow 300ms ease',
                            }}
                        >
                            {/* Background photo */}
                            <WeddingImage
                                image={weddingImages.thankYou}
                                alt="Wedding"
                                sizes="280px"
                                className="absolute inset-0 w-full h-full"
                                style={{ borderRadius: '6px', aspectRatio: 'unset' }}
                            />
                            {/* Dark overlay */}
                            <div
                                className="absolute inset-0"
                                style={{
                                    background:
                                        'linear-gradient(180deg, rgba(38,48,32,0.32) 0%, rgba(38,48,32,0.52) 100%)',
                                }}
                            />
                            {/* Subtle gradient overlay — matching reference ::after */}
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background:
                                        'linear-gradient(rgba(255,255,255,0) 25%, rgba(255,227,239,0.2) 75%, rgba(215,227,239,0.3) 100%)',
                                }}
                            />

                            {/* Card content */}
                            <div className="relative z-10 flex flex-col items-center justify-center h-full px-5 py-6">
                                {/* Label */}
                                <p
                                    style={{
                                        fontFamily: 'var(--font-formal)',
                                        fontSize: '13px',
                                        color: 'rgba(255,255,255,0.88)',
                                        letterSpacing: '0.28em',
                                        textTransform: 'uppercase',
                                        fontWeight: 400,
                                    }}
                                >
                                    Thiệp mời cưới
                                </p>

                                {/* Decorative line */}
                                <div
                                    style={{
                                        width: '60px',
                                        height: '1px',
                                        background:
                                            'linear-gradient(90deg, transparent, rgba(200,185,154,0.8), transparent)',
                                        margin: '10px 0 14px',
                                    }}
                                />

                                {/* Couple names */}
                                <p
                                    style={{
                                        fontFamily: 'var(--font-envelope-guest)',
                                        fontSize: '33px',
                                        color: '#FFFFFF',
                                        textShadow: '0 2px 16px rgba(0,0,0,0.3)',
                                        lineHeight: 1.15,
                                        textAlign: 'center',
                                        fontWeight: 700,
                                    }}
                                >
                                    {weddingConfig.couple.groom.name} &{' '}
                                    {weddingConfig.couple.bride.name}
                                </p>

                                {/* Date */}
                                <p
                                    style={{
                                        fontFamily: 'var(--font-primary)',
                                        fontSize: '14px',
                                        color: 'rgba(255,255,255,0.93)',
                                        fontWeight: 400,
                                        marginTop: '6px',
                                        letterSpacing: '0.15em',
                                    }}
                                >
                                    05.04.2026
                                </p>

                                {/* Invitation text */}
                                <p
                                    style={{
                                        fontFamily: 'var(--font-formal)',
                                        fontSize: '15px',
                                        color: 'rgba(255,255,255,0.82)',
                                        marginTop: '14px',
                                    }}
                                >
                                    Trân trọng mời Bạn + Nt
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Pocket — z:3 (full-height element)
              Ref: .front.pocket { z-index: 3 }
              border-top: transparent (V-opening), border-bottom: solid (bottom panel),
              border-left/right: solid (side panels).
              Together with flap, completely covers the card (z:1-2) when closed. */}
                    <div
                        className="absolute top-0 left-0"
                        style={{
                            zIndex: 3,
                            width: 0,
                            height: 0,
                            borderTop: `${ENV_H - POCKET_H}px solid transparent`,
                            borderBottom: `${POCKET_H}px solid #4A6240`,
                            borderLeft: `${ENV_W / 2}px solid #465C3D`,
                            borderRight: `${ENV_W / 2}px solid #465C3D`,
                            borderBottomLeftRadius: '6px',
                            borderBottomRightRadius: '6px',
                        }}
                    />

                    {/* Top flap — z:5 (full-height element)
              Ref: .front.flap { z-index: 5 closed, 1 open }
              border-top: solid (visible triangle), border-bottom: transparent (for full height),
              border-left/right: transparent.
              Open: rotateX(180deg) 1.2s, Close: 0.8s with 0.8s delay */}
                    <div
                        className="absolute top-0 left-0 mt-0.5"
                        data-testid="envelope-flap"
                        style={{
                            zIndex: isClosed || isClosingFlap ? 5 : 1,
                            width: 0,
                            height: 0,
                            borderTop: `${FLAP_H}px solid #3C4E34`,
                            borderBottom: `${ENV_H - FLAP_H}px solid transparent`,
                            borderLeft: `${ENV_W / 2}px solid transparent`,
                            borderRight: `${ENV_W / 2}px solid transparent`,
                            transformOrigin: 'center top',
                            transform: flapOpen ? 'rotateX(180deg)' : 'rotateX(0deg)',
                            transition: isClosingFlap
                                ? 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), z-index 0s'
                                : 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), z-index 1.2s',
                        }}
                    />

                    {/* Wax seal — z:10
              Ref: always visible, centered at ~40% height, no animation */}
                    <div
                        className="absolute flex items-center justify-center"
                        style={{
                            zIndex: 10,
                            width: '54px',
                            height: '54px',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.3))',
                        }}
                    >
                        <img
                            src={waxSeal}
                            alt="Wax seal"
                            className="w-full h-full object-contain"
                            style={{ borderRadius: '50%' }}
                        />
                    </div>

                    {/* ── Heart particle burst — z:7
                 15 SVG hearts burst radially from wax seal on open.
                 Each heart has randomized: size, color, angle, distance, delay, drift.
                 Two-phase animation: burst outward → float up & fade. ── */}
                    {showHearts && <HeartBurst key={heartsKey} />}
                </div>
            </div>

            {/* ── Touch prompt ── */}
            <div
                className="flex items-center justify-center gap-3 relative z-10"
                style={{
                    marginTop: '28px',
                    transition: 'margin-top 600ms ease',
                }}
            >
                <div
                    style={{
                        width: '50px',
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, #C8B99A)',
                    }}
                />
                <p
                    className="cursor-pointer select-none"
                    onClick={handleClick}
                    style={{
                        fontFamily: 'var(--font-envelope-prompt)',
                        fontSize: '18px',
                        color: '#4A5D3A',
                        opacity: isClosed ? 1 : isOpen ? 0.7 : 0.35,
                        transition: 'opacity 500ms ease',
                    }}
                >
                    {isClosed ? 'Chạm để mở thiệp' : isOpen || isClosingCard ? 'Chạm để đóng thiệp' : ''}
                </p>
                <div
                    style={{
                        width: '50px',
                        height: '1px',
                        background: 'linear-gradient(90deg, #C8B99A, transparent)',
                    }}
                />
            </div>

            <style>{`
        /* ── Envelope idle float (ref: translateY 0 → -20px, 3s) ── */
        @keyframes envelopeFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        /* ── Shadow scale in sync with float ── */
        @keyframes shadowScale {
          0%, 100% { transform: translateX(-50%) scaleX(1); }
          50% { transform: translateX(-50%) scaleX(0.85); }
        }

        /* ── Heart burst: radial explosion then float upward & fade ──
           Custom properties per heart (set inline by JS):
             --hx, --hy: burst target position (pre-computed from angle+distance)
             --h-drift: upward float after burst
             --h-sway: horizontal sway after burst
             --h-rot: end rotation
             --h-dur: total animation duration
             --h-delay: stagger delay
        */
        @keyframes heartBurst {
          0% {
            transform: translate(0px, 0px) scale(0) rotate(0deg);
            opacity: 0;
          }
          18% {
            transform: translate(
              calc(var(--hx) * 0.65),
              calc(var(--hy) * 0.65)
            ) scale(1.3) rotate(calc(var(--h-rot) * 0.4));
            opacity: 1;
          }
          38% {
            transform: translate(var(--hx), var(--hy)) scale(1) rotate(var(--h-rot));
            opacity: 0.92;
          }
          100% {
            transform: translate(
              calc(var(--hx) + var(--h-sway)),
              calc(var(--hy) - var(--h-drift))
            ) scale(0.45) rotate(calc(var(--h-rot) * 1.8));
            opacity: 0;
          }
        }
      `}</style>
        </section>
    )
}
