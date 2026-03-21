import { useState, useEffect, useRef } from 'react'
import { useScrollAnimation } from './useScrollAnimation'
import { VineFrame } from './FloralOverlay'

const weddingDate = new Date('2026-04-05T13:15:00+07:00')

/* ═══════════════════════════════════════════════════════════════
   FLIP DIGIT — Single two-digit flip card with 3D animation
   ═══════════════════════════════════════════════════════════════ */

const CARD_W = 72
const CARD_H = 82
const FONT_SIZE = 36
const FLIP_DURATION = 500 // ms

// Olive palette for card faces
const COLOR = {
    cardTop: '#4E6440',
    cardBottom: '#435838',
    cardTopHighlight: 'rgba(255,255,255,0.06)',
    divider: 'rgba(0,0,0,0.25)',
    text: '#F2EDE4',
    shadow: '0 6px 18px rgba(30,40,20,0.45), 0 2px 6px rgba(0,0,0,0.2)',
    innerShadowTop: 'inset 0 -1px 2px rgba(0,0,0,0.12)',
    innerShadowBottom: 'inset 0 1px 3px rgba(0,0,0,0.18)',
} as const

const digitStyle: React.CSSProperties = {
    fontFamily: 'var(--font-primary)',
    fontSize: FONT_SIZE,
    fontWeight: 700,
    color: COLOR.text,
    lineHeight: `${CARD_H}px`,
    textAlign: 'center',
    letterSpacing: '0.04em',
    display: 'block',
    width: '100%',
    userSelect: 'none',
}

function FlipUnit({ value, label }: { value: number; label: string }) {
    const prevRef = useRef(value)
    const [displayValue, setDisplayValue] = useState(value)
    const [flipping, setFlipping] = useState(false)
    const flipKeyRef = useRef(0)

    useEffect(() => {
        if (value !== prevRef.current) {
            // Start flip
            setFlipping(true)
            flipKeyRef.current += 1

            const timer = setTimeout(() => {
                setDisplayValue(value)
                setFlipping(false)
                prevRef.current = value
            }, FLIP_DURATION)

            return () => clearTimeout(timer)
        }
    }, [value])

    const newStr = String(value).padStart(2, '0')
    const oldStr = String(displayValue).padStart(2, '0')
    const flipKey = flipKeyRef.current

    return (
        <div className="flex flex-col items-center">
            {/* Card container */}
            <div
                style={{
                    position: 'relative',
                    width: CARD_W,
                    height: CARD_H,
                    perspective: '400px',
                    perspectiveOrigin: '50% 50%',
                    borderRadius: '8px',
                    boxShadow: COLOR.shadow,
                }}
            >
                {/* ── UPPER STATIC HALF ── shows NEW value immediately */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '50%',
                        overflow: 'hidden',
                        background: `linear-gradient(180deg, ${COLOR.cardTop} 0%, ${COLOR.cardTop} 100%)`,
                        borderRadius: '8px 8px 0 0',
                        zIndex: 1,
                        boxShadow: COLOR.innerShadowTop,
                    }}
                >
                    {/* Subtle top highlight for 3D feel */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '40%',
                            background:
                                'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)',
                            borderRadius: '8px 8px 0 0',
                            pointerEvents: 'none',
                        }}
                    />
                    <span style={digitStyle}>{flipping ? newStr : oldStr}</span>
                </div>

                {/* ── LOWER STATIC HALF ── shows OLD value (updates after flip) */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '50%',
                        overflow: 'hidden',
                        background: COLOR.cardBottom,
                        borderRadius: '0 0 8px 8px',
                        zIndex: 1,
                        boxShadow: COLOR.innerShadowBottom,
                    }}
                >
                    <span
                        style={{
                            ...digitStyle,
                            transform: 'translateY(-50%)',
                        }}
                    >
                        {oldStr}
                    </span>
                </div>

                {/* ── CENTER DIVIDER LINE ── crisp split between halves */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        width: '100%',
                        height: '1.5px',
                        background: COLOR.divider,
                        zIndex: 10,
                        transform: 'translateY(-0.75px)',
                    }}
                />
                {/* Small notches on the sides for mechanical feel */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: -1,
                        width: 4,
                        height: 6,
                        background: 'rgba(0,0,0,0.15)',
                        borderRadius: '0 2px 2px 0',
                        transform: 'translateY(-50%)',
                        zIndex: 11,
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        right: -1,
                        width: 4,
                        height: 6,
                        background: 'rgba(0,0,0,0.15)',
                        borderRadius: '2px 0 0 2px',
                        transform: 'translateY(-50%)',
                        zIndex: 11,
                    }}
                />

                {/* ── ANIMATED TOP FLAP ── old value, flips down to reveal new */}
                {flipping && (
                    <div
                        key={`flap-top-${flipKey}`}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '50%',
                            overflow: 'hidden',
                            background: `linear-gradient(180deg, ${COLOR.cardTop} 0%, ${COLOR.cardTop} 100%)`,
                            borderRadius: '8px 8px 0 0',
                            zIndex: 4,
                            transformOrigin: 'bottom center',
                            animation: `flipDown ${FLIP_DURATION / 2}ms cubic-bezier(0.33, 0, 0.67, 1) forwards`,
                            backfaceVisibility: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '40%',
                                background:
                                    'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)',
                                borderRadius: '8px 8px 0 0',
                                pointerEvents: 'none',
                            }}
                        />
                        <span style={digitStyle}>{oldStr}</span>
                    </div>
                )}

                {/* ── ANIMATED BOTTOM FLAP ── new value, flips into view */}
                {flipping && (
                    <div
                        key={`flap-bot-${flipKey}`}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            height: '50%',
                            overflow: 'hidden',
                            background: COLOR.cardBottom,
                            borderRadius: '0 0 8px 8px',
                            zIndex: 3,
                            transformOrigin: 'top center',
                            animation: `flipUp ${FLIP_DURATION / 2}ms cubic-bezier(0.33, 1, 0.67, 1) ${FLIP_DURATION / 2}ms forwards`,
                            transform: 'rotateX(90deg)',
                            backfaceVisibility: 'hidden',
                            boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
                        }}
                    >
                        <span
                            style={{
                                ...digitStyle,
                                transform: 'translateY(-50%)',
                            }}
                        >
                            {newStr}
                        </span>
                    </div>
                )}
            </div>

            {/* Label */}
            <p
                style={{
                    fontFamily: 'var(--font-primary)',
                    fontSize: '10px',
                    color: 'rgba(60,78,48,0.6)',
                    letterSpacing: '0.18em',
                    marginTop: '10px',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                }}
            >
                {label}
            </p>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════
   COLON SEPARATOR — Pulsing dots between units
   ═══════════════════════════════════════════════════════════════ */

