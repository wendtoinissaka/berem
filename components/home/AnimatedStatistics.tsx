"use client";

import { useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  HardHat,
  Layers3,
} from "lucide-react";

type Statistic = {
  id: string;
  label: string;
  description?: string | null;
  value: string;
  suffix?: string | null;
};

type AnimatedStatisticsProps = {
  statistics: Statistic[];
};

const icons = [Building2, HardHat, Layers3, CheckCircle2, Activity];

function parseNumericValue(value: string) {
  // Accepte notamment : 1200, 1 200, 1 200,5 ou 1200.5
  const normalized = value.trim().replace(/\s/g, "").replace(",", ".");
  const match = normalized.match(/^-?\d+(?:\.\d+)?/);

  if (!match) return null;

  const number = Number(match[0]);

  return Number.isFinite(number) ? number : null;
}

function formatNumber(value: number, decimals: number) {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

function AnimatedCounter({
  value,
  suffix,
  shouldAnimate,
}: {
  value: string;
  suffix?: string | null;
  shouldAnimate: boolean;
}) {
  const target = parseNumericValue(value);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (target === null) {
      setDisplayValue(value);
      return;
    }

    const decimals = String(target).includes(".")
      ? String(target).split(".")[1].length
      : 0;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!shouldAnimate || reducedMotion) {
      setDisplayValue(formatNumber(target, decimals));
      return;
    }

    let animationFrame = 0;
    let startTime: number | null = null;
    const duration = 1700;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Courbe ease-out : rapide au départ, plus douce à l'arrivée.
      const easedProgress = 1 - Math.pow(1 - progress, 4);
      const currentValue = target * easedProgress;

      setDisplayValue(formatNumber(currentValue, decimals));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplayValue(formatNumber(target, decimals));
      }
    };

    setDisplayValue(formatNumber(0, decimals));
    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [target, value, shouldAnimate]);

  return (
    <span>
      {displayValue}
      {suffix && <span className="ml-1 text-[#D59344]">{suffix}</span>}
    </span>
  );
}

export default function AnimatedStatistics({
  statistics,
}: AnimatedStatisticsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      {statistics.map((statistic, index) => {
        const Icon = icons[index % icons.length];

        return (
          <article
            key={statistic.id}
            className={`group relative min-h-[220px] overflow-hidden border border-white/10 bg-white/[0.05] p-7 transition-all duration-700 hover:-translate-y-1 hover:border-[#D59344]/60 hover:bg-white/[0.09] sm:p-8 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: `${index * 120}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center border border-[#D59344]/30 bg-[#D59344]/10 text-[#D59344]">
                <Icon size={22} strokeWidth={1.7} />
              </div>

              <ArrowUpRight
                size={20}
                className="text-white/30 transition-colors duration-300 group-hover:text-[#D59344]"
              />
            </div>

            <div className="mt-8">
              <p className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                <AnimatedCounter
                  value={statistic.value}
                  suffix={statistic.suffix}
                  shouldAnimate={isVisible}
                />
              </p>

              <h3 className="mt-3 text-base font-bold text-white sm:text-lg">
                {statistic.label}
              </h3>

              {statistic.description && (
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {statistic.description}
                </p>
              )}
            </div>

            <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#D59344] transition-all duration-700 group-hover:w-full" />
          </article>
        );
      })}
    </div>
  );
}