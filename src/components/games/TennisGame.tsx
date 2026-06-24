import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import games from "@/content/games.json";

export function TennisGame() {
  const qs = games.tennis.questions;
  const [i, setI] = useState(0);
  const [side, setSide] = useState<"left" | "right">("left");
  const [done, setDone] = useState(false);
  const [wrong, setWrong] = useState(false);

  const answer = (idx: number) => {
    if (idx === qs[i].answer) {
      setSide((s) => (s === "left" ? "right" : "left"));
      setTimeout(() => {
        if (i + 1 >= qs.length) setDone(true);
        else setI(i + 1);
      }, 700);
    } else {
      setWrong(true);
      setTimeout(() => setWrong(false), 700);
    }
  };

  const reset = () => {
    setI(0);
    setSide("left");
    setDone(false);
  };

  return (
    <div>
      <div
        className="relative mx-auto aspect-[2/1] w-full overflow-hidden rounded-2xl border-4"
        style={{
          background: "linear-gradient(180deg, oklch(0.5 0.18 50), oklch(0.42 0.16 45))",
          borderColor: "oklch(0.96 0.012 80)",
        }}
      >
        <div className="absolute inset-y-0 left-1/2 w-px bg-white/80" />
        <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/40" />
        <motion.div
          className="absolute h-5 w-5 rounded-full bg-[oklch(0.92_0.18_120)] shadow-glow"
          animate={{
            left: side === "left" ? "15%" : "80%",
            top: ["45%", "20%", "45%"],
          }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          style={{ translateY: "-50%" }}
        />
      </div>

      <div className="mt-6 min-h-[180px] rounded-2xl border border-[var(--gold)]/15 bg-card/40 p-6">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <p className="font-display text-4xl text-gradient-gold">Perfect match.</p>
              <p className="mt-2 text-sm text-foreground/70">A gente combina demais.</p>
              <button
                onClick={reset}
                className="mt-5 rounded-md border border-[var(--gold)]/30 px-4 py-1.5 text-xs uppercase tracking-wider text-gold hover:bg-[var(--gold)]/10"
              >
                Jogar de novo
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-gold/70">
                Rally {i + 1} / {qs.length}
              </p>
              <p className="mt-2 font-display text-2xl text-foreground/95">{qs[i].q}</p>
              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                {qs[i].options.map((o, idx) => (
                  <button
                    key={o}
                    onClick={() => answer(idx)}
                    className="rounded-lg border border-[var(--gold)]/20 bg-background/40 px-4 py-2.5 text-sm transition-all hover:border-[var(--gold)]/60 hover:bg-[var(--gold)]/10"
                  >
                    {o}
                  </button>
                ))}
              </div>
              {wrong && <p className="mt-3 text-sm text-rose-300">Bola fora — tenta de novo.</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
