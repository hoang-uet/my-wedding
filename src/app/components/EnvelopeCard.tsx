import { useState, useCallback, useRef } from 'react'
import { weddingConfig, weddingImages } from './wedding-config'
import waxSeal from 'figma:asset/91e40b66f6d8b6ed8c595451dfa5272f0f98667d.png'
import orchidBouquet from 'figma:asset/2ac02946802c8fa703bc243b25ace4cd4e75e9f9.png'
import orchidSingle from 'figma:asset/0bee3b951be34c869dc95c68ee90702159a7a88b.png'

/**
 * Envelope + invitation card with 4 states:
 *   closed → opening → open → closing → closed
 *
 * Z-index layers (inside envelope):
 *   0: body   1: side flaps   3: card   4: pocket   5: top flap   6: seal
 *
 * The card starts inside the envelope (opacity 0, covered by pocket z:4).
 * On open, it slides UP so ~70% of the card is ABOVE the envelope top,
 * while the bottom ~30% overlaps behind the pocket — matching the reference.
 */
type EnvelopeState = 'closed' | 'opening' | 'open' | 'closing'

const ENV_W = 310
const ENV_H = 215
const FLAP_H = 108
const POCKET_H = 105
const CARD_H = 230
const CARD_RISE = 195 // card rises this much when open

