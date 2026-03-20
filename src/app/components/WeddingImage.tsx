import { useState, useCallback } from 'react'
import type { ImageData } from './image-manifest'

interface WeddingImageProps {
    image: ImageData
    alt: string
    sizes: string
    className?: string
    style?: React.CSSProperties
    fetchPriority?: 'high' | 'low' | 'auto'
    loading?: 'lazy' | 'eager'
}

export function WeddingImage({
    image,
    alt,
    sizes,
    className = '',
    style,
    fetchPriority,
    loading = 'lazy',
}: WeddingImageProps) {
    const [loaded, setLoaded] = useState(false)

    const onLoad = useCallback(() => setLoaded(true), [])

    const aspectRatio = `${image.width} / ${image.height}`

    return (
        <div
            className={className}
            style={{
                position: 'relative',
                overflow: 'hidden',
                aspectRatio,
                backgroundImage: `url(${image.blur})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                ...style,
            }}
        >
            <img
                src={image.src}
                srcSet={image.srcSet}
                sizes={sizes}
                alt={alt}
                decoding="async"
                loading={loading}
                fetchPriority={fetchPriority}
                onLoad={onLoad}
                style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: loaded ? 1 : 0,
                    transition: 'opacity 0.4s ease',
                }}
            />
        </div>
    )
}
