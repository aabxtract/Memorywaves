'use client';

import React, { useRef, useEffect } from 'react';
import type { Fragment } from '@/lib/types';

interface GenerativeArtProps {
  fragments: Fragment[];
  isMinted: boolean;
}

const sentimentKeywords: Record<string, { h: number, s: number, l: number }> = {
  happy: { h: 60, s: 100, l: 70 },
  joy: { h: 45, s: 100, l: 65 },
  love: { h: 340, s: 100, l: 80 },
  sad: { h: 220, s: 80, l: 60 },
  fear: { h: 270, s: 60, l: 40 },
  angry: { h: 0, s: 90, l: 55 },
  dream: { h: 276, s: 90, l: 75 },
  light: { h: 70, s: 100, l: 90 },
  dark: { h: 240, s: 20, l: 20 },
  time: { h: 180, s: 50, l: 70 },
};

class Particle {
    x: number;
    y: number;
    size: number;
    color: string;
    vx: number;
    vy: number;
    
    constructor(x: number, y: number, size: number, color: string, speedFactor: number) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.vx = (Math.random() - 0.5) * 0.2 * speedFactor;
        this.vy = (Math.random() - 0.5) * 0.2 * speedFactor;
    }

    update(width: number, height: number) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < this.size || this.x > width - this.size) this.vx *= -1;
        if (this.y < this.size || this.y > height - this.size) this.vy *= -1;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

export function GenerativeArt({ fragments, isMinted }: GenerativeArtProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;
    
    const resizeCanvas = () => {
        const dpr = window.devicePixelRatio || 1;
        const rect = parent.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        ctx.scale(dpr, dpr);
    };
    
    resizeCanvas();

    const { width, height } = parent.getBoundingClientRect();

    // Determine time range for motion speed
    const timestamps = fragments.map(f => f.timestamp);
    const minTime = Math.min(...timestamps);
    const maxTime = Math.max(...timestamps);
    const timeRange = maxTime - minTime;

    // Initialize particles based on fragments
    particlesRef.current = fragments.map(fragment => {
        let color = { h: 276, s: 50, l: 80 }; // Default: dreamy purple
        const text = fragment.text.toLowerCase();
        for (const keyword in sentimentKeywords) {
            if (text.includes(keyword)) {
                color = sentimentKeywords[keyword];
                break;
            }
        }
        const hslColor = `hsla(${color.h}, ${color.s}%, ${color.l}%, 0.7)`;
        const size = Math.random() * 4 + fragments.length * 0.1;
        const x = Math.random() * width;
        const y = Math.random() * height;

        const timeNormal = timeRange > 0 ? (fragment.timestamp - minTime) / timeRange : 0.5;
        const speedFactor = 0.5 + timeNormal * 1.5;

        return new Particle(x, y, size, hslColor, speedFactor);
    });

    let animationFrameId: number;
    const animate = () => {
        ctx.clearRect(0, 0, width, height);

        particlesRef.current.forEach((p, i) => {
            p.update(width, height);
            p.draw(ctx);
            // Draw lines to a few other particles
            for(let j = i + 1; j < Math.min(i + 5, particlesRef.current.length); j++) {
                 const other = particlesRef.current[j];
                 const dist = Math.hypot(p.x - other.x, p.y - other.y);
                 if (dist < width / 4) {
                     ctx.beginPath();
                     ctx.moveTo(p.x, p.y);
                     ctx.lineTo(other.x, other.y);
                     ctx.strokeStyle = `hsla(${colorToHsl(p.color).h}, 50%, 70%, ${0.5 - (dist / (width/4)) * 0.5})`;
                     ctx.lineWidth = 0.5;
                     ctx.stroke();
                 }
            }
        });

        if (!isMinted) {
          animationFrameId = requestAnimationFrame(animate);
        }
    };
    
    if (!isMinted) {
      animate();
    } else {
      // Draw one static frame if minted
      setTimeout(animate, 100);
    }
    
    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [fragments, isMinted]);

  const colorToHsl = (color: string) => {
    const [h,s,l] = color.match(/\d+/g) || ['0','0','0'];
    return {h: parseInt(h), s: parseInt(s), l: parseInt(l)};
  }

  return <canvas ref={canvasRef} />;
}
