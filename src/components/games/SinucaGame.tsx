import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Simple sequential pool: click balls 1→5 in order to pocket them.
const BALLS = [
  { id: 1, color: "oklch(0.75 0.18 80)", x: 25, y: 50 },
  { id: 2, color: "oklch(0.55 0.2 250)", x: 45, y: 30 },
  { id: 3, color: "oklch(0.6 0.22 25)", x: 60, y: 65 },
  { id: 4, color: "oklch(0.5 0.18 290)", x: 75, y: 35 },
  { id: 5, color: "oklch(0.6 0.2 140)", x: 88, y: 55 },
];

const POCKETS = [
  { x: 4, y: 8 },
  { x: 50, y: 4 },
  { x: 96, y: 8 },
  { x: 4, y: 92 },
  { x: 50, y: 96 },
  { x: 96, y: 92 },
];

export function SinucaGame() {
  const [pocketed, setPocketed] = useState<number[]>([]);
  const [error, setError] = useState<number | null>(null);

  const next = pocketed.length + 1;

  const click = (id: number) => {
    if (pocketed.includes(id)) return;
    if (id === next) {
      setPocketed([...pocketed, id]);
    } else {
      setError(id);
      setTimeout(() => setError(null), 600);
    }
  };

  const reset = () => setPocketed([]);
  const done = pocketed.length === BALLS.length;

  return (
    <div>
      <div
        className="relative mx-auto aspect-[2/1] w-full overflow-hidden rounded-3xl border-8 sm:border-[14px]"
        style={{
          background: "radial-gradient(ellipse at center, oklch(0.42 0.12 150), oklch(0.3 0.08 150))",
          borderColor: "oklch(0.28 0.06 30)",
          boxShadow: "inset 0 0 60px rgba(0,0,0,0.6)",
        }}
      >
        {POCKETS.map((p, i) => (
          <div
            key={i}
            className="absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/80 sm:h-8 sm:w-8"
            style={{ left: `${p.x}%`, top: `${p.y}%`, boxShadow: "inset 0 0 8px rgba(0,0,0,0.9)" }}
          />
        ))}
        {BALLS.map((b) => {
          const isPocketed = pocketed.includes(b.id);
          const wrong = error === b.id;
          return (
            <motion.button
              key={b.id}
              onClick={() => click(b.id)}
              className="absolute grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full font-bold text-white shadow-[inset_-4px_-6px_8px_rgba(0,0,0,0.4),inset_4px_4px_6px_rgba(255,255,255,0.25)] sm:h-12 sm:w-12"
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                background: b.color,
              }}
              animate={
                isPocketed
                  ? { scale: 0, opacity: 0, left: `${POCKETS[0].x}%`, top: `${POCKETS[0].y}%` }
                  : wrong
                    ? { x: [-4, 4, -4, 4, 0] }
                    : {}
              }
              transition={isPocketed ? { duration: 0.6 } : { duration: 0.3 }}
              whileHover={{ scale: 1.08 }}
            >
              {b.id}
            </motion.button>
          );
        })}
      </div>
      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-sm text-foreground/80">
          {done ? (
            <span className="font-display text-xl text-gold italic">Game, set, match. ♥</span>
          ) : (
            <>
              Próxima bola: <span className="font-bold text-gold">{next}</span>
              {error && <span className="ml-3 text-rose-300">Ops, fora de ordem!</span>}
            </>
          )}
        </p>
        <button
          onClick={reset}
          className="rounded-md border border-[var(--gold)]/30 px-3 py-1.5 text-xs uppercase tracking-wider text-gold hover:bg-[var(--gold)]/10"
        >
          Recomeçar
        </button>
      </div>
    </div>
  );
}
