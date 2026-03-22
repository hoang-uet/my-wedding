import { weddingImages, weddingConfig } from './wedding-config'
import { useScrollAnimation } from './useScrollAnimation'
import { WeddingImage } from './WeddingImage'
import orchidBouquet from '../../assets/orchid-bouquet.png'

export function PhotoQuoteSplit() {
    const ref = useScrollAnimation({ variant: 'fadeInScale' })

    return (
        <section ref={ref} className="relative" style={{ zIndex: 2 }}>
            {/* Main split layout */}
            <div className="flex" style={{ minHeight: '320px' }}>
                {/* Photo left */}
                <div className="w-1/2 relative overflow-hidden">
                    <WeddingImage
                        image={weddingImages.quotePhoto}
                        alt="Đôi uyên ương cầm hoa"
                        sizes="215px"
                        className="w-full h-full"
                        style={{ minHeight: '320px', aspectRatio: 'unset' }}
                    />
                    {/* Subtle vignette toward the green side */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                'linear-gradient(to right, transparent 50%, rgba(74,93,58,0.2) 100%)',
                        }}
                    />
                    {/* Bottom shadow for depth at the orchid transition */}
                    <div
                        className="absolute bottom-0 left-0 right-0"
                        style={{
                            height: '60px',
                            background: 'linear-gradient(to top, rgba(60,78,48,0.3), transparent)',
                        }}
                    />
                </div>

                {/* Quote right */}
                <div
                    className="w-1/2 flex items-center justify-center relative"
                    style={{
                        background:
                            'linear-gradient(160deg, #5A7247 0%, #4A5D3A 45%, #3C4E30 100%)',
                        padding: '36px 20px',
                    }}
                >
                    {/* Subtle leaf texture */}
                    <div className="absolute top-4 right-4 opacity-15">
                        <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                            <path d="M40 5 Q25 20 20 40" stroke="#FFFFFF" strokeWidth="0.8" />
                            <ellipse
                                cx="30"
                                cy="15"
                                rx="8"
                                ry="3"
                                fill="#FFFFFF"
                                opacity="0.3"
                                transform="rotate(-30 30 15)"
                            />
                            <ellipse
                                cx="22"
                                cy="30"
                                rx="7"
                                ry="2.5"
                                fill="#FFFFFF"
                                opacity="0.25"
                                transform="rotate(10 22 30)"
                            />
                        </svg>
                    </div>

                    {/* Bottom leaf texture for symmetry */}
                    <div className="absolute bottom-4 left-4 opacity-10">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                            <path d="M5 35 Q18 22 25 5" stroke="#FFFFFF" strokeWidth="0.6" />
                            <ellipse
                                cx="15"
                                cy="25"
                                rx="6"
                                ry="2.5"
                                fill="#FFFFFF"
                                opacity="0.3"
                                transform="rotate(25 15 25)"
                            />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        {/* Opening quote mark */}
                        <p
                            className="text-center mb-2"
                            style={{
                                fontFamily: 'var(--font-script-elegant)',
                                fontSize: '52px',
                                color: 'rgba(255,255,255,0.2)',
                                lineHeight: 0.8,
                            }}
                        >
                            {'\u201C'}
                        </p>
                        <p
                            style={{
                                fontFamily: 'var(--font-envelope-guest)',
                                fontSize: '28px',
                                color: 'rgba(255,255,255,0.88)',
                                lineHeight: 1.9,
                                textAlign: 'center',
                                fontWeight: 500,
                            }}
                        >
                            {weddingConfig.quote.split}
                        </p>
                        {/* Closing quote mark */}
                        <p
                            className="text-center mt-2"
                            style={{
                                fontFamily: 'var(--font-script-elegant)',
                                fontSize: '52px',
                                color: 'rgba(255,255,255,0.2)',
                                lineHeight: 0.5,
                            }}
                        >
                            {'\u201D'}
                        </p>
                    </div>

                    {/* Floral accent at junction (left edge) */}
                    <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 z-10">
                        <svg width="30" height="28" viewBox="0 0 24 24" fill="#E87461">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* ── Orchid Bridge Decoration ──
                Positioned at the bottom edge, centered, overlapping
                both this section and the Countdown section below.
                Creates visual depth & continuity between sections. */}
            <div
                className="absolute pointer-events-none"
                style={{
                    bottom: '-70px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 5,
                    width: '100px',
                    height: 'auto',
                    filter: 'drop-shadow(0 8px 8px rgba(40,55,30,0.3))',
                }}
            >
                <img
                    src={orchidBouquet}
                    alt=""
                    aria-hidden="true"
                    style={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'contain',
                        opacity: 0.9,
                        animation: 'floralSway 8s ease-in-out infinite',
                    }}
                />
            </div>
        </section>
    )
}
