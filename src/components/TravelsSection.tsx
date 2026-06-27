import { useEffect, useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
  ZoomableGroup,
} from "react-simple-maps";
import { AnimatePresence, motion } from "framer-motion";
import travels from "@/content/travels.json";
import { SectionTitle } from "./SectionTitle";


const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type City = (typeof travels.cities)[number];

export function TravelsSection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [position, setPosition] = useState<{ coordinates: [number, number]; zoom: number }>({
    coordinates: [-20, 20],
    zoom: 1,
  });
  const homes = useMemo(() => travels.cities.filter((c) => c.type === "home"), []);
  const fromHome = homes.find((c) => c.id === "ribeirao");
  const toHome = homes.find((c) => c.id === "paris");

  const handleZoomIn = () => setPosition((p) => ({ ...p, zoom: Math.min(p.zoom * 1.6, 40) }));
  const handleZoomOut = () => setPosition((p) => ({ ...p, zoom: Math.max(p.zoom / 1.6, 0.8) }));
  const handleReset = () => setPosition({ coordinates: [-20, 20], zoom: 1 });
  const focusCity = (c: City) =>
    setPosition({ coordinates: c.coords as [number, number], zoom: 8 });

  return (
    <section id="travels" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionTitle eyebrow="Chapter I" title={travels.intro.title} subtitle={travels.intro.subtitle} />

        <div className="relative mt-14 overflow-hidden rounded-3xl border border-[var(--gold)]/15 bg-card/40 shadow-warm">
          <div className="aspect-[16/9] w-full">
            <ComposableMap
              projectionConfig={{ scale: 160 }}
              style={{ width: "100%", height: "100%", background: "transparent" }}
            >
              <ZoomableGroup
                center={position.coordinates}
                zoom={position.zoom}
                minZoom={0.8}
                maxZoom={40}
                onMoveEnd={(pos) => setPosition(pos)}
              >
                <Geographies geography={GEO_URL}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        style={{
                          default: {
                            fill: "oklch(0.24 0.025 45)",
                            stroke: "oklch(0.32 0.03 50)",
                            strokeWidth: 0.4,
                            outline: "none",
                          },
                          hover: { fill: "oklch(0.28 0.04 45)", outline: "none" },
                          pressed: { fill: "oklch(0.3 0.05 45)", outline: "none" },
                        }}
                      />
                    ))
                  }
                </Geographies>

                {fromHome && toHome && (
                  <Line
                    from={fromHome.coords as [number, number]}
                    to={toHome.coords as [number, number]}
                    stroke="oklch(0.82 0.14 80)"
                    strokeWidth={1.2}
                    strokeLinecap="round"
                    strokeDasharray="4 4"
                  />
                )}

                {travels.cities.map((c) => {
                  const isHome = c.type === "home";
                  const scale = 1 / Math.sqrt(position.zoom);
                  return (
                    <Marker
                      key={c.id}
                      coordinates={c.coords as [number, number]}
                      onClick={() => setSelectedIndex(travels.cities.findIndex((x) => x.id === c.id))}
                      style={{ default: { cursor: "pointer" }, hover: { cursor: "pointer" }, pressed: { cursor: "pointer" } }}
                    >
                      <g style={{ transform: `scale(${scale})`, transformBox: "fill-box", transformOrigin: "center" }}>
                        <circle
                          r={isHome ? 10 : 7}
                          fill="transparent"
                          style={{ pointerEvents: "all" }}
                        />
                        <circle
                          r={isHome ? 7 : 4}
                          fill={isHome ? "oklch(0.65 0.22 25)" : "oklch(0.7 0.15 240)"}
                          opacity={0.25}
                        />
                        <circle
                          r={isHome ? 4 : 2.5}
                          fill={isHome ? "oklch(0.65 0.22 25)" : "oklch(0.7 0.15 240)"}
                          stroke="oklch(0.96 0.012 80)"
                          strokeWidth={0.6}
                        />
                      </g>
                    </Marker>
                  );
                })}
              </ZoomableGroup>
            </ComposableMap>
          </div>

          <div className="absolute left-4 top-4 flex flex-col gap-2 rounded-xl border border-[var(--gold)]/15 bg-background/70 p-3 text-xs backdrop-blur-md sm:left-6 sm:top-6">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ background: "oklch(0.65 0.22 25)" }} />
              <span>Onde vivemos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ background: "oklch(0.7 0.15 240)" }} />
              <span>Onde estivemos</span>
            </div>
            <div className="text-[10px] text-muted-foreground">Use o scroll para dar zoom · clique nos pinos</div>
          </div>

          <div className="absolute right-4 top-4 flex flex-col gap-1 sm:right-6 sm:top-6">
            <button
              onClick={handleZoomIn}
              className="grid h-9 w-9 place-items-center rounded-md border border-[var(--gold)]/20 bg-background/80 text-lg font-bold backdrop-blur-md transition hover:bg-background"
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              onClick={handleZoomOut}
              className="grid h-9 w-9 place-items-center rounded-md border border-[var(--gold)]/20 bg-background/80 text-lg font-bold backdrop-blur-md transition hover:bg-background"
              aria-label="Zoom out"
            >
              −
            </button>
            <button
              onClick={handleReset}
              className="grid h-9 w-9 place-items-center rounded-md border border-[var(--gold)]/20 bg-background/80 text-[10px] font-bold backdrop-blur-md transition hover:bg-background"
              aria-label="Reset"
            >
              ⟲
            </button>
          </div>
        </div>

        {/* City list */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {travels.cities.map((c, i) => (
            <button
              key={c.id}
              onDoubleClick={() => setSelectedIndex(i)}
              onClick={() => focusCity(c)}
              className="group rounded-xl border border-[var(--gold)]/10 bg-card/40 px-3 py-3 text-left transition-all hover:border-[var(--gold)]/40 hover:bg-card/70"
            >
              <p className={`text-sm font-medium ${c.type === "home" ? "text-gold" : "text-foreground/90"}`}>
                {c.name}
              </p>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{c.country}</p>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <PassportBook
            cities={travels.cities as City[]}
            index={selectedIndex}
            onChange={setSelectedIndex}
            onClose={() => setSelectedIndex(null)}
          />
        )}
      </AnimatePresence>

    </section>
  );
}

