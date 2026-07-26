import { useEffect, useRef } from "react";

export default function NeuralNetwork() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle pool setup
    const particleCount = Math.min(80, Math.floor((width * height) / 18000));
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      glow: number;
    }> = [];

    const colors = [
      "rgba(0, 255, 255, 0.75)", // cyan
      "rgba(157, 78, 221, 0.75)", // violet
      "rgba(255, 0, 127, 0.75)", // cyber pink
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2.2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        glow: Math.random() * 8 + 5,
      });
    }

    // Touch/Mouse coordinate tracking
    const mouse = { x: null as number | null, y: null as number | null, radius: 160 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Draw frame
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Faint background ambiance
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      gradient.addColorStop(0, "rgba(13, 13, 27, 0.1)");
      gradient.addColorStop(1, "rgba(7, 7, 12, 0.5)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Move & render particles
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Bounce walls
        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        // Mouse attraction/repulsion forces
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p1.x;
          const dy = mouse.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            p1.x -= dx * force * 0.02; // smooth pushback
            p1.y -= dy * force * 0.02;
          }
        }

        // Draw node dot
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.shadowBlur = p1.glow;
        ctx.shadowColor = p1.color;
        ctx.fill();

        // Connect nodes inside threshold
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const connectionThreshold = 140;
          if (dist < connectionThreshold) {
            const alpha = (1 - dist / connectionThreshold) * 0.16;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);

            // Glimmering lines
            const lineGrad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            lineGrad.addColorStop(0, p1.color.replace("0.75", alpha.toString()));
            lineGrad.addColorStop(1, p2.color.replace("0.75", alpha.toString()));

            ctx.strokeStyle = lineGrad;
            ctx.lineWidth = 0.8;
            ctx.shadowBlur = 0; // turn off shadow blur for lines (cpu boost)
            ctx.stroke();
          }
        }
      }

      // Attract to mouse
      if (mouse.x !== null && mouse.y !== null) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const alpha = (1 - dist / mouse.radius) * 0.22;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="neural-mesh-canvas"
      className="pointer-events-none fixed top-0 left-0 -z-10 h-full w-full opacity-60"
    />
  );
}
