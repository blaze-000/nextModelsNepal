"use client";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

type UseLenisOptions = {
    enabled?: boolean;
};

export function useLenis({ enabled = true }: UseLenisOptions = {}) {
    useEffect(() => {
        if (!enabled) return; 

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, [enabled]);
}
