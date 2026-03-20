import { weddingImages, weddingConfig } from './wedding-config'
import { useScrollAnimation } from './useScrollAnimation'

export function ThankYou() {
    const ref = useScrollAnimation()

    return (
        <section className="relative" style={{ height: '320px' }}>
            <img
                src={weddingImages.thankYou}
                alt="Đôi uyên ương trong khung cảnh lãng mạn"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
            />
            {/* Gradient overlay */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        'linear-gradient(180deg, rgba(74,93,58,0.2) 0%, rgba(58,74,48,0.5) 100%)',
                }}
            />
            <div
                ref={ref}
                className="relative z-10 flex flex-col items-center justify-center h-full"
            >
                <p
                    style={{
                        fontFamily: "'Monsieur La Doulaise', cursive",
                        fontSize: '52px',
                        color: '#FFFFFF',
                        textShadow: '0 2px 16px rgba(0,0,0,0.3)',
                    }}
                >
                    Thank you!
                </p>
                <p
                    className="mt-2"
                    style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '14px',
                        color: 'rgba(255,255,255,0.7)',
                        letterSpacing: '0.15em',
                        fontWeight: 400,
                    }}
                >
                    {weddingConfig.couple.groom.name} & {weddingConfig.couple.bride.name}
                </p>
                <p
                    className="mt-6"
                    style={{
                        fontFamily: "'Quicksand', sans-serif",
                        fontSize: '10px',
                        color: 'rgba(255,255,255,0.35)',
                        letterSpacing: '0.1em',
                    }}
                >
                    05 . 04 . 2026
                </p>
            </div>
        </section>
    )
}
