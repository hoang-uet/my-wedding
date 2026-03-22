import { useRef, useState, useCallback, useEffect } from 'react'
import goldenHourSrc from '@/assets/music/golden-hour.mp3'

/**
 * Wedding Audio Player Hook
 *
 * ── Configuration ──────────────────────────────────────
 * AUDIO_SRC     : Vite-imported audio asset (content-hashed URL)
 * FADE_DURATION : Volume fade in/out duration in ms
 * TARGET_VOLUME : Max playback volume (0–1)
 *
 * To change the song, replace the import above.
 * Audio file location: src/assets/music/golden-hour.mp3
 * Supported formats: .mp3, .webm, .ogg, .m4a
 * ───────────────────────────────────────────────────────
 */
const AUDIO_SRC = goldenHourSrc
const FADE_DURATION = 800
const TARGET_VOLUME = 0.6

export function useAudioPlayer() {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const fadeRef = useRef<number>(0)
    const [isPlaying, setIsPlaying] = useState(false)

    // Lazy-create audio element — no network request until play()
    const getAudio = useCallback(() => {
        if (!audioRef.current) {
            const audio = new Audio()
            audio.preload = 'none'
            audio.loop = true
            audio.volume = 0
            audioRef.current = audio
        }
        return audioRef.current
    }, [])

    // Smooth volume fade using requestAnimationFrame (off main thread rendering)
    const fadeVolume = useCallback(
        (from: number, to: number, duration: number): Promise<void> =>
            new Promise((resolve) => {
                if (fadeRef.current) cancelAnimationFrame(fadeRef.current)
                const audio = audioRef.current
                if (!audio) {
                    resolve()
                    return
                }

                const start = performance.now()
                const step = (now: number) => {
                    const t = Math.min((now - start) / duration, 1)
                    // Ease-in-out quadratic for natural volume curve
                    const ease = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
                    audio.volume = Math.max(0, Math.min(1, from + (to - from) * ease))

                    if (t < 1) {
                        fadeRef.current = requestAnimationFrame(step)
                    } else {
                        fadeRef.current = 0
                        resolve()
                    }
                }
                fadeRef.current = requestAnimationFrame(step)
            }),
        [],
    )

    const play = useCallback(async () => {
        const audio = getAudio()

        // Lazy-load: set src only on first play (saves bandwidth on initial load)
        if (!audio.src || audio.src === window.location.origin + '/') {
            audio.src = AUDIO_SRC
            audio.load()
        }

        try {
            audio.volume = 0
            await audio.play()
            setIsPlaying(true)
            fadeVolume(0, TARGET_VOLUME, FADE_DURATION)
        } catch {
            // Browser autoplay policy blocked — user gesture required
            setIsPlaying(false)
        }
    }, [getAudio, fadeVolume])

    const pause = useCallback(async () => {
        const audio = audioRef.current
        if (!audio || audio.paused) return

        await fadeVolume(audio.volume, 0, FADE_DURATION)
        audio.pause()
        setIsPlaying(false)
    }, [fadeVolume])

    const toggle = useCallback(() => {
        return isPlaying ? pause() : play()
    }, [isPlaying, play, pause])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (fadeRef.current) cancelAnimationFrame(fadeRef.current)
            const audio = audioRef.current
            if (audio) {
                audio.pause()
                audio.src = ''
                audio.load()
            }
        }
    }, [])

    return { isPlaying, toggle, play, pause }
}
