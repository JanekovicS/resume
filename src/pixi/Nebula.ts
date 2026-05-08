import { Container, Graphics, Sprite } from 'pixi.js';
import type { Renderer } from 'pixi.js';

export interface NebulaConfig {
    fxFraction: number;
    fyFraction: number;
    colors: [number, number, number];
    radius: number;
    parallaxStrength: number;
    driftAmplitude: number;
    driftSpeed: number;
    seed: number;
    rotation?: number;
}

interface Tier {
    count: number;
    sizeMin: number;
    sizeMax: number;
    distMax: number;
    alpha: number;
    colorIdx: 0 | 1 | 2;
}

const TIERS: Tier[] = [
    { count: 14, sizeMin: 0.55, sizeMax: 1.05, distMax: 0.85, alpha: 0.016, colorIdx: 0 },
    { count: 12, sizeMin: 0.40, sizeMax: 0.80, distMax: 0.65, alpha: 0.028, colorIdx: 1 },
    { count: 10, sizeMin: 0.25, sizeMax: 0.55, distMax: 0.45, alpha: 0.040, colorIdx: 1 },
    { count:  8, sizeMin: 0.15, sizeMax: 0.35, distMax: 0.25, alpha: 0.055, colorIdx: 2 },
    { count:  5, sizeMin: 0.08, sizeMax: 0.18, distMax: 0.12, alpha: 0.075, colorIdx: 2 },
];

export class Nebula {
    public readonly container: Container;
    private config: NebulaConfig;

    constructor(config: NebulaConfig) {
        this.config = config;
        this.container = new Container();
        this.draw();
    }

    public bake(renderer: Renderer): void {
        const bounds = this.container.getLocalBounds();
        const cx = (bounds.minX + bounds.maxX) / 2;
        const cy = (bounds.minY + bounds.maxY) / 2;

        const texture = renderer.generateTexture({
            target: this.container,
            resolution: 0.5,
            antialias: true,
        });

        const oldChildren = [...this.container.children];
        this.container.removeChildren();
        oldChildren.forEach(c => c.destroy());

        const sprite = new Sprite(texture);
        sprite.anchor.set(0.5);
        sprite.x = cx;
        sprite.y = cy;
        this.container.addChild(sprite);

        this.container.rotation = this.config.rotation ?? 0;
    }

    private draw(): void {
        const { colors, radius, seed } = this.config;
        const rng = mulberry32(seed);

        for (const tier of TIERS) {
            const g = new Graphics();
            for (let i = 0; i < tier.count; i++) {
                const a = rng() * Math.PI * 2;
                const r = Math.pow(rng(), 0.7) * radius * tier.distMax;
                const yScale = 0.55 + rng() * 0.4;
                const x = Math.cos(a) * r;
                const y = Math.sin(a) * r * yScale;
                const sz = radius * (tier.sizeMin + rng() * (tier.sizeMax - tier.sizeMin));
                const color = colors[tier.colorIdx];
                g.circle(x, y, sz).fill({ color, alpha: tier.alpha });
            }
            this.container.addChild(g);
        }
    }

    public update(
        time: number,
        screenW: number,
        screenH: number,
        mouseNX: number,
        mouseNY: number,
        drift: boolean,
    ): void {
        const { fxFraction, fyFraction, parallaxStrength, driftAmplitude, driftSpeed, seed } = this.config;
        const baseX = fxFraction * screenW;
        const baseY = fyFraction * screenH;

        const driftX = drift ? Math.sin(time * driftSpeed + seed) * driftAmplitude : 0;
        const driftY = drift ? Math.cos(time * driftSpeed * 0.7 + seed * 1.3) * driftAmplitude * 0.6 : 0;

        this.container.x = baseX + driftX - mouseNX * parallaxStrength;
        this.container.y = baseY + driftY - mouseNY * parallaxStrength;
    }
}

function mulberry32(seed: number): () => number {
    let s = seed >>> 0;
    return () => {
        s = (s + 0x6D2B79F5) >>> 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
