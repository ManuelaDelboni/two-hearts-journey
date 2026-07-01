import { useState, useRef } from "react";
import { motion } from "framer-motion";
import travels from "@/content/travels.json";
import games from "@/content/games.json";

// Build city lookup (id → {name, country}) from travels.json
const CITY_MAP = Object.fromEntries(
  travels.cities.map(c => [c.id, { name: c.name, country: c.country }])
);

const CORRECT_ORDER: string[] = games.f1.cityOrder as string[];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function F1Game() {
  const [order, setOrder]         = useState<string[]>(() => shuffle(CORRECT_ORDER));
  const [dragIdx, setDragIdx]     = useState<number | null>(null);
  const [overIdx, setOverIdx]     = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const dragSrc                   = useRef<number | null>(null);

  // Real-time score
  const correctCount = order.filter((id, i) => id === CORRECT_ORDER[i]).length;
  const pct          = Math.round((correctCount / CORRECT_ORDER.length) * 100);

  // ── Drag handlers — reorder only on drop, hover tracked via onDragOver ──
  const onDragStart = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
    dragSrc.current = idx;
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (overIdx !== idx) setOverIdx(idx);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, toIdx: number) => {
    e.preventDefault();
    const fromIdx = dragSrc.current;
    if (fromIdx === null || fromIdx === toIdx) return;
    setOrder(prev => {
      const next = [...prev];
      const [item] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, item);
      return next;
    });
    dragSrc.current = null;
    setDragIdx(null);
    setOverIdx(null);
  };

  const onDragEnd = () => {
    dragSrc.current = null;
    setDragIdx(null);
    setOverIdx(null);
  };

  // ── Actions ────────────────────────────────────────────────────
  const reset = () => {
    setOrder(shuffle(CORRECT_ORDER));
    setSubmitted(false);
    setDragIdx(null);
    setOverIdx(null);
  };

  return (
    <div className="space-y-5">

      {/* ── F1 Track ── */}
      <div className="relative mx-auto h-20 w-full overflow-hidden rounded-2xl border border-[var(--gold)]/15 bg-[oklch(0.18_0.02_40)]">
        {/* Asphalt stripes */}
        <div className="absolute inset-x-0 top-1/2 h-8 -translate-y-1/2"
          style={{
            background: "repeating-linear-gradient(90deg, oklch(0.26 0.02 40) 0 28px, oklch(0.20 0.02 40) 28px 56px)",
            borderTop:    "2px dashed oklch(0.82 0.14 80 / 0.35)",
            borderBottom: "2px dashed oklch(0.82 0.14 80 / 0.35)",
          }}
        />

        {/* Progress fill */}
        <motion.div
          className="absolute inset-x-0 top-1/2 h-8 -translate-y-1/2 origin-left"
          style={{
            background: pct === 100
              ? "linear-gradient(90deg, oklch(0.65 0.22 140 / 0.5), oklch(0.72 0.18 120 / 0.7))"
              : "linear-gradient(90deg, oklch(0.7 0.2 80 / 0.35), oklch(0.65 0.22 40 / 0.5))",
          }}
          animate={{ scaleX: pct / 100 }}
          transition={{ type: "spring", stiffness: 70, damping: 14 }}
        />

        {/* Car */}
        <motion.span
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-2xl"
          animate={{ left: `${Math.max(3, pct - 2)}%` }}
          transition={{ type: "spring", stiffness: 70, damping: 14 }}
        >
          🏎️
        </motion.span>

        {/* Finish line */}
        <div className="absolute right-0 top-0 h-full w-2 pointer-events-none"
          style={{ background: "repeating-linear-gradient(0deg, #fff 0 6px, #000 6px 12px)" }}
        />

        {/* Percentage */}
        <motion.span
          key={pct}
          initial={{ scale: 1.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`absolute right-4 top-1/2 -translate-y-1/2 text-lg font-bold tabular-nums ${
            pct === 100 ? "text-emerald-400" : "text-gold"
          }`}
        >
          {pct}%
        </motion.span>
      </div>

      {/* ── Instructions ── */}
      <p className="text-center text-xs tracking-[0.2em] text-foreground/35">
        Ordene as cidades cronologicamente — arrasta e solta
      </p>

      {/* ── City cards ── */}
      <div className="max-h-72 space-y-1.5 overflow-y-auto rounded-xl pr-1 sm:max-h-80">
        {order.map((id, idx) => {
          const city      = CITY_MAP[id];
          const isDragged = dragIdx === idx;
          const isOver    = overIdx === idx && dragIdx !== idx;
          const isCorrect = submitted && id === CORRECT_ORDER[idx];
          const isWrong   = submitted && id !== CORRECT_ORDER[idx];

          return (
            <div
              key={id}
              draggable={!submitted}
              onDragStart={e => onDragStart(e, idx)}
              onDragOver={e => onDragOver(e, idx)}
              onDrop={e => onDrop(e, idx)}
              onDragEnd={onDragEnd}
              className={[
                "flex items-center gap-3 rounded-xl border px-4 py-2.5 cursor-grab active:cursor-grabbing transition-all duration-150",
                isDragged  ? "opacity-30 scale-[0.98]"                             : "",
                isOver     ? "border-gold/60 bg-[var(--gold)]/10 scale-[1.01]"     : "",
                isCorrect  ? "border-emerald-500/40 bg-emerald-500/10"              : "",
                isWrong    ? "border-rose-500/25 bg-rose-500/5"                     : "",
                !isDragged && !isOver && !isCorrect && !isWrong
                           ? "border-[var(--gold)]/15 bg-card/40 hover:border-[var(--gold)]/30"
                           : "",
              ].join(" ")}
            >
              {/* Position number */}
              <span className="w-5 shrink-0 text-center text-xs font-bold text-foreground/25">
                {idx + 1}
              </span>

              {/* City info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{city?.name ?? id}</p>
                <p className="text-xs text-foreground/40">{city?.country}</p>
              </div>

              {/* Drag handle / result icon */}
              <span className={`shrink-0 text-sm ${submitted ? "" : "text-foreground/20"}`}>
                {submitted
                  ? isCorrect ? "✓" : "✗"
                  : "⠿"}
              </span>

              {/* Correct position hint when submitted & wrong */}
              {isWrong && (
                <span className="shrink-0 text-[10px] text-foreground/30">
                  #{CORRECT_ORDER.indexOf(id) + 1}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Actions ── */}
      <div className="flex items-center justify-between gap-4">
        <button onClick={reset}
          className="rounded-md border border-[var(--gold)]/30 px-4 py-1.5 text-xs uppercase tracking-wider text-gold hover:bg-[var(--gold)]/10 transition-colors"
        >
          Reiniciar
        </button>

        {!submitted ? (
          <button onClick={() => setSubmitted(true)}
            className="rounded-full bg-gold px-6 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-primary-foreground shadow-glow hover:opacity-90 transition-opacity"
          >
            Verificar ordem
          </button>
        ) : (
          <span className={`font-display text-lg italic ${pct === 100 ? "text-gold" : "text-foreground/70"}`}>
            {pct === 100 ? "Corrida perfeita ! 🏆" : `${correctCount} / ${CORRECT_ORDER.length} corretas`}
          </span>
        )}
      </div>
    </div>
  );
}
