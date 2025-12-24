import { useEffect, useRef } from "react";
import { SMILEY_PIXEL_ART, SMILEY_COLORS } from "./constants";

interface Smiley {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const SIZE = 32;

let smileySprite: HTMLCanvasElement | null = null;

function getSmileySprite(): HTMLCanvasElement {
  if (smileySprite) return smileySprite;

  smileySprite = document.createElement("canvas");
  smileySprite.width = SIZE;
  smileySprite.height = SIZE;
  const ctx = smileySprite.getContext("2d")!;
  const pixelSize = SIZE / 16;

  for (let row = 0; row < 16; row++) {
    for (let col = 0; col < 16; col++) {
      const val = SMILEY_PIXEL_ART[row][col];
      if (val === 0) continue;
      ctx.fillStyle = val === 1 ? SMILEY_COLORS.outline : SMILEY_COLORS.face;
      ctx.fillRect(
        col * pixelSize,
        row * pixelSize,
        Math.ceil(pixelSize),
        Math.ceil(pixelSize)
      );
    }
  }

  return smileySprite;
}

export function SmileyCelebration({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smileysRef = useRef<Smiley[]>([]);
  const animationRef = useRef<number>(0);
  const spawnedRef = useRef(false);
  const scrollVelocityRef = useRef(0);

  useEffect(() => {
    if (!active) return;

    let lastScrollY = window.scrollY;
    let lastTime = performance.now();

    const handleScroll = () => {
      const now = performance.now();
      const dt = now - lastTime;
      if (dt > 0) {
        const delta = window.scrollY - lastScrollY;
        scrollVelocityRef.current = (delta / dt) * 16;
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

    const stableWidth = document.documentElement.clientWidth;
    const stableHeight = document.documentElement.clientHeight;

    canvas.width = stableWidth;
    canvas.height = stableHeight;

    const resize = () => {
      canvas.width = document.documentElement.clientWidth;
      canvas.height = document.documentElement.clientHeight;
    };
    window.addEventListener("resize", resize);

    if (!spawnedRef.current) {
      spawnedRef.current = true;
      // Scale smiley count based on viewport width
      // Mobile (~400px) = 50, Desktop (5200px) = 200 (4x)
      const widthMultiplier = 1 + ((stableWidth - 400) / 4800) * 3;
      const smileyCount = Math.round(50 * Math.max(1, widthMultiplier));

      for (let i = 0; i < smileyCount; i++) {
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
    const sprite = getSmileySprite();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      scrollVelocityRef.current *= 0.95;

      const smileys = smileysRef.current;
      const checkRadiusSq = SIZE * SIZE * 4; // Check within 2x SIZE

      // Update physics and check boundaries
      for (let i = 0; i < smileys.length; i++) {
        const smiley = smileys[i];
        smiley.vy += GRAVITY + scrollVelocityRef.current * 0.02;
        smiley.vx *= FRICTION;
        smiley.vy *= FRICTION;
        smiley.x += smiley.vx;
        smiley.y += smiley.vy;

        const CEILING_Y = -500;
        if (smiley.y - SIZE / 2 < CEILING_Y) {
          smiley.y = CEILING_Y + SIZE / 2;
          smiley.vy *= -BOUNCE;
        }

        if (smiley.y + SIZE / 2 > FLOOR_Y) {
          smiley.y = FLOOR_Y - SIZE / 2;
          smiley.vy *= -BOUNCE;
        }

        if (smiley.x < SIZE / 2) {
          smiley.x = SIZE / 2;
          smiley.vx *= -BOUNCE;
        }
        if (smiley.x > canvas.width - SIZE / 2) {
          smiley.x = canvas.width - SIZE / 2;
          smiley.vx *= -BOUNCE;
        }
      }

      // Optimized collision detection: only check each pair once (O(n²/2) instead of O(n²))
      // Use squared distance to avoid expensive sqrt until collision confirmed
      for (let i = 0; i < smileys.length; i++) {
        const smiley = smileys[i];
        for (let j = i + 1; j < smileys.length; j++) {
          const other = smileys[j];

          const dx = other.x - smiley.x;
          const dy = other.y - smiley.y;
          const distSq = dx * dx + dy * dy;

          // Early exit if too far apart
          if (distSq > checkRadiusSq) continue;

          const dist = Math.sqrt(distSq);
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
      }

      // Draw all smileys
      for (let i = 0; i < smileys.length; i++) {
        const smiley = smileys[i];
        ctx.drawImage(
          sprite,
          Math.round(smiley.x - SIZE / 2),
          Math.round(smiley.y - SIZE / 2)
        );
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
