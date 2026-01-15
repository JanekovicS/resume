import { Application, Graphics } from 'pixi.js';
import { STARFIELD } from './constants';

export class Starfield {
    private particles: Graphics[] = [];
    private app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    public create(): void {
        const { PARTICLE_COUNT, COLORS, MIN_SIZE, MAX_SIZE, MIN_ALPHA, MAX_ALPHA, MIN_BLINK_SPEED, MAX_BLINK_SPEED } = STARFIELD;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const p = new Graphics();
            const color = COLORS[Math.floor(Math.random() * COLORS.length)]!;
            const size = Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE;
            const alpha = Math.random() * (MAX_ALPHA - MIN_ALPHA) + MIN_ALPHA;

            p.circle(0, 0, size).fill({ color, alpha });

            p.x = Math.random() * this.app.screen.width;
            p.y = Math.random() * this.app.screen.height;

            (p as any).baseAlpha = alpha;
            (p as any).blinkSpeed = Math.random() * (MAX_BLINK_SPEED - MIN_BLINK_SPEED) + MIN_BLINK_SPEED;
            (p as any).blinkOffset = Math.random() * Math.PI * 2;

            this.app.stage.addChildAt(p, 0);
            this.particles.push(p);
        }
    }

    public update(time: number, scrollVelocity: number, lastWheelTime: number): void {
        const { WARP_THRESHOLD, WARP_MULTIPLIER } = STARFIELD;
        const warpIntensity = Math.abs(scrollVelocity) * 0.5;
        const screenCenterX = this.app.screen.width / 2;
        const screenCenterY = this.app.screen.height / 2;
        const isActivelyScrolling = Date.now() - lastWheelTime < 400;

        this.particles.forEach((p) => {
            const baseAlpha = (p as any).baseAlpha || 0.5;
            const blinkSpeed = (p as any).blinkSpeed || 2;
            const blinkOffset = (p as any).blinkOffset || 0;

            p.alpha = baseAlpha * (0.5 + Math.sin(time * blinkSpeed + blinkOffset) * 0.5);

            if (warpIntensity > WARP_THRESHOLD && isActivelyScrolling) {
                const dx = p.x - screenCenterX;
                const dy = p.y - screenCenterY;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                p.x += (dx / dist) * warpIntensity * WARP_MULTIPLIER;
                p.y += (dy / dist) * warpIntensity * WARP_MULTIPLIER;

                if (p.x < 0 || p.x > this.app.screen.width || p.y < 0 || p.y > this.app.screen.height) {
                    p.x = screenCenterX + (Math.random() - 0.5) * 100;
                    p.y = screenCenterY + (Math.random() - 0.5) * 100;
                }
            }
        });
    }

    public resize(): void {
        this.particles.forEach(p => {
            p.x = Math.random() * this.app.screen.width;
            p.y = Math.random() * this.app.screen.height;
        });
    }

    public destroy(): void {
        this.particles.forEach(p => p.destroy());
        this.particles = [];
    }
}