export function EnvelopeCard() {
    const [state, setState] = useState<EnvelopeState>('closed')
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const handleClick = useCallback(() => {
        if (state === 'opening' || state === 'closing') return
        if (timerRef.current) clearTimeout(timerRef.current)

        if (state === 'closed') {
            setState('opening')
            timerRef.current = setTimeout(() => setState('open'), 900)
        } else {
            setState('closing')
            timerRef.current = setTimeout(() => setState('closed'), 1000)
        }
    }, [state])

    const isClosed = state === 'closed'
    const isOpening = state === 'opening'
    const isOpen = state === 'open'
    const isClosing = state === 'closing'
    const flapOpen = isOpening || isOpen
    const sealVisible = isClosed || isClosing

    const cardY = isOpen ? -CARD_RISE : isOpening ? -CARD_RISE * 0.35 : 0
    const cardOpacity = isOpen ? 1 : isOpening ? 0.85 : isClosing ? 0.6 : 0

    // Wrapper grows to accommodate the card rising above
    const wrapperH = isOpen || isOpening ? ENV_H + CARD_RISE + 10 : ENV_H

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
                    fontFamily: "'Monsieur La Doulaise', cursive",
                    fontSize: '52px',
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
                    transition: isClosing
                        ? 'height 600ms cubic-bezier(0.4, 0, 0.2, 1)'
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
                        perspective: '1200px',
                        animation: isClosed ? 'envelopeWobble 3s ease-in-out infinite' : 'none',
                    }}
                    onClick={handleClick}
                >
                    {/* Body background — z:0 */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                'linear-gradient(160deg, #4E6B3C 0%, #3C5230 40%, #354A2A 100%)',
                            borderRadius: '5px',
                            boxShadow: isClosed
                                ? '0 10px 35px rgba(50,70,40,0.35)'
                                : '0 6px 24px rgba(50,70,40,0.25)',
                            transition: 'box-shadow 500ms ease',
                        }}
                    />

                    {/* Left side flap — z:1 */}
                    <div
                        className="absolute top-0 left-0"
                        style={{
                            zIndex: 1,
                            width: 0,
                            height: 0,
                            borderTop: `${FLAP_H}px solid transparent`,
                            borderBottom: `${ENV_H - FLAP_H}px solid transparent`,
                            borderLeft: `${ENV_W / 2}px solid #445E34`,
                        }}
                    />

                    {/* Right side flap — z:1 */}
                    <div
                        className="absolute top-0 right-0"
                        style={{
                            zIndex: 1,
                            width: 0,
                            height: 0,
                            borderTop: `${FLAP_H}px solid transparent`,
                            borderBottom: `${ENV_H - FLAP_H}px solid transparent`,
                            borderRight: `${ENV_W / 2}px solid #445E34`,
                        }}
                    />

                    {/* ───────────────────────────────────
              INVITATION CARD — z:3
              Between side flaps (z:1) and pocket (z:4).
              Pocket covers the card bottom → "inside envelope" look.
              ─────────────────────────────────── */}
                    <div
                        className="absolute"
                        style={{
                            zIndex: 3,
                            left: '8%',
                            right: '8%',
                            height: `${CARD_H}px`,
                            bottom: '12px',
                            transform: `translateY(${cardY}px)`,
                            transition: isClosing
                                ? 'transform 600ms cubic-bezier(0.4, 0, 0.2, 1), opacity 500ms ease'
                                : 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1), opacity 600ms ease 100ms',
                            opacity: cardOpacity,
                            pointerEvents: isOpen ? 'auto' : 'none',
                        }}
                    >
                        <div
                            className="w-full h-full rounded-lg overflow-hidden relative"
                            style={{
                                boxShadow: isOpen
                                    ? '0 12px 40px rgba(0,0,0,0.22), 0 4px 12px rgba(0,0,0,0.1)'
                                    : '0 2px 8px rgba(0,0,0,0.06)',
                                transition: 'box-shadow 700ms ease',
                            }}
                        >
                            {/* Background photo */}
                            <img
                                src={weddingImages.thankYou}
                                alt="Wedding"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            {/* Dark overlay */}
                            <div
                                className="absolute inset-0"
                                style={{
                                    background:
                                        'linear-gradient(180deg, rgba(38,48,32,0.32) 0%, rgba(38,48,32,0.52) 100%)',
                                }}
                            />

                            {/* Card content */}
                            <div className="relative z-10 flex flex-col items-center justify-center h-full px-5 py-6">
                                {/* Label */}
                                <p
                                    style={{
                                        fontFamily: "'Cormorant Garamond', serif",
                                        fontSize: '13px',
                                        color: 'rgba(255,255,255,0.88)',
                                        letterSpacing: '0.28em',
                                        textTransform: 'uppercase',
                                        fontWeight: 600,
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
                                        fontFamily: "'Monsieur La Doulaise', cursive",
                                        fontSize: '36px',
                                        color: '#FFFFFF',
                                        textShadow: '0 2px 16px rgba(0,0,0,0.3)',
                                        lineHeight: 1.15,
                                        textAlign: 'center',
                                    }}
                                >
                                    {weddingConfig.couple.groom.name} &{' '}
                                    {weddingConfig.couple.bride.name}
                                </p>

                                {/* Date */}
                                <p
                                    style={{
                                        fontFamily: "'Cormorant Garamond', serif",
                                        fontSize: '18px',
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
                                        fontFamily: "'Monsieur La Doulaise', cursive",
                                        fontSize: '21px',
                                        color: 'rgba(255,255,255,0.82)',
                                        marginTop: '14px',
                                    }}
                                >
                                    Trân trọng mời Bạn + Nt
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom pocket flap — z:4
              Covers card bottom to create "inside envelope" illusion */}
                    <div className="absolute bottom-0 left-0 right-0" style={{ zIndex: 4 }}>
                        <div
                            style={{
                                width: 0,
                                height: 0,
                                borderLeft: `${ENV_W / 2}px solid #4E6B3C`,
                                borderRight: `${ENV_W / 2}px solid #4E6B3C`,
                                borderTop: `${POCKET_H}px solid #527040`,
                            }}
                        />
                    </div>

                    {/* Top flap — z:5 */}
                    <div
                        className="absolute top-0 left-0 right-0"
                        style={{
                            zIndex: 5,
                            height: `${FLAP_H}px`,
                            transformOrigin: 'top center',
                            transform: flapOpen ? 'rotateX(-180deg)' : 'rotateX(0deg)',
                            transition: isClosing
                                ? 'transform 600ms cubic-bezier(0.4, 0, 0.2, 1) 350ms'
                                : 'transform 700ms cubic-bezier(0.4, 0, 0.2, 1)',
                            transformStyle: 'preserve-3d',
                        }}
                    >
                        {/* Front */}
                        <div
                            style={{
                                position: 'absolute',
                                width: 0,
                                height: 0,
                                borderLeft: `${ENV_W / 2}px solid transparent`,
                                borderRight: `${ENV_W / 2}px solid transparent`,
                                borderTop: `${FLAP_H}px solid #3C5230`,
                                backfaceVisibility: 'hidden',
                            }}
                        />
                        {/* Back (visible when flipped) */}
                        <div
                            style={{
                                position: 'absolute',
                                width: 0,
                                height: 0,
                                borderLeft: `${ENV_W / 2}px solid transparent`,
                                borderRight: `${ENV_W / 2}px solid transparent`,
                                borderTop: `${FLAP_H}px solid #2E4023`,
                                transform: 'rotateX(180deg)',
                                backfaceVisibility: 'hidden',
                            }}
                        />
                    </div>

                    {/* Wax seal — z:6 */}
                    <div
                        className="absolute flex items-center justify-center"
                        style={{
                            zIndex: 6,
                            width: '54px',
                            height: '54px',
                            top: '50%',
                            left: '50%',
                            transform: sealVisible
                                ? 'translate(-50%, -50%) scale(1) rotate(0deg)'
                                : 'translate(-50%, -50%) scale(0) rotate(90deg)',
                            transition: isClosing
                                ? 'transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1) 700ms, opacity 300ms ease 700ms'
                                : 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms ease',
                            opacity: sealVisible ? 1 : 0,
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
                        fontFamily: "'Monsieur La Doulaise', cursive",
                        fontSize: '26px',
                        color: '#4A5D3A',
                        opacity: isClosed ? 1 : isOpen ? 0.7 : 0.35,
                        transition: 'opacity 500ms ease',
                    }}
                >
                    {isClosed ? 'Chạm để mở thiệp' : isOpen ? 'Chạm để đóng thiệp' : ''}
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
        @keyframes envelopeWobble {
          0%, 100% { transform: rotate(0deg); }
          15% { transform: rotate(-1.5deg); }
          30% { transform: rotate(1.5deg); }
          45% { transform: rotate(-1deg); }
          55% { transform: rotate(0.5deg); }
          65% { transform: rotate(0deg); }
        }
      `}</style>
        </section>
    )
}