function PassportBook({
  cities,
  index,
  onChange,
  onClose,
}: {
  cities: City[];
  index: number;
  onChange: (i: number) => void;
  onClose: () => void;
}) {
  const [direction, setDirection] = useState<1 | -1>(1);
  const city = cities[index];

  const go = (d: 1 | -1) => {
    const next = index + d;
    if (next < 0 || next >= cities.length) return;
    setDirection(d);
    onChange(next);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); go(1); }
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); go(-1); }
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  let wheelLock = false;
  const onWheel = (e: React.WheelEvent) => {
    if (wheelLock) return;
    if (Math.abs(e.deltaY) < 30) return;
    wheelLock = true;
    go(e.deltaY > 0 ? 1 : -1);
    setTimeout(() => { wheelLock = false; }, 600);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      onWheel={onWheel}
    >
      <button
        onClick={onClose}
        className="absolute right-5 top-5 z-10 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/80 backdrop-blur hover:bg-black/60"
      >
        Fechar ✕
      </button>

      {/* Vertical nav buttons */}
      <div className="absolute right-5 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-3">
        <button
          onClick={(e) => { e.stopPropagation(); go(-1); }}
          disabled={index === 0}
          className="grid h-11 w-11 place-items-center rounded-full border border-[var(--gold)]/40 bg-black/50 text-gold backdrop-blur transition hover:bg-black/70 disabled:opacity-30"
          aria-label="Página anterior"
        >
          ▲
        </button>
        <span className="text-center font-mono text-[10px] text-white/60">
          {String(index + 1).padStart(2, "0")} / {String(cities.length).padStart(2, "0")}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); go(1); }}
          disabled={index === cities.length - 1}
          className="grid h-11 w-11 place-items-center rounded-full border border-[var(--gold)]/40 bg-black/50 text-gold backdrop-blur transition hover:bg-black/70 disabled:opacity-30"
          aria-label="Próxima página"
        >
          ▼
        </button>
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl"
        style={{ perspective: "2000px" }}
      >
        <div
          className="relative w-full overflow-hidden rounded-2xl border-2 shadow-warm"
          style={{
            aspectRatio: "3 / 4",
            maxHeight: "85vh",
            background: "linear-gradient(135deg, oklch(0.30 0.09 25), oklch(0.20 0.06 20))",
            borderColor: "oklch(0.40 0.12 25)",
          }}
        >
          {/* Header */}
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-[var(--gold)]/30 bg-[oklch(0.20_0.06_25)]/90 px-5 py-3 backdrop-blur">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold/70">Passport · Carimbo</p>
              <p className="font-display text-sm text-foreground/80">Nossa caderneta de viagem</p>
            </div>
            <p className="font-mono text-[10px] text-white/40">No. {String(index + 1).padStart(3, "0")}</p>
          </div>

          {/* Page flip */}
          <AnimatePresence mode="popLayout" custom={direction}>
            <motion.div
              key={city.id}
              custom={direction}
              initial={(d: 1 | -1) => ({ rotateX: d === 1 ? 90 : -90, opacity: 0, y: d === 1 ? 40 : -40 })}
              animate={{ rotateX: 0, opacity: 1, y: 0 }}
              exit={(d: 1 | -1) => ({ rotateX: d === 1 ? -90 : 90, opacity: 0, y: d === 1 ? -40 : 40 })}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "center center", backfaceVisibility: "hidden" }}
              className="absolute inset-0 flex flex-col px-6 pb-6 pt-20 sm:px-10"
            >
              {/* Photo */}
              <div className="relative flex-1 overflow-hidden rounded-lg border border-[var(--gold)]/20 bg-black/40">
                {city.photo ? (
                  <img
                    src={city.photo}
                    alt={city.name}
                    onError={(e) => { (e.currentTarget.style.display = "none"); }}
                    className="h-full w-full object-cover"
                  />
                ) : null}
                <div className="pointer-events-none absolute inset-0 grid place-items-center text-center text-xs uppercase tracking-[0.3em] text-white/30">
                  <span>Adicione uma foto em<br />public{city.photo}</span>
                </div>
                {/* Stamp */}
                <div
                  className="absolute right-4 top-4 grid h-20 w-20 place-items-center rounded-full border-2 text-center text-[10px] font-bold uppercase leading-tight backdrop-blur"
                  style={{
                    borderColor: city.type === "home" ? "oklch(0.75 0.2 25)" : "oklch(0.78 0.13 240)",
                    color: city.type === "home" ? "oklch(0.85 0.2 25)" : "oklch(0.85 0.13 240)",
                    background: "rgba(0,0,0,0.35)",
                    transform: "rotate(-12deg)",
                  }}
                >
                  {city.type === "home" ? "HOME" : "VISITED"}
                </div>
              </div>

              {/* Caption */}
              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <h3 className="font-display text-3xl text-gradient-gold sm:text-4xl">{city.name}</h3>
                  <p className="text-xs uppercase tracking-[0.2em] text-foreground/60">{city.country}</p>
                  <p className="mt-2 font-display text-base italic text-foreground/80">"{city.note}"</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-gold/60">Data</p>
                  <p className="font-mono text-sm text-foreground/90">{city.date ?? "—"}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Hint */}
          <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-white/40">
            ▲ ▼ para virar a página
          </div>
        </div>
      </div>
    </motion.div>
  );
}

  );
}
