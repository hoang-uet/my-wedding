import { useScrollAnimation } from './useScrollAnimation'
import { CornerOrchidCluster } from './FloralOverlay'

export function WeddingGift() {
    const ref = useScrollAnimation()

    return (
        <section
            id="gift-section"
            ref={ref}
            className="relative overflow-hidden"
            style={{ background: '#F0EBE2', padding: '48px 24px' }}
        >
            {/* Floral corner — z-1, below content */}
            <CornerOrchidCluster position="top-right" size={85} delay={200} />
            {/* Ornamental line — z-10, above floral */}
            <div className="flex justify-center mb-6 relative z-10">
                <div
                    style={{
                        width: '50px',
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, #C8B99A, transparent)',
                    }}
                />
            </div>

            {/* Gift box illustration */}
            <div className="flex justify-center mb-6 relative z-10">
                <GiftBoxIllustration />
            </div>

            {/* Thank you text */}
            <p
                className="text-center mb-3 relative z-10"
                style={{
                    fontFamily: 'var(--font-primary)',
                    fontSize: '16px',
                    color: '#4A4A4A',
                    lineHeight: 1.8,
                    fontStyle: 'italic',
                }}
            >
                Cảm ơn bạn đã dành tình cảm cho chúng mình! Sự hiện diện của bạn chính là món quà ý
                nghĩa nhất, và chúng mình vô cùng trân quý khi được cùng bạn chia sẻ niềm hạnh phúc
                trong ngày trọng đại này.
            </p>

            {/* Subtle bottom ornament */}
            <div className="flex justify-center mt-6">
                <svg width="60" height="12" viewBox="0 0 60 12">
                    <line x1="0" y1="6" x2="22" y2="6" stroke="#C8B99A" strokeWidth="0.5" />
                    <circle cx="30" cy="6" r="2" fill="none" stroke="#9BAF88" strokeWidth="0.6" />
                    <line x1="38" y1="6" x2="60" y2="6" stroke="#C8B99A" strokeWidth="0.5" />
                </svg>
            </div>
        </section>
    )
}

function GiftBoxIllustration() {
    return (
        <svg width="100" height="110" viewBox="0 0 100 110">
            {/* Box body */}
            <rect
                x="18"
                y="48"
                width="64"
                height="50"
                rx="3"
                fill="#FAF0EA"
                stroke="#D4A886"
                strokeWidth="1.5"
            />
            {/* Box lid */}
            <rect
                x="13"
                y="38"
                width="74"
                height="14"
                rx="3"
                fill="#FAF0EA"
                stroke="#D4A886"
                strokeWidth="1.5"
            />
            {/* Ribbon vertical */}
            <rect x="45" y="38" width="10" height="60" fill="#E8B4A0" opacity="0.4" />
            {/* Ribbon horizontal */}
            <rect x="13" y="41" width="74" height="8" fill="#E8B4A0" opacity="0.3" />
            {/* Bow left */}
            <ellipse cx="42" cy="30" rx="14" ry="10" fill="#E8B4A0" opacity="0.7" />
            {/* Bow right */}
            <ellipse cx="58" cy="30" rx="14" ry="10" fill="#E8B4A0" opacity="0.7" />
            {/* Bow center */}
            <circle cx="50" cy="32" r="5" fill="#D4856A" opacity="0.6" />
            {/* Heart */}
            <path
                d="M50 10 C47 4 40 4 40 10 C40 16 50 22 50 22 C50 22 60 16 60 10 C60 4 53 4 50 10"
                fill="#E87461"
                opacity="0.7"
            />
            {/* Sparkles */}
            <circle cx="28" cy="18" r="1.5" fill="#E8C8A0" opacity="0.6" />
            <circle cx="72" cy="20" r="1" fill="#E8C8A0" opacity="0.5" />
            <circle cx="22" cy="28" r="1" fill="#E8C8A0" opacity="0.4" />
        </svg>
    )
}

export function FloralWreath() {
    return (
        <svg width="80" height="40" viewBox="0 0 80 40" opacity="0.6">
            <path
                d="M10 32 Q25 6 40 18 Q55 30 70 6"
                stroke="#9BAF88"
                strokeWidth="1.2"
                fill="none"
            />
            {/* White petals */}
            <circle cx="68" cy="8" r="5.5" fill="#F5E6E0" opacity="0.8" />
            <circle cx="63" cy="5" r="4" fill="#F5E6E0" opacity="0.75" />
            <circle cx="73" cy="5" r="4" fill="#F5E6E0" opacity="0.75" />
            <circle cx="68" cy="8" r="2" fill="#E8C8A0" opacity="0.45" />
            {/* Leaves */}
            <ellipse
                cx="24"
                cy="16"
                rx="6"
                ry="2.5"
                fill="#9BAF88"
                opacity="0.3"
                transform="rotate(-25 24 16)"
            />
            <ellipse
                cx="50"
                cy="22"
                rx="5"
                ry="2"
                fill="#9BAF88"
                opacity="0.25"
                transform="rotate(20 50 22)"
            />
        </svg>
    )
}
