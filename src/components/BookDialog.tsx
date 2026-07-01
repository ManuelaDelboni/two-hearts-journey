import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform, animate } from "framer-motion";
import book from "@/content/book.json";

// Hex colors so opacity suffixes like ${GOLD}cc work correctly
const GOLD      = "#d4a843";
const GOLD_SOFT = "#e8cc8a";
const EMBER     = "#9b4215";
const GOLD_GRADIENT = `linear-gradient(135deg, ${GOLD_SOFT}, ${GOLD} 50%, ${EMBER})`;
const SERIF = '"Cormorant Garamond", "Playfair Display", Georgia, serif';
const ROMAN = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];

const { salutation, paragraphs, signature } = book.letter;
const PARAS_PER_PAGE = 3;
const CONTENT_PAGES = Array.from(
  { length: Math.ceil(paragraphs.length / PARAS_PER_PAGE) },
  (_, i) => ({
    salutation: i === 0 ? salutation : undefined,
    paragraphs: paragraphs.slice(i * PARAS_PER_PAGE, (i + 1) * PARAS_PER_PAGE),
    signature: (i + 1) * PARAS_PER_PAGE >= paragraphs.length ? signature : undefined,
  })
);

// Smoother easing: quick lift, gentle settle — feels like real paper
const TURN_EASE = [0.22, 0.0, 0.18, 1.0] as const;
const TURN_DURATION = 1.05;

// Ribbon / bookmark colors for each page tab
const TAB_COLORS = ["#c8783a", "#b85c2e", "#a84020", "#983010"];

type Props = { open: boolean; onClose: () => void };

// Decorative corner SVG — rotated per corner via className
function Corner({ className }: { className: string }) {
  return (
    <svg
      className={className}
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      aria-hidden
    >
      <path d="M2 42 C2 2 42 2 42 2" stroke={GOLD} strokeWidth="0.9" strokeOpacity="0.45" />
      <circle cx="2"  cy="42" r="2"   fill={GOLD} fillOpacity="0.4" />
      <circle cx="42" cy="2"  r="2"   fill={GOLD} fillOpacity="0.4" />
      <circle cx="22" cy="22" r="1.2" fill={GOLD} fillOpacity="0.25" />
    </svg>
  );
}

