import { Container, Graphics } from 'pixi.js';
import type { DesignDimensions } from './types';
import { CAMERA, EVENT } from './constants';

const COMET_COLORS = [0x9be7ff, 0xb0d8ff, 0xffffff, 0xffe7b0, 0xc8b8ff];

export class Comet {
    public readonly container: Container;
    public done: boolean = false;
    public readonly z: number;

    private screenX: number;
    private screenY: number;
    private vx: number;
    private vy: number;
    private age: number = 0;
    private duration: number;
    private headSize: number;

    constructor(design: DesignDimensions, scrollZ: number) {
        this.container = new Container();
        const trail = new Graphics();
        const head = new Graphics();
        this.container.addChild(trail, head);

        this.headSize = 4 + Math.random() * 5;
        this.z = scrollZ + EVENT.Z_MIN + Math.random() * (EVENT.Z_MAX - EVENT.Z_MIN);

        const fromLeft = Math.random() < 0.5;
        const speedPx = 700 + Math.random() * 500;
        const downward = Math.random() < 0.5 ? 1 : -1;
        const slope = (0.15 + Math.random() * 0.35) * downward;
        const dirX = fromLeft ? 1 : -1;

        this.vx = dirX * speedPx;
        this.vy = slope * speedPx;

        const band = EVENT.Y_BANDS[Math.floor(Math.random() * EVENT.Y_BANDS.length)]!;
        this.screenY = design.height * (band[0] + Math.random() * (band[1] - band[0]));
        this.screenX = fromLeft ? -120 : design.width + 120;

        this.duration = (design.width + 300) / Math.abs(this.vx);

        const color = COMET_COLORS[Math.floor(Math.random() * COMET_COLORS.length)]!;
        this.draw(head, trail, color);

        this.container.rotation = Math.atan2(this.vy, this.vx);
    }

    private draw(head: Graphics, trail: Graphics, color: number): void {
        const s = this.headSize;

        head.circle(0, 0, s).fill({ color: 0xffffff });
        head.circle(0, 0, s * 1.6).fill({ color, alpha: 0.55 });
        head.circle(0, 0, s * 3).fill({ color, alpha: 0.18 });
        head.circle(0, 0, s * 5).fill({ color, alpha: 0.07 });

        const trailLen = s * 36;
        const segments = 14;
        for (let i = 0; i < segments; i++) {
            const t0 = i / segments;
            const t1 = (i + 1) / segments;
            const a = Math.pow(1 - t0, 1.5);
            const w = s * (1 - t0 * 0.85);
            trail.moveTo(-trailLen * t0, 0)
                .lineTo(-trailLen * t1, 0)
                .stroke({ color, alpha: a * 0.75, width: w, cap: 'round' });
        }
    }

    public getEffectiveZ(currentScrollZ: number): number {
        return this.z - currentScrollZ;
    }

    public update(delta: number, scrollZ: number): void {
        const dt = delta / 60;
        this.age += dt;

        this.screenX += this.vx * dt;
        this.screenY += this.vy * dt;

        const effectiveZ = this.z - scrollZ;
        if (effectiveZ < -CAMERA.FOCAL_LENGTH + 100) {
            this.done = true;
            return;
        }

        const scale = CAMERA.FOCAL_LENGTH / (CAMERA.FOCAL_LENGTH + effectiveZ);
        this.container.x = this.screenX;
        this.container.y = this.screenY;
        this.container.scale.set(scale);

        const fadeIn = 0.25;
        const fadeOut = 0.4;
        let alpha = 1;
        if (this.age < fadeIn) alpha = this.age / fadeIn;
        else if (this.age > this.duration - fadeOut) {
            alpha = Math.max(0, (this.duration - this.age) / fadeOut);
        }
        this.container.alpha = alpha;

        if (this.age >= this.duration) this.done = true;
    }
}
