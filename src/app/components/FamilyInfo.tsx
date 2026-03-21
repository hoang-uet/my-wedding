import { weddingConfig } from './wedding-config'
import { useChildrenStagger } from './useScrollAnimation'
import { CornerOrchidCluster } from './FloralOverlay'
import chuHy from '@/assets/chu-hy.png'

export function FamilyInfo() {
    const ref = useChildrenStagger(120)

    return (
        <section
            className="relative overflow-hidden"
            style={{
                background: 'linear-gradient(180deg, #F5F0E8 0%, #F0EBE2 100%)',
                padding: '48px 20px 40px',
            }}
        >
            {/* Floral corner — top-right orchid (z-1, below text z-10) */}
            <CornerOrchidCluster position="top-right" size={100} delay={200} />

            {/* Decorative top ornament */}
            <div className="flex justify-center mb-6">
                <FloralOrnament />
            </div>

            <div ref={ref} className="flex gap-2">
                {/* Nhà Trai */}
                <div className="flex-1 text-center">
                    <h3
                        style={{
                            fontFamily: 'var(--font-primary)',
                            fontSize: '18px',
                            fontWeight: 700,
                            color: '#4A5D3A',
                            marginBottom: '14px',
                        }}
                    >
                        Nhà Trai
                    </h3>
                    <p
                        style={{
                            fontFamily: 'var(--font-primary)',
                            fontSize: '15px',
                            color: '#3A3A3A',
                            fontWeight: 500,
                            lineHeight: 1.8,
                        }}
                    >
                        Ông: {weddingConfig.families.groom.father}
                    </p>
                    <p
                        style={{
                            fontFamily: 'var(--font-primary)',
                            fontSize: '15px',
                            color: '#3A3A3A',
                            fontWeight: 500,
                            lineHeight: 1.8,
                        }}
                    >
                        Bà: {weddingConfig.families.groom.mother}
                    </p>
                    <p
                        style={{
                            fontFamily: 'var(--font-primary)',
                            fontSize: '12px',
                            color: '#8B7355',
                            fontStyle: 'italic',
                            marginTop: '8px',
                        }}
                    >
                        {weddingConfig.families.groom.city}
                    </p>
                </div>

                {/* Center divider — Chữ Hỷ (囍) */}
                <div className="flex flex-col items-center justify-center px-2">
                    <div
                        style={{
                            width: '1px',
                            height: '32px',
                            background:
                                'linear-gradient(180deg, transparent, #C8B99A, transparent)',
                        }}
                    />
                    <img
                        src={chuHy}
                        alt="Chữ Hỷ"
                        style={{
                            width: '36px',
                            height: '36px',
                            objectFit: 'contain',
                            margin: '6px 0',
                        }}
                    />
                    <div
                        style={{
                            width: '1px',
                            height: '32px',
                            background:
                                'linear-gradient(180deg, transparent, #C8B99A, transparent)',
                        }}
                    />
                </div>

                {/* Nhà Gái */}
                <div className="flex-1 text-center">
                    <h3
                        style={{
                            fontFamily: 'var(--font-primary)',
                            fontSize: '18px',
                            fontWeight: 700,
                            color: '#4A5D3A',
                            marginBottom: '14px',
                        }}
                    >
                        Nhà Gái
                    </h3>
                    <p
                        style={{
                            fontFamily: 'var(--font-primary)',
                            fontSize: '15px',
                            color: '#3A3A3A',
                            fontWeight: 500,
                            lineHeight: 1.8,
                        }}
                    >
                        Ông: {weddingConfig.families.bride.father}
                    </p>
                    <p
                        style={{
                            fontFamily: 'var(--font-primary)',
                            fontSize: '15px',
                            color: '#3A3A3A',
                            fontWeight: 500,
                            lineHeight: 1.8,
                        }}
                    >
                        Bà: {weddingConfig.families.bride.mother}
                    </p>
                    <p
                        style={{
                            fontFamily: 'var(--font-primary)',
                            fontSize: '12px',
                            color: '#8B7355',
                            fontStyle: 'italic',
                            marginTop: '8px',
                        }}
                    >
                        {weddingConfig.families.bride.city}
                    </p>
                </div>
            </div>
        </section>
    )
}

function FloralOrnament() {
    return (
        <svg width="140" height="36" viewBox="0 0 140 36">
            <path
                d="M20 28 Q40 8 70 18 Q100 28 120 8"
                stroke="#9BAF88"
                strokeWidth="1.2"
                fill="none"
                opacity="0.6"
            />
            <ellipse
                cx="38"
                cy="14"
                rx="6"
                ry="2.5"
                fill="#9BAF88"
                opacity="0.3"
                transform="rotate(-25 38 14)"
            />
            <ellipse
                cx="102"
                cy="14"
                rx="6"
                ry="2.5"
                fill="#9BAF88"
                opacity="0.3"
                transform="rotate(25 102 14)"
            />
            {/* Center flower */}
            <circle cx="70" cy="18" r="5" fill="#F5E6E0" opacity="0.7" />
            <circle cx="65" cy="15" r="4" fill="#F5E6E0" opacity="0.6" />
            <circle cx="75" cy="15" r="4" fill="#F5E6E0" opacity="0.6" />
            <circle cx="70" cy="18" r="2" fill="#E8C8A0" opacity="0.5" />
        </svg>
    )
}
