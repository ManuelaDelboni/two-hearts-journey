import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import book from "@/content/book.json";

export function BookDialog() {
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "radial-gradient(ellipse at center, rgba(20,10,5,0.85), rgba(0,0,0,0.95))" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="relative w-full max-w-5xl" style={{ perspective: 2000 }}>
            <motion.div
              className="relative mx-auto"
              initial={{ rotateX: -25, scale: 0.85, opacity: 0 }}
              animate={{ rotateX: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="relative grid aspect-[16/10] w-full grid-cols-2 overflow-hidden rounded-md shadow-warm">
                {/* Left page (cover or interior) */}
                <motion.div
                  className="relative origin-right"
                  initial={false}
                  animate={{ rotateY: opened ? -170 : 0 }}
                  transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
                  style={{ transformStyle: "preserve-3d", transformOrigin: "right center" }}
                >
                  {/* Front of left page = cover */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                    style={{
                      backfaceVisibility: "hidden",
                      background:
                        "linear-gradient(135deg, oklch(0.32 0.08 30) 0%, oklch(0.22 0.06 25) 60%, oklch(0.16 0.04 20) 100%)",
                      boxShadow: "inset 0 0 80px rgba(0,0,0,0.6), inset 8px 0 30px rgba(0,0,0,0.4)",
                    }}
                  >
                    <div className="absolute inset-3 rounded-sm border border-[var(--gold)]/40" />
                    <div className="absolute inset-5 rounded-sm border border-[var(--gold)]/20" />
                    <p className="font-hand text-xl text-gold/80">prólogo</p>
                    <h1 className="mt-3 font-display text-4xl text-gradient-gold sm:text-6xl">
                      {book.cover.title}
                    </h1>
                    <p className="mt-2 font-display italic text-gold-soft/80">{book.cover.subtitle}</p>
                    <div className="mt-8 flex items-center gap-3">
                      <span className="h-px w-12 bg-[var(--gold)]/50" />
                      <span className="font-hand text-2xl text-gold">♥</span>
                      <span className="h-px w-12 bg-[var(--gold)]/50" />
                    </div>
                    <p className="mt-6 text-xs uppercase tracking-[0.3em] text-gold/60">{book.cover.stamp}</p>
                  </div>
                  {/* Back of left page (interior left, mirrored) */}
                  <div
                    className="paper-texture absolute inset-0 flex items-center justify-center p-10"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                  >
                    <div className="font-hand text-2xl leading-relaxed text-[oklch(0.3_0.06_30)] sm:text-3xl">
                      <p className="mb-3">{book.letter.salutation}</p>
                      <p className="text-base leading-relaxed sm:text-lg">{book.letter.paragraphs[0]}</p>
                      <p className="mt-3 text-base leading-relaxed sm:text-lg">{book.letter.paragraphs[1]}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Right page (interior content) */}
                <div className="paper-texture relative flex flex-col justify-between p-8 sm:p-10">
                  <div className="font-hand text-[oklch(0.28_0.06_30)]">
                    <AnimatePresence>
                      {opened && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8, duration: 0.8 }}
                        >
                            <p className="text-base leading-relaxed sm:text-lg">
                              {book.letter.paragraphs[2]}
                            </p>
                            <p className="mt-3 text-base leading-relaxed sm:text-lg">
                              {book.letter.paragraphs[3]}
                            </p>
                          <p className="mt-8 text-right font-display text-2xl italic">{book.letter.signature}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => (opened ? setOpen(false) : setOpened(true))}
                      className="group relative overflow-hidden rounded-full bg-[oklch(0.25_0.06_30)] px-6 py-2.5 text-sm font-medium text-[var(--gold-soft)] shadow-glow transition-transform hover:scale-[1.03]"
                    >
                      <span className="relative z-10">{opened ? "Entrar na nossa história →" : book.cta}</span>
                    </button>
                  </div>
                </div>

                {/* Spine */}
                <div
                  className="pointer-events-none absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2"
                  style={{ background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.6), transparent)" }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
