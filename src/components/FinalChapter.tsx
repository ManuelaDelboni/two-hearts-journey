import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import final from "@/content/final.json";
import { SectionTitle } from "./SectionTitle";

type Star = { id: number; x: number; y: number; size: number; delay: number };

function makeStars(n: number): Star[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 4,
  }));
}

function Typewriter({ text }: { text: string }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    setShown("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 35);
    return () => clearInterval(id);
  }, [text]);
  return (
    <span>
      {shown}
      <span className="ml-0.5 inline-block h-5 w-[2px] animate-pulse bg-gold align-middle" />
    </span>
  );
}

export function FinalChapter() {
  const stars = useMemo(() => makeStars(120), []);
  const wishStars = useMemo(
    () =>
      final.wishes.map((w, i) => ({
        wish: w,
        x: 8 + Math.random() * 84,
        y: 10 + Math.random() * 75,
        size: 3 + Math.random() * 2,
        id: i,
      })),
    [],
  );
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  const open = (i: number) => {
    setPicked(i);
    setRevealed((s) => new Set([...s, i]));
  };

  return (
    <section
      id="final"
      className="relative overflow-hidden py-24 sm:py-32"
      style={{
        background:
          "radial-gradient(ellipse at top, oklch(0.18 0.04 280) 0%, oklch(0.1 0.02 280) 50%, oklch(0.08 0.01 280) 100%)",
      }}
    >
      {/* twinkling background stars */}
      <div className="pointer-events-none absolute inset-0">
        {stars.map((s) => (
          <span
            key={s.id}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
        <SectionTitle eyebrow="Epílogo" title={final.title} subtitle={final.subtitle} />

        <div className="relative mt-16 aspect-[16/10] w-full overflow-hidden rounded-3xl border border-[var(--gold)]/20"
          style={{
            background: "radial-gradient(ellipse at center, oklch(0.16 0.06 280), oklch(0.08 0.02 280))",
          }}
        >
          {wishStars.map((s) => {
            const isRevealed = revealed.has(s.id);
            return (
              <button
                key={s.id}
                onClick={() => open(s.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${s.x}%`, top: `${s.y}%` }}
                aria-label="Revelar desejo"
              >
                <motion.span
                  className="block text-gold"
                  style={{ fontSize: `${s.size * 8}px`, filter: "drop-shadow(0 0 8px oklch(0.82 0.14 80 / 0.8))" }}
                  animate={
                    isRevealed
                      ? { scale: [1, 1.4, 1.2], rotate: [0, 20, -10, 0] }
                      : { opacity: [0.55, 1, 0.55] }
                  }
                  transition={
                    isRevealed
                      ? { duration: 0.8 }
                      : { duration: 2 + Math.random() * 2, repeat: Infinity }
                  }
                >
                  ✦
                </motion.span>
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-center text-sm text-foreground/60">
          Toque nas estrelas — cada uma guarda um pedaço do nosso futuro.
        </p>

        <p className="mt-16 text-center font-display text-2xl italic text-gradient-gold sm:text-3xl">
          {final.closing}
        </p>
      </div>

      <AnimatePresence>
        {picked !== null && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPicked(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="relative w-full max-w-lg rounded-2xl border border-[var(--gold)]/30 bg-card p-8 text-center shadow-warm"
            >
              <p className="text-5xl">✦</p>
              <p className="mt-6 font-display text-2xl leading-snug text-foreground/95 sm:text-3xl">
                <Typewriter text={final.wishes[picked]} />
              </p>
              <button
                onClick={() => setPicked(null)}
                className="mt-8 rounded-full bg-gold px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Fechar estrela
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