function ColonSeparator() {
    return (
        <div
            className="flex flex-col items-center justify-center gap-2.5"
            style={{
                height: CARD_H,
                paddingBottom: '20px', // offset for label space
            }}
        >
            <div
                style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: 'rgba(60,78,48,0.3)',
                    animation: 'colonPulse 2s ease-in-out infinite',
                }}
            />
            <div
                style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: 'rgba(60,78,48,0.3)',
                    animation: 'colonPulse 2s ease-in-out infinite',
                    animationDelay: '0.15s',
                }}
            />
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════
   COUNTDOWN — Main section component
   ═══════════════════════════════════════════════════════════════ */

export function Countdown() {
    const ref = useScrollAnimation()
    const [timeLeft, setTimeLeft] = useState(getTimeLeft(weddingDate))

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getTimeLeft(weddingDate))
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const isPast = timeLeft.total <= 0

    return (
        <section
            ref={ref}
            style={{
                padding: '56px 16px 48px',
                position: 'relative',
                overflow: 'hidden',
                zIndex: 1,
            }}
        >
            {/* Vine corner accents — green strokes work on cream bg */}
            <div style={{ opacity: 0.4 }}>
                <VineFrame position="top-left" delay={200} />
                <VineFrame position="bottom-right" delay={400} />
            </div>

            {/* Title — script font */}
            <h2
                className="text-center mb-2 relative z-10"
                style={{
                    fontFamily: 'var(--font-script-elegant), var(--font-calligraphy-vn)',
                    fontSize: '48px',
                    color: '#3C4E30',
                    fontWeight: 400,
                }}
            >
                Countdown
            </h2>

            {/* Subtitle */}
            <p
                className="text-center mb-1 relative z-10"
                style={{
                    fontFamily: 'var(--font-primary)',
                    fontSize: '11px',
                    color: 'rgba(60,78,48,0.5)',
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                }}
            >
                until our special day
            </p>

            {/* Ornamental line */}
            <div className="flex justify-center mb-8 relative z-10">
                <div
                    style={{
                        width: '60px',
                        height: '1px',
                        marginTop: '12px',
                        background:
                            'linear-gradient(90deg, transparent, rgba(60,78,48,0.2), transparent)',
                    }}
                />
            </div>

            {isPast ? (
                <p
                    className="text-center relative z-10"
                    style={{
                        fontFamily: 'var(--font-primary)',
                        fontSize: '22px',
                        color: '#3C4E30',
                        fontStyle: 'italic',
                    }}
                >
                    Hôm nay là ngày trọng đại!
                </p>
            ) : (
                <div
                    className="flex items-start justify-center relative z-10"
                    style={{ gap: '6px' }}
                >
                    <FlipUnit value={timeLeft.days} label="Ngày" />
                    <ColonSeparator />
                    <FlipUnit value={timeLeft.hours} label="Giờ" />
                    <ColonSeparator />
                    <FlipUnit value={timeLeft.minutes} label="Phút" />
                    <ColonSeparator />
                    <FlipUnit value={timeLeft.seconds} label="Giây" />
                </div>
            )}

            {/* Flip animation keyframes */}
            <style>{`
                @keyframes flipDown {
                    0% {
                        transform: rotateX(0deg);
                    }
                    100% {
                        transform: rotateX(-90deg);
                    }
                }
                @keyframes flipUp {
                    0% {
                        transform: rotateX(90deg);
                    }
                    100% {
                        transform: rotateX(0deg);
                    }
                }
                @keyframes colonPulse {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.6; }
                }
            `}</style>
        </section>
    )
}

function getTimeLeft(target: Date) {
    const now = new Date()
    const total = target.getTime() - now.getTime()

    if (total <= 0) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }

    return {
        total,
        days: Math.floor(total / (1000 * 60 * 60 * 24)),
        hours: Math.floor((total / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((total / (1000 * 60)) % 60),
        seconds: Math.floor((total / 1000) % 60),
    }
}
