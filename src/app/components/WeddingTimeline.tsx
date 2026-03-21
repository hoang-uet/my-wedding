import { weddingConfig } from './wedding-config'
import { useChildrenStagger } from './useScrollAnimation'

export function WeddingTimeline() {
    const ref = useChildrenStagger(200)

    return (
        <section
            style={{
                background: '#F0EBE2',
                padding: '48px 16px',
            }}
        >
            <h2
                className="text-center mb-2"
                style={{
                    fontFamily: 'var(--font-calligraphy-vn)',
                    fontSize: '43px',
                    color: '#4A5D3A',
                    fontWeight: 400,
                }}
            >
                Timeline 04-04-2026
            </h2>

            {/* Ornamental line */}
            <div className="flex justify-center mb-8">
                <div
                    style={{
                        width: '50px',
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, #C8B99A, transparent)',
                    }}
                />
            </div>

            <div ref={ref} className="grid grid-cols-3 gap-2">
                {weddingConfig.timeline.map((item) => (
                    <div key={item.time} className="text-center">
                        <div className="flex justify-center mb-3">
                            <div
                                className="flex items-center justify-center"
                                style={{
                                    width: '72px',
                                    height: '72px',
                                    borderRadius: '50%',
                                    border: '1.5px solid #C8B99A',
                                    background: 'rgba(155,175,136,0.08)',
                                }}
                            >
                                <TimelineIcon type={item.icon} />
                            </div>
                        </div>
                        <p
                            style={{
                                fontFamily: 'var(--font-primary)',
                                fontSize: '20px',
                                fontWeight: 600,
                                color: '#4A5D3A',
                                marginBottom: '2px',
                            }}
                        >
                            {item.time}
                        </p>
                        <p
                            style={{
                                fontFamily: 'var(--font-primary)',
                                fontSize: '12px',
                                color: '#8B7355',
                                fontWeight: 500,
                                letterSpacing: '0.05em',
                            }}
                        >
                            {item.label}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}

function TimelineIcon({ type }: { type: 'camera' | 'champagne' | 'rings' }) {
    const color = '#4A5D3A'

    if (type === 'camera') {
        return (
            <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <rect x="4" y="10" width="24" height="17" rx="2" />
                <path d="M11 10V8a2 2 0 012-2h6a2 2 0 012 2v2" />
                <circle cx="16" cy="18.5" r="5" />
                <circle cx="16" cy="18.5" r="2.5" />
                <circle cx="24" cy="14" r="1.5" fill={color} opacity="0.3" />
            </svg>
        )
    }

    if (type === 'champagne') {
        return (
            <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M10 28V20L7 6h8l-3 14z" />
                <line x1="6" y1="28" x2="14" y2="28" />
                <path d="M22 28V20l-3-14h8l-3 14z" />
                <line x1="18" y1="28" x2="26" y2="28" />
                <line x1="14" y1="12" x2="18" y2="12" />
                {/* Sparkles */}
                <circle cx="16" cy="4" r="1" fill={color} opacity="0.4" />
                <circle cx="13" cy="6" r="0.6" fill={color} opacity="0.3" />
                <circle cx="19" cy="6" r="0.6" fill={color} opacity="0.3" />
            </svg>
        )
    }

    // Rings
    return (
        <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="18" r="7" />
            <circle cx="20" cy="18" r="7" />
            {/* Diamond */}
            <polygon
                points="16,4 14,8 18,8"
                fill={color}
                opacity="0.25"
                stroke={color}
                strokeWidth="1"
            />
            <line x1="16" y1="8" x2="16" y2="11" />
        </svg>
    )
}
