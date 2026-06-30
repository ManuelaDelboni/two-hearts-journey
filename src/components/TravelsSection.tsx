import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform, animate } from "framer-motion";
import travels from "@/content/travels.json";
import { SectionTitle } from "./SectionTitle";

type City = (typeof travels.cities)[number];

const TILE_URL =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> &copy; <a href="https://carto.com/" target="_blank">CARTO</a>';

const HOME_COLOR = "#c8843a";
const HOME_RING = "#e5b472";
const VISIT_COLOR = "#7aaec8";
const VISIT_RING = "#a4cce0";
const LINE_COLOR = "#c8a040";

function markerHtml(isHome: boolean) {
  const wrap = isHome ? 30 : 22;
  const dot = isHome ? 14 : 10;
  const color = isHome ? HOME_COLOR : VISIT_COLOR;
  const ring = isHome ? HOME_RING : VISIT_RING;
  return `
    <div style="position:relative;width:${wrap}px;height:${wrap}px;display:flex;align-items:center;justify-content:center;">
      ${isHome ? `<div class="map-pulse-ring" style="position:absolute;inset:0;border-radius:50%;border:1.5px solid ${color};"></div>` : ""}
      <div style="width:${dot}px;height:${dot}px;background:${color};border:2.5px solid ${ring};border-radius:50%;box-shadow:0 0 10px ${color}99;flex-shrink:0;"></div>
    </div>`;
}

