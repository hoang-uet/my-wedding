import { weddingImages, weddingConfig } from './wedding-config'
import { useScrollAnimation } from './useScrollAnimation'
import { WeddingImage } from './WeddingImage'

export function PhotoHero() {
    const textRef = useScrollAnimation({ variant: 'fadeInUp', delay: 200 })

    return (
        <section className="relative" style={{ minHeight: 'clamp(400px, 65vh, 520px)' }}>
            <WeddingImage
                image={weddingImages.heroCouple}
                alt="Đôi uyên ương đi trên cánh đồng xanh"
                sizes="430px"
                fetchPriority="high"
                loading="eager"
                className="absolute inset-0 w-full h-full"
                style={{ aspectRatio: 'unset' }}
            />
            {/* Gradient overlay */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        'linear-gradient(to bottom, rgba(74,93,58,0.1) 0%, rgba(58,58,58,0.2) 50%, rgba(58,74,58,0.45) 100%)',
                }}
            />

            {/* Quote text */}
            <div
                ref={textRef}
                className="absolute inset-0 flex flex-col items-center justify-end px-8"
                style={{ paddingBottom: '48px' }}
            >
                <p
                    style={{
                        fontFamily: 'var(--font-calligraphy-vn)',
                        fontSize: 'var(--text-quote)',
                        color: '#FFFFFF',
                        textShadow: '0 2px 20px rgba(0,0,0,0.35)',
                        lineHeight: 1.25,
                        textAlign: 'center',
                        fontWeight: 500,
                    }}
                >
                    <span className="block" style={{ marginRight: 'var(--space-quote-x)' }}>
                        All of me loves
                    </span>
                    <span className="block" style={{ marginLeft: 'var(--space-quote-x)' }}>
                        All of you
                    </span>
                </p>
                {/* Couple names below quote */}
                <p
                    className="mt-4"
                    style={{
                        fontFamily: 'var(--font-primary)',
                        fontSize: '14px',
                        color: 'rgba(255,255,255,0.8)',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        fontWeight: 500,
                    }}
                >
                    {weddingConfig.couple.groom.name} & {weddingConfig.couple.bride.name}
                </p>
            </div>
        </section>
    )
}
