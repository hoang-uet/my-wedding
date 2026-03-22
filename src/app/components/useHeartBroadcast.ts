import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

// ─── Constants ───────────────────────────────────────────────────────────────

const CHANNEL_NAME = 'hearts'
const EVENT_NAME = 'heart_burst'

/** Max clicks allowed within the throttle window */
const THROTTLE_MAX_CLICKS = 3
/** Sliding window duration (ms) */
const THROTTLE_WINDOW_MS = 2000
/** Debounce delay before sending batched clicks (ms) */
const SEND_BATCH_DELAY_MS = 300
/** Window to batch incoming remote events (ms) */
const RECEIVE_BATCH_DELAY_MS = 200
/** Max hearts spawned from a single remote batch */
const RECEIVE_BATCH_CAP = 40
/** Max hearts per single broadcast event */
const PER_EVENT_CAP = 15
/** Hearts spawned per local click */
const LOCAL_HEARTS_MIN = 5
const LOCAL_HEARTS_RANGE = 4 // 5–8

// ─── Types ───────────────────────────────────────────────────────────────────

interface HeartBurstPayload {
  /** Number of hearts to spawn */
  c: number
}

// ─── Hook ────────────────────────────────────────────────────────────────────

interface UseHeartBroadcastReturn {
  /**
   * Call when user clicks "Bắn tim".
   * Returns the number of local hearts to spawn (0 if throttled).
   */
  shootHearts: () => number
  /** Accumulated remote spawn count. Reset after consumption. */
  remoteSpawnCount: number
  /** Reset remoteSpawnCount to 0 after HeartCanvas processes it */
  clearRemoteSpawn: () => void
}

/**
 * Hook managing Supabase Realtime Broadcast for heart animations.
 *
 * - Client-side throttling: max 3 clicks / 2s sliding window
 * - Send batching: debounce 300ms, aggregate clicks into 1 broadcast
 * - Receive batching: aggregate remote events in 200ms window, cap 40
 * - Graceful degradation: works offline (local hearts still fire)
 */
export function useHeartBroadcast(): UseHeartBroadcastReturn {
  const [remoteSpawnCount, setRemoteSpawnCount] = useState(0)

  // Refs for throttle/batch state (not reactive — no re-renders)
  const clickTimestamps = useRef<number[]>([])
  const pendingSendCount = useRef(0)
  const sendTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const receiveBatchCount = useRef(0)
  const receiveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)

  // ── Supabase channel lifecycle ──
  useEffect(() => {
    if (!supabase) return

    const channel = supabase.channel(CHANNEL_NAME)
    channelRef.current = channel

    channel
      .on('broadcast', { event: EVENT_NAME }, (msg) => {
        const payload = msg.payload as HeartBurstPayload
        const count = Math.min(payload?.c ?? 0, PER_EVENT_CAP)
        if (count <= 0) return

        // Batch incoming events
        receiveBatchCount.current += count

        if (!receiveTimerRef.current) {
          receiveTimerRef.current = setTimeout(() => {
            const capped = Math.min(receiveBatchCount.current, RECEIVE_BATCH_CAP)
            setRemoteSpawnCount((prev) => prev + capped)
            receiveBatchCount.current = 0
            receiveTimerRef.current = null
          }, RECEIVE_BATCH_DELAY_MS)
        }
      })
      .subscribe()

    return () => {
      if (sendTimerRef.current) clearTimeout(sendTimerRef.current)
      if (receiveTimerRef.current) clearTimeout(receiveTimerRef.current)
      supabase.removeChannel(channel)
      channelRef.current = null
    }
  }, [])

  // ── Send broadcast (batched) ──
  const flushSend = useCallback(() => {
    const count = pendingSendCount.current
    pendingSendCount.current = 0
    sendTimerRef.current = null
    if (count <= 0 || !channelRef.current) return

    channelRef.current.send({
      type: 'broadcast',
      event: EVENT_NAME,
      payload: { c: count } satisfies HeartBurstPayload,
    })
  }, [])

  // ── Throttle check (sliding window) ──
  const isThrottled = useCallback((): boolean => {
    const now = Date.now()
    const timestamps = clickTimestamps.current
    // Evict expired timestamps
    while (timestamps.length > 0 && now - timestamps[0] > THROTTLE_WINDOW_MS) {
      timestamps.shift()
    }
    return timestamps.length >= THROTTLE_MAX_CLICKS
  }, [])

  // ── Public: shoot hearts ──
  const shootHearts = useCallback((): number => {
    if (isThrottled()) return 0

    clickTimestamps.current.push(Date.now())

    // Local hearts (immediate feedback)
    const localCount = LOCAL_HEARTS_MIN + Math.floor(Math.random() * LOCAL_HEARTS_RANGE)

    // Queue for broadcast batch
    pendingSendCount.current += localCount
    if (sendTimerRef.current) clearTimeout(sendTimerRef.current)
    sendTimerRef.current = setTimeout(flushSend, SEND_BATCH_DELAY_MS)

    return localCount
  }, [isThrottled, flushSend])

  const clearRemoteSpawn = useCallback(() => {
    setRemoteSpawnCount(0)
  }, [])

  return { shootHearts, remoteSpawnCount, clearRemoteSpawn }
}
