import { useMemo, useState } from "react";
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
  const [selected, setSelected] = useState<City | null>(null);
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
                      onClick={() => setSelected(c)}
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
          {travels.cities.map((c) => (
            <button
              key={c.id}
              onDoubleClick={() => setSelected(c)}
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
        {selected && <PassportModal city={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}

function PassportModal({ city, onClose }: { city: City; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, rotate: -2 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-xl border-2 border-[oklch(0.35_0.1_25)] shadow-warm"
        style={{
          background: "linear-gradient(135deg, oklch(0.28 0.08 25), oklch(0.22 0.06 20))",
        }}
      >
        <div className="border-b border-[var(--gold)]/30 bg-[oklch(0.22_0.06_25)] px-5 py-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold/70">Passport · Carimbo</p>
          <p className="font-display text-sm text-foreground/80">Nossa caderneta de viagem</p>
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-3xl text-gradient-gold">{city.name}</h3>
              <p className="text-sm uppercase tracking-wider text-foreground/60">{city.country}</p>
            </div>
            <div
              className="grid h-20 w-20 shrink-0 place-items-center rounded-full border-2 text-center text-[10px] font-bold uppercase leading-tight"
              style={{
                borderColor: city.type === "home" ? "oklch(0.65 0.22 25)" : "oklch(0.7 0.15 240)",
                color: city.type === "home" ? "oklch(0.75 0.2 25)" : "oklch(0.78 0.13 240)",
                transform: "rotate(-12deg)",
              }}
            >
              {city.type === "home" ? "HOME" : "VISITED"}
              <br />
              <span className="text-[8px] font-normal">{city.name}</span>
            </div>
          </div>
          <p className="mt-5 font-display text-lg italic text-foreground/85">"{city.note}"</p>
          {city.photo && (
            <img src={city.photo} alt={city.name} className="mt-4 w-full rounded-lg object-cover" />
          )}
          <button
            onClick={onClose}
            className="mt-6 w-full rounded-md bg-gold py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Fechar passaporte
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
