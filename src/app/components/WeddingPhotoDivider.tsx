import { useScrollAnimation } from './useScrollAnimation'
import { weddingImages } from './wedding-config'

export function WeddingPhotoDivider() {
    const ref = useScrollAnimation({ threshold: 0.1 })

    return (
        <section ref={ref} className="relative" style={{ height: '380px' }}>
            <img
                src={weddingImages.heroCouple}
                alt="Đôi uyên ương trên cánh đồng xanh"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
            />
            {/* Soft gradient top & bottom edges to blend with adjacent sections */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        'linear-gradient(180deg, #EDE8DD 0%, transparent 12%, transparent 88%, #F0EBE2 100%)',
                }}
            />
        </section>
    )
}
