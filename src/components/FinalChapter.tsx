import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import final from "@/content/final.json";
import { SectionTitle } from "./SectionTitle";

type Star = { id: number; x: number; y: number; size: number; delay: number };
type WishStar = { id: number; x: number; y: number; size: number; wish: string; custom: boolean };

function makeStars(n: number): Star[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 4,
  }));
}

function randomStarPosition(existing: { x: number; y: number }[]) {
  const minDist = 10;
  for (let attempt = 0; attempt < 20; attempt++) {
    const x = 8 + Math.random() * 84;
    const y = 10 + Math.random() * 75;
    if (!existing.some((p) => Math.hypot(p.x - x, p.y - y) < minDist)) return { x, y };
  }
  return { x: 8 + Math.random() * 84, y: 10 + Math.random() * 75 };
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
  const wishStars = useMemo<WishStar[]>(
    () =>
      final.wishes.map((w, i) => ({
        id: i,
        wish: w,
        x: 8 + Math.random() * 84,
        y: 10 + Math.random() * 75,
        size: 3 + Math.random() * 2,
        custom: false,
      })),
    [],
  );
  const nextId = useRef(wishStars.length);
  const [customStars, setCustomStars] = useState<WishStar[]>([]);
  const allStars = useMemo(() => [...wishStars, ...customStars], [wishStars, customStars]);

  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [wishInput, setWishInput] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const open = (i: number) => {
    setPicked(i);
    setRevealed((s) => new Set([...s, i]));
  };

  const pickedWish = picked !== null ? allStars.find((s) => s.id === picked)?.wish ?? "" : "";

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = wishInput.trim();
    if (!text) return;
    const pos = randomStarPosition(allStars.map((s) => ({ x: s.x, y: s.y })));
    const id = nextId.current++;
    setCustomStars((prev) => [
      ...prev,
      { id, x: pos.x, y: pos.y, size: 3 + Math.random() * 2, wish: text, custom: true },
    ]);
    setWishInput("");
    setFeedback("✦ Seu desejo virou uma estrela no céu.");
    setTimeout(() => setFeedback(null), 3200);
  };

  const extra = customStars.length;

  return (
    <section
      id="final"
      className="relative overflow-hidden py-12 sm:py-16"
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

        <div
          className="relative mt-16 w-full overflow-hidden rounded-3xl border border-[var(--gold)]/20 transition-[min-height] duration-500 ease-out aspect-[16/10]"
          style={{
            background: "radial-gradient(ellipse at center, oklch(0.16 0.06 280), oklch(0.08 0.02 280))",
            aspectRatio: extra > 0 ? "auto" : undefined,
            minHeight: extra > 0 ? `${380 + Math.min(extra, 24) * 16}px` : undefined,
          }}
        >
          {allStars.map((s) => {
            const isRevealed = revealed.has(s.id);
            return (
              <motion.button
                key={s.id}
                onClick={() => open(s.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${s.x}%`, top: `${s.y}%` }}
                aria-label="Revelar desejo"
                initial={s.custom ? { opacity: 0, scale: 0 } : false}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
              </motion.button>
            );
          })}
        </div>

        <p className="mt-6 text-center text-sm text-foreground/60">
          Toque nas estrelas — cada uma guarda um pedaço do nosso futuro.
        </p>

        <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-[var(--gold)]/20 bg-white/[0.03] p-6 backdrop-blur-sm">
          <p className="text-center text-sm uppercase tracking-[0.18em] text-gold/80">
            Adicione seu próprio desejo
          </p>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={wishInput}
              onChange={(e) => setWishInput(e.target.value.slice(0, 200))}
              placeholder="Escreva um desejo para o nosso futuro…"
              maxLength={200}
              className="flex-1 rounded-full border border-[var(--gold)]/30 bg-black/30 px-4 py-2.5 text-sm text-foreground/90 placeholder:text-foreground/40 outline-none focus:border-[var(--gold)]/70"
            />
            <button
              type="submit"
              disabled={!wishInput.trim()}
              className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Criar estrela ✦
            </button>
          </form>
          <AnimatePresence>
            {feedback && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 text-center text-sm text-gold"
              >
                {feedback}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

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
                <Typewriter text={pickedWish} />
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