export function TravelsSection() {
  const [selected, setSelected] = useState<City | null>(null);
  const mapElRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  // Keep a stable ref to avoid stale closures in marker click handlers
  const setSelectedRef = useRef(setSelected);
  setSelectedRef.current = setSelected;

  useEffect(() => {
    if (!mapElRef.current) return;
    let mounted = true;

    (async () => {
      const L = (await import("leaflet")).default;
      if (!mounted || !mapElRef.current) return;

      const map = L.map(mapElRef.current, {
        center: [25, -10],
        zoom: 3,
        zoomControl: false,
        minZoom: 2,
        maxZoom: 18,
      });
      mapRef.current = map;

      L.tileLayer(TILE_URL, { attribution: TILE_ATTR, maxZoom: 19 }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Dashed line connecting the two home cities
      const homes = travels.cities.filter((c) => c.type === "home");
      if (homes.length >= 2) {
        L.polyline(
          homes.map((h) => [h.coords[1], h.coords[0]] as [number, number]),
          { color: LINE_COLOR, weight: 1.5, dashArray: "6 9", opacity: 0.55 }
        ).addTo(map);
      }

      // City markers
      travels.cities.forEach((city) => {
        const isHome = city.type === "home";
        const [lng, lat] = city.coords;
        const size = isHome ? 30 : 22;
        const icon = L.divIcon({
          className: "",
          html: markerHtml(isHome),
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });
        const marker = L.marker([lat, lng], { icon });
        marker.on("click", () => setSelectedRef.current(city));
        marker.addTo(map);
      });
    })();

    return () => {
      mounted = false;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);


  const homes = travels.cities.filter((c) => c.type === "home");
  const visits = travels.cities.filter((c) => c.type === "visit");

  return (
    <section id="travels" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionTitle
          eyebrow="Chapter I"
          title={travels.intro.title}
          subtitle={travels.intro.subtitle}
        />

        {/* Map */}
        <div
          className="relative mt-14 overflow-hidden rounded-3xl border border-[var(--gold)]/15 shadow-warm"
          style={{ height: "clamp(300px, 48vw, 560px)", isolation: "isolate" }}
        >
          <div ref={mapElRef} className="h-full w-full" />

          {/* Legend */}
          <div className="absolute left-4 top-4 z-[1000] flex flex-col gap-2 rounded-2xl border border-white/10 bg-black/60 px-3 py-3 text-xs backdrop-blur-md text-white/75">
            <div className="flex items-center gap-2">
              <span
                className="block h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: HOME_COLOR, boxShadow: `0 0 6px ${HOME_COLOR}aa` }}
              />
              <span>Onde vivemos</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="block h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: VISIT_COLOR }}
              />
              <span>Onde estivemos</span>
            </div>
            <div
              className="flex items-center gap-2 pt-0.5 mt-0.5 border-t"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}
            >
              <span className="text-white/35 text-[10px]">
                {homes.length} lares · {visits.length} destinos
              </span>
            </div>
          </div>
        </div>

        {/* City grid */}
        <div className="mt-10 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-6">
          {travels.cities.map((c) => {
            const isActive = selected?.id === c.id;
            const isHome = c.type === "home";
            return (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className={`group relative rounded-xl border px-3 py-2.5 text-left transition-all duration-200 ${
                  isActive
                    ? "border-[var(--gold)]/50 bg-card/80"
                    : "border-[var(--gold)]/10 bg-card/40 hover:border-[var(--gold)]/35 hover:bg-card/65"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span
                    className="block h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: isHome ? HOME_COLOR : VISIT_COLOR }}
                  />
                  <p
                    className={`text-sm font-medium truncate leading-snug ${
                      isHome ? "text-gold" : "text-foreground/90"
                    }`}
                  >
                    {c.name}
                  </p>
                </div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground truncate pl-3">
                  {c.country}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <PassportModal city={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

// ── Photo Gallery ────────────────────────────────────────────────────────────
const FLIP_EASE = [0.22, 0.0, 0.18, 1.0] as const;
const FLIP_DURATION = 0.9;

function PhotoGallery({ photos }: { photos: string[] }) {
  const [current, setCurrent] = useState(0);
  const [leaf, setLeaf]       = useState<number | null>(null);

  const rotY        = useMotionValue(0);
  const underOpacity = useTransform(rotY, [-180, -90, -55, -25, 0], [0, 0.04, 0.18, 0.10, 0]);
  const peelOpacity  = useTransform(rotY, [-180, -90, -45, -10, 0], [0, 0.55, 0.32, 0.07, 0]);
  const glowOpacity  = useTransform(rotY, [-180, -90, -30, 0],       [0, 0.14, 0.05, 0]);

  const isFlipping = leaf !== null;

  const flipTo = (target: number, dir: "next" | "prev") => {
    if (isFlipping || target === current) return;
    if (dir === "next") {
      const dep = current;
      setCurrent(target);
      setLeaf(dep);
      rotY.set(0);
      animate(rotY, -180, { duration: FLIP_DURATION, ease: FLIP_EASE, onComplete: () => setLeaf(null) });
    } else {
      setLeaf(target);
      rotY.set(-180);
      animate(rotY, 0, { duration: FLIP_DURATION, ease: FLIP_EASE, onComplete: () => { setCurrent(target); setLeaf(null); } });
    }
  };

  const renderFrame = (idx: number) => (
    <div style={{ aspectRatio: "4/3", position: "relative", overflow: "hidden", background: "#0a0a0a", borderRadius: "0.75rem 0.75rem 0 0" }}>
      <img
        src={photos[idx]}
        alt=""
        draggable={false}
        loading="lazy"
        decoding="async"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", userSelect: "none" }}
      />
      {/* thin inner border */}
      <div style={{ position: "absolute", inset: 8, border: "1px solid rgba(255,255,255,0.10)", borderRadius: "0.375rem", pointerEvents: "none" }} />
    </div>
  );

  // Preload adjacent photos so flips feel instant
  useEffect(() => {
    [photos[current - 1], photos[current + 1]].forEach((src) => {
      if (src) new window.Image().src = src;
    });
  }, [current, photos]);

  return (
    <div style={{ position: "relative", perspective: "1800px" }}>
      <div style={{ position: "relative", transformStyle: "preserve-3d" }}>
        {renderFrame(current)}

        {/* under-shadow while flipping */}
        {isFlipping && (
          <motion.div style={{ position: "absolute", inset: 0, borderRadius: "0.75rem 0.75rem 0 0", background: "linear-gradient(to right, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 28%, transparent 60%)", opacity: underOpacity, pointerEvents: "none", zIndex: 1 }} />
        )}

        {/* turning leaf */}
        {leaf !== null && (
          <motion.div style={{ position: "absolute", inset: 0, zIndex: 2, transformOrigin: "0% 50%", rotateY: rotY, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
            {renderFrame(leaf)}
            <motion.div style={{ position: "absolute", inset: 0, borderRadius: "0.75rem 0.75rem 0 0", background: "linear-gradient(to left, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.08) 28%, transparent 45%)", opacity: peelOpacity, pointerEvents: "none" }} />
            <motion.div style={{ position: "absolute", inset: 0, borderRadius: "0.75rem 0.75rem 0 0", background: "linear-gradient(to right, rgba(255,255,255,0.2) 0%, transparent 14%)", opacity: glowOpacity, pointerEvents: "none" }} />
          </motion.div>
        )}

        {/* navigation arrows */}
        {!isFlipping && photos.length > 1 && (
          <>
            {current > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); flipTo(current - 1, "prev"); }}
                className="absolute inset-y-0 left-0 z-10 flex w-2/5 items-center justify-start pl-3 opacity-0 hover:opacity-100 transition-opacity duration-300"
                aria-label="Foto anterior"
              >
                <span style={{ color: "white", fontSize: 30, textShadow: "0 1px 10px rgba(0,0,0,0.9)" }}>‹</span>
              </button>
            )}
            {current < photos.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); flipTo(current + 1, "next"); }}
                className="absolute inset-y-0 right-0 z-10 flex w-2/5 items-center justify-end pr-3 opacity-0 hover:opacity-100 transition-opacity duration-300"
                aria-label="Próxima foto"
              >
                <span style={{ color: "white", fontSize: 30, textShadow: "0 1px 10px rgba(0,0,0,0.9)" }}>›</span>
              </button>
            )}
          </>
        )}

        {/* dot indicators */}
        {photos.length > 1 && (
          <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5, zIndex: 10 }}>
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); flipTo(i, i > current ? "next" : "prev"); }}
                style={{ width: i === current ? 18 : 6, height: 6, borderRadius: 3, background: i === current ? "white" : "rgba(255,255,255,0.35)", border: "none", padding: 0, cursor: "pointer", transition: "all 0.3s" }}
                aria-label={`Foto ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Passport modal ────────────────────────────────────────────────────────────
function PassportModal({ city, onClose }: { city: City; onClose: () => void }) {
  const isHome   = city.type === "home";
  const dotColor = isHome ? HOME_COLOR : VISIT_COLOR;
  const dotRing  = isHome ? HOME_RING  : VISIT_RING;
  const hasPhotos = city.photos.length > 0;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center bg-black/75 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm overflow-hidden rounded-2xl"
        style={{
          background: "linear-gradient(160deg, oklch(0.20 0.05 240), oklch(0.15 0.03 240))",
          border: "1px solid oklch(0.35 0.08 240 / 0.5)",
          boxShadow: "0 30px 80px -20px rgba(0,0,0,0.8)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Photo gallery — full width, no padding, rounded top */}
        {hasPhotos && <PhotoGallery photos={city.photos} />}

        {/* Header bar */}
        <div
          className="flex items-center justify-between px-5 py-3 border-b"
          style={{ borderColor: `${dotColor}25`, marginTop: hasPhotos ? 0 : undefined }}
        >
          <div className="flex items-center gap-2.5">
            <span className="block h-2 w-2 rounded-full" style={{ background: dotColor, boxShadow: `0 0 6px ${dotColor}99` }} />
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
              {isHome ? "Nossa Casa" : "Destino Visitado"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-white/30 transition-colors hover:text-white/70"
            aria-label="Fechar"
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="2" y1="2" x2="12" y2="12" />
              <line x1="12" y1="2" x2="2" y2="12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3
                className="text-3xl font-bold leading-tight"
                style={{ background: `linear-gradient(135deg, ${dotRing}, ${dotColor} 60%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}
              >
                {city.name}
              </h3>
              <p className="mt-0.5 text-[11px] uppercase tracking-widest text-white/40">{city.country}</p>
            </div>

            {/* Stamp */}
            <div
              className="shrink-0 grid place-items-center rounded-full border-2 text-center leading-tight p-2 mt-1"
              style={{ width: 58, height: 58, borderColor: dotColor, color: dotRing, transform: "rotate(-10deg)", opacity: 0.85 }}
            >
              <span className="text-[8px] font-bold uppercase">{isHome ? "CASA" : "VISIT"}</span>
              <span className="block text-[7px] font-normal mt-0.5" style={{ color: `${dotColor}99` }}>{city.name.split(" ")[0]}</span>
            </div>
          </div>

          <div className="mt-4 rounded-xl px-4 py-3" style={{ background: `${dotColor}10`, border: `1px solid ${dotColor}20` }}>
            <p className="text-sm italic text-white/80 leading-relaxed">"{city.note}"</p>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[10px] text-white/25">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>
              {Math.abs(city.coords[1]).toFixed(3)}°{city.coords[1] >= 0 ? "N" : "S"},{" "}
              {Math.abs(city.coords[0]).toFixed(3)}°{city.coords[0] >= 0 ? "E" : "W"}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