export function BookDialog({ open, onClose }: Props) {
  const [displayPage, setDisplayPage] = useState(0);
  const [leafPage,    setLeafPage]    = useState<number | null>(null);

  const leafRotY = useMotionValue(0);

  const underShadowOpacity = useTransform(
    leafRotY, [-180, -90, -55, -25, 0], [0, 0.04, 0.22, 0.13, 0]
  );
  const leafShadowOpacity = useTransform(
    leafRotY, [-180, -90, -45, -10, 0], [0, 0.6, 0.38, 0.08, 0]
  );
  const leafHighlightOpacity = useTransform(
    leafRotY, [-180, -90, -30, 0], [0, 0.14, 0.06, 0]
  );

  useEffect(() => {
    if (!open) {
      setDisplayPage(0);
      setLeafPage(null);
      leafRotY.set(0);
    }
  }, [open, leafRotY]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isAnimating = leafPage !== null;
  const isLastPage  = displayPage === CONTENT_PAGES.length;

  const goNext = () => {
    if (isAnimating || displayPage >= CONTENT_PAGES.length) return;
    const departing = displayPage;
    setDisplayPage(displayPage + 1);
    setLeafPage(departing);
    leafRotY.set(0);
    animate(leafRotY, -180, {
      duration: TURN_DURATION,
      ease: TURN_EASE,
      onComplete: () => setLeafPage(null),
    });
  };

  const goPrev = () => {
    if (isAnimating || displayPage <= 0) return;
    const arriving = displayPage - 1;
    setLeafPage(arriving);
    leafRotY.set(-180);
    animate(leafRotY, 0, {
      duration: TURN_DURATION,
      ease: TURN_EASE,
      onComplete: () => {
        setDisplayPage(arriving);
        setLeafPage(null);
      },
    });
  };

  // Jump to a specific page via tab click
  const goToPage = (target: number) => {
    if (isAnimating || target === displayPage) return;
    if (target > displayPage) {
      const departing = displayPage;
      setDisplayPage(target);
      setLeafPage(departing);
      leafRotY.set(0);
      animate(leafRotY, -180, {
        duration: TURN_DURATION,
        ease: TURN_EASE,
        onComplete: () => setLeafPage(null),
      });
    } else {
      setLeafPage(target);
      leafRotY.set(-180);
      animate(leafRotY, 0, {
        duration: TURN_DURATION,
        ease: TURN_EASE,
        onComplete: () => {
          setDisplayPage(target);
          setLeafPage(null);
        },
      });
    }
  };

  // ── Cover ──────────────────────────────────────────────────────────────────
  const renderCover = (clickable: boolean) => (
    <div
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={clickable ? goNext : undefined}
      onKeyDown={clickable ? (e) => e.key === "Enter" && goNext() : undefined}
      className={clickable ? "group cursor-pointer" : ""}
      style={{ aspectRatio: "3 / 4", display: "block" }}
    >
      <div
        className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-md p-8 text-center"
        style={{
          background:
            "linear-gradient(150deg, oklch(0.30 0.08 30) 0%, oklch(0.20 0.06 25) 55%, oklch(0.14 0.04 20) 100%)",
          boxShadow:
            "0 35px 90px -20px rgba(0,0,0,0.85), inset 0 0 90px rgba(0,0,0,0.55), inset 10px 0 35px rgba(0,0,0,0.45)",
        }}
      >
        {/* Spine shadow */}
        <div
          className="absolute inset-y-0 left-0 w-4"
          style={{ background: "linear-gradient(to right, rgba(0,0,0,0.65), transparent)" }}
        />
        {/* Double border */}
        <div className="absolute inset-3 rounded-sm" style={{ border: `1px solid ${GOLD}55` }} />
        <div className="absolute inset-5 rounded-sm" style={{ border: `1px solid ${GOLD}28` }} />

        {/* Corner ornaments */}
        <Corner className="absolute left-3  top-3"  />
        <Corner className="absolute right-3 top-3    rotate-90"  />
        <Corner className="absolute left-3  bottom-3 -rotate-90" />
        <Corner className="absolute right-3 bottom-3 rotate-180" />

        {/* Content */}
        <p
          className="font-hand text-xl tracking-wide"
          style={{ color: `${GOLD}cc`, letterSpacing: "0.06em" }}
        >
          ✦ &nbsp;prólogo&nbsp; ✦
        </p>

        <h1
          className="mt-4 text-4xl sm:text-5xl leading-tight"
          style={{
            fontFamily: SERIF,
            background: GOLD_GRADIENT,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {book.cover.title}
        </h1>

        <p
          className="mt-2 text-base italic"
          style={{ fontFamily: SERIF, color: `${GOLD_SOFT}bb` }}
        >
          {book.cover.subtitle}
        </p>

        {/* Divider */}
        <div className="mt-7 flex items-center gap-3">
          <span className="h-px w-10" style={{ background: `${GOLD}60` }} />
          <span className="font-hand text-2xl" style={{ color: `${GOLD}dd` }}>♥</span>
          <span className="h-px w-10" style={{ background: `${GOLD}60` }} />
        </div>

        <p
          className="mt-5 text-base uppercase tracking-[0.3em]"
          style={{ color: `${GOLD}99` }}
        >
          {book.cover.stamp}
        </p>

        {clickable && (
          <p
            className="mt-10 text-[11px] uppercase tracking-[0.3em] opacity-50 transition-opacity duration-500 group-hover:opacity-100"
            style={{ color: GOLD_SOFT }}
          >
            ✦ clique para abrir ✦
          </p>
        )}
      </div>
    </div>
  );

  // ── Content page ───────────────────────────────────────────────────────────
  const renderContentPage = (pageIndex: number) => {
    const cp = CONTENT_PAGES[pageIndex - 1];
    const tabColor = TAB_COLORS[(pageIndex - 1) % TAB_COLORS.length];
    return (
      <div
        className="paper-texture relative overflow-hidden rounded-md"
        style={{
          aspectRatio: "3 / 4",
          boxShadow: "0 30px 80px -30px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.12)",
        }}
      >
        {/* Spine shadow */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-5 z-10"
          style={{ background: "linear-gradient(to right, rgba(0,0,0,0.08), transparent)" }}
        />
        {/* Bookmark ribbon on top-right corner */}
        <div
          className="pointer-events-none absolute top-0 right-6 z-10"
          style={{
            width: 18,
            height: 44,
            background: `linear-gradient(180deg, ${tabColor} 70%, ${tabColor}88 100%)`,
            clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)",
            boxShadow: `0 2px 8px ${tabColor}55`,
          }}
        />

        {/* Inner border */}
        <div
          className="pointer-events-none absolute inset-3 rounded-sm"
          style={{ border: `1px solid ${GOLD}18` }}
        />

        {/* Page content */}
        <div
          className="pointer-events-none relative z-10 flex h-full flex-col p-8 sm:p-10"
          style={{ color: "oklch(0.28 0.06 30)" }}
        >
          {/* Decorative top rule */}
          <div className="mb-5 flex items-center gap-2 opacity-25">
            <span className="h-px flex-1" style={{ background: GOLD }} />
            <span className="text-[10px]" style={{ color: GOLD, fontFamily: SERIF }}>♦</span>
            <span className="h-px flex-1" style={{ background: GOLD }} />
          </div>

          <div className="flex-1 font-hand overflow-hidden">
            {cp?.salutation && (
              <p className="mb-4 text-2xl sm:text-3xl">{cp.salutation}</p>
            )}
            {cp?.paragraphs.map((para, i) => (
              <p key={i} className="mt-3 text-lg leading-relaxed sm:text-xl">
                {para}
              </p>
            ))}
            {cp?.signature && (
              <p
                className="mt-8 text-right text-2xl italic"
                style={{ fontFamily: SERIF }}
              >
                {cp.signature}
              </p>
            )}
          </div>

          {/* Bottom: ornament + page number */}
          <div className="flex items-center gap-2 opacity-30 mt-4">
            <span className="h-px flex-1" style={{ background: GOLD }} />
            <p className="text-xs italic" style={{ fontFamily: SERIF, color: GOLD }}>
              — {ROMAN[pageIndex - 1] ?? pageIndex} —
            </p>
            <span className="h-px flex-1" style={{ background: GOLD }} />
          </div>
        </div>
      </div>
    );
  };

  const renderPageByIndex = (pageIndex: number, clickable = false) =>
    pageIndex === 0 ? renderCover(clickable) : renderContentPage(pageIndex);

  // ── Dialog ─────────────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(18,8,2,0.88), rgba(0,0,0,0.96))",
            fontFamily: SERIF,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            aria-label="Fechar"
            className="absolute right-5 top-5 z-10 rounded-full px-3 py-1 text-sm transition-opacity hover:opacity-80"
            style={{ color: GOLD_SOFT, border: `1px solid ${GOLD}55` }}
          >
            ✕
          </button>

          {/* Book + page tabs wrapper */}
          <div
            style={{ width: "min(420px, 90vw)", perspective: "2200px", position: "relative" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Page bookmark tabs on the right side */}
            {displayPage > 0 && !isAnimating && (
              <div
                style={{
                  position: "absolute",
                  right: -6,
                  top: 24,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  zIndex: 20,
                  transform: "translateX(100%)",
                }}
              >
                {CONTENT_PAGES.map((_, i) => {
                  const pg = i + 1;
                  const isActive = displayPage === pg;
                  const color = TAB_COLORS[i % TAB_COLORS.length];
                  return (
                    <button
                      key={i}
                      onClick={() => goToPage(pg)}
                      title={`Página ${ROMAN[i]}`}
                      style={{
                        width: isActive ? 22 : 16,
                        height: 32,
                        background: isActive ? color : `${color}77`,
                        borderRadius: "0 5px 5px 0",
                        border: "none",
                        cursor: isActive ? "default" : "pointer",
                        transition: "all 0.25s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: isActive ? `2px 2px 8px ${color}66` : "none",
                      }}
                    >
                      <span
                        style={{
                          color: "rgba(255,255,255,0.85)",
                          fontSize: 9,
                          fontFamily: SERIF,
                          fontStyle: "italic",
                          writingMode: "vertical-rl",
                          userSelect: "none",
                        }}
                      >
                        {ROMAN[i]}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Entry animation wrapper */}
            <motion.div
              initial={{ y: 24, scale: 0.92, opacity: 0 }}
              animate={{ y: 0,  scale: 1,    opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Page stack */}
              <div style={{ position: "relative", transformStyle: "preserve-3d" }}>
                {/* Stable background page */}
                {renderPageByIndex(displayPage, displayPage === 0 && !isAnimating)}

                {/* Shadow cast onto the page below by the turning leaf */}
                {isAnimating && (
                  <motion.div
                    style={{
                      position: "absolute",
                      inset: 0,
                      pointerEvents: "none",
                      borderRadius: "0.375rem",
                      background:
                        "linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.18) 28%, transparent 65%)",
                      opacity: underShadowOpacity,
                      zIndex: 1,
                    }}
                  />
                )}

                {/* Turning leaf overlay */}
                {leafPage !== null && (
                  <motion.div
                    style={{
                      position: "absolute",
                      inset: 0,
                      zIndex: 2,
                      transformOrigin: "0% 50%",
                      rotateY: leafRotY,
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {renderPageByIndex(leafPage)}

                    {/* Peel-edge shadow */}
                    <motion.div
                      style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        borderRadius: "0.375rem",
                        background:
                          "linear-gradient(to left, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 28%, transparent 50%)",
                        opacity: leafShadowOpacity,
                      }}
                    />

                    {/* Spine highlight */}
                    <motion.div
                      style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        borderRadius: "0.375rem",
                        background:
                          "linear-gradient(to right, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 8%, transparent 18%)",
                        opacity: leafHighlightOpacity,
                      }}
                    />
                  </motion.div>
                )}

                {/* Navigation zones */}
                {!isAnimating && displayPage > 0 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); goPrev(); }}
                      className="absolute inset-y-0 left-0 z-10 flex w-1/2 cursor-pointer items-center justify-start pl-4 opacity-0 transition-opacity duration-300 hover:opacity-100"
                      aria-label="Página anterior"
                    >
                      <span
                        className="select-none text-3xl leading-none"
                        style={{
                          color: "oklch(0.3 0.06 30)",
                          textShadow: "0 1px 4px rgba(0,0,0,0.25)",
                          fontFamily: SERIF,
                        }}
                      >
                        ‹
                      </span>
                    </button>

                    {!isLastPage && (
                      <button
                        onClick={(e) => { e.stopPropagation(); goNext(); }}
                        className="absolute inset-y-0 right-0 z-10 flex w-1/2 cursor-pointer items-center justify-end pr-4 opacity-0 transition-opacity duration-300 hover:opacity-100"
                        aria-label="Próxima página"
                      >
                        <span
                          className="select-none text-3xl leading-none"
                          style={{
                            color: "oklch(0.3 0.06 30)",
                            textShadow: "0 1px 4px rgba(0,0,0,0.25)",
                            fontFamily: SERIF,
                          }}
                        >
                          ›
                        </span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
