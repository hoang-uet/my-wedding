import { MapPin } from 'lucide-react'
import { weddingConfig } from './wedding-config'
import { useChildrenStagger } from './useScrollAnimation'

export function EventDetails() {
    const ref = useChildrenStagger(80)

    return (
        <section
            className="relative overflow-hidden"
            style={{
                background: '#F0EBE2',
                padding: '32px 16px 40px',
            }}
        >
            {/* Right floral decoration */}
            <div className="absolute -top-2 -right-2 opacity-50">
                <FloralBranch />
            </div>

            <div ref={ref} className="text-center relative z-10">
                {/* Couple names */}
                <div className="mb-2">
                    <p
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: '38px',
                            color: '#3A3A3A',
                            letterSpacing: '0.12em',
                            lineHeight: 1.15,
                            fontWeight: 600,
                        }}
                    >
                        {weddingConfig.couple.groom.displayName}
                    </p>
                    <p
                        style={{
                            fontFamily: "'Monsieur La Doulaise', cursive",
                            fontSize: '36px',
                            color: '#9BAF88',
                            margin: '2px 0',
                        }}
                    >
                        &
                    </p>
                    <p
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: '38px',
                            color: '#3A3A3A',
                            letterSpacing: '0.12em',
                            lineHeight: 1.15,
                            fontWeight: 600,
                        }}
                    >
                        {weddingConfig.couple.bride.displayName}
                    </p>
                </div>

                {/* Thin ornamental line */}
                <div className="flex justify-center my-5">
                    <div
                        style={{
                            width: '60px',
                            height: '1px',
                            background: 'linear-gradient(90deg, transparent, #C8B99A, transparent)',
                        }}
                    />
                </div>

                {/* Invitation text */}
                <div className="mb-5">
                    <p
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: '16px',
                            color: '#4A5D3A',
                            letterSpacing: '0.15em',
                            lineHeight: 1.8,
                            fontWeight: 500,
                            textTransform: 'uppercase',
                        }}
                    >
                        Tham dự tiệc chung vui
                        <br />
                        cùng gia đình chúng tôi
                    </p>
                </div>

                {/* Time */}
                <div className="mb-3">
                    <p
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: '20px',
                            color: '#3A3A3A',
                            fontWeight: 500,
                            letterSpacing: '0.1em',
                        }}
                    >
                        09 : 00, {weddingConfig.event.dayOfWeek}
                    </p>
                </div>

                {/* Date display - month / DAY / year */}
                <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="text-center">
                        <p
                            style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: '14px',
                                color: '#8B7355',
                                letterSpacing: '0.15em',
                                fontWeight: 500,
                            }}
                        >
                            THÁNG
                        </p>
                        <p
                            style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: '22px',
                                color: '#3A3A3A',
                                fontWeight: 600,
                            }}
                        >
                            04
                        </p>
                    </div>
                    <div
                        style={{
                            width: '1px',
                            height: '48px',
                            background: '#C8B99A',
                        }}
                    />
                    <p
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: '72px',
                            color: '#4A5D3A',
                            fontWeight: 300,
                            lineHeight: 1,
                        }}
                    >
                        05
                    </p>
                    <div
                        style={{
                            width: '1px',
                            height: '48px',
                            background: '#C8B99A',
                        }}
                    />
                    <div className="text-center">
                        <p
                            style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: '14px',
                                color: '#8B7355',
                                letterSpacing: '0.15em',
                                fontWeight: 500,
                            }}
                        >
                            NĂM
                        </p>
                        <p
                            style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: '22px',
                                color: '#3A3A3A',
                                fontWeight: 600,
                            }}
                        >
                            2026
                        </p>
                    </div>
                </div>

                {/* Lunar date */}
                <p
                    style={{
                        fontFamily: "'Quicksand', sans-serif",
                        fontSize: '13px',
                        color: '#8B7355',
                        marginBottom: '24px',
                        fontStyle: 'italic',
                    }}
                >
                    ({weddingConfig.event.lunarDate})
                </p>

                {/* Ornamental divider */}
                <div className="flex justify-center mb-5">
                    <svg width="100" height="8" viewBox="0 0 100 8">
                        <line x1="0" y1="4" x2="40" y2="4" stroke="#C8B99A" strokeWidth="0.5" />
                        <circle
                            cx="50"
                            cy="4"
                            r="2.5"
                            fill="none"
                            stroke="#C8B99A"
                            strokeWidth="0.5"
                        />
                        <line x1="60" y1="4" x2="100" y2="4" stroke="#C8B99A" strokeWidth="0.5" />
                    </svg>
                </div>

                {/* Venue */}
                <div className="mb-3">
                    <p
                        style={{
                            fontFamily: "'Quicksand', sans-serif",
                            fontSize: '13px',
                            fontWeight: 500,
                            color: '#8B7355',
                            marginBottom: '4px',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                        }}
                    >
                        Hôn lễ được tổ chức tại
                    </p>
                    <p
                        style={{
                            fontFamily: "'Monsieur La Doulaise', cursive",
                            fontSize: '34px',
                            color: '#4A5D3A',
                        }}
                    >
                        {weddingConfig.event.venue}
                    </p>
                </div>

                {/* Address */}
                <p
                    style={{
                        fontFamily: "'Quicksand', sans-serif",
                        fontSize: '13px',
                        color: '#666',
                        lineHeight: 1.7,
                        marginBottom: '20px',
                        padding: '0 16px',
                    }}
                >
                    {weddingConfig.event.address}
                </p>

                {/* Directions button */}
                <a
                    href={weddingConfig.event.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 no-underline"
                    style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '16px',
                        color: '#4A5D3A',
                        borderBottom: '1px solid #9BAF88',
                        paddingBottom: '2px',
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                    }}
                >
                    <MapPin size={16} strokeWidth={1.5} />
                    Chỉ Đường
                </a>
            </div>

            {/* Left bottom floral */}
            <div
                className="absolute -bottom-2 -left-2 opacity-50"
                style={{ transform: 'scaleX(-1) scaleY(-1)' }}
            >
                <FloralBranch />
            </div>
        </section>
    )
}

