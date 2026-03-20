import { useState, useEffect } from 'react'
import { useScrollAnimation } from './useScrollAnimation'

const weddingDate = new Date('2026-04-05T09:00:00+07:00')

export function Countdown() {
    const ref = useScrollAnimation()

    const [timeLeft, setTimeLeft] = useState(getTimeLeft(weddingDate))

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getTimeLeft(weddingDate))
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const isPast = timeLeft.total <= 0

    const boxes = isPast
        ? []
        : [
              { value: timeLeft.days, label: 'Ngày' },
              { value: timeLeft.hours, label: 'Giờ' },
              { value: timeLeft.minutes, label: 'Phút' },
              { value: timeLeft.seconds, label: 'Giây' },
          ]

    return (
        <section
            ref={ref}
            style={{
                background: 'linear-gradient(135deg, #4A5D3A 0%, #3C4E30 50%, #354828 100%)',
                padding: '48px 20px',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Subtle leaf pattern overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04 }}>
                <svg width="100%" height="100%" viewBox="0 0 400 300">
                    <ellipse
                        cx="50"
                        cy="40"
                        rx="30"
                        ry="12"
                        fill="white"
                        transform="rotate(-20 50 40)"
                    />
                    <ellipse
                        cx="350"
                        cy="80"
                        rx="25"
                        ry="10"
                        fill="white"
                        transform="rotate(30 350 80)"
                    />
                    <ellipse
                        cx="100"
                        cy="250"
                        rx="28"
                        ry="11"
                        fill="white"
                        transform="rotate(-15 100 250)"
                    />
                    <ellipse
                        cx="300"
                        cy="220"
                        rx="22"
                        ry="9"
                        fill="white"
                        transform="rotate(25 300 220)"
                    />
                </svg>
            </div>

            <h2
                className="text-center mb-3 relative z-10"
                style={{
                    fontFamily: "'Monsieur La Doulaise', cursive",
                    fontSize: '44px',
                    color: '#FFFFFF',
                    fontWeight: 400,
                }}
            >
                Đếm ngược
            </h2>

            {/* Ornamental line */}
            <div className="flex justify-center mb-8 relative z-10">
                <div
                    style={{
                        width: '50px',
                        height: '1px',
                        background:
                            'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    }}
                />
            </div>

            {isPast ? (
                <p
                    className="text-center relative z-10"
                    style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '22px',
                        color: '#FFFFFF',
                        fontStyle: 'italic',
                    }}
                >
                    Hôm nay là ngày trọng đại!
                </p>
            ) : (
                <div className="flex gap-3 justify-center relative z-10">
                    {boxes.map((box) => (
                        <div
                            key={box.label}
                            className="text-center"
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                padding: '16px 8px',
                                minWidth: '70px',
                                border: '1px solid rgba(255,255,255,0.08)',
                                backdropFilter: 'blur(4px)',
                            }}
                        >
                            <p
                                style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                    fontSize: '36px',
                                    fontWeight: 300,
                                    color: '#FFFFFF',
                                    lineHeight: 1.1,
                                }}
                            >
                                {String(box.value).padStart(2, '0')}
                            </p>
                            <p
                                style={{
                                    fontFamily: "'Quicksand', sans-serif",
                                    fontSize: '10px',
                                    color: 'rgba(255,255,255,0.55)',
                                    letterSpacing: '0.15em',
                                    marginTop: '6px',
                                    textTransform: 'uppercase',
                                    fontWeight: 500,
                                }}
                            >
                                {box.label}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}

function getTimeLeft(target: Date) {
    const now = new Date()
    const total = target.getTime() - now.getTime()

    if (total <= 0) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }

    return {
        total,
        days: Math.floor(total / (1000 * 60 * 60 * 24)),
        hours: Math.floor((total / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((total / (1000 * 60)) % 60),
        seconds: Math.floor((total / 1000) % 60),
    }
}
