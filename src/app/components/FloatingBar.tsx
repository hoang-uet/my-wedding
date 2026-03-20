import { useState, useCallback, useRef, useEffect } from 'react'
import { X, Gift, Camera, Smile, Send } from 'lucide-react'

interface FloatingBarProps {
    onScrollToGallery: () => void
    onScrollToGift: () => void
}

const heartColors = ['#E87461', '#F5A3A3', '#E8B4A0', '#D4856A', '#F0C0C0']

const MOCK_MESSAGES = [
    { id: 1, name: 'Thanh', emoji: '🌸', text: 'Chúc mừng hạnh phúc lứa đôi!' },
    {
        id: 2,
        name: 'Ngọc',
        emoji: '🎉',
        text: 'May your love story be beautiful and endless!',
    },
    {
        id: 3,
        name: 'Erik',
        emoji: '💕',
        text: 'Mãi mãi hạnh phúc bên nhau!',
    },
    {
        id: 4,
        name: 'Phương',
        emoji: '🎊',
        text: 'Chúc hai bạn luôn vui vẻ, thấu hiểu và nâng đỡ nhau!',
    },
    {
        id: 5,
        name: 'Ngọc',
        emoji: '💐',
        text: 'Trăm năm hạnh phúc!',
    },
]

export function FloatingBar({ onScrollToGallery, onScrollToGift }: FloatingBarProps) {
    const [showMessages, setShowMessages] = useState(false)
    const [messages, setMessages] = useState(MOCK_MESSAGES)
    const [newMessage, setNewMessage] = useState('')
    const [hearts, setHearts] = useState<
        { id: number; x: number; size: number; rotation: number; color: string }[]
    >([])
    const heartIdRef = useRef(0)

    const shootHearts = useCallback(() => {
        const newHearts = Array.from({ length: 7 }, () => ({
            id: heartIdRef.current++,
            x: Math.random() * 80 - 40,
            size: 14 + Math.random() * 12,
            rotation: Math.random() * 50 - 25,
            color: heartColors[Math.floor(Math.random() * heartColors.length)],
        }))
        setHearts((prev) => [...prev, ...newHearts])

        setTimeout(() => {
            setHearts((prev) => prev.filter((h) => !newHearts.find((nh) => nh.id === h.id)))
        }, 1000)
    }, [])

    const sendMessage = useCallback(() => {
        if (!newMessage.trim()) return
        setMessages((prev) => [
            ...prev,
            {
                id: Date.now(),
                name: 'Bạn',
                emoji: '❤️',
                text: newMessage.trim(),
            },
        ])
        setNewMessage('')
    }, [newMessage])

    const messagesEndRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages.length])

    return (
        <>
            {/* Messages overlay */}
            {showMessages && (
                <div
                    className="absolute bottom-[56px] left-0 right-0 z-[800]"
                    style={{
                        maxHeight: '55vh',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        background:
                            'linear-gradient(180deg, transparent 0%, rgba(240,235,226,0.95) 15%)',
                    }}
                >
                    {/* Close button */}
                    <div className="flex justify-end px-3 pt-6 pb-1">
                        <button
                            onClick={() => setShowMessages(false)}
                            className="flex items-center justify-center cursor-pointer"
                            style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                background: 'rgba(74,93,58,0.2)',
                                border: 'none',
                                color: '#4A5D3A',
                            }}
                        >
                            <X size={14} />
                        </button>
                    </div>

                    {/* Messages list */}
                    <div className="flex-1 overflow-y-auto px-3 pb-2" style={{ maxHeight: '45vh' }}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className="mb-2"
                                style={{
                                    maxWidth: '88%',
                                    background: 'rgba(255,255,255,0.7)',
                                    borderRadius: '12px',
                                    padding: '8px 12px',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                                    border: '1px solid rgba(212,204,190,0.4)',
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: "'Quicksand', sans-serif",
                                        fontSize: '12px',
                                        fontWeight: 700,
                                        color: '#4A5D3A',
                                    }}
                                >
                                    {msg.name}:
                                </span>{' '}
                                <span
                                    style={{
                                        fontFamily: "'Quicksand', sans-serif",
                                        fontSize: '12px',
                                        color: '#4A4A4A',
                                    }}
                                >
                                    {msg.emoji} {msg.text}
                                </span>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            )}

            {/* Floating hearts animation */}
            <div className="absolute bottom-[56px] left-1/2 -translate-x-1/2 pointer-events-none z-[850]">
                {hearts.map((heart) => (
                    <div
                        key={heart.id}
                        className="absolute"
                        style={{
                            left: `${heart.x}px`,
                            animation: 'floatingHeart 900ms ease-out forwards',
                            transform: `rotate(${heart.rotation}deg)`,
                        }}
                    >
                        <svg
                            width={heart.size}
                            height={heart.size}
                            viewBox="0 0 24 24"
                            fill={heart.color}
                        >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </div>
                ))}
            </div>

            {/* Bottom bar */}
            <div
                className="absolute bottom-0 left-0 right-0 z-[800] flex items-center gap-2"
                style={{
                    background: 'rgba(255,255,255,0.92)',
                    backdropFilter: 'blur(12px)',
                    padding: '8px 10px',
                    borderTop: '1px solid rgba(212,204,190,0.5)',
                }}
            >
                {/* Message input */}
                <div
                    className="flex-1 flex items-center gap-1 cursor-pointer"
                    style={{
                        background: '#F0EBE2',
                        borderRadius: '20px',
                        padding: '7px 12px',
                        border: '1px solid rgba(212,204,190,0.3)',
                    }}
                    onClick={() => {
                        setShowMessages(true)
                    }}
                >
                    {showMessages ? (
                        <div className="flex items-center gap-1 flex-1">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Gửi lời chúc..."
                                className="flex-1 bg-transparent outline-none border-none"
                                style={{
                                    fontFamily: "'Quicksand', sans-serif",
                                    fontSize: '13px',
                                    color: '#3A3A3A',
                                }}
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    sendMessage()
                                }}
                                className="cursor-pointer"
                                style={{ background: 'none', border: 'none', padding: '2px' }}
                            >
                                <Send size={14} color="#4A5D3A" />
                            </button>
                        </div>
                    ) : (
                        <>
                            <span
                                style={{
                                    fontFamily: "'Quicksand', sans-serif",
                                    fontSize: '12px',
                                    color: '#999',
                                }}
                            >
                                Gửi lời chúc...
                            </span>
                            <Smile size={14} color="#C8B99A" />
                        </>
                    )}
                </div>

                {/* Shoot hearts button */}
                <button
                    onClick={shootHearts}
                    className="flex items-center gap-1 shrink-0 cursor-pointer"
                    style={{
                        background: 'rgba(232,180,160,0.25)',
                        border: 'none',
                        borderRadius: '20px',
                        padding: '7px 12px',
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#E87461">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span
                        style={{
                            fontFamily: "'Quicksand', sans-serif",
                            fontSize: '11px',
                            color: '#8B7355',
                            fontWeight: 600,
                        }}
                    >
                        Bắn tim
                    </span>
                </button>

                {/* Gift button */}
                <button
                    onClick={onScrollToGift}
                    className="flex items-center justify-center shrink-0 cursor-pointer"
                    style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: '#E87461',
                        border: 'none',
                        color: 'white',
                        boxShadow: '0 2px 8px rgba(232,116,97,0.35)',
                    }}
                >
                    <Gift size={15} strokeWidth={1.8} />
                </button>

                {/* Album button */}
                <button
                    onClick={onScrollToGallery}
                    className="flex items-center justify-center shrink-0 cursor-pointer relative"
                    style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: '#D4856A',
                        border: 'none',
                        color: 'white',
                        boxShadow: '0 2px 8px rgba(212,133,106,0.35)',
                    }}
                >
                    <Camera size={15} strokeWidth={1.8} />
                    <span
                        className="absolute -top-1 -right-1 flex items-center justify-center"
                        style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            background: '#E87461',
                            fontSize: '9px',
                            color: 'white',
                            fontWeight: 700,
                            fontFamily: "'Quicksand', sans-serif",
                        }}
                    >
                        6
                    </span>
                </button>
            </div>

            <style>{`
        @keyframes floatingHeart {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          50% { opacity: 0.8; }
          100% { opacity: 0; transform: translateY(-130px) scale(0.6); }
        }
      `}</style>
        </>
    )
}
