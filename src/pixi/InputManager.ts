import type { Application } from 'pixi.js';
import type { ScrollController } from './ScrollController';

export class InputManager {
    private scrollController: ScrollController;
    private lastTouchY: number = 0;
    public enabled: boolean = true;

    private _targetMouseNX: number = 0;
    private _targetMouseNY: number = 0;
    private _smoothMouseNX: number = 0;
    private _smoothMouseNY: number = 0;

    private readonly onWheel: (e: WheelEvent) => void;
    private readonly onTouchStart: (e: TouchEvent) => void;
    private readonly onTouchMove: (e: TouchEvent) => void;
    private readonly onMouseMove: (e: MouseEvent) => void;
    private readonly onKeyDown: (e: KeyboardEvent) => void;
    private stageTapApp: Application | null = null;
    private stageTapCallback: (() => void) | null = null;

    constructor(scrollController: ScrollController) {
        this.scrollController = scrollController;

        this.onWheel = (e) => {
            if (!this.enabled) return;
            this.scrollController.scrollBy(e.deltaY);
        };

        this.onTouchStart = (e) => {
            if (!this.enabled || !e.touches[0]) return;
            this.lastTouchY = e.touches[0].clientY;
        };

        this.onTouchMove = (e) => {
            if (!this.enabled || !e.touches[0]) return;
            const touchY = e.touches[0].clientY;
            const deltaY = this.lastTouchY - touchY;
            this.lastTouchY = touchY;
            this.scrollController.scrollBy(deltaY * 2);
        };

        this.onMouseMove = (e) => {
            const w = window.innerWidth || 1;
            const h = window.innerHeight || 1;
            this._targetMouseNX = (e.clientX / w - 0.5) * 2;
            this._targetMouseNY = (e.clientY / h - 0.5) * 2;
        };

        this.onKeyDown = (e) => {
            if (!this.enabled) return;
            const target = e.target as HTMLElement | null;
            if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;

            switch (e.key) {
                case 'ArrowDown':
                case 'PageDown':
                case ' ':
                case 'j':
                case 'J':
                    this.scrollController.scrollToNext();
                    e.preventDefault();
                    break;
                case 'ArrowUp':
                case 'PageUp':
                case 'k':
                case 'K':
                    this.scrollController.scrollToPrev();
                    e.preventDefault();
                    break;
                case 'Home':
                    this.scrollController.scrollToFirst();
                    e.preventDefault();
                    break;
                case 'End':
                    this.scrollController.scrollToLast();
                    e.preventDefault();
                    break;
            }
        };

        window.addEventListener('wheel', this.onWheel, { passive: true });
        window.addEventListener('touchstart', this.onTouchStart, { passive: true });
        window.addEventListener('touchmove', this.onTouchMove, { passive: true });
        window.addEventListener('mousemove', this.onMouseMove, { passive: true });
        window.addEventListener('keydown', this.onKeyDown);
    }

    public updateSmoothing(deltaTime: number): void {
        const lerp = Math.min(1, 0.06 * deltaTime);
        this._smoothMouseNX += (this._targetMouseNX - this._smoothMouseNX) * lerp;
        this._smoothMouseNY += (this._targetMouseNY - this._smoothMouseNY) * lerp;
    }

    public get mouseNX(): number { return this._smoothMouseNX; }
    public get mouseNY(): number { return this._smoothMouseNY; }

    public setupStageTap(app: Application, callback: () => void): void {
        app.stage.eventMode = 'static';
        app.stage.hitArea = app.screen;
        app.stage.on('pointertap', callback);
        this.stageTapApp = app;
        this.stageTapCallback = callback;
    }

    public destroy(): void {
        window.removeEventListener('wheel', this.onWheel);
        window.removeEventListener('touchstart', this.onTouchStart);
        window.removeEventListener('touchmove', this.onTouchMove);
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('keydown', this.onKeyDown);

        if (this.stageTapApp && this.stageTapCallback) {
            this.stageTapApp.stage.off('pointertap', this.stageTapCallback);
            this.stageTapApp = null;
            this.stageTapCallback = null;
        }
    }
}
