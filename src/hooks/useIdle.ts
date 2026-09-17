import { useState, useEffect, useRef, useCallback } from 'react';

interface UseIdleOptions {
  /** Total idle timeout in milliseconds before session auto-logout (default: 15 mins) */
  timeoutMs?: number;
  /** Warning period in milliseconds before timeout fires (default: 60 seconds) */
  warningThresholdMs?: number;
  /** Whether the timer is currently enabled */
  enabled?: boolean;
  /** Callback triggered when user becomes idle */
  onIdle?: () => void;
  /** Callback triggered when entering warning period */
  onWarning?: () => void;
}

interface UseIdleReturn {
  isIdle: boolean;
  isWarning: boolean;
  remainingSeconds: number;
  resetTimer: () => void;
  lastActive: number;
}

const DEFAULT_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const DEFAULT_WARNING_MS = 60 * 1000;      // 60 seconds

export function useIdle({
  timeoutMs = DEFAULT_TIMEOUT_MS,
  warningThresholdMs = DEFAULT_WARNING_MS,
  enabled = true,
  onIdle,
  onWarning,
}: UseIdleOptions = {}): UseIdleReturn {
  const [isIdle, setIsIdle] = useState(false);
  const [isWarning, setIsWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(Math.round(timeoutMs / 1000));
  const [lastActive, setLastActive] = useState<number>(Date.now());

  const lastActiveRef = useRef<number>(Date.now());
  const onIdleRef = useRef(onIdle);
  const onWarningRef = useRef(onWarning);

  onIdleRef.current = onIdle;
  onWarningRef.current = onWarning;

  const resetTimer = useCallback(() => {
    const now = Date.now();
    lastActiveRef.current = now;
    setLastActive(now);
    setIsIdle(false);
    setIsWarning(false);
    setRemainingSeconds(Math.round(timeoutMs / 1000));
  }, [timeoutMs]);

  // Listen to user activity events
  useEffect(() => {
    if (!enabled) return;

    const activityEvents = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'wheel',
      'click',
    ];

    let throttleTimer: ReturnType<typeof setTimeout> | null = null;

    const handleActivity = () => {
      // Throttle event handling to once every 1000ms for smooth performance
      if (!throttleTimer) {
        throttleTimer = setTimeout(() => {
          throttleTimer = null;
          // Don't auto-reset if in warning state unless explicitly called
          const now = Date.now();
          lastActiveRef.current = now;
          setLastActive(now);
          if (isIdle) {
            setIsIdle(false);
          }
        }, 1000);
      }
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      if (throttleTimer) clearTimeout(throttleTimer);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [enabled, isIdle]);

  // Interval ticker checking time elapsed
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - lastActiveRef.current;
      const remainingMs = Math.max(0, timeoutMs - elapsed);
      const remainingSec = Math.ceil(remainingMs / 1000);

      setRemainingSeconds(remainingSec);

      // Check warning threshold
      if (remainingMs <= warningThresholdMs && remainingMs > 0) {
        if (!isWarning) {
          setIsWarning(true);
          onWarningRef.current?.();
        }
      } else {
        if (isWarning && remainingMs > warningThresholdMs) {
          setIsWarning(false);
        }
      }

      // Check full idle expiration
      if (remainingMs <= 0) {
        if (!isIdle) {
          setIsIdle(true);
          setIsWarning(false);
          onIdleRef.current?.();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [enabled, timeoutMs, warningThresholdMs, isWarning, isIdle]);

  return {
    isIdle,
    isWarning,
    remainingSeconds,
    resetTimer,
    lastActive,
  };
}
