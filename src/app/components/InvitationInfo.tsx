import { weddingConfig } from './wedding-config'
import { useChildrenStagger } from './useScrollAnimation'

interface InvitationInfoProps {
    /** Guest name from personalized invitation link. null/undefined = generic text. */
    guestName?: string | null
}

/**
 * Central invitation section — sits between FamilyInfo and EventDetails.
 *
 * Layout (matches reference image top→bottom):
 *   Couple names  →  divider  →  "TRÂN TRỌNG KÍNH MỜI"
 *   →  Guest name (red calligraphy)  →  "THAM DỰ TIỆC CHUNG VUI"
 */
export function InvitationInfo({ guestName }: InvitationInfoProps) {
    const ref = useChildrenStagger(100)

    return (
        <section
            data-testid="invitation-info"
            className="relative"
            style={{
                background: '#F0EBE2',
                padding: '12px 20px 36px',
            }}
        >
            <div ref={ref} className="flex flex-col items-center text-center">
                {/* ── Couple names ── */}
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

                {/* ── Thin ornamental line ── */}
                <div
                    style={{
                        width: '60px',
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, #C8B99A, transparent)',
                        margin: '18px 0 20px',
                    }}
                />

                {/* ── "TRÂN TRỌNG KÍNH MỜI" ── */}
                <p
                    style={{
                        fontFamily: 'var(--font-venue)',
                        fontSize: '16px',
                        color: '#4A5D3A',
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        fontWeight: 400,
                    }}
                >
                    Trân trọng kính mời
                </p>

                {/* ── Guest name (personalized) OR generic "Bạn + Nt" ── */}
                <p
                    data-testid="invitation-guest-name"
                    style={{
                        fontFamily: 'var(--font-envelope-guest)',
                        fontSize: '40px',
                        color: 'rgb(199, 21, 21)',
                        lineHeight: 1.3,
                        marginTop: '12px',
                        maxWidth: '90%',
                        wordBreak: 'break-word',
                    }}
                >
                    {guestName || 'Bạn + Người thương'}
                </p>

                {/* ── "THAM DỰ TIỆC CHUNG VUI / CÙNG GIA ĐÌNH CHÚNG TÔI" ── */}
                <p
                    style={{
                        fontFamily: 'var(--font-venue)',
                        fontSize: '14px',
                        color: '#4A5D3A',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        fontWeight: 400,
                        lineHeight: 1.8,
                        marginTop: '16px',
                    }}
                >
                    Tham dự tiệc chung vui
                    <br />
                    cùng gia đình chúng tôi
                </p>
            </div>
        </section>
    )
}
