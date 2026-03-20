import { weddingConfig, weddingImages } from './wedding-config'
import { useScrollAnimation } from './useScrollAnimation'
import orchidBouquet from 'figma:asset/2ac02946802c8fa703bc243b25ace4cd4e75e9f9.png'
import orchidSingle from 'figma:asset/0bee3b951be34c869dc95c68ee90702159a7a88b.png'
import orchidBranch from 'figma:asset/f4488b0b6856e505f1f4c7c09b04f9b54e683079.png'

/**
 * CouplePortraits – S3
 * Polaroid-style photos of groom (top-left) and bride (bottom-right)
 * overlapping each other, connected by orchid decorations.
 * Gentle wobble animation on each photo.
 */
export function CouplePortraits() {
    const sectionRef = useScrollAnimation({ stagger: 0 })

    return (
        <section
            ref={sectionRef}
            className="relative"
            style={{
                background: '#F0EBE2',
                padding: '52px 16px 56px',
                overflowX: 'hidden',
                overflowY: 'visible',
            }}
        >
            {/* Paper texture */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    opacity: 0.03,
                    background:
                        'repeating-conic-gradient(#8B7355 0% 25%, transparent 0% 50%) 0 0 / 3px 3px',
                }}
            />

            {/* ═══════════════════════════════════════
          PHOTO PAIR CONTAINER
          Groom top-left, Bride bottom-right, overlapping
          ═══════════════════════════════════════ */}
            <div
                className="relative mx-auto"
                style={{
                    maxWidth: '380px',
                    height: '480px',
                }}
            >
                {/* ── GROOM POLAROID (top-left) ── */}
                <div
                    className="absolute"
                    style={{
                        top: '0px',
                        left: '10px',
                        zIndex: 2,
                        animation: 'polaroidFloat 5s ease-in-out infinite',
                    }}
                >
                    <div
                        style={{
                            background: 'white',
                            padding: '8px 8px 12px 8px',
                            boxShadow: '0 8px 28px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.06)',
                            transform: 'rotate(-5deg)',
                        }}
                    >
                        <img
                            src={weddingImages.groom}
                            alt={`Chú rể ${weddingConfig.couple.groom.name}`}
                            style={{
                                width: '170px',
                                height: '215px',
                                objectFit: 'cover',
                                display: 'block',
                            }}
                            loading="lazy"
                        />
                    </div>
                </div>

                {/* ── Groom label (top-right of groom photo) ── */}
                <div
                    className="absolute"
                    style={{
                        top: '18px',
                        right: '18px',
                        zIndex: 4,
                        textAlign: 'right',
                    }}
                >
                    <p
                        style={{
                            fontFamily: "'Quicksand', sans-serif",
                            fontSize: '14px',
                            color: '#8B7355',
                            fontWeight: 500,
                            letterSpacing: '0.12em',
                            marginBottom: '4px',
                        }}
                    >
                        Chú rể
                    </p>
                    <p
                        style={{
                            fontFamily: "'HoaTay1', cursive",
                            fontSize: '30px',
                            color: '#4A5D3A',
                            lineHeight: 1.05,
                        }}
                    >
                        {weddingConfig.couple.groom.name}
                    </p>
                </div>

                {/* ── Orchid branch — top-left corner of groom photo ── */}
                <div
                    className="absolute pointer-events-none"
                    style={{
                        top: '-18px',
                        left: '-12px',
                        width: '90px',
                        height: '100px',
                        zIndex: 5,
                        transform: 'rotate(-15deg)',
                        filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.06))',
                    }}
                >
                    <img src={orchidSingle} alt="" className="w-full h-full object-contain" />
                </div>

                {/* ── CENTER ORCHID BOUQUET — connecting element ── */}
                <div
                    className="absolute pointer-events-none"
                    style={{
                        top: '180px',
                        left: '50%',
                        transform: 'translateX(-50%) rotate(5deg)',
                        width: '120px',
                        height: '130px',
                        zIndex: 6,
                        filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.08))',
                        animation: 'orchidSway 6s ease-in-out infinite',
                    }}
                >
                    <img src={orchidBouquet} alt="" className="w-full h-full object-contain" />
                </div>

                {/* ── BRIDE POLAROID (bottom-right, overlapping groom) ── */}
                <div
                    className="absolute"
                    style={{
                        bottom: '30px',
                        right: '10px',
                        zIndex: 3,
                        animation: 'polaroidFloat2 5s ease-in-out infinite',
                    }}
                >
                    <div
                        style={{
                            background: 'white',
                            padding: '8px 8px 12px 8px',
                            boxShadow: '0 8px 28px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.06)',
                            transform: 'rotate(4deg)',
                        }}
                    >
                        <img
                            src={weddingImages.bride}
                            alt={`Cô dâu ${weddingConfig.couple.bride.name}`}
                            style={{
                                width: '175px',
                                height: '220px',
                                objectFit: 'cover',
                                display: 'block',
                            }}
                            loading="lazy"
                        />
                    </div>
                </div>

                {/* ── Bride label (left of bride photo) ── */}
                <div
                    className="absolute"
                    style={{
                        bottom: '100px',
                        left: '14px',
                        zIndex: 4,
                        textAlign: 'left',
                    }}
                >
                    <p
                        style={{
                            fontFamily: "'Quicksand', sans-serif",
                            fontSize: '14px',
                            color: '#8B7355',
                            fontWeight: 500,
                            letterSpacing: '0.12em',
                            marginBottom: '4px',
                        }}
                    >
                        Cô dâu
                    </p>
                    <p
                        style={{
                            fontFamily: "'HoaTay1', cursive",
                            fontSize: '30px',
                            color: '#4A5D3A',
                            lineHeight: 1.05,
                        }}
                    >
                        {weddingConfig.couple.bride.name}
                    </p>
                </div>

                {/* ── Orchid bouquet — bottom-right of bride photo ── */}
                <div
                    className="absolute pointer-events-none"
                    style={{
                        bottom: '0px',
                        right: '-8px',
                        width: '100px',
                        height: '110px',
                        zIndex: 5,
                        transform: 'rotate(10deg)',
                        filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.06))',
                    }}
                >
                    <img src={orchidBouquet} alt="" className="w-full h-full object-contain" />
                </div>

                {/* ── Small orchid branch — decorative between photos ── */}
                <div
                    className="absolute pointer-events-none"
                    style={{
                        top: '140px',
                        left: '12px',
                        width: '80px',
                        height: '35px',
                        zIndex: 1,
                        opacity: 0.7,
                        transform: 'rotate(-5deg)',
                    }}
                >
                    <img src={orchidBranch} alt="" className="w-full h-full object-contain" />
                </div>

                {/* ── Green vine line connecting photos ── */}
                <svg
                    className="absolute pointer-events-none"
                    style={{
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 0,
                    }}
                    viewBox="0 0 380 480"
                    fill="none"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M 80 230 Q 160 250 200 280 Q 240 310 300 290"
                        stroke="#9BAF88"
                        strokeWidth="1.2"
                        opacity="0.3"
                        fill="none"
                    />
                </svg>
            </div>

            {/* ═══ ANIMATIONS ═══ */}
            <style>{`
        @keyframes polaroidFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-4px) rotate(0.5deg);
          }
          50% {
            transform: translateY(-2px) rotate(-0.3deg);
          }
          75% {
            transform: translateY(-5px) rotate(0.3deg);
          }
        }

        @keyframes polaroidFloat2 {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          30% {
            transform: translateY(-5px) rotate(-0.4deg);
          }
          60% {
            transform: translateY(-2px) rotate(0.5deg);
          }
          85% {
            transform: translateY(-4px) rotate(-0.2deg);
          }
        }

        @keyframes orchidSway {
          0%, 100% {
            transform: translateX(-50%) rotate(5deg) scale(1);
          }
          33% {
            transform: translateX(-50%) rotate(8deg) scale(1.02);
          }
          66% {
            transform: translateX(-50%) rotate(3deg) scale(0.98);
          }
        }
      `}</style>
        </section>
    )
}
