
declare module "@studio-freight/lenis" {
    export interface LenisOptions {
        duration?: number;
        easing?: (t: number) => number;
        direction?: "vertical" | "horizontal";
        gestureDirection?: "vertical" | "horizontal";
        smooth?: boolean;
        smoothTouch?: boolean;
        touchMultiplier?: number;
    }

    export default class Lenis {
        constructor(options?: LenisOptions);
        raf(time: number): void;
        scrollTo(
            target: number | string | HTMLElement,
            options?: { offset?: number; duration?: number; easing?: (t: number) => number }
        ): void;
        destroy(): void;
    }
}
