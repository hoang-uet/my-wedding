'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { weddingImages } from './wedding-config'
import { WeddingImage } from './WeddingImage'
import { FloatingPetals } from './FloralOverlay'

// Số ảnh hiển thị ngoài grid (ảnh cuối sẽ có overlay mờ + nút xem thêm)
const PREVIEW_COUNT = 6

export function Gallery() {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
    const gridRef = useRef<HTMLDivElement>(null)

    const images = weddingImages.gallery
    const previewImages = images.slice(0, PREVIEW_COUNT)
    const remainingCount = images.length - PREVIEW_COUNT

    // Scroll-triggered stagger
    useEffect(() => {
        const el = gridRef.current
        if (!el) return

        const items = el.querySelectorAll('.gallery-item')
        items.forEach((item) => {
            ;(item as HTMLElement).style.opacity = '0'
            ;(item as HTMLElement).style.transform = 'scale(0.95)'
            ;(item as HTMLElement).style.transition = 'opacity 500ms ease, transform 500ms ease'
        })

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        items.forEach((item, i) => {
                            setTimeout(() => {
                                ;(item as HTMLElement).style.opacity = '1'
                                ;(item as HTMLElement).style.transform = 'scale(1)'
                            }, i * 100)
                        })
                        observer.unobserve(entry.target)
                    }
                })
            },
            { threshold: 0.1 },
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    const openLightbox = useCallback((index: number) => {
        setLightboxIndex(index)
    }, [])

    const closeLightbox = useCallback(() => {
        setLightboxIndex(null)
    }, [])

    const navigate = useCallback(
        (dir: -1 | 1) => {
            if (lightboxIndex === null) return
            setLightboxIndex((lightboxIndex + dir + images.length) % images.length)
        },
        [lightboxIndex, images.length],
    )

    // Keyboard navigation
    useEffect(() => {
        if (lightboxIndex === null) return
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeLightbox()
            if (e.key === 'ArrowLeft') navigate(-1)
            if (e.key === 'ArrowRight') navigate(1)
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [lightboxIndex, closeLightbox, navigate])

    return (
        <section id="gallery-section" className="relative" style={{ background: '#F0EBE2', padding: '48px 0 16px' }}>
            {/* Floating petals — z-1, subtle background decoration */}
            <FloatingPetals />

            {/* Header */}
            <div className="text-center mb-8 px-4">
                <div className="flex items-baseline justify-center gap-4 flex-wrap">
                    <span
                        style={{
                            fontFamily: "var(--font-display-serif)",
                            fontSize: '32px',
                            fontWeight: 600,
                            color: '#3A3A3A',
                            letterSpacing: '0.15em',
                        }}
                    >
                        ALBUM
                    </span>
                    <span
                        style={{
                            fontFamily: "var(--font-script-elegant)",
                            fontSize: '36px',
                            color: '#4A5D3A',
                        }}
                    >
                        of
                    </span>
                    <span
                        style={{
                            fontFamily: "var(--font-display-serif)",
                            fontSize: '32px',
                            fontWeight: 600,
                            color: '#3A3A3A',
                            letterSpacing: '0.15em',
                        }}
                    >
                        LOVE
                    </span>
                </div>
                {/* Ornamental line */}
                <div className="flex justify-center mt-3">
                    <div
                        style={{
                            width: '50px',
                            height: '1px',
                            background: 'linear-gradient(90deg, transparent, #C8B99A, transparent)',
                        }}
                    />
                </div>
            </div>

            {/* Gallery grid — 6 ảnh preview, ảnh cuối có overlay mờ */}
            <div ref={gridRef} className="grid grid-cols-2 px-2" style={{ gap: '3px' }}>
                {previewImages.map((image, i) => {
                    const isFullWidth = i === 0 || i === 3
                    const isLast = i === PREVIEW_COUNT - 1

                    return (
                        <div
                            key={`gallery-${i}`}
                            className="gallery-item cursor-pointer overflow-hidden relative"
                            style={{
                                gridColumn: isFullWidth ? 'span 2' : 'span 1',
                                aspectRatio: isFullWidth ? '16/9' : '3/4',
                                borderRadius: '2px',
                            }}
                            onClick={() => openLightbox(i)}
                        >
                            <WeddingImage
                                image={image}
                                alt={`Ảnh cưới ${i + 1}`}
                                sizes={isFullWidth ? '430px' : '215px'}
                                className="w-full h-full"
                                style={{ aspectRatio: 'unset' }}
                            />

                            {/* Overlay mờ cho ảnh cuối */}
                            {isLast && remainingCount > 0 && (
                                <div
                                    className="absolute inset-0 flex flex-col items-center justify-center"
                                    style={{
                                        background: 'rgba(12, 22, 8, 0.62)',
                                        backdropFilter: 'blur(5px)',
                                        WebkitBackdropFilter: 'blur(5px)',
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: 'var(--font-display-serif)',
                                            fontSize: '32px',
                                            fontWeight: 700,
                                            color: '#FFFFFF',
                                            letterSpacing: '0.02em',
                                            lineHeight: 1,
                                        }}
                                    >
                                        +{remainingCount}
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: 'var(--font-primary)',
                                            fontSize: '11px',
                                            color: 'rgba(255,255,255,0.7)',
                                            letterSpacing: '0.18em',
                                            marginTop: '8px',
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        Xem tất cả
                                    </span>
                                    <div
                                        style={{
                                            marginTop: '14px',
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            border: '1.5px solid rgba(255,255,255,0.5)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <ChevronRight size={16} color="rgba(255,255,255,0.8)" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Lightbox — hiển thị toàn bộ ảnh kể từ index được click */}
            {lightboxIndex !== null && (
                <div
                    role="dialog"
                    aria-label={`Ảnh ${lightboxIndex + 1} / ${images.length}`}
                    className="fixed inset-0 z-[1100] flex items-center justify-center"
                    style={{
                        background: 'rgba(0,0,0,0.94)',
                        animation: 'galleryFadeIn 250ms ease',
                    }}
                    onClick={closeLightbox}
                >
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 text-white cursor-pointer"
                        style={{ background: 'none', border: 'none' }}
                        aria-label="Đóng"
                    >
                        <X size={28} strokeWidth={1.5} />
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            navigate(-1)
                        }}
                        className="absolute left-3 flex items-center justify-center cursor-pointer"
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.12)',
                            border: 'none',
                            color: 'white',
                        }}
                        aria-label="Ảnh trước"
                    >
                        <ChevronLeft size={22} />
                    </button>

                    <img
                        src={images[lightboxIndex].src}
                        srcSet={images[lightboxIndex].srcSet}
                        sizes="100vw"
                        alt={`Ảnh cưới ${lightboxIndex + 1}`}
                        className="max-w-[92vw] max-h-[85vh] object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />

                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            navigate(1)
                        }}
                        className="absolute right-3 flex items-center justify-center cursor-pointer"
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.12)',
                            border: 'none',
                            color: 'white',
                        }}
                        aria-label="Ảnh sau"
                    >
                        <ChevronRight size={22} />
                    </button>

                    <p
                        className="absolute bottom-6"
                        style={{
                            fontFamily: "var(--font-primary)",
                            fontSize: '13px',
                            color: 'rgba(255,255,255,0.5)',
                            letterSpacing: '0.1em',
                        }}
                    >
                        {lightboxIndex + 1} / {images.length}
                    </p>
                </div>
            )}

            <style>{`
        @keyframes galleryFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
        </section>
    )
}
