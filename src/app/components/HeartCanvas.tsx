import { useRef, useEffect, useCallback, memo } from 'react'

// ─── Constants ───────────────────────────────────────────────────────────────

const HEART_COLORS = [
  '#E87461', '#F5A3A3', '#D4856A', '#E8B4A0',
  '#F0C0C0', '#d00000', '#e63946', '#ff6b81',
]

const MAX_PARTICLES = 150
const EMERGENCY_CAP = 200

/**
 * Pre-created heart Path2D — allocated once, reused every frame.
 * viewBox origin 0 0 24 24.
 */
const HEART_PATH = new Path2D(
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
)

// ─── Particle interface & helpers ────────────────────────────────────────────

interface HeartParticle {
  active: boolean
  // position
  x: number
  y: number
  startX: number
  startY: number
  // S-curve trajectory
  amplitude: number
  frequency: number
  phase: number
  // visual
  size: number
  color: string
  initialOpacity: number
  rotation: number
  rotationSpeed: number
  // lifecycle
  speed: number
  life: number
  maxLife: number
  fadeStart: number
}

/** Uniform random in [min, max] */
function rand(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function randomSize(): number {
  const r = Math.random()
  if (r < 0.4) return rand(10, 14)      // 40% small
  if (r < 0.8) return rand(16, 20)      // 40% medium
  return rand(22, 26)                     // 20% large
}

function createParticle(canvasW: number, canvasH: number): HeartParticle {
  return {
    active: true,
    x: 0,
    y: 0,
    startX: rand(canvasW * 0.15, canvasW * 0.85),
    startY: canvasH,
    amplitude: rand(15, 45),
    frequency: rand(0.8, 1.5),
    phase: rand(0, Math.PI * 2),
    size: randomSize(),
    color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
    initialOpacity: rand(0.7, 0.9),
    rotation: 0,
    rotationSpeed: rand(-0.03, 0.03),
    speed: rand(1.5, 3.5),
    life: 0,
    maxLife: rand(90, 180), // 1.5–3s @60fps
    fadeStart: rand(0.6, 0.8),
  }
}

// ─── Object Pool ─────────────────────────────────────────────────────────────

class ParticlePool {
  private pool: HeartParticle[] = []
  activeCount = 0

  acquire(canvasW: number, canvasH: number): HeartParticle | null {
    if (this.activeCount >= MAX_PARTICLES) return null

    // Try to recycle a dead particle
    for (let i = 0; i < this.pool.length; i++) {
      if (!this.pool[i].active) {
        const p = this.pool[i]
        Object.assign(p, createParticle(canvasW, canvasH))
        this.activeCount++
        return p
      }
    }

    // Emergency hard cap
    if (this.pool.length >= EMERGENCY_CAP) return null

    // Allocate new
    const p = createParticle(canvasW, canvasH)
    this.pool.push(p)
    this.activeCount++
    return p
  }

  release(p: HeartParticle) {
    if (p.active) {
      p.active = false
      this.activeCount--
    }
  }

  forEach(fn: (p: HeartParticle) => void) {
    for (let i = 0; i < this.pool.length; i++) {
      if (this.pool[i].active) fn(this.pool[i])
    }
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

interface HeartCanvasProps {
  /** When > 0, spawn this many hearts. Caller should reset to 0 after. */
  spawnSignal: number
  /** Called after spawn signal is consumed */
  onSpawnConsumed?: () => void
}

/**
 * High-performance Canvas 2D heart particle renderer.
 * - Single <canvas> element, zero extra DOM nodes
 * - Object pool: no GC pressure during animation
 * - Idle stop: rAF loop halts when no particles are active (0 CPU)
 * - Respects prefers-reduced-motion
 */
export const HeartCanvas = memo(function HeartCanvas({
  spawnSignal,
  onSpawnConsumed,
}: HeartCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const poolRef = useRef(new ParticlePool())
  const rafRef = useRef<number>(0)
  const runningRef = useRef(false)
  const reducedMotionRef = useRef(false)

  // Check prefers-reduced-motion once
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotionRef.current = mq.matches
    const handler = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // ── Canvas sizing (DPR-aware) ──
  const syncSize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    if (!parent) return
    const dpr = window.devicePixelRatio || 1
    const rect = parent.getBoundingClientRect()
    const w = rect.width
    const h = rect.height
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }, [])

  useEffect(() => {
    syncSize()
    const ro = new ResizeObserver(syncSize)
    const parent = canvasRef.current?.parentElement
    if (parent) ro.observe(parent)
    return () => ro.disconnect()
  }, [syncSize])

  // ── Animation loop ──
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const pool = poolRef.current
    const dpr = window.devicePixelRatio || 1
    const w = canvas.width / dpr
    const h = canvas.height / dpr

    // Clear
    ctx.clearRect(0, 0, w, h)

    // Update & draw
    pool.forEach((p) => {
      p.life++
      const t = p.life / p.maxLife
      if (t >= 1) {
        pool.release(p)
        return
      }

      // S-curve position
      p.x = p.startX + p.amplitude * Math.sin(p.frequency * Math.PI * t + p.phase)
      p.y = p.startY - p.speed * p.life

      // Rotation
      p.rotation += p.rotationSpeed

      // Opacity fade
      const opacity =
        t < p.fadeStart
          ? p.initialOpacity
          : p.initialOpacity * (1 - (t - p.fadeStart) / (1 - p.fadeStart))

      // Skip offscreen
      if (p.y < -30 || p.y > h + 30) return

      // Draw
      const scale = p.size / 24
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.scale(scale, scale)
      // Center the heart path (viewBox 0 0 24 24 → center at 12,12)
      ctx.translate(-12, -12)
      ctx.globalAlpha = Math.max(0, opacity)
      ctx.fillStyle = p.color
      ctx.fill(HEART_PATH)
      ctx.restore()
    })

    // Continue or idle-stop
    if (pool.activeCount > 0) {
      rafRef.current = requestAnimationFrame(animate)
    } else {
      runningRef.current = false
    }
  }, [])

  const startLoop = useCallback(() => {
    if (!runningRef.current) {
      runningRef.current = true
      rafRef.current = requestAnimationFrame(animate)
    }
  }, [animate])

  // ── Spawn hearts when signal changes ──
  useEffect(() => {
    if (spawnSignal <= 0) return
    if (reducedMotionRef.current) {
      // Respect prefers-reduced-motion: skip animation
      onSpawnConsumed?.()
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const w = canvas.width / dpr
    const h = canvas.height / dpr
    if (w === 0 || h === 0) return

    const pool = poolRef.current
    const count = Math.min(spawnSignal, MAX_PARTICLES - pool.activeCount)
    for (let i = 0; i < count; i++) {
      pool.acquire(w, h)
    }

    startLoop()
    onSpawnConsumed?.()
  }, [spawnSignal, onSpawnConsumed, startLoop])

  // ── Cleanup on unmount ──
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current)
      runningRef.current = false
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 100,
      }}
    />
  )
})
