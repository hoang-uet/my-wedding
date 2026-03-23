import { useState } from 'react'
import { useScrollAnimation } from './useScrollAnimation'
import { CornerOrchidCluster, BouquetAccent } from './FloralOverlay'

export function RSVPForm() {
    const ref = useScrollAnimation()
    const [name, setName] = useState('')
    const [attendance, setAttendance] = useState<'yes' | 'no'>('yes')
    const [guests, setGuests] = useState('1')
    const [wish, setWish] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const trimmed = name.trim()
        if (!trimmed || trimmed.length < 2) {
            setError('Vui lòng nhập họ tên (ít nhất 2 ký tự)')
            return
        }
        setError('')
        setLoading(true)

        // Simulate API call
        setTimeout(() => {
            setSubmitted(true)
            setLoading(false)
        }, 1000)
    }

    if (submitted) {
        return (
            <section
                style={{ background: '#F0EBE2', padding: '48px 24px' }}
                className="text-center"
            >
                <div style={{ animation: 'rsvpFadeIn 600ms ease' }}>
                    <p
                        style={{
                            fontFamily: 'var(--font-script-elegant)',
                            fontSize: '36px',
                            color: '#4A5D3A',
                            marginBottom: '12px',
                        }}
                    >
                        Cảm ơn bạn!
                    </p>
                    <p
                        style={{
                            fontFamily: 'var(--font-display-serif)',
                            fontSize: '16px',
                            color: '#666',
                            fontStyle: 'italic',
                        }}
                    >
                        Chúng mình mong gặp bạn nhé ♡
                    </p>
                </div>
                <style>{`
          @keyframes rsvpFadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
            </section>
        )
    }

    const inputStyle: React.CSSProperties = {
        width: '100%',
        border: '1px solid #D4CCBE',
        borderRadius: '6px',
        padding: '11px 14px',
        fontFamily: 'var(--font-primary)',
        fontSize: '16px',
        outline: 'none',
        boxSizing: 'border-box' as const,
        background: 'white',
        transition: 'border-color 200ms, box-shadow 200ms',
        color: '#3A3A3A',
    }

    return (
        <section
            ref={ref}
            className="relative overflow-hidden"
            style={{ background: '#F0EBE2', padding: '48px 20px' }}
        >
            {/* Floral accents — z-1, below form content */}
            <CornerOrchidCluster position="top-left" size={95} delay={200} />
            <BouquetAccent position="bottom-right" size={140} delay={500} />

            {/* Intro text — z-10 ensures text stays above floral decorations */}
            <p
                className="text-center mb-6 relative z-10"
                style={{
                    fontFamily: 'var(--font-display-serif)',
                    fontSize: '16px',
                    color: '#4A5D3A',
                    lineHeight: 1.8,
                    fontStyle: 'italic',
                }}
            >
                Hãy xác nhận sự có mặt của bạn để chúng mình chuẩn bị đón tiếp một cách chu đáo
                nhất. Trân trọng!
            </p>

            {/* Form — z-10 stays above floral decorations (z-1) */}
            <form
                onSubmit={handleSubmit}
                className="relative z-10"
                style={{
                    background: 'rgba(255,255,255,0.6)',
                    borderRadius: '12px',
                    padding: '28px 20px',
                    border: '1px solid #D4CCBE',
                    backdropFilter: 'blur(4px)',
                }}
            >
                <h3
                    className="text-center mb-6"
                    style={{
                        fontFamily: 'var(--font-display-serif)',
                        fontSize: '22px',
                        fontWeight: 600,
                        color: '#4A5D3A',
                        letterSpacing: '0.05em',
                    }}
                >
                    Xác nhận tham dự
                </h3>

                {/* Name field */}
                <div className="mb-5">
                    <label
                        htmlFor="rsvp-name"
                        style={{
                            fontFamily: 'var(--font-primary)',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#4A5D3A',
                            display: 'block',
                            marginBottom: '6px',
                            letterSpacing: '0.03em',
                        }}
                    >
                        Họ và tên
                    </label>
                    <input
                        id="rsvp-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nhập tên của bạn"
                        style={{
                            ...inputStyle,
                            borderColor: error ? '#E87461' : '#D4CCBE',
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#9BAF88'
                            e.target.style.boxShadow = '0 0 0 3px rgba(155,175,136,0.12)'
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = error ? '#E87461' : '#D4CCBE'
                            e.target.style.boxShadow = 'none'
                        }}
                    />
                    {error && (
                        <p
                            style={{
                                fontFamily: 'var(--font-primary)',
                                fontSize: '12px',
                                color: '#E87461',
                                marginTop: '4px',
                            }}
                        >
                            {error}
                        </p>
                    )}
                </div>

                {/* Attendance */}
                <div className="mb-5">
                    <p
                        style={{
                            fontFamily: 'var(--font-primary)',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#4A5D3A',
                            marginBottom: '8px',
                            letterSpacing: '0.03em',
                        }}
                    >
                        Bạn sẽ tham dự chứ?
                    </p>
                    <label className="flex items-center gap-2 mb-2 cursor-pointer">
                        <input
                            type="radio"
                            name="attendance"
                            checked={attendance === 'yes'}
                            onChange={() => setAttendance('yes')}
                            style={{ accentColor: '#4A5D3A' }}
                        />
                        <span
                            style={{
                                fontFamily: 'var(--font-primary)',
                                fontSize: '14px',
                                color: '#3A3A3A',
                            }}
                        >
                            Có, tôi sẽ tham dự
                        </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="attendance"
                            checked={attendance === 'no'}
                            onChange={() => setAttendance('no')}
                            style={{ accentColor: '#4A5D3A' }}
                        />
                        <span
                            style={{
                                fontFamily: 'var(--font-primary)',
                                fontSize: '14px',
                                color: '#3A3A3A',
                            }}
                        >
                            Tôi bận, rất tiếc...
                        </span>
                    </label>
                </div>

                {/* Number of guests */}
                {attendance === 'yes' && (
                    <div className="mb-5">
                        <label
                            htmlFor="rsvp-guests"
                            style={{
                                fontFamily: 'var(--font-primary)',
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#4A5D3A',
                                display: 'block',
                                marginBottom: '6px',
                                letterSpacing: '0.03em',
                            }}
                        >
                            Số lượng người tham dự
                        </label>
                        <select
                            id="rsvp-guests"
                            value={guests}
                            onChange={(e) => setGuests(e.target.value)}
                            style={inputStyle}
                        >
                            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                                <option key={n} value={n}>
                                    {n} người
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Wishes */}
                <div className="mb-5">
                    <label
                        htmlFor="rsvp-wish"
                        style={{
                            fontFamily: 'var(--font-primary)',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#4A5D3A',
                            display: 'block',
                            marginBottom: '6px',
                            letterSpacing: '0.03em',
                        }}
                    >
                        Lời chúc (tuỳ chọn)
                    </label>
                    <textarea
                        id="rsvp-wish"
                        value={wish}
                        onChange={(e) => setWish(e.target.value)}
                        placeholder="Gửi lời chúc đến cô dâu chú rể..."
                        rows={3}
                        style={{
                            ...inputStyle,
                            resize: 'none' as const,
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#9BAF88'
                            e.target.style.boxShadow = '0 0 0 3px rgba(155,175,136,0.12)'
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#D4CCBE'
                            e.target.style.boxShadow = 'none'
                        }}
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full cursor-pointer"
                    style={{
                        background: loading ? 'rgba(74,93,58,0.5)' : '#4A5D3A',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '13px',
                        fontFamily: 'var(--font-primary)',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'background 200ms, transform 100ms',
                        letterSpacing: '0.05em',
                    }}
                    onMouseEnter={(e) => {
                        if (!loading) (e.target as HTMLElement).style.background = '#5A7247'
                    }}
                    onMouseLeave={(e) => {
                        if (!loading) (e.target as HTMLElement).style.background = '#4A5D3A'
                    }}
                >
                    {loading ? 'Đang gửi...' : 'Gửi xác nhận'}
                </button>
            </form>
        </section>
    )
}
