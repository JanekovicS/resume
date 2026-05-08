import { Container, Graphics } from 'pixi.js';
import type { DesignDimensions } from './types';
import { CAMERA, EVENT } from './constants';

const UFO_LIGHT_COLORS = [0x60ffaa, 0xffd166, 0xff6bd0, 0x6bd6ff];

export class UFO {
    public readonly container: Container;
    public done: boolean = false;
    public readonly z: number;

    private body: Container;
    private light: Graphics;
    private lightColor: number;
    private screenX: number;
    private baseY: number;
    private vx: number;
    private age: number = 0;
    private duration: number;
    private hullWidth: number;
    private hullHeight: number;

    constructor(design: DesignDimensions, scrollZ: number) {
        this.container = new Container();
        this.body = new Container();
        const hull = new Graphics();
        const dome = new Graphics();
        this.light = new Graphics();
        this.body.addChild(this.light, hull, dome);
        this.container.addChild(this.body);

        this.hullWidth = 60 + Math.random() * 40;
        this.hullHeight = this.hullWidth * 0.32;
        this.z = scrollZ + EVENT.Z_MIN + Math.random() * (EVENT.Z_MAX - EVENT.Z_MIN);
        this.lightColor = UFO_LIGHT_COLORS[Math.floor(Math.random() * UFO_LIGHT_COLORS.length)]!;

        const fromLeft = Math.random() < 0.5;
        const speedPx = 220 + Math.random() * 180;
        this.vx = fromLeft ? speedPx : -speedPx;
        this.screenX = fromLeft ? -200 : design.width + 200;

        const band = EVENT.Y_BANDS[Math.floor(Math.random() * EVENT.Y_BANDS.length)]!;
        this.baseY = design.height * (band[0] + Math.random() * (band[1] - band[0]));

        this.duration = (design.width + 400) / Math.abs(this.vx);

        this.drawHull(hull, dome);
    }

    private drawHull(hull: Graphics, dome: Graphics): void {
        const w = this.hullWidth;
        const h = this.hullHeight;

        hull.ellipse(0, h * 0.4, w * 1.4, h * 0.5).fill({ color: 0x000000, alpha: 0.25 });
        hull.ellipse(0, 0, w, h).fill({ color: 0x9aa6b3 });
        hull.ellipse(0, -h * 0.15, w * 0.95, h * 0.85).fill({ color: 0xc7d0db, alpha: 0.6 });
        hull.ellipse(0, h * 0.2, w, h * 0.6).fill({ color: 0x4a5568, alpha: 0.35 });
        hull.ellipse(0, 0, w, h).stroke({ color: 0x2c3744, width: 1.5, alpha: 0.7 });

        dome.ellipse(0, -h * 0.6, w * 0.42, h * 1.3).fill({ color: 0xafe3ff, alpha: 0.85 });
        dome.ellipse(-w * 0.08, -h * 0.85, w * 0.18, h * 0.5).fill({ color: 0xffffff, alpha: 0.55 });
        dome.ellipse(0, -h * 0.6, w * 0.42, h * 1.3).stroke({ color: 0x6cb6ff, width: 1, alpha: 0.7 });
    }

    public getEffectiveZ(currentScrollZ: number): number {
        return this.z - currentScrollZ;
    }

    public update(delta: number, scrollZ: number): void {
        const dt = delta / 60;
        this.age += dt;

        this.screenX += this.vx * dt;
        const screenY = this.baseY + Math.sin(this.age * 1.6) * 18;

        const effectiveZ = this.z - scrollZ;
        if (effectiveZ < -CAMERA.FOCAL_LENGTH + 100) {
            this.done = true;
            return;
        }

        const scale = CAMERA.FOCAL_LENGTH / (CAMERA.FOCAL_LENGTH + effectiveZ);
        this.container.x = this.screenX;
        this.container.y = screenY;
        this.container.scale.set(scale);
        this.body.rotation = Math.sin(this.age * 1.6) * 0.06;

        const pulse = 0.5 + 0.5 * Math.sin(this.age * 4.5);
        const w = this.hullWidth;
        const h = this.hullHeight;
        this.light.clear();
        this.light.ellipse(0, h * 1.6, w * 0.55 + pulse * w * 0.15, h * 1.0 + pulse * h * 0.4)
            .fill({ color: this.lightColor, alpha: 0.10 + pulse * 0.10 });
        this.light.ellipse(0, h * 1.1, w * 0.40 + pulse * w * 0.10, h * 0.7 + pulse * h * 0.3)
            .fill({ color: this.lightColor, alpha: 0.20 + pulse * 0.20 });
        this.light.ellipse(0, h * 0.7, w * 0.22 + pulse * w * 0.06, h * 0.4 + pulse * h * 0.15)
            .fill({ color: 0xffffff, alpha: 0.4 + pulse * 0.4 });

        const fadeIn = 0.5;
        const fadeOut = 0.6;
        let alpha = 1;
        if (this.age < fadeIn) alpha = this.age / fadeIn;
        else if (this.age > this.duration - fadeOut) {
            alpha = Math.max(0, (this.duration - this.age) / fadeOut);
        }
        this.container.alpha = alpha;

        if (this.age >= this.duration) this.done = true;
    }
}
