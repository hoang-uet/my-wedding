import { useState, useEffect, useCallback, useMemo } from 'react'
import { customAlphabet } from 'nanoid'
import { supabase } from '@/lib/supabase'

const generateHash = customAlphabet('abcdefghijkmnpqrstuvwxyz23456789', 8)

export interface Invitation {
    id: string
    guest_name: string
    hash: string
    created_at: string
}

/** Normalize Vietnamese text for accent-insensitive search */
const normalizeVN = (str: string) =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

interface UseInvitationsReturn {
    invitations: Invitation[]
    isLoading: boolean
    error: string | null
    searchQuery: string
    setSearchQuery: (q: string) => void
    filteredInvitations: Invitation[]
    createInvitation: (guestName: string) => Promise<Invitation>
    deleteInvitation: (id: string) => Promise<void>
    isCreating: boolean
    isDeleting: string | null
}

/**
 * Admin hook: CRUD operations for invitations with realtime subscription.
 * Fetches all invitations (ORDER BY created_at DESC), supports search,
 * create (with nanoid hash), and delete.
 */
export function useInvitations(): UseInvitationsReturn {
    const [invitations, setInvitations] = useState<Invitation[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [isCreating, setIsCreating] = useState(false)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    // Fetch all invitations
    useEffect(() => {
        if (!supabase) {
            setError('Supabase chưa được cấu hình.')
            setIsLoading(false)
            return
        }

        const fetchInvitations = async () => {
            const { data, error: fetchError } = await supabase
                .from('invitations')
                .select('*')
                .order('created_at', { ascending: false })

            if (fetchError) {
                setError('Không thể tải danh sách thiệp mời.')
            } else {
                setInvitations(data ?? [])
            }
            setIsLoading(false)
        }

        fetchInvitations()

        // Realtime subscription for INSERT and DELETE
        const channel = supabase
            .channel('invitations-realtime')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'invitations' },
                (payload) => {
                    const newInv = payload.new as Invitation
                    setInvitations((prev) => {
                        // Avoid duplicate (if we inserted it ourselves)
                        if (prev.some((inv) => inv.id === newInv.id)) return prev
                        return [newInv, ...prev]
                    })
                },
            )
            .on(
                'postgres_changes',
                { event: 'DELETE', schema: 'public', table: 'invitations' },
                (payload) => {
                    const deletedId = (payload.old as { id: string }).id
                    setInvitations((prev) => prev.filter((inv) => inv.id !== deletedId))
                },
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    // Client-side search with Vietnamese normalization
    const filteredInvitations = useMemo(() => {
        if (!searchQuery.trim()) return invitations
        const normalized = normalizeVN(searchQuery.trim())
        return invitations.filter((inv) =>
            normalizeVN(inv.guest_name).includes(normalized),
        )
    }, [invitations, searchQuery])

    // Create invitation with hash, retry on collision
    const createInvitation = useCallback(async (guestName: string): Promise<Invitation> => {
        if (!supabase) throw new Error('Supabase chưa được cấu hình.')

        setIsCreating(true)
        setError(null)

        try {
            // Retry up to 3 times for hash collision
            for (let attempt = 0; attempt < 3; attempt++) {
                const hash = generateHash()
                const { data, error: insertError } = await supabase
                    .from('invitations')
                    .insert({ guest_name: guestName.trim(), hash })
                    .select()
                    .single()

                if (insertError) {
                    // unique_violation = hash collision, retry
                    if (insertError.code === '23505' && attempt < 2) continue
                    throw new Error(insertError.message)
                }

                // Optimistic update: add to list immediately
                setInvitations((prev) => {
                    if (prev.some((inv) => inv.id === data.id)) return prev
                    return [data, ...prev]
                })
                return data
            }
            throw new Error('Không thể tạo hash duy nhất. Vui lòng thử lại.')
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể tạo thiệp.'
            setError(message)
            throw err
        } finally {
            setIsCreating(false)
        }
    }, [])

    // Delete invitation
    const deleteInvitation = useCallback(async (id: string): Promise<void> => {
        if (!supabase) throw new Error('Supabase chưa được cấu hình.')

        setIsDeleting(id)
        setError(null)

        try {
            const { error: deleteError } = await supabase
                .from('invitations')
                .delete()
                .eq('id', id)

            if (deleteError) throw new Error(deleteError.message)

            // Optimistic update
            setInvitations((prev) => prev.filter((inv) => inv.id !== id))
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể xóa thiệp.'
            setError(message)
            throw err
        } finally {
            setIsDeleting(null)
        }
    }, [])

    return {
        invitations,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        filteredInvitations,
        createInvitation,
        deleteInvitation,
        isCreating,
        isDeleting,
    }
}
