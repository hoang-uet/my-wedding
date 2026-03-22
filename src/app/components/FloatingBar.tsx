import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X, Camera, Smile, Send, ChevronDown, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useWishes } from './useWishes'
import { NameModal } from './NameModal'

interface FloatingBarProps {
    onScrollToGallery: () => void
    onScrollToGift: () => void
    /** Called when user clicks "Bắn tim". Replaces old DOM-based heart animation. */
    onShootHearts?: () => void
}

/** Small presentational component for peek wish items (avoids duplication) */
function PeekWishItem({ wish }: { wish: import('./useWishes').Wish }) {
    return (
        <div
            className="mb-1.5"
            style={{
                maxWidth: '90%',
                background: 'rgba(255,255,255,0.5)',
                borderRadius: '10px',
                padding: '5px 10px',
                border: '1px solid rgba(212,204,190,0.3)',
            }}
        >
            <span
                style={{
                    fontFamily: 'var(--font-primary)',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#4A5D3A',
                }}
            >
                {wish.guest_name}:
            </span>{' '}
            <span
                style={{
                    fontFamily: 'var(--font-primary)',
                    fontSize: '11px',
                    color: '#4A4A4A',
                }}
            >
                {wish.message}
            </span>
        </div>
    )
}

/** Format relative time in Vietnamese */
function timeAgo(dateStr: string): string {
    try {
        return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: vi })
    } catch {
        return ''
    }
}

