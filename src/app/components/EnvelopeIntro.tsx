import { useState, useEffect, useCallback } from 'react'
import { weddingImages, weddingConfig } from './wedding-config'
import { WeddingImage } from './WeddingImage'

interface EnvelopeIntroProps {
    onOpen: () => void
}

export function EnvelopeIntro({ onOpen }: EnvelopeIntroProps) {
    const [state, setState] = useState<'closed' | 'opening' | 'letter' | 'exiting' | 'done'>(
        'closed',
    )

    const triggerOpen = useCallback(() => {
        if (state !== 'closed') return
        setState('opening')
        setTimeout(() => setState('letter'), 600)
        setTimeout(() => setState('exiting'), 2200)
        setTimeout(() => {
            setState('done')
            onOpen()
        }, 3000)
    }, [state, onOpen])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (state === 'closed') triggerOpen()
        }, 6000)
        return () => clearTimeout(timer)
    }, [state, triggerOpen])

    if (state === 'done') return null

    return (
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center"
            style={{
                background: 'linear-gradient(180deg, #F5F0E8 0%, #EDE8DD 100%)',
                transition: 'opacity 0.8s ease, transform 0.8s ease',
                opacity: state === 'exiting' ? 0 : 1,
                transform: state === 'exiting' ? 'scale(1.05)' : 'scale(1)',
            }}
            onClick={triggerOpen}
        >
            {/* Subtle paper texture */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    opacity: 0.03,
                    background:
                        'repeating-conic-gradient(#8B7355 0% 25%, transparent 0% 50%) 0 0 / 3px 3px',
                }}
            />

            {/* Top-left floral */}
            <div className="absolute top-0 left-0" style={{ opacity: 0.6 }}>
                <FloralCornerSVG />
            </div>
            {/* Top-right floral */}
            <div
                className="absolute top-0 right-0"
                style={{ opacity: 0.6, transform: 'scaleX(-1)' }}
            >
                <FloralCornerSVG />
            </div>
            {/* Bottom-right floral */}
            <div
                className="absolute bottom-0 right-0"
                style={{ opacity: 0.5, transform: 'rotate(180deg)' }}
            >
                <FloralCornerSVG />
            </div>

            <div className="flex flex-col items-center gap-5 px-6 z-10">
                {/* Save our date */}
                <h1
                    style={{
                        fontFamily: "var(--font-script-elegant)",
                        fontSize: '54px',
                        color: '#4A5D3A',
                        animation: 'envelopeFadeSlide 1s ease-out',
                        letterSpacing: '0.02em',
                    }}
                >
                    Save our date
                </h1>

                {/* Thin ornamental line */}
                <div
                    style={{
                        width: '80px',
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, #9BAF88, transparent)',
                    }}
                />

                {/* Envelope */}
                <div
                    className="relative cursor-pointer"
                    style={{
                        width: '280px',
                        height: '200px',
                        perspective: '1200px',
                        animation: 'envelopeScaleIn 0.6s ease-out 0.3s both',
                    }}
                >
                    {/* Envelope body */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                'linear-gradient(135deg, #5A7247 0%, #4A5D3A 50%, #3C4E30 100%)',
                            borderRadius: '4px',
                            boxShadow: '0 8px 32px rgba(58,74,48,0.3)',
                        }}
                    />

                    {/* Letter sliding up */}
                    <div
                        className="absolute left-[8%] right-[8%] bottom-[12%] rounded overflow-hidden"
                        style={{
                            height: '150px',
                            background: 'white',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                            transition:
                                'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease-out',
                            transform:
                                state === 'letter' || state === 'exiting'
                                    ? 'translateY(-70px)'
                                    : 'translateY(0)',
                            opacity: state === 'letter' || state === 'exiting' ? 1 : 0.2,
                            zIndex: 2,
                        }}
                    >
                        <div className="p-3 text-center flex flex-col items-center gap-1">
                            <WeddingImage
                                image={weddingImages.heroCouple}
                                alt="Ảnh cưới đôi uyên ương"
                                sizes="240px"
                                loading="eager"
                                className="w-full rounded-sm mb-1"
                                style={{ height: '60px', opacity: 0.85, aspectRatio: 'unset' }}
                            />
                            <p
                                style={{
                                    fontFamily: "var(--font-primary)",
                                    fontSize: '10px',
                                    color: '#8B7355',
                                    fontWeight: 500,
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Thiệp mời cưới
                            </p>
                            <p
                                style={{
                                    fontFamily: "var(--font-script-elegant)",
                                    fontSize: '22px',
                                    color: '#4A5D3A',
                                }}
                            >
                                {weddingConfig.couple.groom.name} &{' '}
                                {weddingConfig.couple.bride.name}
                            </p>
                            <p
                                style={{
                                    fontFamily: "var(--font-primary)",
                                    fontSize: '13px',
                                    color: '#8B7355',
                                    fontWeight: 400,
                                }}
                            >
                                05 . 04 . 2026
                            </p>
                            <p
                                style={{
                                    fontFamily: "var(--font-primary)",
                                    fontSize: '9px',
                                    color: '#999',
                                    fontStyle: 'italic',
                                }}
                            >
                                Trân trọng mời Bạn + Nt
                            </p>
                        </div>
                    </div>

                    {/* Flap (top triangle) */}
                    <div
                        className="absolute top-0 left-0 right-0 z-[3]"
                        style={{
                            height: '100px',
                            transformOrigin: 'top center',
                            transition: 'transform 0.6s ease-in-out',
                            transform: state !== 'closed' ? 'rotateX(-180deg)' : 'rotateX(0deg)',
                        }}
                    >
                        <div
                            style={{
                                width: 0,
                                height: 0,
                                borderLeft: '140px solid transparent',
                                borderRight: '140px solid transparent',
                                borderTop: '100px solid #4A5D3A',
                                filter: 'brightness(1.05)',
                            }}
                        />
                    </div>

                    {/* Pocket (bottom flap) */}
                    <div
                        className="absolute bottom-0 left-0 right-0 z-[4]"
                        style={{ height: '80px' }}
                    >
                        <div
                            style={{
                                width: 0,
                                height: 0,
                                borderLeft: '140px solid #5A7247',
                                borderRight: '140px solid #5A7247',
                                borderTop: '80px solid #4F6A3C',
                            }}
                        />
                    </div>

                    {/* Wax Seal */}
                    <div
                        className="absolute z-[5] flex items-center justify-center"
                        style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            background:
                                'radial-gradient(circle at 40% 35%, #D4856A, #B5654A, #8B4513)',
                            boxShadow:
                                '0 3px 10px rgba(0,0,0,0.35), inset 0 1px 2px rgba(255,255,255,0.2)',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            transition: 'transform 0.4s ease, opacity 0.4s ease',
                            ...(state !== 'closed'
                                ? { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 }
                                : {}),
                        }}
                    >
                        <span
                            style={{
                                fontFamily: "var(--font-script-elegant)",
                                fontSize: '16px',
                                color: '#F5E6D0',
                            }}
                        >
                            M
                        </span>
                    </div>
                </div>

                {/* Touch prompt */}
                <p
                    style={{
                        fontFamily: "var(--font-primary)",
                        fontSize: '18px',
                        color: '#8B7355',
                        animation: 'envelopePulse 2.5s ease-in-out infinite',
                        fontStyle: 'italic',
                        letterSpacing: '0.05em',
                    }}
                >
                    Chạm để mở thiệp
                </p>
            </div>

            <style>{`
        @keyframes envelopeFadeSlide {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes envelopeScaleIn {
          from { transform: scale(0.85); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes envelopePulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
        </div>
    )
}

function FloralCornerSVG() {
    return (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            {/* Main stem */}
            <path
                d="M8 112 Q20 80 40 60 Q55 45 75 30 Q90 20 105 8"
                stroke="#9BAF88"
                strokeWidth="1.5"
                fill="none"
                opacity="0.7"
            />
            {/* Secondary stem */}
            <path
                d="M5 90 Q15 70 30 55 Q40 48 55 38"
                stroke="#9BAF88"
                strokeWidth="1"
                fill="none"
                opacity="0.5"
            />
            {/* Leaves */}
            <ellipse
                cx="25"
                cy="78"
                rx="12"
                ry="5"
                fill="#9BAF88"
                opacity="0.35"
                transform="rotate(-35 25 78)"
            />
            <ellipse
                cx="42"
                cy="58"
                rx="10"
                ry="4"
                fill="#9BAF88"
                opacity="0.3"
                transform="rotate(-40 42 58)"
            />
            <ellipse
                cx="60"
                cy="42"
                rx="9"
                ry="3.5"
                fill="#9BAF88"
                opacity="0.3"
                transform="rotate(-30 60 42)"
            />
            <ellipse
                cx="80"
                cy="26"
                rx="8"
                ry="3"
                fill="#9BAF88"
                opacity="0.25"
                transform="rotate(-45 80 26)"
            />
            {/* Flower petals cluster */}
            <circle cx="100" cy="14" r="8" fill="#F5E6E0" opacity="0.85" />
            <circle cx="93" cy="9" r="6.5" fill="#F5E6E0" opacity="0.8" />
            <circle cx="107" cy="9" r="6.5" fill="#F5E6E0" opacity="0.8" />
            <circle cx="100" cy="6" r="5.5" fill="#F5E6E0" opacity="0.75" />
            <circle cx="100" cy="13" r="3" fill="#E8C8A0" opacity="0.5" />
            {/* Small buds */}
            <circle cx="50" cy="50" r="3.5" fill="#F5E6E0" opacity="0.5" />
            <circle cx="15" cy="95" r="2.5" fill="#9BAF88" opacity="0.35" />
            <circle cx="70" cy="34" r="2" fill="#F5E6E0" opacity="0.4" />
        </svg>
    )
}
