import { useEffect, useRef } from "react";
import { SMILEY_PIXEL_ART, SMILEY_COLORS } from "./constants";

interface Smiley {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const SIZE = 32;

function drawSmiley(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const pixelSize = SIZE / 16;
  const px = Math.round(x - SIZE / 2);
  const py = Math.round(y - SIZE / 2);

  for (let row = 0; row < 16; row++) {
    for (let col = 0; col < 16; col++) {
      const val = SMILEY_PIXEL_ART[row][col];
      if (val === 1) {
        ctx.fillStyle = SMILEY_COLORS.outline;
      } else if (val === 2) {
        ctx.fillStyle = SMILEY_COLORS.face;
      } else {
        continue;
      }
      ctx.fillRect(
        px + col * pixelSize,
        py + row * pixelSize,
        Math.ceil(pixelSize),
        Math.ceil(pixelSize)
      );
    }
  }
}

export function SmileyCelebration({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smileysRef = useRef<Smiley[]>([]);
  const animationRef = useRef<number>(0);
  const spawnedRef = useRef(false);
  const scrollVelocityRef = useRef(0);

  // Track scroll inertia
  useEffect(() => {
    if (!active) return;

    let lastScrollY = window.scrollY;
    let lastTime = performance.now();

    const handleScroll = () => {
      const now = performance.now();
      const dt = now - lastTime;
      if (dt > 0) {
        const delta = window.scrollY - lastScrollY;
        scrollVelocityRef.current = (delta / dt) * 16; // Normalize to ~60fps
      }
      lastScrollY = window.scrollY;
      lastTime = now;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [active]);

  // Main animation loop
  useEffect(() => {
    if (!active) {
      spawnedRef.current = false;
      smileysRef.current = [];
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Capture stable dimensions at start (avoids iOS rubber-band viewport changes)
    const stableWidth = document.documentElement.clientWidth;
    const stableHeight = document.documentElement.clientHeight;

    canvas.width = stableWidth;
    canvas.height = stableHeight;

    const resize = () => {
      // Only update on actual orientation/resize, not scroll bounce
      canvas.width = document.documentElement.clientWidth;
      canvas.height = document.documentElement.clientHeight;
    };
    window.addEventListener("resize", resize);

    // Spawn smileys
    if (!spawnedRef.current) {
      spawnedRef.current = true;
      for (let i = 0; i < 50; i++) {
        setTimeout(() => {
          smileysRef.current.push({
            x: Math.random() * stableWidth,
            y: -20 - Math.random() * 200,
            vx: (Math.random() - 0.5) * 2,
            vy: Math.random() * 2 + 1,
          });
        }, i * 40);
      }
    }

    const GRAVITY = 0.3;
    const FRICTION = 0.98;
    const BOUNCE = 0.75;
    const FLOOR_Y = stableHeight;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Decay scroll velocity
      scrollVelocityRef.current *= 0.95;

      for (const smiley of smileysRef.current) {
        smiley.vy += GRAVITY + scrollVelocityRef.current * 0.02;
        smiley.vx *= FRICTION;
        smiley.vy *= FRICTION;
        smiley.x += smiley.vx;
        smiley.y += smiley.vy;

        // Ceiling (above viewport to catch flying smileys)
        const CEILING_Y = -500;
        if (smiley.y - SIZE / 2 < CEILING_Y) {
          smiley.y = CEILING_Y + SIZE / 2;
          smiley.vy *= -BOUNCE;
        }

        // Floor
        if (smiley.y + SIZE / 2 > FLOOR_Y) {
          smiley.y = FLOOR_Y - SIZE / 2;
          smiley.vy *= -BOUNCE;
        }

        // Walls
        if (smiley.x < SIZE / 2) {
          smiley.x = SIZE / 2;
          smiley.vx *= -BOUNCE;
        }
        if (smiley.x > canvas.width - SIZE / 2) {
          smiley.x = canvas.width - SIZE / 2;
          smiley.vx *= -BOUNCE;
        }

        // Collisions
        for (const other of smileysRef.current) {
          if (other === smiley) continue;
          const dx = other.x - smiley.x;
          const dy = other.y - smiley.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < SIZE && dist > 0) {
            const overlap = (SIZE - dist) / 2;
            const nx = dx / dist;
            const ny = dy / dist;
            smiley.x -= nx * overlap * 0.5;
            smiley.y -= ny * overlap * 0.5;
            other.x += nx * overlap * 0.5;
            other.y += ny * overlap * 0.5;
          }
        }

        drawSmiley(ctx, smiley.x, smiley.y);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[45] pointer-events-none"
      style={{
        touchAction: "none",
        viewTransitionName: "smiley-celebration",
        zIndex: 101,
      }}
    />
  );
}
