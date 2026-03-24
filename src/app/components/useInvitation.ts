import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface UseInvitationReturn {
    /** Guest name from DB, null if not found or no hash */
    guestName: string | null
    /** True while fetching from Supabase */
    isLoading: boolean
    /** True if hash matched a record in DB */
    isFound: boolean
}

/** Retry delays in ms — escalating backoff to handle Supabase cold starts */
const RETRY_DELAYS = [800, 2000, 4000]

/**
 * Fetches guest name from Supabase by invitation hash.
 * Retries with exponential backoff to handle Supabase free-tier cold starts
 * and PostgREST connection pool warm-up delays.
 * Returns null gracefully if hash is missing, invalid, or Supabase is unavailable.
 */
export function useInvitation(hash: string | undefined): UseInvitationReturn {
    const [guestName, setGuestName] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(!!hash)
    const [isFound, setIsFound] = useState(false)

    useEffect(() => {
        if (!hash || !supabase) {
            setGuestName(null)
            setIsLoading(false)
            setIsFound(false)
            return
        }

        let cancelled = false
        setIsLoading(true)

        const queryByHash = async () => {
            const { data, error } = await supabase
                .from('invitations')
                .select('guest_name')
                .eq('hash', hash)
                .limit(1)
                .single()

            if (error || !data) return null
            return data.guest_name as string
        }

        const fetchWithRetry = async () => {
            try {
                // First attempt — immediate
                const name = await queryByHash()
                if (cancelled) return

                if (name) {
                    setGuestName(name)
                    setIsFound(true)
                    setIsLoading(false)
                    return
                }

                // Retry with backoff — handles Supabase cold start / propagation delay
                for (const delay of RETRY_DELAYS) {
                    await new Promise((r) => setTimeout(r, delay))
                    if (cancelled) return

                    const retryName = await queryByHash()
                    if (cancelled) return

                    if (retryName) {
                        setGuestName(retryName)
                        setIsFound(true)
                        setIsLoading(false)
                        return
                    }
                }

                // All retries exhausted — hash genuinely doesn't exist
                if (!cancelled) {
                    setGuestName(null)
                    setIsFound(false)
                    setIsLoading(false)
                }
            } catch {
                // Supabase connection error — fallback to generic invitation
                if (!cancelled) {
                    setGuestName(null)
                    setIsFound(false)
                    setIsLoading(false)
                }
            }
        }

        fetchWithRetry()

        return () => {
            cancelled = true
        }
    }, [hash])

    return { guestName, isLoading, isFound }
}
