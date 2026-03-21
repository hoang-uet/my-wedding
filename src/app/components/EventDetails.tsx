import { MapPin } from 'lucide-react'
import { weddingConfig } from './wedding-config'
import { useChildrenStagger } from './useScrollAnimation'
import { CornerOrchidCluster, VineFrame } from './FloralOverlay'

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
            {/* Right floral decoration (original SVG) */}
            <div className="absolute -top-2 -right-2 opacity-50">
                <FloralBranch />
            </div>

            {/* Vine corner accents — z-1, below content z-10 */}
            <VineFrame position="top-left" delay={100} />
            <CornerOrchidCluster position="bottom-right" size={90} delay={400} />

            <div ref={ref} className="text-center relative z-10">
                {/* Couple names */}
                <div className="mb-2">
                    <p
                        style={{
                            fontFamily: 'var(--font-couple-names)',
                            fontSize: '34px',
                            color: '#3A3A3A',
                            lineHeight: 1.15,
                            fontWeight: 700,
                        }}
                    >
                        {weddingConfig.couple.groom.displayName}
                    </p>
                    <p
                        style={{
                            fontFamily: 'var(--font-couple-names)',
                            fontSize: '38px',
                            color: '#9BAF88',
                            margin: '2px 0',
                            fontWeight: 700,
                        }}
                    >
                        &
                    </p>
                    <p
                        style={{
                            fontFamily: 'var(--font-couple-names)',
                            fontSize: '34px',
                            color: '#3A3A3A',
                            lineHeight: 1.15,
                            fontWeight: 700,
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
                            fontFamily: 'var(--font-display-serif)',
                            fontSize: '18px',
                            color: '#4A5D3A',
                            letterSpacing: '0.1em',
                            lineHeight: 1.8,
                            fontWeight: 400,
                            textTransform: 'lowercase',
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
                            fontFamily: 'var(--font-primary)',
                            fontSize: '20px',
                            color: '#3A3A3A',
                            fontWeight: 500,
                            letterSpacing: '0.1em',
                        }}
                    >
                        13 : 00, {weddingConfig.event.dayOfWeek}
                    </p>
                </div>

                {/* Date display - month / DAY / year */}
                <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="text-center">
                        <p
                            style={{
                                fontFamily: 'var(--font-primary)',
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
                                fontFamily: 'var(--font-primary)',
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
                            fontFamily: 'var(--font-primary)',
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
                                fontFamily: 'var(--font-primary)',
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
                                fontFamily: 'var(--font-primary)',
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
                        fontFamily: 'var(--font-primary)',
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

                {/* Venue cards */}
                <div className="flex flex-col gap-6">
                    <VenueCard
                        label="Lễ Thành Hôn"
                        side="Nhà Trai"
                        venue={weddingConfig.event.groom.venue}
                        address={weddingConfig.event.groom.address}
                        mapsUrl={weddingConfig.event.groom.mapsUrl}
                    />

                    {/* Connecting ornament */}
                    <div className="flex items-center justify-center gap-3">
                        <div
                            style={{
                                width: '40px',
                                height: '1px',
                                background: 'linear-gradient(90deg, transparent, #C8B99A)',
                            }}
                        />
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                                d="M8 2C8 2 3 6 3 9C3 11.5 5.2 13.5 8 14C10.8 13.5 13 11.5 13 9C13 6 8 2 8 2Z"
                                fill="#9BAF88"
                                opacity="0.35"
                            />
                        </svg>
                        <div
                            style={{
                                width: '40px',
                                height: '1px',
                                background: 'linear-gradient(90deg, #C8B99A, transparent)',
                            }}
                        />
                    </div>

                    <VenueCard
                        label="Lễ Vu Quy"
                        side="Nhà Gái"
                        venue={weddingConfig.event.bride.venue}
                        address={weddingConfig.event.bride.address}
                        mapsUrl={weddingConfig.event.bride.mapsUrl}
                    />
                </div>
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

function VenueCard({
    label,
    side,
    venue,
    address,
    mapsUrl,
}: {
    label: string
    side: string
    venue: string
    address: string
    mapsUrl: string
}) {
    return (
        <div
            style={{
                background: 'rgba(255,255,255,0.45)',
                borderRadius: '12px',
                padding: '20px 16px 18px',
                border: '1px solid rgba(200,185,154,0.3)',
            }}
        >
            {/* Side label */}
            <p
                style={{
                    fontFamily: 'var(--font-primary)',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#9BAF88',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    marginBottom: '2px',
                }}
            >
                {label}
            </p>

            {/* Venue name */}
            <p
                style={{
                    fontFamily: 'var(--font-venue)',
                    fontSize: '26px',
                    color: '#4A5D3A',
                    lineHeight: 1.4,
                    marginBottom: '2px',
                }}
            >
                {venue}
            </p>

            {/* Side tag */}
            <p
                style={{
                    fontFamily: 'var(--font-primary)',
                    fontSize: '12px',
                    color: '#8B7355',
                    fontStyle: 'italic',
                    marginBottom: '8px',
                }}
            >
                {side}
            </p>

            {/* Address */}
            <p
                style={{
                    fontFamily: 'var(--font-primary)',
                    fontSize: '13px',
                    color: '#666',
                    lineHeight: 1.6,
                    marginBottom: '12px',
                }}
            >
                {address}
            </p>

            {/* Map link */}
            <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 no-underline"
                style={{
                    fontFamily: 'var(--font-primary)',
                    fontSize: '13px',
                    color: '#4A5D3A',
                    fontWeight: 500,
                    borderBottom: '1px solid rgba(155,175,136,0.5)',
                    paddingBottom: '1px',
                }}
            >
                <MapPin size={14} strokeWidth={1.5} />
                Xem bản đồ
            </a>
        </div>
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
