import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import games from "@/content/games.json";

export function F1Game() {
  const cps = games.f1.checkpoints;
  const [current, setCurrent] = useState(0);
  const [opened, setOpened] = useState<number | null>(null);
  const progress = current / (cps.length - 1);

  const advance = () => {
    if (current < cps.length - 1) setCurrent(current + 1);
    setOpened(current);
  };

  return (
    <div>
      {/* Track */}
      <div className="relative mx-auto h-24 w-full overflow-hidden rounded-2xl border border-[var(--gold)]/15 bg-[oklch(0.18_0.02_40)] sm:h-28">
        {/* Track stripes */}
        <div
          className="absolute inset-x-0 top-1/2 h-8 -translate-y-1/2"
          style={{
            background:
              "repeating-linear-gradient(90deg, oklch(0.28 0.02 40) 0 30px, oklch(0.22 0.02 40) 30px 60px)",
            borderTop: "2px dashed oklch(0.82 0.14 80 / 0.5)",
            borderBottom: "2px dashed oklch(0.82 0.14 80 / 0.5)",
          }}
        />
        {/* Checkpoints */}
        {cps.map((cp, i) => {
          const pct = (i / (cps.length - 1)) * 100;
          const reached = i <= current;
          return (
            <button
              key={i}
              onClick={() => reached && setOpened(i)}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pct}%` }}
            >
              <div
                className={`grid h-8 w-8 place-items-center rounded-full border-2 text-[10px] font-bold transition-all ${
                  reached
                    ? "bg-gold text-primary-foreground border-gold shadow-glow"
                    : "bg-background/60 text-foreground/40 border-foreground/20"
                }`}
              >
                {i + 1}
              </div>
            </button>
          );
        })}
        {/* Car */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 text-3xl"
          animate={{ left: `${progress * 100}%` }}
          transition={{ type: "spring", stiffness: 90, damping: 16 }}
          style={{ translateX: "-50%" }}
        >
          🏎️
        </motion.div>
        {/* Finish */}
        <div className="absolute right-0 top-0 h-full w-2" style={{
          background: "repeating-linear-gradient(0deg, #fff 0 6px, #000 6px 12px)"
        }} />
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-sm text-foreground/80">
          Checkpoint <span className="font-bold text-gold">{current + 1}</span> de {cps.length}
        </p>
        {current < cps.length - 1 ? (
          <button
            onClick={advance}
            className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90"
          >
            Acelerar →
          </button>
        ) : (
          <span className="font-display text-lg italic text-gold">Bandeira quadriculada ♥</span>
        )}
      </div>

      {/* Cards */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cps.map((cp, i) => {
          const reached = i <= current;
          return (
            <button
              key={i}
              disabled={!reached}
              onClick={() => setOpened(i)}
              className={`rounded-xl border p-4 text-left transition-all ${
                reached
                  ? "border-[var(--gold)]/30 bg-card/60 hover:border-[var(--gold)]/60 hover:bg-card"
                  : "cursor-not-allowed border-[var(--gold)]/5 bg-card/20 opacity-40"
              }`}
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold/70">{cp.date}</p>
              <p className="mt-1 font-display text-lg">{cp.title}</p>
              <p className="mt-1 text-xs text-foreground/60">{reached ? "Toque para abrir o envelope" : "Bloqueado"}</p>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {opened !== null && (
          <EnvelopeModal cp={cps[opened]} onClose={() => setOpened(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function EnvelopeModal({ cp, onClose }: { cp: { date: string; title: string; memory: string }; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.85, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-md"
        style={{ perspective: 1200 }}
      >
        <div
          className="relative aspect-[3/2] w-full overflow-hidden rounded-md shadow-warm"
          style={{ background: "linear-gradient(135deg, oklch(0.85 0.08 80), oklch(0.7 0.1 70))" }}
        >
          {/* Letter inside */}
          <motion.div
            className="absolute inset-x-4 top-4 rounded bg-[oklch(0.96_0.02_80)] p-4 text-[oklch(0.2_0.03_40)] shadow-md"
            initial={{ y: 0 }}
            animate={{ y: open ? -80 : 0 }}
            transition={{ duration: 0.8 }}
            style={{ height: "calc(100% - 32px)" }}
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-[oklch(0.4_0.1_30)]">{cp.date}</p>
            <p className="mt-1 font-display text-2xl">{cp.title}</p>
            <p className="mt-3 font-hand text-xl leading-snug">{cp.memory}</p>
          </motion.div>

          {/* Envelope flap */}
          <motion.div
            className="absolute inset-x-0 top-0 origin-top"
            initial={false}
            animate={{ rotateX: open ? -180 : 0 }}
            transition={{ duration: 0.8 }}
            style={{
              height: "55%",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              background: "linear-gradient(135deg, oklch(0.78 0.1 70), oklch(0.62 0.12 60))",
              transformStyle: "preserve-3d",
            }}
          />
          {/* Bottom flap */}
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none"
            style={{
              height: "55%",
              clipPath: "polygon(0 100%, 100% 100%, 50% 0)",
              background: "linear-gradient(135deg, oklch(0.72 0.1 65), oklch(0.55 0.13 55))",
            }}
          />
          {/* Wax seal */}
          {!open && (
            <button
              onClick={() => setOpen(true)}
              className="absolute left-1/2 top-[45%] grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-white shadow-lg"
              style={{ background: "radial-gradient(circle at 30% 30%, oklch(0.65 0.22 25), oklch(0.4 0.18 25))" }}
            >
              ♥
            </button>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full rounded-md border border-[var(--gold)]/30 px-3 py-2 text-xs uppercase tracking-wider text-gold hover:bg-[var(--gold)]/10"
        >
          Fechar
        </button>
      </motion.div>
    </motion.div>
  );
}
