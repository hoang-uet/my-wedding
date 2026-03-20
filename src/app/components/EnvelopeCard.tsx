import { useState, useCallback, useRef } from 'react'
import { weddingConfig, weddingImages } from './wedding-config'
import { WeddingImage } from './WeddingImage'
import waxSeal from '@/assets/wax-seal.png'
import orchidBouquet from '@/assets/orchid-bouquet.png'
import orchidSingle from '@/assets/orchid-single.png'

/**
 * Envelope + invitation card with 4 states:
 *   closed → opening → open → closing → closed
 *
 * Z-index layers (inside envelope):
 *   0: body   1: side flaps   1-2: card (1 closed/closing, 2 open)   3: pocket   1-5: flap (5 closed/closing, 1 open)   10: seal   7: hearts
 *
 * Animation timings matched exactly to cinelove.me/template/pc/thiep-cuoi-48:
 *   - Idle: float up/down 20px (3s ease-in-out infinite)
 *   - Shadow: oval beneath, scaleX pulses in sync with float
 *   - Flap open: 1.2s, close: 0.8s with 0.8s delay
 *   - Card rise: 1s with 0.5s delay, close: 0.6s with 0.2s delay
 *   - Hearts: 3 hearts with CSS shape, float/sway/scale animations
 */
type EnvelopeState = 'closed' | 'opening' | 'open' | 'closing'

const ENV_W = 310
const ENV_H = 215
const FLAP_H = 108
const POCKET_H = 105
// Reference: original letter rise = 94.47px for 298px wide → proportional for 310px = ~98px
const CARD_RISE = 98

interface EnvelopeCardProps {
    /** Called when user taps the envelope to open (first click). Use to trigger music. */
    onOpen?: () => void
}

