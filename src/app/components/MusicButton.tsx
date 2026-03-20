import audioIcon from '@/assets/audio-icon.png'

/**
 * Elegant vinyl disc music toggle button.
 *
 * Playing  → spinning dark-green disc with custom audio icon
 * Paused   → frosted white circle with audio icon (tinted green)
 *
 * Color palette matches the wedding theme: #4A5D3A green, #C8B99A gold.
 */

interface MusicButtonProps {
    isPlaying: boolean
    onClick: () => void
}

export function MusicButton({ isPlaying, onClick }: MusicButtonProps) {
    return (
        <>
            <button
                onClick={onClick}
                aria-label={isPlaying ? 'Tắt nhạc' : 'Bật nhạc'}
                style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    zIndex: 900,
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    // Vinyl disc: green gradient with inset groove rings
                    background: isPlaying
                        ? 'linear-gradient(135deg, #252b23 0%, #000000 50%, #3C4E34 100%)'
                        : 'rgba(255,255,255,0.85)',
                    boxShadow: isPlaying
                        ? [
                              'inset 0 0 0 2px rgba(200,185,154,0.25)',
                              'inset 0 0 0 5px rgba(255,255,255,0.06)',
                              'inset 0 0 0 8px rgba(0,0,0,0.08)',
                              'inset 0 0 0 11px rgba(255,255,255,0.04)',
                              '0 3px 16px rgba(60,78,52,0.35)',
                          ].join(', ')
                        : '0 2px 12px rgba(0,0,0,0.1)',
                    backdropFilter: isPlaying ? 'none' : 'blur(8px)',
                    transition: 'box-shadow 400ms ease, background 400ms ease',
                    animation: isPlaying ? 'vinylSpin 3s linear infinite' : 'none',
                }}
            >
                <img
                    src={audioIcon}
                    alt=""
                    style={{
                        width: '20px',
                        height: '20px',
                        objectFit: 'contain',
                        // White icon on playing (dark bg), green-tinted on paused (white bg)
                        filter: isPlaying
                            ? 'none'
                            : 'brightness(0) saturate(100%) invert(32%) sepia(15%) saturate(1200%) hue-rotate(70deg)',
                        transition: 'filter 400ms ease',
                    }}
                />
            </button>

            <style>{`
        @keyframes vinylSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </>
    )
}
