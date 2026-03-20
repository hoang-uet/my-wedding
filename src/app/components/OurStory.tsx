import { weddingConfig } from './wedding-config'
import { useChildrenStagger } from './useScrollAnimation'

export function OurStory() {
    const ref = useChildrenStagger(150)

    return (
        <section
            style={{
                background: 'linear-gradient(180deg, #F0EBE2 0%, #EDE8DD 100%)',
                padding: '52px 28px',
            }}
        >
            {/* Top leaf ornament */}
            <div className="flex justify-center mb-2 opacity-50">
                <LeafSprig />
            </div>

            <div ref={ref}>
                <h2
                    className="text-center mb-3"
                    style={{
                        fontFamily: "var(--font-script-elegant)",
                        fontSize: '55px',
                        color: '#4A5D3A',
                        fontWeight: 400,
                        lineHeight: 1.1,
                    }}
                >
                    Our story
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

                {weddingConfig.story.map((paragraph, index) => (
                    <p
                        key={index}
                        className="text-center mb-5"
                        style={{
                            fontFamily: "var(--font-primary)",
                            fontSize: '13px',
                            fontWeight: 500,
                            color: '#4A4A4A',
                            lineHeight: 1.82,
                        }}
                    >
                        {paragraph}
                    </p>
                ))}
            </div>

            {/* Bottom ornament */}
            <div className="flex justify-center mt-4 opacity-50">
                <LeafSprig />
            </div>
        </section>
    )
}

function LeafSprig() {
    return (
        <svg width="80" height="24" viewBox="0 0 80 24">
            <path
                d="M15 18 Q28 6 40 12 Q52 18 65 6"
                stroke="#9BAF88"
                strokeWidth="1"
                fill="none"
                opacity="0.6"
            />
            <ellipse
                cx="26"
                cy="10"
                rx="5"
                ry="2"
                fill="#9BAF88"
                opacity="0.3"
                transform="rotate(-25 26 10)"
            />
            <ellipse
                cx="54"
                cy="10"
                rx="5"
                ry="2"
                fill="#9BAF88"
                opacity="0.3"
                transform="rotate(25 54 10)"
            />
            <circle cx="40" cy="12" r="2" fill="#9BAF88" opacity="0.25" />
        </svg>
    )
}