export function EnvelopeCard({ onOpen }: EnvelopeCardProps) {
    const [state, setState] = useState<EnvelopeState>('closed')
    const [heartsKey, setHeartsKey] = useState(0)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const handleClick = useCallback(() => {
        if (state === 'opening' || state === 'closing') return
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
            setState('closing')
            // 0.8s delay + 0.8s flap = 1.6s total
            timerRef.current = setTimeout(() => setState('closed'), 1600)
        }
    }, [state, onOpen])

    const isClosed = state === 'closed'
    const isOpening = state === 'opening'
    const isOpen = state === 'open'
    const isClosing = state === 'closing'
    const flapOpen = isOpening || isOpen
    const showHearts = isOpen

    // Card position: CSS transition handles the smooth animation
    const cardY = (isOpen || isOpening) ? -CARD_RISE : 0

    // Wrapper grows to accommodate the card rising above.
    // During closing, keep expanded briefly so layout doesn't jump while card descends.
    const wrapperH = isOpen || isOpening || isClosing ? ENV_H + CARD_RISE + 10 : ENV_H

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
                    fontFamily: "var(--font-script-hero)",
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
                    transition: isClosing
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
                            zIndex: (isOpen || isOpening) ? 2 : 1,
                            left: '5%',
                            right: '5%',
                            top: '5%',
                            bottom: '5%',
                            transform: `translateY(${cardY}px)`,
                            transition: isClosing
                                ? 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s, z-index 0.2s'
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
                                        fontFamily: "var(--font-formal)",
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
                                        fontFamily: "var(--font-envelope-guest)",
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
                                        fontFamily: "var(--font-primary)",
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
                                        fontFamily: "var(--font-formal)",
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
                        className="absolute top-0 left-0"
                        data-testid="envelope-flap"
                        style={{
                            zIndex: (isClosed || isClosing) ? 5 : 1,
                            width: 0,
                            height: 0,
                            borderTop: `${FLAP_H}px solid #3C4E34`,
                            borderBottom: `${ENV_H - FLAP_H}px solid transparent`,
                            borderLeft: `${ENV_W / 2}px solid transparent`,
                            borderRight: `${ENV_W / 2}px solid transparent`,
                            transformOrigin: 'center top',
                            transform: flapOpen ? 'rotateX(180deg)' : 'rotateX(0deg)',
                            transition: isClosing
                                ? 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s, z-index 0.8s'
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

                    {/* ── Floating hearts — z:7
                Ref: cinelove.me/template/pc/thiep-cuoi-48
                3 hearts with CSS ::before/::after shape
                a1: left 20%, scale 0.6, float 4s delay 1.2s, sway 2s x4 alternate
                a2: left 55%, scale 1.0, float 5s delay 1.4s, sway 4s x2 alternate
                a3: left 10%, scale 0.8, float 7s delay 1.6s, sway 2s x6 alternate
                ── */}
                    {showHearts && (
                        <div
                            key={heartsKey}
                            className="pointer-events-none"
                            style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: `${FLAP_H * 0.89}px`,
                                overflow: 'visible',
                                zIndex: 7,
                            }}
                            data-testid="hearts-container"
                        >
                            {/* Heart 1 — small, left side */}
                            <div
                                className="heart-wrap"
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: '20%',
                                    animation:
                                        'heartFloat 4s cubic-bezier(0.25,0.46,0.45,0.94) 1.2s 1 forwards, sideSway 2s ease-in-out 4 alternate, heartScaleWrap 0.5s cubic-bezier(0.68,-0.55,0.265,1.55) 1 both',
                                }}
                                data-testid="heart-1"
                            >
                                <div className="heart-shape" style={{ '--heart-scale': '0.6' } as React.CSSProperties} />
                            </div>

                            {/* Heart 2 — full size, center */}
                            <div
                                className="heart-wrap"
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: '55%',
                                    animation:
                                        'heartFloat 5s cubic-bezier(0.25,0.46,0.45,0.94) 1.4s 1 forwards, sideSway 4s ease-in-out 2 alternate, heartScaleWrap 0.5s cubic-bezier(0.68,-0.55,0.265,1.55) 1 both',
                                }}
                                data-testid="heart-2"
                            >
                                <div className="heart-shape" style={{ '--heart-scale': '1' } as React.CSSProperties} />
                            </div>

                            {/* Heart 3 — medium, far left */}
                            <div
                                className="heart-wrap"
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: '10%',
                                    animation:
                                        'heartFloat 7s cubic-bezier(0.25,0.46,0.45,0.94) 1.6s 1 forwards, sideSway 2s ease-in-out 6 alternate, heartScaleWrap 0.5s cubic-bezier(0.68,-0.55,0.265,1.55) 1 both',
                                }}
                                data-testid="heart-3"
                            >
                                <div className="heart-shape" style={{ '--heart-scale': '0.8' } as React.CSSProperties} />
                            </div>
                        </div>
                    )}
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
                        fontFamily: "var(--font-envelope-prompt)",
                        fontSize: '18px',
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

        /* ── Heart CSS shape (ref: ::before/::after with border-radius) ── */
        .heart-shape {
          position: absolute;
          bottom: 0;
          width: 28px;
          height: 45px;
          transform: scale(var(--heart-scale, 1));
        }
        .heart-shape::before,
        .heart-shape::after {
          position: absolute;
          content: '';
          left: 14px;
          top: 0;
          width: 14px;
          height: 22.5px;
          background-color: #d00000;
          border-radius: 14px 14px 0 0;
          transform: rotate(-45deg);
          transform-origin: 0 100%;
        }
        .heart-shape::after {
          left: 0;
          transform: rotate(45deg);
          transform-origin: 100% 100%;
        }

        /* ── Heart scale animation (ref: 0→1.2→var, bounce easing) ── */
        @keyframes heartScaleWrap {
          0%   { transform: scale(0); opacity: 0; }
          50%  { transform: scale(1.2); opacity: 0.8; }
          100% { transform: scale(var(--heart-scale, 1)); opacity: 1; }
        }

        /* ── Heart float upward (ref: top 0→-600px, multi-step opacity) ── */
        @keyframes heartFloat {
          0%   { top: 0; opacity: 1; }
          50%  { opacity: 0.8; }
          80%  { opacity: 0.3; }
          100% { top: -600px; opacity: 0; visibility: hidden; }
        }

        /* ── Heart sway (ref: margin-left 0→25→50, alternate) ── */
        @keyframes sideSway {
          0%   { margin-left: 0; }
          50%  { margin-left: 25px; }
          100% { margin-left: 50px; }
        }
      `}</style>
        </section>
    )
}
