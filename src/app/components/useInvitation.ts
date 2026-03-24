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

/**
 * Fetches guest name from Supabase by invitation hash.
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

        const fetchInvitation = async () => {
            try {
                const { data, error } = await supabase
                    .from('invitations')
                    .select('guest_name')
                    .eq('hash', hash)
                    .limit(1)
                    .single()

                if (cancelled) return

                if (error || !data) {
                    setGuestName(null)
                    setIsFound(false)
                } else {
                    setGuestName(data.guest_name)
                    setIsFound(true)
                }
            } catch {
                // Supabase connection error — fallback to generic invitation
                if (!cancelled) {
                    setGuestName(null)
                    setIsFound(false)
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false)
                }
            }
        }

        fetchInvitation()

        return () => {
            cancelled = true
        }
    }, [hash])

    return { guestName, isLoading, isFound }
}
