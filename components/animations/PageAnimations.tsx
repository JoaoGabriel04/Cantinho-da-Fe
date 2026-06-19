"use client";

import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function PageAnimations() {
  const pathname = usePathname();

  useGSAP(
    () => {
      if (typeof window === "undefined") return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      ScrollTrigger.refresh();

      // ── Hero entrance (no scroll trigger) ───────────────────────────
      const heroLabel = document.querySelector<HTMLElement>(".gsap-hero-label");
      const heroTitle = document.querySelector<HTMLElement>(".gsap-hero-title");
      const heroSub   = document.querySelector<HTMLElement>(".gsap-hero-sub");
      const heroCta   = document.querySelector<HTMLElement>(".gsap-hero-cta");

      if (heroLabel || heroTitle) {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        if (heroLabel) {
          tl.from(heroLabel, { y: -20, opacity: 0, duration: 0.6 });
        }
        if (heroTitle) {
          const lines = heroTitle.querySelectorAll<HTMLElement>(".gsap-title-line");
          if (lines.length) {
            tl.from(lines, { y: 70, opacity: 0, duration: 0.9, stagger: 0.18 }, "-=0.3");
          } else {
            tl.from(heroTitle, { y: 50, opacity: 0, duration: 0.9 }, "-=0.3");
          }
        }
        if (heroSub) tl.from(heroSub, { y: 24, opacity: 0, duration: 0.7 }, "-=0.4");
        if (heroCta) tl.from(heroCta, { y: 20, opacity: 0, duration: 0.6 }, "-=0.35");
      }

      // ── Spin nos ornamentos ✦ do hero ───────────────────────────────
      gsap.utils.toArray<HTMLElement>(".hero-sparkle").forEach((el) => {
        const duration = Number(el.dataset.duration ?? 10);
        const delay    = Number(el.dataset.delay ?? 0);
        gsap.to(el, {
          rotation: 360,
          duration,
          delay,
          ease: "power1.inOut",
          repeat: -1,
          transformOrigin: "50% 50%",
        });
      });

      // ── Parallax nos ornamentos ✦ do hero ────────────────────────────
      const heroSection = document.querySelector<HTMLElement>(".gsap-hero");
      const heroDecos   = gsap.utils.toArray<HTMLElement>(".gsap-hero-deco");

      if (heroSection && heroDecos.length) {
        gsap.to(heroDecos, {
          y: -80,
          ease: "none",
          scrollTrigger: {
            trigger: heroSection,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }

      // ── Fade + slide up ──────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>(".gsap-fade-up").forEach((el) => {
        gsap.from(el, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      // ── Stagger (filhos do container) ────────────────────────────────
      gsap.utils.toArray<HTMLElement>(".gsap-stagger").forEach((container) => {
        const kids = Array.from(container.children) as HTMLElement[];
        if (!kids.length) return;
        gsap.from(kids, {
          y: 45,
          opacity: 0,
          duration: 0.7,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: { trigger: container, start: "top 85%" },
        });
      });

      // ── Slide da esquerda ────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>(".gsap-slide-left").forEach((el) => {
        gsap.from(el, {
          x: -60,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%" },
        });
      });

      // ── Slide da direita ─────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>(".gsap-slide-right").forEach((el) => {
        gsap.from(el, {
          x: 60,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%" },
        });
      });

      // ── Scale + fade (blocos escuros, CTAs) ─────────────────────────
      gsap.utils.toArray<HTMLElement>(".gsap-scale-up").forEach((el) => {
        gsap.from(el, {
          scale: 0.94,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%" },
        });
      });
    },
    { dependencies: [pathname], revertOnUpdate: true }
  );

  return null;
}
