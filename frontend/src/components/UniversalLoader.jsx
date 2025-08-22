import React, { useEffect, useRef, useState } from "react";
import "../styles/universal-loader.css";

/** Delay + minDuration to avoid flicker and jank */
function useDeferredLoading(isLoading, { delay = 180, minDuration = 420 } = {}) {
  const [visible, setVisible] = useState(false);
  const startRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    clearTimeout(timerRef.current);

    if (isLoading) {
      startRef.current = performance.now();
      timerRef.current = setTimeout(() => setVisible(true), delay);
    } else {
      const elapsed = performance.now() - startRef.current;
      if (visible && elapsed < minDuration) {
        timerRef.current = setTimeout(() => setVisible(false), minDuration - elapsed);
      } else {
        setVisible(false);
      }
    }
    return () => clearTimeout(timerRef.current);
  }, [isLoading, delay, minDuration, visible]);

  return visible;
}

/**
 * Universal loader:
 * - variant: "inline" | "overlay" | "page"
 * - message: accessible loading label
 * - blur: px blur for overlay/page
 * - size: spinner size in px
 * - active: boolean flag (required)
 */
export default function UniversalLoader({
  active = false,
  variant = "overlay",
  message = "Loading…",
  blur = 6,
  size = 36,
  className = "",
  style,
}) {
  const show = useDeferredLoading(active);

  if (!show) return null;

  if (variant === "inline") {
    return (
      <span className={`ul-inline ${className}`} role="status" aria-live="polite" aria-busy="true" style={style}>
        <span className="ul-spinner" style={{ width: size, height: size }} />
        <span className="ul-sr-only">{message}</span>
      </span>
    );
  }

  if (variant === "page") {
    return (
      <div className="ul-page" role="status" aria-live="polite" aria-busy="true">
        <div className="ul-backdrop" style={{ backdropFilter: `blur(${blur}px)` }} />
        <div className="ul-center">
          <span className="ul-spinner ul-lg" style={{ width: size * 1.2, height: size * 1.2 }} />
          <p className="ul-msg">{message}</p>
        </div>
      </div>
    );
  }

  // default: overlay (covers nearest relatively-positioned parent)
  return (
    <div className={`ul-overlay ${className}`} role="status" aria-live="polite" aria-busy="true" style={{ ...style }}>
      <div className="ul-backdrop" style={{ backdropFilter: `blur(${blur}px)` }} />
      <div className="ul-center">
        <span className="ul-spinner" style={{ width: size, height: size }} />
        <p className="ul-msg">{message}</p>
      </div>
    </div>
  );
}

export { useDeferredLoading };
