import { weddingImages, weddingConfig } from './wedding-config'
import { useScrollAnimation } from './useScrollAnimation'

export function PhotoQuoteSplit() {
    const ref = useScrollAnimation()

    return (
        <section ref={ref} className="flex" style={{ minHeight: '300px' }}>
            {/* Photo left */}
            <div className="w-1/2 relative overflow-hidden">
                <img
                    src={weddingImages.quotePhoto}
                    alt="Đôi uyên ương cầm hoa"
                    className="w-full h-full object-cover"
                    style={{ minHeight: '300px' }}
                    loading="lazy"
                />
                {/* Subtle vignette */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(to right, transparent 60%, rgba(74,93,58,0.15) 100%)',
                    }}
                />
            </div>

            {/* Quote right */}
            <div
                className="w-1/2 flex items-center justify-center relative"
                style={{
                    background: 'linear-gradient(135deg, #5A7247 0%, #4A5D3A 50%, #3C4E30 100%)',
                    padding: '32px 20px',
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

                <div className="relative z-10">
                    {/* Quote mark */}
                    <p
                        className="text-center mb-2"
                        style={{
                            fontFamily: "'Monsieur La Doulaise', cursive",
                            fontSize: '48px',
                            color: 'rgba(255,255,255,0.25)',
                            lineHeight: 0.8,
                        }}
                    >
                        {'\u201C'}
                    </p>
                    <p
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: '16px',
                            color: 'rgba(255,255,255,0.9)',
                            lineHeight: 1.8,
                            textAlign: 'center',
                            fontStyle: 'italic',
                            fontWeight: 300,
                        }}
                    >
                        {weddingConfig.quote.split}
                    </p>
                    {/* Quote mark closing */}
                    <p
                        className="text-center mt-2"
                        style={{
                            fontFamily: "'Monsieur La Doulaise', cursive",
                            fontSize: '48px',
                            color: 'rgba(255,255,255,0.25)',
                            lineHeight: 0.5,
                        }}
                    >
                        {'\u201D'}
                    </p>
                </div>

                {/* Floral accent at junction */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 z-10">
                    <svg width="28" height="40" viewBox="0 0 28 40" fill="none">
                        <circle cx="14" cy="12" r="7" fill="#F5E6E0" opacity="0.85" />
                        <circle cx="9" cy="8" r="5" fill="#F5E6E0" opacity="0.8" />
                        <circle cx="19" cy="8" r="5" fill="#F5E6E0" opacity="0.8" />
                        <circle cx="14" cy="12" r="2.5" fill="#E8C8A0" opacity="0.5" />
                        <path
                            d="M14 18 Q13 28 10 36"
                            stroke="#9BAF88"
                            strokeWidth="1"
                            fill="none"
                            opacity="0.6"
                        />
                        <ellipse
                            cx="10"
                            cy="28"
                            rx="4"
                            ry="1.5"
                            fill="#9BAF88"
                            opacity="0.3"
                            transform="rotate(-15 10 28)"
                        />
                    </svg>
                </div>
            </div>
        </section>
    )
}
