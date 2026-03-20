import { useMemo, useRef, useEffect } from 'react'
import { weddingImages } from './wedding-config'
import { WeddingImage } from './WeddingImage'

export function CalendarHighlight() {
    const ref = useRef<HTMLDivElement>(null)

    // Wedding date: April 5, 2026
    const weddingDay = 5
    const month = 3 // April (0-indexed)
    const year = 2026

    const dayLabels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

    const calendarData = useMemo(() => {
        const firstDay = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const cells: (number | null)[] = []

        for (let i = 0; i < firstDay; i++) {
            cells.push(null)
        }
        for (let d = 1; d <= daysInMonth; d++) {
            cells.push(d)
        }
        return cells
    }, [])

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const cells = el.querySelectorAll('.cal-cell')
                        cells.forEach((cell, i) => {
                            const htmlCell = cell as HTMLElement
                            setTimeout(() => {
                                htmlCell.style.opacity = '1'
                                htmlCell.style.transform = 'translateY(0)'
                            }, i * 25)
                        })
                        observer.unobserve(entry.target)
                    }
                })
            },
            { threshold: 0.15 },
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return (
        <section className="relative" style={{ minHeight: '440px' }}>
            <WeddingImage
                image={weddingImages.scenic}
                alt="Đôi uyên ương trong khung cảnh đẹp"
                sizes="430px"
                className="absolute inset-0 w-full h-full"
                style={{ aspectRatio: 'unset' }}
            />
            <div
                className="absolute inset-0"
                style={{
                    background:
                        'linear-gradient(180deg, rgba(58,74,48,0.55) 0%, rgba(42,56,34,0.65) 100%)',
                }}
            />

            <div className="relative z-10 flex flex-col items-center justify-center h-full px-5 py-12">
                {/* Month/Year title */}
                <h3
                    className="mb-1"
                    style={{
                        fontFamily: "'Monsieur La Doulaise', cursive",
                        fontSize: '42px',
                        color: '#FFFFFF',
                        fontWeight: 400,
                    }}
                >
                    Tháng 4
                </h3>
                <p
                    style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '14px',
                        color: 'rgba(255,255,255,0.6)',
                        letterSpacing: '0.2em',
                        marginBottom: '20px',
                    }}
                >
                    2026
                </p>

                {/* Day labels */}
                <div className="grid gap-0 mb-2" style={{ gridTemplateColumns: 'repeat(7, 38px)' }}>
                    {dayLabels.map((day) => (
                        <div
                            key={day}
                            className="flex items-center justify-center"
                            style={{
                                width: '38px',
                                height: '28px',
                                fontFamily: "'Quicksand', sans-serif",
                                fontSize: '11px',
                                color: 'rgba(255,255,255,0.5)',
                                fontWeight: 600,
                                letterSpacing: '0.05em',
                            }}
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div
                    ref={ref}
                    className="grid gap-0"
                    style={{ gridTemplateColumns: 'repeat(7, 38px)' }}
                >
                    {calendarData.map((day, i) => (
                        <div
                            key={i}
                            className="cal-cell flex items-center justify-center relative"
                            style={{
                                width: '38px',
                                height: '36px',
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: '15px',
                                color: day === weddingDay ? '#FFFFFF' : 'rgba(255,255,255,0.75)',
                                fontWeight: day === weddingDay ? 700 : 400,
                                opacity: 0,
                                transform: 'translateY(6px)',
                                transition: 'opacity 250ms ease, transform 250ms ease',
                            }}
                        >
                            {day !== null && (
                                <>
                                    {day === weddingDay && (
                                        <div
                                            className="absolute inset-0 flex items-center justify-center"
                                            style={{
                                                animation: 'calHeartPulse 2s ease-in-out infinite',
                                            }}
                                        >
                                            <svg
                                                width="30"
                                                height="28"
                                                viewBox="0 0 24 24"
                                                fill="#E87461"
                                            >
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                            </svg>
                                        </div>
                                    )}
                                    <span className="relative z-10">{day}</span>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        @keyframes calHeartPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.12); }
        }
      `}</style>
        </section>
    )
}
