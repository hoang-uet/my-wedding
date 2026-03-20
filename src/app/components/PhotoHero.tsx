import { weddingImages, weddingConfig } from './wedding-config'
import { useScrollAnimation } from './useScrollAnimation'

export function PhotoHero() {
    const textRef = useScrollAnimation()

    return (
        <section className="relative" style={{ height: '480px' }}>
            <img
                src={weddingImages.heroCouple}
                alt="Đôi uyên ương đi trên cánh đồng xanh"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
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
                        fontFamily: "'Monsieur La Doulaise', cursive",
                        fontSize: '46px',
                        color: '#FFFFFF',
                        textShadow: '0 2px 20px rgba(0,0,0,0.35)',
                        lineHeight: 1.25,
                        textAlign: 'center',
                    }}
                >
                    <span className="block" style={{ marginRight: '30px' }}>
                        All of me loves
                    </span>
                    <span className="block" style={{ marginLeft: '30px' }}>
                        All of you
                    </span>
                </p>
                {/* Couple names below quote */}
                <p
                    className="mt-4"
                    style={{
                        fontFamily: "'Cormorant Garamond', serif",
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
