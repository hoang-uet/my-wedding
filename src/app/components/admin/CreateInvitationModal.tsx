import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/app/components/ui/dialog'
import { UserPlus } from 'lucide-react'

interface CreateInvitationModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (guestName: string) => Promise<void>
    isCreating: boolean
}

const MAX_NAME_LENGTH = 100

export function CreateInvitationModal({
    open,
    onOpenChange,
    onSubmit,
    isCreating,
}: CreateInvitationModalProps) {
    const [name, setName] = useState('')
    const [error, setError] = useState<string | null>(null)

    const trimmedName = name.trim()
    const isValid = trimmedName.length >= 1 && trimmedName.length <= MAX_NAME_LENGTH

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isValid || isCreating) return

        if (trimmedName.length < 1) {
            setError('Vui lòng nhập tên khách mời')
            return
        }

        setError(null)
        try {
            await onSubmit(trimmedName)
            setName('')
            setError(null)
        } catch {
            setError('Không thể tạo thiệp. Vui lòng thử lại.')
        }
    }

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            setName('')
            setError(null)
        }
        onOpenChange(nextOpen)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="max-w-[390px] mx-auto"
                style={{
                    background: '#F0EBE2',
                    border: '1px solid rgba(212,204,190,0.4)',
                    borderRadius: '16px',
                }}
            >
                <DialogHeader>
                    <DialogTitle
                        className="flex items-center gap-2 justify-center"
                        style={{
                            fontFamily: 'var(--font-display-serif)',
                            color: '#3C4E34',
                            fontSize: '20px',
                        }}
                    >
                        <UserPlus size={20} />
                        Tạo Thiệp Mới
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name input */}
                    <div className="space-y-2">
                        <label
                            htmlFor="guest-name"
                            className="block text-sm font-medium"
                            style={{ color: '#3C4E34', fontFamily: 'var(--font-primary)' }}
                        >
                            Tên khách mời
                        </label>
                        <input
                            id="guest-name"
                            type="text"
                            value={name}
                            onChange={(e) => {
                                if (e.target.value.length <= MAX_NAME_LENGTH) {
                                    setName(e.target.value)
                                    setError(null)
                                }
                            }}
                            placeholder='Ví dụ: "Anh Tuấn & Gia Đình"'
                            autoFocus
                            className="w-full px-3 py-2.5 rounded-[10px] text-sm outline-none transition-colors"
                            style={{
                                fontFamily: 'var(--font-primary)',
                                background: 'rgba(255,255,255,0.8)',
                                border: error
                                    ? '1.5px solid #E87461'
                                    : '1.5px solid rgba(139,115,85,0.3)',
                                color: '#2D2D2D',
                            }}
                        />
                        <div className="flex justify-between items-center">
                            <p
                                className="text-xs"
                                style={{
                                    color: error ? '#E87461' : '#8B7355',
                                    fontFamily: 'var(--font-primary)',
                                }}
                            >
                                {error ?? 'Ví dụ: "Cô Lan", "Bác Hùng", "Anh Tuấn & Gia Đình"'}
                            </p>
                            {name.length > 0 && (
                                <span
                                    className="text-xs tabular-nums"
                                    style={{ color: '#8B7355' }}
                                >
                                    {trimmedName.length}/{MAX_NAME_LENGTH}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Preview */}
                    {trimmedName && (
                        <div
                            className="rounded-xl p-4 text-center"
                            style={{
                                background: 'linear-gradient(180deg, rgba(60,78,52,0.85) 0%, rgba(74,93,58,0.9) 100%)',
                                border: '1px solid rgba(155,175,136,0.3)',
                            }}
                        >
                            <p
                                className="text-xs mb-1"
                                style={{
                                    fontFamily: 'var(--font-primary)',
                                    color: 'rgba(255,255,255,0.7)',
                                    letterSpacing: '0.08em',
                                }}
                            >
                                Xem trước trên thiệp
                            </p>
                            <p
                                style={{
                                    fontFamily: 'var(--font-formal)',
                                    fontSize: '12px',
                                    color: 'rgba(255,255,255,0.82)',
                                    letterSpacing: '0.05em',
                                }}
                            >
                                Trân trọng kính mời
                            </p>
                            <p
                                style={{
                                    fontFamily: 'var(--font-calligraphy-vn)',
                                    fontSize: '20px',
                                    color: '#FFECD2',
                                    textShadow: '0 1px 6px rgba(0,0,0,0.3)',
                                    lineHeight: 1.3,
                                    marginTop: '2px',
                                    wordBreak: 'break-word',
                                }}
                            >
                                {trimmedName}
                            </p>
                        </div>
                    )}

                    <DialogFooter className="flex gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => handleOpenChange(false)}
                            className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors"
                            style={{
                                fontFamily: 'var(--font-primary)',
                                color: '#5A7247',
                                background: 'transparent',
                                border: '1.5px solid rgba(90,114,71,0.3)',
                            }}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={!isValid || isCreating}
                            className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity disabled:opacity-50"
                            style={{
                                fontFamily: 'var(--font-primary)',
                                background: '#4A5D3A',
                            }}
                        >
                            {isCreating ? 'Đang tạo...' : 'Tạo thiệp'}
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
