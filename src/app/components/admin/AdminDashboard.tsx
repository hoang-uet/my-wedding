import { useState, useCallback } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Search, Plus, Copy, Trash2, Lock, ArrowLeft, Mail, User } from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/app/components/ui/alert-dialog'
import { Toaster, toast } from 'sonner'
import { weddingConfig } from '@/app/components/wedding-config'
import { useInvitations, type Invitation } from './useInvitations'
import { CreateInvitationModal } from './CreateInvitationModal'

// ─────────────────────────────────────────
// PIN Gate
// ─────────────────────────────────────────

function PinGate({ onAuthenticated }: { onAuthenticated: () => void }) {
    const [pin, setPin] = useState('')
    const [error, setError] = useState(false)
    const adminPin = import.meta.env.VITE_ADMIN_PIN || '0000'

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (pin === adminPin) {
            sessionStorage.setItem('admin_authenticated', '1')
            onAuthenticated()
        } else {
            setError(true)
            setPin('')
        }
    }

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen px-6"
            style={{ background: '#F0EBE2' }}
        >
            <div
                className="w-full max-w-[340px] p-8 rounded-2xl text-center"
                style={{
                    background: 'rgba(255,255,255,0.7)',
                    border: '1px solid rgba(212,204,190,0.4)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                }}
            >
                <div
                    className="mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(74,93,58,0.1)' }}
                >
                    <Lock size={22} style={{ color: '#4A5D3A' }} />
                </div>
                <h1
                    style={{
                        fontFamily: 'var(--font-display-serif)',
                        fontSize: '22px',
                        color: '#3C4E34',
                        marginBottom: '6px',
                    }}
                >
                    Quản Lý Thiệp Mời
                </h1>
                <p
                    className="text-sm mb-6"
                    style={{ color: '#8B7355', fontFamily: 'var(--font-primary)' }}
                >
                    Nhập mã PIN để truy cập
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        inputMode="numeric"
                        maxLength={6}
                        value={pin}
                        onChange={(e) => {
                            setPin(e.target.value.replace(/\D/g, ''))
                            setError(false)
                        }}
                        autoFocus
                        placeholder="••••"
                        className="w-full px-4 py-3 rounded-xl text-center text-2xl tracking-[0.5em] outline-none transition-colors"
                        style={{
                            fontFamily: 'var(--font-primary)',
                            background: 'rgba(255,255,255,0.9)',
                            border: error ? '2px solid #E87461' : '2px solid rgba(139,115,85,0.2)',
                            color: '#2D2D2D',
                        }}
                    />
                    {error && (
                        <p
                            className="text-sm"
                            style={{ color: '#E87461', fontFamily: 'var(--font-primary)' }}
                        >
                            Sai mã PIN. Vui lòng thử lại.
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={pin.length < 4}
                        className="w-full py-3 rounded-xl text-white font-medium text-sm transition-opacity disabled:opacity-40"
                        style={{ background: '#4A5D3A', fontFamily: 'var(--font-primary)' }}
                    >
                        Xác nhận
                    </button>
                </form>
            </div>
        </div>
    )
}

// ─────────────────────────────────────────
// Invitation Card
// ─────────────────────────────────────────

function InvitationCard({
    invitation,
    isDeleting,
    onCopy,
    onDelete,
}: {
    invitation: Invitation
    isDeleting: boolean
    onCopy: (hash: string) => void
    onDelete: (inv: Invitation) => void
}) {
    const relativeTime = formatDistanceToNow(new Date(invitation.created_at), {
        addSuffix: true,
        locale: vi,
    })

    return (
        <div
            className="p-4 rounded-xl transition-all"
            style={{
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(212,204,190,0.4)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                opacity: isDeleting ? 0.5 : 1,
            }}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <User size={14} style={{ color: '#4A5D3A', flexShrink: 0 }} />
                        <p
                            className="font-semibold truncate"
                            style={{
                                fontFamily: 'var(--font-primary)',
                                fontSize: '15px',
                                color: '#2D2D2D',
                            }}
                        >
                            {invitation.guest_name}
                        </p>
                    </div>
                    <p
                        className="truncate"
                        style={{
                            fontFamily: 'var(--font-primary)',
                            fontSize: '12px',
                            color: '#5A7247',
                            fontVariantNumeric: 'tabular-nums',
                        }}
                    >
                        /thiep-moi/{invitation.hash}
                    </p>
                    <p
                        className="mt-1"
                        style={{
                            fontFamily: 'var(--font-primary)',
                            fontSize: '11px',
                            color: '#8B7355',
                        }}
                    >
                        {relativeTime}
                    </p>
                </div>

                <div className="flex gap-1.5 shrink-0">
                    <button
                        onClick={() => onCopy(invitation.hash)}
                        className="p-2 rounded-lg transition-colors"
                        style={{ background: 'rgba(74,93,58,0.08)' }}
                        title="Copy link"
                    >
                        <Copy size={16} style={{ color: '#4A5D3A' }} />
                    </button>
                    <button
                        onClick={() => onDelete(invitation)}
                        disabled={isDeleting}
                        className="p-2 rounded-lg transition-colors disabled:opacity-50"
                        style={{ background: 'rgba(232,116,97,0.08)' }}
                        title="Xóa"
                    >
                        <Trash2 size={16} style={{ color: '#E87461' }} />
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─────────────────────────────────────────
// Dashboard (main content after PIN)
// ─────────────────────────────────────────

function Dashboard() {
    const {
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        filteredInvitations,
        createInvitation,
        deleteInvitation,
        isCreating,
        isDeleting,
    } = useInvitations()

    const [createModalOpen, setCreateModalOpen] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState<Invitation | null>(null)

    const handleCreate = useCallback(
        async (guestName: string) => {
            const inv = await createInvitation(guestName)
            toast.success(`Đã tạo thiệp cho ${inv.guest_name}!`)
            setCreateModalOpen(false)
        },
        [createInvitation],
    )

    const handleCopy = useCallback(async (hash: string) => {
        const baseUrl = import.meta.env.VITE_SITE_URL || window.location.origin
        const url = `${baseUrl}/thiep-moi/${hash}`
        try {
            await navigator.clipboard.writeText(url)
            toast.success('Đã copy link thiệp!')
        } catch {
            // Fallback for older browsers
            const textarea = document.createElement('textarea')
            textarea.value = url
            document.body.appendChild(textarea)
            textarea.select()
            document.execCommand('copy')
            document.body.removeChild(textarea)
            toast.success('Đã copy link thiệp!')
        }
    }, [])

    const handleDelete = useCallback(
        async (id: string) => {
            try {
                await deleteInvitation(id)
                toast.success('Đã xóa thiệp.')
            } catch {
                toast.error('Không thể xóa thiệp.')
            }
            setDeleteTarget(null)
        },
        [deleteInvitation],
    )

    return (
        <div
            className="w-full h-full flex items-start justify-center min-h-screen"
            style={{ background: '#D4CFC7' }}
        >
            <div
                className="phone-frame w-full flex flex-col min-h-screen"
                style={{
                    maxWidth: '430px',
                    background: '#F0EBE2',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.08)',
                }}
            >
                {/* Header */}
                <div
                    className="sticky top-0 z-10 px-4 pt-5 pb-3"
                    style={{
                        background: 'rgba(240,235,226,0.95)',
                        backdropFilter: 'blur(12px)',
                    }}
                >
                    <div className="flex items-center justify-between mb-1">
                        <a
                            href="/"
                            className="p-1.5 -ml-1.5 rounded-lg transition-colors"
                            style={{ color: '#4A5D3A' }}
                        >
                            <ArrowLeft size={20} />
                        </a>
                        <Mail size={18} style={{ color: '#8B7355' }} />
                    </div>
                    <h1
                        className="text-center"
                        style={{
                            fontFamily: 'var(--font-display-serif)',
                            fontSize: '22px',
                            color: '#3C4E34',
                        }}
                    >
                        Quản Lý Thiệp Mời
                    </h1>
                    <p
                        className="text-center"
                        style={{
                            fontFamily: 'var(--font-couple-names)',
                            fontSize: '16px',
                            color: '#5A7247',
                            marginTop: '2px',
                        }}
                    >
                        {weddingConfig.couple.groom.name} & {weddingConfig.couple.bride.name}
                    </p>

                    {/* Search + Create */}
                    <div className="mt-4 space-y-3">
                        <div className="relative">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2"
                                style={{ color: '#8B7355' }}
                            />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm khách mời..."
                                className="w-full pl-9 pr-3 py-2.5 rounded-[10px] text-sm outline-none transition-colors"
                                style={{
                                    fontFamily: 'var(--font-primary)',
                                    background: 'rgba(255,255,255,0.7)',
                                    border: '1.5px solid rgba(139,115,85,0.2)',
                                    color: '#2D2D2D',
                                }}
                            />
                        </div>
                        <button
                            onClick={() => setCreateModalOpen(true)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity"
                            style={{ background: '#4A5D3A', fontFamily: 'var(--font-primary)' }}
                        >
                            <Plus size={18} />
                            Tạo thiệp mới
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 px-4 py-3 space-y-3 overflow-y-auto">
                    {error && (
                        <p
                            className="text-sm text-center py-2"
                            style={{ color: '#E87461', fontFamily: 'var(--font-primary)' }}
                        >
                            {error}
                        </p>
                    )}

                    {isLoading ? (
                        <div className="flex flex-col items-center py-12">
                            <div
                                className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                                style={{
                                    borderColor: 'rgba(74,93,58,0.3)',
                                    borderTopColor: 'transparent',
                                }}
                            />
                            <p
                                className="mt-3 text-sm"
                                style={{ color: '#8B7355', fontFamily: 'var(--font-primary)' }}
                            >
                                Đang tải...
                            </p>
                        </div>
                    ) : filteredInvitations.length === 0 ? (
                        <div className="flex flex-col items-center py-12 text-center">
                            <div
                                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                                style={{ background: 'rgba(74,93,58,0.06)' }}
                            >
                                <Mail size={28} style={{ color: '#8B7355' }} />
                            </div>
                            <p
                                className="font-medium mb-1"
                                style={{
                                    color: '#3C4E34',
                                    fontFamily: 'var(--font-primary)',
                                    fontSize: '15px',
                                }}
                            >
                                {searchQuery ? 'Không tìm thấy kết quả' : 'Chưa có thiệp nào'}
                            </p>
                            <p
                                className="text-sm"
                                style={{ color: '#8B7355', fontFamily: 'var(--font-primary)' }}
                            >
                                {searchQuery
                                    ? `Không có khách mời nào khớp với "${searchQuery}"`
                                    : 'Nhấn "Tạo thiệp mới" để bắt đầu'}
                            </p>
                        </div>
                    ) : (
                        filteredInvitations.map((inv) => (
                            <InvitationCard
                                key={inv.id}
                                invitation={inv}
                                isDeleting={isDeleting === inv.id}
                                onCopy={handleCopy}
                                onDelete={setDeleteTarget}
                            />
                        ))
                    )}
                </div>

                {/* Count footer */}
                {!isLoading && filteredInvitations.length > 0 && (
                    <div
                        className="px-4 py-3 text-center text-xs"
                        style={{
                            color: '#8B7355',
                            fontFamily: 'var(--font-primary)',
                            borderTop: '1px solid rgba(212,204,190,0.3)',
                        }}
                    >
                        {searchQuery
                            ? `${filteredInvitations.length} kết quả`
                            : `Tổng: ${filteredInvitations.length} thiệp mời`}
                    </div>
                )}
            </div>

            {/* Create Modal */}
            <CreateInvitationModal
                open={createModalOpen}
                onOpenChange={setCreateModalOpen}
                onSubmit={handleCreate}
                isCreating={isCreating}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={!!deleteTarget}
                onOpenChange={(open) => {
                    if (!open) setDeleteTarget(null)
                }}
            >
                <AlertDialogContent style={{ background: '#F0EBE2', borderRadius: '16px' }}>
                    <AlertDialogHeader>
                        <AlertDialogTitle
                            style={{ fontFamily: 'var(--font-display-serif)', color: '#3C4E34' }}
                        >
                            Xóa thiệp mời?
                        </AlertDialogTitle>
                        <AlertDialogDescription
                            style={{ fontFamily: 'var(--font-primary)', color: '#8B7355' }}
                        >
                            Xóa thiệp mời cho{' '}
                            <strong style={{ color: '#2D2D2D' }}>{deleteTarget?.guest_name}</strong>
                            ? Link sẽ không còn hoạt động.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            className="rounded-lg"
                            style={{ fontFamily: 'var(--font-primary)', color: '#5A7247' }}
                        >
                            Hủy
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteTarget && handleDelete(deleteTarget.id)}
                            className="rounded-lg text-white"
                            style={{ background: '#E87461', fontFamily: 'var(--font-primary)' }}
                        >
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Toast */}
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        fontFamily: 'var(--font-primary)',
                        background: '#F0EBE2',
                        border: '1px solid rgba(212,204,190,0.4)',
                        color: '#3C4E34',
                    },
                }}
            />

            <style>{`
                @media (min-width: 768px) {
                    .phone-frame {
                        border-radius: 36px !important;
                        max-height: 100vh;
                        overflow: hidden;
                    }
                }
                @media (max-width: 767px) {
                    .phone-frame {
                        max-width: 100% !important;
                    }
                }
            `}</style>
        </div>
    )
}

// ─────────────────────────────────────────
// Export: AdminDashboard with PIN gate
// ─────────────────────────────────────────

export function AdminDashboard() {
    const [authenticated, setAuthenticated] = useState(
        () => sessionStorage.getItem('admin_authenticated') === '1',
    )

    if (!authenticated) {
        return <PinGate onAuthenticated={() => setAuthenticated(true)} />
    }

    return <Dashboard />
}
