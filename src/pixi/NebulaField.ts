import { Application, Container } from 'pixi.js';
import { Nebula } from './Nebula';
import type { NebulaConfig } from './Nebula';

const NEBULAS: NebulaConfig[] = [
    {
        fxFraction: 0.16, fyFraction: 0.24,
        colors: [0x2a0a4a, 0x6a1ea2, 0xc06fff],
        radius: 340, parallaxStrength: 4,
        driftAmplitude: 7, driftSpeed: 0.04, seed: 17,
        rotation: -0.18,
    },
    {
        fxFraction: 0.88, fyFraction: 0.42,
        colors: [0x062b3f, 0x1865aa, 0x4fd1ff],
        radius: 380, parallaxStrength: 5,
        driftAmplitude: 8, driftSpeed: 0.035, seed: 91,
        rotation: 0.22,
    },
    {
        fxFraction: 0.55, fyFraction: 0.92,
        colors: [0x4a0a18, 0xc23f4a, 0xff8b6a],
        radius: 260, parallaxStrength: 3,
        driftAmplitude: 6, driftSpeed: 0.05, seed: 234,
        rotation: 0.05,
    },
    {
        fxFraction: 0.38, fyFraction: 0.10,
        colors: [0x0a1842, 0x2c4dc2, 0x6a8aff],
        radius: 300, parallaxStrength: 6,
        driftAmplitude: 9, driftSpeed: 0.03, seed: 555,
        rotation: -0.30,
    },
];

export class NebulaField {
    private app: Application;
    public readonly layer: Container;
    private nebulas: Nebula[] = [];
    private reducedMotion: boolean = false;

    constructor(app: Application) {
        this.app = app;
        this.layer = new Container();
        this.app.stage.addChildAt(this.layer, 0);
    }

    public create(): void {
        for (const cfg of NEBULAS) {
            const n = new Nebula(cfg);
            n.bake(this.app.renderer);
            this.layer.addChild(n.container);
            this.nebulas.push(n);
        }
    }

    public setReducedMotion(reduced: boolean): void {
        this.reducedMotion = reduced;
    }

    public update(time: number, mouseNX: number, mouseNY: number): void {
        const w = this.app.screen.width;
        const h = this.app.screen.height;
        const drift = !this.reducedMotion;
        for (const n of this.nebulas) {
            n.update(time, w, h, mouseNX, mouseNY, drift);
        }
    }

    public destroy(): void {
        this.layer.destroy({ children: true, texture: true });
        this.nebulas = [];
    }
}
