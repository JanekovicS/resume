import type { Application } from 'pixi.js';
import type { ScrollController } from './ScrollController';

export class InputManager {
    private scrollController: ScrollController;
    private lastTouchY: number = 0;
    public enabled: boolean = true;

    private readonly onWheel: (e: WheelEvent) => void;
    private readonly onTouchStart: (e: TouchEvent) => void;
    private readonly onTouchMove: (e: TouchEvent) => void;
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

        window.addEventListener('wheel', this.onWheel, { passive: true });
        window.addEventListener('touchstart', this.onTouchStart, { passive: true });
        window.addEventListener('touchmove', this.onTouchMove, { passive: true });
    }

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

        if (this.stageTapApp && this.stageTapCallback) {
            this.stageTapApp.stage.off('pointertap', this.stageTapCallback);
            this.stageTapApp = null;
            this.stageTapCallback = null;
        }
    }
}
