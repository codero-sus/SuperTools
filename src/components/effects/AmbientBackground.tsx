import React, { useEffect, useRef, useState } from 'react';

export type AmbientEffect = 'leaves' | 'stars' | 'rain' | 'fireflies' | 'off';

interface AmbientBackgroundProps {
  effect: AmbientEffect;
  isDark: boolean;
}

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({ effect, isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (effect === 'off') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Optimized particle pool (strictly 25-35 particles to run easily on 3-4GB RAM PCs)
    const count = effect === 'stars' ? 35 : effect === 'leaves' ? 24 : effect === 'rain' ? 35 : 22;

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      angle: number;
      angularSpeed: number;
      color: string;
      opacity: number;
      fadeSpeed: number;
      length?: number;
    }

    const leafColorsLight = ['#d97706', '#ea580c', '#b45309', '#f59e0b', '#10b981'];
    const leafColorsDark = ['#f59e0b', '#fb923c', '#d97706', '#34d399', '#f43f5e'];

    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: effect === 'leaves' ? 10 + Math.random() * 12 : effect === 'stars' ? 1 + Math.random() * 2.5 : effect === 'fireflies' ? 2 + Math.random() * 3 : 1.5,
        speedX: effect === 'leaves' ? Math.random() * 1 - 0.2 : effect === 'stars' ? (Math.random() < 0.1 ? 4 + Math.random() * 3 : 0) : effect === 'fireflies' ? (Math.random() - 0.5) * 0.6 : 0.5,
        speedY: effect === 'leaves' ? 0.6 + Math.random() * 1.2 : effect === 'stars' ? (Math.random() < 0.1 ? 2 + Math.random() * 2 : 0) : effect === 'fireflies' ? (Math.random() - 0.5) * 0.6 : 8 + Math.random() * 6,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.02,
        color: effect === 'leaves'
          ? (isDark ? leafColorsDark[Math.floor(Math.random() * leafColorsDark.length)] : leafColorsLight[Math.floor(Math.random() * leafColorsLight.length)])
          : effect === 'fireflies'
          ? '#fef08a'
          : '#ffffff',
        opacity: Math.random() * 0.6 + 0.2,
        fadeSpeed: (Math.random() * 0.01 + 0.005) * (Math.random() < 0.5 ? 1 : -1),
        length: effect === 'rain' ? 14 + Math.random() * 10 : effect === 'stars' ? 40 : 0
      });
    }

    // Shooting star state
    let shootingStar = {
      active: false,
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      len: 0,
      opacity: 0
    };

    let lastShootingStarTime = Date.now();

    let isTabVisible = !document.hidden;
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const render = () => {
      if (!isTabVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      if (effect === 'leaves') {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += Math.sin(p.angle) * 0.8 + p.speedX;
          p.y += p.speedY;
          p.angle += p.angularSpeed;

          if (p.y > height + 20) {
            p.y = -20;
            p.x = Math.random() * width;
          }
          if (p.x > width + 20) p.x = -20;
          if (p.x < -20) p.x = width + 20;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = isDark ? p.opacity * 0.7 : p.opacity * 0.55;

          // Simple elegant leaf shape
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      } else if (effect === 'stars') {
        // Twinkling calm stars
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.opacity += p.fadeSpeed;
          if (p.opacity > 0.85 || p.opacity < 0.15) {
            p.fadeSpeed = -p.fadeSpeed;
          }

          ctx.fillStyle = isDark ? '#ffffff' : '#6366f1';
          ctx.globalAlpha = isDark ? p.opacity : p.opacity * 0.4;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        // Periodic peaceful shooting star
        const now = Date.now();
        if (!shootingStar.active && now - lastShootingStarTime > 4000 && Math.random() < 0.03) {
          shootingStar.active = true;
          shootingStar.x = Math.random() * width * 0.8;
          shootingStar.y = Math.random() * (height * 0.4);
          shootingStar.dx = 9 + Math.random() * 5;
          shootingStar.dy = 4 + Math.random() * 3;
          shootingStar.len = 90 + Math.random() * 60;
          shootingStar.opacity = 1.0;
          lastShootingStarTime = now;
        }

        if (shootingStar.active) {
          ctx.save();
          const grad = ctx.createLinearGradient(
            shootingStar.x,
            shootingStar.y,
            shootingStar.x - shootingStar.len * 0.8,
            shootingStar.y - shootingStar.len * 0.35
          );
          grad.addColorStop(0, isDark ? `rgba(255, 255, 255, ${shootingStar.opacity})` : `rgba(99, 102, 241, ${shootingStar.opacity})`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(shootingStar.x, shootingStar.y);
          ctx.lineTo(
            shootingStar.x - shootingStar.len * 0.8,
            shootingStar.y - shootingStar.len * 0.35
          );
          ctx.stroke();
          ctx.restore();

          shootingStar.x += shootingStar.dx;
          shootingStar.y += shootingStar.dy;
          shootingStar.opacity -= 0.02;

          if (shootingStar.opacity <= 0 || shootingStar.x > width || shootingStar.y > height) {
            shootingStar.active = false;
          }
        }
      } else if (effect === 'rain') {
        ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.35)' : 'rgba(99, 102, 241, 0.25)';
        ctx.lineWidth = 1.2;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.y += p.speedY;
          p.x += p.speedX;

          if (p.y > height) {
            p.y = -20;
            p.x = Math.random() * width;
          }

          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speedX * 2, p.y + (p.length || 15));
          ctx.stroke();
        }
      } else if (effect === 'fireflies') {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.speedX;
          p.y += p.speedY;
          p.opacity += p.fadeSpeed;

          if (p.opacity > 0.85 || p.opacity < 0.15) {
            p.fadeSpeed = -p.fadeSpeed;
          }

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.save();
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#facc15';
          ctx.fillStyle = '#fef08a';
          ctx.globalAlpha = p.opacity * 0.8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [effect, isDark]);

  if (effect === 'off') return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
      aria-hidden="true"
    />
  );
};
