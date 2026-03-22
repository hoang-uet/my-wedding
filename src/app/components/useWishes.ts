import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'

export interface Wish {
    id: string
    guest_name: string
    message: string
    created_at: string
}

export interface UseWishesReturn {
    wishes: Wish[]
    isLoading: boolean
    sendWish: (message: string) => Promise<void>
    isSending: boolean
    error: string | null
    clearError: () => void
    cooldownRemaining: number
}

const RATE_LIMIT_SECONDS = 5

export function useWishes(): UseWishesReturn {
    const [wishes, setWishes] = useState<Wish[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSending, setIsSending] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [cooldownRemaining, setCooldownRemaining] = useState(0)
    const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null)

    // Fetch initial wishes
    useEffect(() => {
        if (!supabase) {
            setIsLoading(false)
            return
        }

        async function fetchWishes() {
            const { data, error: fetchError } = await supabase!
                .from('wishes')
                .select('*')
                .order('created_at', { ascending: true })

            if (fetchError) {
                console.error('[useWishes] Fetch error:', fetchError.message)
                setError('Không thể tải lời chúc. Vui lòng thử lại.')
            } else {
                setWishes(data ?? [])
            }
            setIsLoading(false)
        }

        fetchWishes()
    }, [])

    // Realtime subscription
    useEffect(() => {
        if (!supabase) return

        const channel = supabase
            .channel('wishes-realtime')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'wishes' },
                (payload) => {
                    const newWish = payload.new as Wish
                    setWishes((prev) => {
                        // Avoid duplicates (e.g. from own insert)
                        if (prev.some((w) => w.id === newWish.id)) return prev
                        return [...prev, newWish]
                    })
                },
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    // Cooldown timer
    useEffect(() => {
        return () => {
            if (cooldownRef.current) clearInterval(cooldownRef.current)
        }
    }, [])

    const startCooldown = useCallback(() => {
        setCooldownRemaining(RATE_LIMIT_SECONDS)
        if (cooldownRef.current) clearInterval(cooldownRef.current)

        cooldownRef.current = setInterval(() => {
            setCooldownRemaining((prev) => {
                if (prev <= 1) {
                    if (cooldownRef.current) clearInterval(cooldownRef.current)
                    cooldownRef.current = null
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }, [])

    const sendWish = useCallback(
        async (message: string) => {
            if (!supabase) {
                setError('Chưa kết nối Supabase. Vui lòng thử lại sau.')
                return
            }

            const trimmed = message.trim()
            if (!trimmed) {
                setError('Vui lòng nhập lời chúc.')
                return
            }
            if (trimmed.length > 1000) {
                setError('Lời chúc tối đa 1000 ký tự.')
                return
            }

            const guestName = localStorage.getItem('guest_name')
            if (!guestName) {
                setError('Vui lòng nhập tên trước.')
                return
            }

            if (cooldownRemaining > 0) return

            setIsSending(true)
            setError(null)

            const { error: insertError } = await supabase
                .from('wishes')
                .insert({ guest_name: guestName, message: trimmed })

            if (insertError) {
                console.error('[useWishes] Insert error:', insertError.message)
                setError('Gửi lời chúc thất bại. Vui lòng thử lại.')
            } else {
                startCooldown()
            }

            setIsSending(false)
        },
        [cooldownRemaining, startCooldown],
    )

    const clearError = useCallback(() => setError(null), [])

    return {
        wishes,
        isLoading,
        sendWish,
        isSending,
        error,
        clearError,
        cooldownRemaining,
    }
}
