"use client";

import { useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function PageAnimations() {
  const pathname = usePathname();

  // ── Recalcula ScrollTrigger em eventos que podem desatualizar posições ──
  useEffect(() => {
    let pendingRaf = 0;

    const scheduleRefresh = () => {
      cancelAnimationFrame(pendingRaf);
      pendingRaf = requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) scheduleRefresh();
    };
    const handleVisibility = () => {
      if (document.visibilityState === "visible") scheduleRefresh();
    };

    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("resize", scheduleRefresh);
    window.addEventListener("popstate", scheduleRefresh);
    document.addEventListener("visibilitychange", handleVisibility);
    // one-time: fontes podem mudar o layout após o primeiro render
    document.fonts?.ready?.then(scheduleRefresh);

    return () => {
      cancelAnimationFrame(pendingRaf);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("resize", scheduleRefresh);
      window.removeEventListener("popstate", scheduleRefresh);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  useGSAP(
    () => {
      if (typeof window === "undefined") return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // ── Hero entrance (no scroll trigger) ───────────────────────────
      const heroLabel = document.querySelector<HTMLElement>(".gsap-hero-label");
      const heroTitle = document.querySelector<HTMLElement>(".gsap-hero-title");
      const heroSub = document.querySelector<HTMLElement>(".gsap-hero-sub");
      const heroCta = document.querySelector<HTMLElement>(".gsap-hero-cta");

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
        const delay = Number(el.dataset.delay ?? 0);
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
      const heroDecos = gsap.utils.toArray<HTMLElement>(".gsap-hero-deco");

      if (heroSection && heroDecos.length) {
        gsap.to(heroDecos, {
          y: -80,
          ease: "none",
          scrollTrigger: {
            trigger: heroSection,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
            invalidateOnRefresh: true,
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

      // ── Categoria cards: scrub com x, y, rotation cascata ─────────────
      gsap.utils.toArray<HTMLElement>(".gsap-categoria-cards").forEach((container) => {
        const kids = Array.from(container.children) as HTMLElement[];
        if (!kids.length) return;

        gsap.set(kids, {
          x: -40,
          y: -40,
          rotation: 45,
          opacity: 0,
        });

        gsap.to(kids, {
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 1,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            end: "bottom 80%",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      });

      // ── Stagger genérico: slide-up + fade one-shot ────────────────────
      gsap.utils.toArray<HTMLElement>(".gsap-stagger").forEach((container) => {
        const kids = Array.from(container.children) as HTMLElement[];
        if (!kids.length) return;

        gsap.from(kids, {
          y: 40,
          opacity: 0,
          duration: 0.65,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            end: "bottom 40%",
            toggleActions: "play none none none",
            scrub: 1,
          },
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

      // ── Recalcula posições depois de criar todas as animações ─────────
      ScrollTrigger.refresh();

    },
    { dependencies: [pathname], revertOnUpdate: true }
  );

  return null;
}
