import type { Application } from 'pixi.js';
import type { ScrollController } from './ScrollController';

export class InputManager {
    private scrollController: ScrollController;
    private lastTouchY: number = 0;
    public enabled: boolean = true;

    constructor(scrollController: ScrollController) {
        this.scrollController = scrollController;

        window.addEventListener('wheel', (e) => {
            if (!this.enabled) return;
            this.scrollController.scrollBy(e.deltaY);
        }, { passive: true });

        window.addEventListener('touchstart', (e) => {
            if (!this.enabled || !e.touches[0]) return;
            this.lastTouchY = e.touches[0].clientY;
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (!this.enabled || !e.touches[0]) return;
            const touchY = e.touches[0].clientY;
            const deltaY = this.lastTouchY - touchY;
            this.lastTouchY = touchY;

            this.scrollController.scrollBy(deltaY * 2);
        }, { passive: true });
    }

    public setupStageTap(app: Application, callback: () => void): void {
        app.stage.eventMode = 'static';
        app.stage.hitArea = app.screen;
        app.stage.on('pointertap', callback);
    }
}
