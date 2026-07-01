import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { Heart, Plane, Globe, Video, Clock, Coffee } from "lucide-react";
import stats from "@/content/statistics.json";
import { SectionTitle } from "./SectionTitle";

const iconMap = { heart: Heart, plane: Plane, globe: Globe, video: Video, clock: Clock, coffee: Coffee };

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.floor(v).toLocaleString("pt-BR"));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, { duration: 2.2, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, to, mv]);

  return (
    <span ref={ref} className="font-display text-5xl text-gradient-gold sm:text-6xl">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export function StatisticsSection() {
  return (
    <section id="statistics" className="relative py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionTitle eyebrow="Chapter II" title={stats.title} subtitle={stats.subtitle} />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.items.map((item, i) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap] ?? Heart;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="group relative overflow-hidden rounded-2xl border border-[var(--gold)]/15 bg-card/40 p-7 backdrop-blur-sm transition-all hover:border-[var(--gold)]/40 hover:shadow-glow"
              >
                <div className="absolute -right-6 -top-6 grid h-24 w-24 place-items-center rounded-full bg-[var(--gold)]/5 transition-transform group-hover:scale-110">
                  <Icon className="h-10 w-10 text-gold/40" />
                </div>
                <Counter to={item.value} suffix={item.suffix} />
                <p className="mt-3 text-sm uppercase tracking-[0.18em] text-foreground/70">{item.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
