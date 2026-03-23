import { useState, useCallback } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

interface NameModalProps {
    open: boolean
    onConfirm: (name: string) => void
    onClose: () => void
}

export function NameModal({ open, onConfirm, onClose }: NameModalProps) {
    const [name, setName] = useState('')
    const [error, setError] = useState('')

    const handleConfirm = useCallback(() => {
        const trimmed = name.trim()
        if (trimmed.length < 2) {
            setError('Tên phải có ít nhất 2 ký tự')
            return
        }
        setError('')
        setName('')
        onConfirm(trimmed)
    }, [name, onConfirm])

    const handleClose = useCallback(() => {
        setName('')
        setError('')
        onClose()
    }, [onClose])

    return (
        <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <Dialog.Portal>
                <Dialog.Overlay
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.4)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 1000,
                    }}
                />
                <Dialog.Content
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 'calc(100% - 48px)',
                        maxWidth: '340px',
                        background: '#F0EBE2',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                        zIndex: 1001,
                    }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <Dialog.Title
                            style={{
                                fontFamily: 'var(--font-primary)',
                                fontSize: '16px',
                                fontWeight: 700,
                                color: '#4A5D3A',
                                margin: 0,
                            }}
                        >
                            Xin chào! Bạn là...
                        </Dialog.Title>
                        <Dialog.Close asChild>
                            <button
                                className="flex items-center justify-center cursor-pointer"
                                style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    background: 'rgba(74,93,58,0.15)',
                                    border: 'none',
                                    color: '#4A5D3A',
                                }}
                            >
                                <X size={14} />
                            </button>
                        </Dialog.Close>
                    </div>

                    <Dialog.Description
                        style={{
                            fontFamily: 'var(--font-primary)',
                            fontSize: '13px',
                            color: '#8B7355',
                            marginBottom: '16px',
                        }}
                    >
                        Nhập tên để gửi lời chúc đến cô dâu chú rể
                    </Dialog.Description>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value)
                            if (error) setError('')
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                        placeholder="Tên của bạn"
                        autoFocus
                        style={{
                            width: '100%',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            border: error ? '1px solid #E87461' : '1px solid rgba(212,204,190,0.5)',
                            background: 'rgba(255,255,255,0.7)',
                            fontFamily: 'var(--font-primary)',
                            fontSize: '16px',
                            color: '#3A3A3A',
                            outline: 'none',
                            boxSizing: 'border-box',
                        }}
                    />

                    {error && (
                        <p
                            style={{
                                fontFamily: 'var(--font-primary)',
                                fontSize: '12px',
                                color: '#E87461',
                                marginTop: '6px',
                                marginBottom: 0,
                            }}
                        >
                            {error}
                        </p>
                    )}

                    <button
                        onClick={handleConfirm}
                        className="cursor-pointer"
                        style={{
                            width: '100%',
                            marginTop: '16px',
                            padding: '10px',
                            borderRadius: '10px',
                            border: 'none',
                            background: '#4A5D3A',
                            color: 'white',
                            fontFamily: 'var(--font-primary)',
                            fontSize: '14px',
                            fontWeight: 600,
                        }}
                    >
                        Xác nhận
                    </button>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
