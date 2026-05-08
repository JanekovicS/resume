import { Application, Container, Graphics } from 'pixi.js';
import { STARFIELD } from './constants';

interface ParticleState {
    baseAlpha: number;
    blinkSpeed: number;
    blinkOffset: number;
    depth: number;
    size: number;
    color: number;
    streakBucket: number;
}

export class Starfield {
    private particles: Graphics[] = [];
    private states: ParticleState[] = [];
    private app: Application;
    private parallaxLayer: Container;
    private warpFactor: number = 0;

    constructor(app: Application) {
        this.app = app;
        this.parallaxLayer = new Container();
        this.app.stage.addChildAt(this.parallaxLayer, 0);
    }

    public create(): void {
        const { PARTICLE_COUNT, COLORS, MIN_SIZE, MAX_SIZE, MIN_ALPHA, MAX_ALPHA, MIN_BLINK_SPEED, MAX_BLINK_SPEED } = STARFIELD;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const color = COLORS[Math.floor(Math.random() * COLORS.length)]!;
            const depth = Math.random();
            const size = (Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE) * (0.6 + depth * 0.6);
            const baseAlpha = (Math.random() * (MAX_ALPHA - MIN_ALPHA) + MIN_ALPHA) * (0.7 + depth * 0.4);

            const p = new Graphics();
            p.x = Math.random() * this.app.screen.width;
            p.y = Math.random() * this.app.screen.height;

            const state: ParticleState = {
                baseAlpha,
                blinkSpeed: Math.random() * (MAX_BLINK_SPEED - MIN_BLINK_SPEED) + MIN_BLINK_SPEED,
                blinkOffset: Math.random() * Math.PI * 2,
                depth,
                size,
                color,
                streakBucket: -1,
            };

            this.parallaxLayer.addChild(p);
            this.particles.push(p);
            this.states.push(state);
            this.drawStar(p, state, 0);
            state.streakBucket = 0;
        }
    }

    private drawStar(p: Graphics, s: ParticleState, streakLen: number): void {
        p.clear();
        if (streakLen >= 2) {
            const lineWidth = Math.max(0.8, s.size * 0.7);
            p.moveTo(-streakLen, 0)
                .lineTo(-s.size * 0.5, 0)
                .stroke({ color: s.color, alpha: 0.55, width: lineWidth, cap: 'round' });
        }
        p.circle(0, 0, s.size).fill({ color: s.color });
    }

    public update(time: number, scrollVelocity: number, lastInputTime: number, mouseNX: number = 0, mouseNY: number = 0): void {
        const { PARALLAX_X, PARALLAX_Y } = STARFIELD;
        const w = this.app.screen.width;
        const h = this.app.screen.height;
        const cx = w / 2;
        const cy = h / 2;
        const maxR = Math.sqrt(cx * cx + cy * cy) || 1;
        const isActivelyScrolling = performance.now() - lastInputTime < 400;

        const speedMag = Math.abs(scrollVelocity);
        const targetWarp = isActivelyScrolling ? Math.min(1, speedMag / 25) : 0;
        this.warpFactor += (targetWarp - this.warpFactor) * 0.1;
        const direction = scrollVelocity >= 0 ? 1 : -1;
        const warping = this.warpFactor > 0.005;

        this.parallaxLayer.x = -mouseNX * PARALLAX_X;
        this.parallaxLayer.y = -mouseNY * PARALLAX_Y;

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i]!;
            const s = this.states[i]!;

            const twinkle = 0.5 + Math.sin(time * s.blinkSpeed + s.blinkOffset) * 0.5;
            const calmAlpha = s.baseAlpha * twinkle;
            const warpAlpha = Math.min(1, s.baseAlpha + 0.25 * s.depth);
            p.alpha = calmAlpha * (1 - this.warpFactor) + warpAlpha * this.warpFactor;

            if (warping) {
                const dx = p.x - cx;
                const dy = p.y - cy;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;

                const perspective = 0.4 + (dist / maxR) * 1.0;
                const push = speedMag * this.warpFactor * (0.4 + s.depth * 1.2) * perspective * 0.35 * direction;
                p.x += (dx / dist) * push;
                p.y += (dy / dist) * push;

                const margin = 30;
                const offScreen = p.x < -margin || p.x > w + margin || p.y < -margin || p.y > h + margin;
                const collapsedAtCenter = dist < 12;
                if (offScreen || collapsedAtCenter) {
                    if (direction >= 0) {
                        const angle = Math.random() * Math.PI * 2;
                        const r = Math.random() * Math.min(cx, cy) * 0.4;
                        p.x = cx + Math.cos(angle) * r;
                        p.y = cy + Math.sin(angle) * r;
                    } else {
                        const edge = Math.floor(Math.random() * 4);
                        const off = 20;
                        if (edge === 0) { p.x = -off; p.y = Math.random() * h; }
                        else if (edge === 1) { p.x = w + off; p.y = Math.random() * h; }
                        else if (edge === 2) { p.x = Math.random() * w; p.y = -off; }
                        else { p.x = Math.random() * w; p.y = h + off; }
                    }
                }

                const desiredStreakLen = this.warpFactor * (4 + s.depth * 40) * Math.min(1, speedMag / 10);
                p.rotation = Math.atan2(dy, dx) + (direction < 0 ? Math.PI : 0);
                const bucket = Math.round(desiredStreakLen / 2);
                if (bucket !== s.streakBucket) {
                    s.streakBucket = bucket;
                    this.drawStar(p, s, bucket * 2);
                }
            } else if (s.streakBucket !== 0) {
                s.streakBucket = 0;
                p.rotation = 0;
                this.drawStar(p, s, 0);
            }
        }
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
        this.states = [];
        this.parallaxLayer.destroy({ children: true });
    }
}
