import { weddingImages, weddingConfig } from './wedding-config'
import { useScrollAnimation } from './useScrollAnimation'
import { WeddingImage } from './WeddingImage'

export function ThankYou() {
    const ref = useScrollAnimation()

    return (
        <section className="relative" style={{ height: '450px' }}>
            <WeddingImage
                image={weddingImages.thankYou}
                alt="Đôi uyên ương trong khung cảnh lãng mạn"
                sizes="430px"
                className="absolute inset-0 w-full h-full"
                style={{ aspectRatio: 'unset' }}
            />
            {/* Dark vignette overlay for text readability */}
            <div
                className="absolute inset-0"
                style={{
                    background: [
                        'radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)',
                        'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.6) 100%)',
                    ].join(', '),
                }}
            />
            <div
                ref={ref}
                className="relative z-10 flex flex-col items-center justify-center h-full"
            >
                <p
                    style={{
                        fontFamily: 'var(--font-script-elegant)',
                        fontSize: '52px',
                        color: 'rgb(75, 83, 32)',
                        textShadow: '0 2px 24px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)',
                    }}
                >
                    Thank you!
                </p>
                <p
                    className="mt-2"
                    style={{
                        fontFamily: 'var(--font-primary)',
                        fontSize: '14px',
                        color: 'rgb(75, 83, 32)',
                        letterSpacing: '0.15em',
                        fontWeight: 400,
                        textShadow: '0 1px 8px rgba(0,0,0,0.4)',
                    }}
                >
                    {weddingConfig.couple.groom.name} & {weddingConfig.couple.bride.name}
                </p>
                <p
                    className="mt-6"
                    style={{
                        fontFamily: 'var(--font-primary)',
                        fontSize: '10px',
                        color: 'rgb(75, 83, 32)',
                        letterSpacing: '0.1em',
                        textShadow: '0 1px 6px rgba(0,0,0,0.3)',
                    }}
                >
                    05 . 04 . 2026
                </p>
            </div>
        </section>
    )
}
