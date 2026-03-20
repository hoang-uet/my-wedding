import { weddingConfig } from './wedding-config'
import { useChildrenStagger } from './useScrollAnimation'

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
            {/* Decorative top ornament */}
            <div className="flex justify-center mb-6">
                <FloralOrnament />
            </div>

            {/* Section label */}
            <p
                className="text-center mb-4"
                style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '13px',
                    color: '#8B7355',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                }}
            >
                Trân trọng kính mời
            </p>

            <div ref={ref} className="flex gap-2">
                {/* Nhà Trai */}
                <div className="flex-1 text-center">
                    <h3
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: '20px',
                            fontWeight: 600,
                            color: '#4A5D3A',
                            marginBottom: '14px',
                            letterSpacing: '0.08em',
                        }}
                    >
                        Nhà Trai
                    </h3>
                    <p
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
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
                            fontFamily: "'Cormorant Garamond', serif",
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
                            fontFamily: "'Quicksand', sans-serif",
                            fontSize: '12px',
                            color: '#8B7355',
                            fontStyle: 'italic',
                            marginTop: '8px',
                        }}
                    >
                        {weddingConfig.families.groom.city}
                    </p>
                </div>

                {/* Center divider */}
                <div className="flex flex-col items-center justify-center px-1">
                    <div
                        style={{
                            width: '1px',
                            height: '40px',
                            background:
                                'linear-gradient(180deg, transparent, #C8B99A, transparent)',
                        }}
                    />
                    <DoubleLeavesIcon />
                    <div
                        style={{
                            width: '1px',
                            height: '40px',
                            background:
                                'linear-gradient(180deg, transparent, #C8B99A, transparent)',
                        }}
                    />
                </div>

                {/* Nhà Gái */}
                <div className="flex-1 text-center">
                    <h3
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: '20px',
                            fontWeight: 600,
                            color: '#4A5D3A',
                            marginBottom: '14px',
                            letterSpacing: '0.08em',
                        }}
                    >
                        Nhà Gái
                    </h3>
                    <p
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
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
                            fontFamily: "'Cormorant Garamond', serif",
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
                            fontFamily: "'Quicksand', sans-serif",
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

function DoubleLeavesIcon() {
    return (
        <svg width="24" height="28" viewBox="0 0 24 28" className="my-2">
            <path d="M12 2 Q8 8 8 14 Q8 20 12 26" stroke="#9BAF88" strokeWidth="1" fill="none" />
            <path d="M12 2 Q16 8 16 14 Q16 20 12 26" stroke="#9BAF88" strokeWidth="1" fill="none" />
            <ellipse
                cx="8"
                cy="10"
                rx="4"
                ry="2"
                fill="#9BAF88"
                opacity="0.35"
                transform="rotate(-30 8 10)"
            />
            <ellipse
                cx="16"
                cy="10"
                rx="4"
                ry="2"
                fill="#9BAF88"
                opacity="0.35"
                transform="rotate(30 16 10)"
            />
            <ellipse
                cx="7"
                cy="18"
                rx="4"
                ry="2"
                fill="#9BAF88"
                opacity="0.3"
                transform="rotate(-20 7 18)"
            />
            <ellipse
                cx="17"
                cy="18"
                rx="4"
                ry="2"
                fill="#9BAF88"
                opacity="0.3"
                transform="rotate(20 17 18)"
            />
        </svg>
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