function FloralBranch() {
    return (
        <svg width="110" height="130" viewBox="0 0 110 130" fill="none">
            <path
                d="M90 8 Q70 30 58 55 Q50 75 45 115"
                stroke="#9BAF88"
                strokeWidth="1.5"
                fill="none"
                opacity="0.5"
            />
            <path
                d="M100 25 Q85 35 75 50"
                stroke="#9BAF88"
                strokeWidth="1"
                fill="none"
                opacity="0.35"
            />
            <ellipse
                cx="72"
                cy="32"
                rx="10"
                ry="4"
                fill="#9BAF88"
                opacity="0.25"
                transform="rotate(-30 72 32)"
            />
            <ellipse
                cx="58"
                cy="60"
                rx="9"
                ry="3.5"
                fill="#9BAF88"
                opacity="0.2"
                transform="rotate(15 58 60)"
            />
            <ellipse
                cx="50"
                cy="88"
                rx="8"
                ry="3"
                fill="#9BAF88"
                opacity="0.2"
                transform="rotate(-10 50 88)"
            />
            {/* White flower */}
            <circle cx="90" cy="10" r="9" fill="#F5E6E0" opacity="0.8" />
            <circle cx="83" cy="6" r="7" fill="#F5E6E0" opacity="0.75" />
            <circle cx="97" cy="6" r="7" fill="#F5E6E0" opacity="0.75" />
            <circle cx="90" cy="3" r="6" fill="#F5E6E0" opacity="0.7" />
            <circle cx="90" cy="10" r="3.5" fill="#E8C8A0" opacity="0.45" />
            {/* Small bud */}
            <circle cx="100" cy="28" r="4" fill="#F5E6E0" opacity="0.5" />
            <circle cx="62" cy="46" r="2.5" fill="#9BAF88" opacity="0.3" />
        </svg>
    )
}
