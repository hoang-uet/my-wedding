import { useMemo, useRef, useEffect } from 'react'
import { weddingImages } from './wedding-config'
import { WeddingImage } from './WeddingImage'

export function CalendarHighlight() {
    const ref = useRef<HTMLDivElement>(null)

    // Wedding date: April 5, 2026
    const weddingDay = 5
    const month = 3 // April (0-indexed: Jan=0, Feb=1, Mar=2, Apr=3)
    const year = 2026

    const dayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

    const calendarData = useMemo(() => {
        const firstDaySunBased = new Date(year, month, 1).getDay()
        const mondayOffset = (firstDaySunBased - 1 + 7) % 7
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const cells: (number | null)[] = []

        for (let i = 0; i < mondayOffset; i++) {
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
        <section
            className="relative overflow-hidden"
            style={{ height: '80vh', maxHeight: '720px' }}
        >
            {/* Scenic image — fills section, cropped to center (couple) */}
            <WeddingImage
                image={weddingImages.scenic}
                alt="Đôi uyên ương trong khung cảnh đẹp"
                sizes="430px"
                style={{
                    aspectRatio: 'unset',
                    position: 'absolute',
                    inset: 0,
                    height: '100%',
                }}
                className="w-full h-full"
            />

            {/* Gradient overlay — bottom portion for calendar readability */}
            <div
                className="absolute inset-x-0 bottom-0"
                style={{
                    height: '60%',
                    background:
                        'linear-gradient(180deg, rgba(42,56,34,0) 0%, rgba(42,56,34,0.45) 35%, rgba(42,56,34,0.75) 100%)',
                }}
            />

            {/* Calendar anchored to bottom-center, full width */}
            <div
                className="absolute bottom-0 inset-x-0 z-10 flex flex-col"
                style={{ padding: '0 24px 28px 24px' }}
            >
                {/* Month title — right-aligned */}
                <h3
                    style={{
                        fontFamily: 'var(--font-label-casual)',
                        fontSize: '25px',
                        color: '#FFFFFF',
                        fontWeight: 500,
                        lineHeight: 2.2,
                        textAlign: 'right',
                    }}
                >
                    Tháng 4
                </h3>

                {/* Day labels — spread evenly */}
                <div className="grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
                    {dayLabels.map((day) => (
                        <div
                            key={day}
                            className="flex items-center justify-center"
                            style={{
                                height: '28px',
                                fontFamily: 'var(--font-primary)',
                                fontSize: '12px',
                                color: 'rgba(255,255,255,0.55)',
                                fontWeight: 600,
                                letterSpacing: '0.05em',
                            }}
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Separator line */}
                <div
                    style={{
                        width: '100%',
                        height: '1px',
                        background: 'rgba(255,255,255,0.25)',
                        marginBottom: '4px',
                    }}
                />

                {/* Calendar grid — spread evenly */}
                <div
                    ref={ref}
                    className="grid"
                    style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}
                >
                    {calendarData.map((day, i) => (
                        <div
                            key={i}
                            className="cal-cell flex items-center justify-center relative"
                            style={{
                                height: '40px',
                                fontFamily: 'var(--font-primary)',
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
                                        <img
                                            src="/heart-highlight.png"
                                            alt=""
                                            className="absolute pointer-events-none"
                                            style={{
                                                width: '42px',
                                                height: 'auto',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                animation:
                                                    'calHeartPulse 2.5s ease-in-out infinite',
                                            }}
                                        />
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
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.15); }
        }
      `}</style>
        </section>
    )
}
