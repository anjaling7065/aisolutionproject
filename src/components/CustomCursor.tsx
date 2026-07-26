import { useEffect, useState } from "react";
import { motion } from "motion/react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [enabled]);

  // Trail smoother lag effect
  useEffect(() => {
    if (!enabled || !isVisible) return;

    let animId: number;
    const updateTrail = () => {
      setTrail((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15,
        };
      });
      animId = requestAnimationFrame(updateTrail);
    };

    animId = requestAnimationFrame(updateTrail);
    return () => cancelAnimationFrame(animId);
  }, [position, isVisible, enabled]);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("interactive-cursor")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mouseover", handleMouseOver);
    return () => window.removeEventListener("mouseover", handleMouseOver);
  }, [enabled]);

  if (!enabled || !isVisible) return null;

  return (
    <>
      {/* Central Cyan dot */}
      <div
        id="custom-cursor-core"
        className="pointer-events-none fixed top-0 left-0 z-50 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_10px_#00ffff]"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
      {/* Outer purple breathing halo */}
      <motion.div
        id="custom-cursor-halo"
        className="pointer-events-none fixed top-0 left-0 z-50 rounded-full border border-purple-500/50 bg-purple-500/5"
        animate={{
          left: `${trail.x}px`,
          top: `${trail.y}px`,
          x: "-50%",
          y: "-50%",
          width: isHovered ? 48 : 28,
          height: isHovered ? 48 : 28,
          borderColor: isHovered ? "#00ffff" : "#a855f7",
          backgroundColor: isHovered ? "rgba(0,255,255,0.06)" : "rgba(168,85,247,0.06)",
        }}
        transition={{ type: "tween", ease: "linear", duration: 0.05 }}
      />
    </>
  );
}