export function FloatingBar({ onScrollToGallery, onScrollToGift, onShootHearts }: FloatingBarProps) {
    // --- Wishes state ---
    const { wishes, isLoading, sendWish, isSending, error, clearError, cooldownRemaining } =
        useWishes()

    // --- UI state ---
    const [showMessages, setShowMessages] = useState(false)
    const [peekDismissed, setPeekDismissed] = useState(false)
    const [nameModalOpen, setNameModalOpen] = useState(false)
    const [newMessage, setNewMessage] = useState('')

    // --- Auto-scroll state ---
    const messagesListRef = useRef<HTMLDivElement>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [isUserScrolling, setIsUserScrolling] = useState(false)
    const [hasNewMessages, setHasNewMessages] = useState(false)
    const prevWishCountRef = useRef(wishes.length)

    // --- Peek mode: last 5 wishes ---
    const peekWishes = useMemo(() => wishes.slice(-5), [wishes])
    const showPeek = !showMessages && !peekDismissed && peekWishes.length > 0

    // --- Peek auto-scroll loop (CSS animation driven, duplicated content for seamless loop) ---
    const peekScrollRef = useRef<HTMLDivElement>(null)
    const [peekScrollDuration, setPeekScrollDuration] = useState(12)

    // Measure peek content height to calculate animation duration
    useEffect(() => {
        if (!showPeek || !peekScrollRef.current) return
        const el = peekScrollRef.current
        // Each "copy" is half the total scrollHeight (since content is duplicated)
        const singleHeight = el.scrollHeight / 2
        // ~30px/s scroll speed — adjust for content amount
        const speed = 30
        const duration = Math.max(6, singleHeight / speed)
        setPeekScrollDuration(duration)
    }, [showPeek, peekWishes])

    // --- Detect new messages for auto-scroll ---
    useEffect(() => {
        if (wishes.length > prevWishCountRef.current) {
            if (isUserScrolling) {
                setHasNewMessages(true)
            } else {
                // Auto-scroll to bottom
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
            }
        }
        prevWishCountRef.current = wishes.length
    }, [wishes.length, isUserScrolling])

    // --- Scroll detection: pause auto-scroll when user scrolls up ---
    const handleMessagesScroll = useCallback(() => {
        const el = messagesListRef.current
        if (!el) return
        const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
        // Consider "at bottom" if within 60px
        if (distanceFromBottom < 60) {
            setIsUserScrolling(false)
            setHasNewMessages(false)
        } else {
            setIsUserScrolling(true)
        }
    }, [])

    // --- Scroll to bottom helper ---
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        setIsUserScrolling(false)
        setHasNewMessages(false)
    }, [])

    // --- Initial scroll to bottom when overlay opens ---
    useEffect(() => {
        if (showMessages) {
            // Double rAF to ensure DOM has fully laid out before scrolling
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    const el = messagesListRef.current
                    if (el) {
                        el.scrollTop = el.scrollHeight
                    }
                    setIsUserScrolling(false)
                    setHasNewMessages(false)
                })
            })
        }
    }, [showMessages])

    // --- Handle "Gửi lời chúc..." click ---
    const handleInputAreaClick = useCallback(() => {
        if (showMessages) return // Already open

        const guestName = localStorage.getItem('guest_name')
        if (!guestName) {
            setNameModalOpen(true)
        } else {
            setPeekDismissed(false) // Reset so peek shows when closing overlay
            setShowMessages(true)
        }
    }, [showMessages])

    // --- Handle name confirmation ---
    const handleNameConfirm = useCallback((name: string) => {
        localStorage.setItem('guest_name', name)
        setNameModalOpen(false)
        setShowMessages(true)
    }, [])

    // --- Handle send ---
    const handleSend = useCallback(async () => {
        if (!newMessage.trim() || isSending || cooldownRemaining > 0) return
        clearError()
        await sendWish(newMessage)
        if (!error) {
            setNewMessage('')
        }
    }, [newMessage, isSending, cooldownRemaining, sendWish, clearError, error])

    // --- Close full overlay ---
    const handleCloseOverlay = useCallback(() => {
        setShowMessages(false)
        setNewMessage('')
        clearError()
    }, [clearError])

    return (
        <>
            {/* ===== PEEK MODE ===== */}
            <AnimatePresence>
                {showPeek && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="absolute bottom-[56px] left-0 right-0 z-[790]"
                        style={{ pointerEvents: 'auto' }}
                    >
                        {/* Close peek button */}
                        <button
                            onClick={() => setPeekDismissed(true)}
                            className="absolute top-1 right-2 flex items-center justify-center cursor-pointer z-10"
                            style={{
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                background: 'rgba(74,93,58,0.25)',
                                border: 'none',
                                color: '#4A5D3A',
                            }}
                        >
                            <X size={10} />
                        </button>

                        {/* Peek messages with gradient fade + auto-scroll loop */}
                        <div
                            style={{
                                maxHeight: '140px',
                                overflow: 'hidden',
                                position: 'relative',
                                padding: '8px 12px 4px',
                            }}
                        >
                            {/* Top gradient fade */}
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '24px',
                                    background:
                                        'linear-gradient(180deg, rgba(240,235,226,1) 0%, transparent 100%)',
                                    zIndex: 1,
                                    pointerEvents: 'none',
                                }}
                            />
                            {/* Bottom gradient fade */}
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: '24px',
                                    background:
                                        'linear-gradient(0deg, rgba(240,235,226,1) 0%, transparent 100%)',
                                    zIndex: 1,
                                    pointerEvents: 'none',
                                }}
                            />

                            {/* Scrolling peek messages — duplicated for seamless loop */}
                            <div
                                ref={peekScrollRef}
                                className="peek-scroll-container"
                                style={{
                                    opacity: 0.7,
                                    animation: `peekScrollLoop ${peekScrollDuration}s linear infinite`,
                                }}
                            >
                                {/* First copy */}
                                {peekWishes.map((wish) => (
                                    <PeekWishItem key={wish.id} wish={wish} />
                                ))}
                                {/* Second copy for seamless loop */}
                                {peekWishes.map((wish) => (
                                    <PeekWishItem key={`dup-${wish.id}`} wish={wish} />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ===== FULL MESSAGES OVERLAY ===== */}
            <AnimatePresence>
                {showMessages && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
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
                                onClick={handleCloseOverlay}
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
                        <div
                            ref={messagesListRef}
                            onScroll={handleMessagesScroll}
                            className="flex-1 overflow-y-auto px-3 pb-2"
                            style={{ maxHeight: '45vh', position: 'relative' }}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 size={20} className="animate-spin" color="#8B7355" />
                                </div>
                            ) : wishes.length === 0 ? (
                                <div
                                    className="flex items-center justify-center py-8"
                                    style={{
                                        fontFamily: 'var(--font-primary)',
                                        fontSize: '13px',
                                        color: '#8B7355',
                                    }}
                                >
                                    Hãy là người đầu tiên gửi lời chúc! 💌
                                </div>
                            ) : (
                                wishes.map((wish) => (
                                    <motion.div
                                        key={wish.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.25 }}
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
                                        <div className="flex items-baseline gap-1">
                                            <span
                                                style={{
                                                    fontFamily: 'var(--font-primary)',
                                                    fontSize: '12px',
                                                    fontWeight: 700,
                                                    color: '#4A5D3A',
                                                }}
                                            >
                                                {wish.guest_name}
                                            </span>
                                            <span
                                                style={{
                                                    fontFamily: 'var(--font-primary)',
                                                    fontSize: '10px',
                                                    color: '#B0A08C',
                                                }}
                                            >
                                                {timeAgo(wish.created_at)}
                                            </span>
                                        </div>
                                        <p
                                            style={{
                                                fontFamily: 'var(--font-primary)',
                                                fontSize: '12px',
                                                color: '#4A4A4A',
                                                margin: '2px 0 0',
                                                lineHeight: 1.4,
                                                wordBreak: 'break-word',
                                            }}
                                        >
                                            {wish.message}
                                        </p>
                                    </motion.div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* New messages indicator */}
                        <AnimatePresence>
                            {hasNewMessages && (
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    onClick={scrollToBottom}
                                    className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 cursor-pointer z-10"
                                    style={{
                                        background: 'rgba(74,93,58,0.9)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '16px',
                                        padding: '4px 12px',
                                        fontFamily: 'var(--font-primary)',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                    }}
                                >
                                    <ChevronDown size={12} />
                                    Lời chúc mới
                                </motion.button>
                            )}
                        </AnimatePresence>

                        {/* Error message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="px-3 pb-1"
                                >
                                    <p
                                        style={{
                                            fontFamily: 'var(--font-primary)',
                                            fontSize: '11px',
                                            color: '#E87461',
                                            margin: 0,
                                            padding: '4px 0',
                                        }}
                                    >
                                        {error}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ===== BOTTOM BAR ===== */}
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
                    onClick={handleInputAreaClick}
                >
                    {showMessages ? (
                        <div className="flex items-center gap-1 flex-1">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => {
                                    setNewMessage(e.target.value)
                                    if (error) clearError()
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Gửi lời chúc..."
                                maxLength={1000}
                                className="flex-1 bg-transparent outline-none border-none"
                                style={{
                                    fontFamily: 'var(--font-primary)',
                                    fontSize: '13px',
                                    color: '#3A3A3A',
                                }}
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                            />
                            {/* Send button / Cooldown / Sending spinner */}
                            {isSending ? (
                                <Loader2 size={14} className="animate-spin" color="#8B7355" />
                            ) : cooldownRemaining > 0 ? (
                                <span
                                    style={{
                                        fontFamily: 'var(--font-primary)',
                                        fontSize: '11px',
                                        color: '#B0A08C',
                                        minWidth: '20px',
                                        textAlign: 'center',
                                    }}
                                >
                                    {cooldownRemaining}s
                                </span>
                            ) : (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleSend()
                                    }}
                                    className="cursor-pointer"
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: '2px',
                                    }}
                                >
                                    <Send size={14} color="#4A5D3A" />
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <span
                                style={{
                                    fontFamily: 'var(--font-primary)',
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
                    onClick={onShootHearts}
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
                            fontFamily: 'var(--font-primary)',
                            fontSize: '11px',
                            color: '#8B7355',
                            fontWeight: 600,
                        }}
                    >
                        Bắn tim
                    </span>
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
                </button>
            </div>

            {/* ===== NAME MODAL ===== */}
            <NameModal
                open={nameModalOpen}
                onConfirm={handleNameConfirm}
                onClose={() => setNameModalOpen(false)}
            />

            <style>{`
                @keyframes peekScrollLoop {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-50%); }
                }
            `}</style>
        </>
    )
}
