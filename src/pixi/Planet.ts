import { Container, Graphics, Sprite } from 'pixi.js';
import type { Renderer } from 'pixi.js';
import { PLANET, CAMERA } from './constants';

export interface MoonConfig {
    radius: number;
    orbitRadius: number;
    orbitSpeed: number;
    orbitPhase: number;
    orbitTilt: number;
    color: number;
    accent?: number;
}

export interface PlanetConfig {
    z: number;
    radius: number;
    color: number;
    accent?: number;
    ringColor?: number;
    ringScale?: number;
    ringTilt?: number;
    lx: number;
    ly: number;
    px: number;
    py: number;
    rotationSpeed?: number;
    moons?: MoonConfig[];
}

export const PLANETS: PlanetConfig[] = [
    { z:  600, radius:  60, color: 0xff7b54, accent: 0x9c2a2a, lx: -780, ly: -360, px: -260, py: -560, rotationSpeed:  0.06 },
    { z: 1100, radius:  95, color: 0xfeca57, accent: 0xb8860b, ringColor: 0xffe6a8, ringScale: 2.2, ringTilt: 0.22, lx:  860, ly:  140, px:  280, py:  420, rotationSpeed: -0.04 },
    { z: 2150, radius: 140, color: 0x5b8def, accent: 0x1a3a8a, lx: -900, ly:  280, px: -290, py:  500, rotationSpeed:  0.03,
        moons: [
            { radius: 16, orbitRadius: 230, orbitSpeed:  0.42, orbitPhase: 0.5, orbitTilt: 0.32, color: 0xc8c4b8, accent: 0x4a4538 },
            { radius:  9, orbitRadius: 320, orbitSpeed: -0.55, orbitPhase: 2.2, orbitTilt: 0.55, color: 0x9aa098, accent: 0x3a3e3a },
        ],
    },
    { z: 2700, radius:  45, color: 0xcfd8dc, accent: 0x607d8b, lx:  720, ly: -240, px:  290, py: -440, rotationSpeed:  0.10 },
    { z: 3500, radius: 110, color: 0xc471ed, accent: 0x4a148c, lx: -820, ly: -260, px: -270, py: -520, rotationSpeed: -0.05,
        moons: [
            { radius: 13, orbitRadius: 195, orbitSpeed: 0.50, orbitPhase: 1.1, orbitTilt: 0.28, color: 0xddd0c0, accent: 0x4a4030 },
        ],
    },
    { z: 3950, radius:  70, color: 0xa8e6cf, accent: 0x2e7d6b, lx:  780, ly:  300, px:  280, py:  520, rotationSpeed:  0.07 },
    { z: 4900, radius: 130, color: 0x12c2e9, accent: 0x0a4a8a, ringColor: 0x4facfe, ringScale: 2.0, ringTilt: -0.18, lx: -880, ly:  180, px: -290, py:  450, rotationSpeed:  0.02 },
    { z: 5500, radius:  55, color: 0xf093fb, accent: 0x6a1b9a, lx:  760, ly: -180, px:  280, py: -400, rotationSpeed: -0.08 },
    { z: 6400, radius: 120, color: 0xfa709a, accent: 0x880e4f, lx: -860, ly: -200, px: -280, py: -480, rotationSpeed:  0.03,
        moons: [
            { radius: 18, orbitRadius: 215, orbitSpeed: 0.36, orbitPhase: 0.0, orbitTilt: 0.25, color: 0xc8b8a8, accent: 0x4a3c30 },
        ],
    },
    { z: 6950, radius:  80, color: 0x84fab0, accent: 0x1b5e20, ringColor: 0xb9f6ca, ringScale: 1.9, ringTilt: 0.25, lx:  820, ly:  240, px:  290, py:  500, rotationSpeed: -0.05 },
];

interface MoonState {
    sprite: Sprite;
    config: MoonConfig;
    inFront: boolean;
}

export class Planet {
    public readonly container: Container;
    public readonly config: PlanetConfig;
    private body: Graphics;
    private ringBack: Graphics | null = null;
    private ringFront: Graphics | null = null;
    private baked: boolean = false;
    private baseX: number;
    private baseY: number;
    private centerOffsetX: number = 0;
    private centerOffsetY: number = 0;
    private backMoonsLayer: Container | null = null;
    private frontMoonsLayer: Container | null = null;
    private moons: MoonState[] = [];

    constructor(config: PlanetConfig, isPortrait: boolean) {
        this.config = config;
        this.container = new Container();
        this.body = new Graphics();

        this.baseX = isPortrait ? config.px : config.lx;
        this.baseY = isPortrait ? config.py : config.ly;

        if (config.ringColor !== undefined) {
            this.ringBack = new Graphics();
            this.ringFront = new Graphics();
            this.container.addChild(this.ringBack, this.body, this.ringFront);
        } else {
            this.container.addChild(this.body);
        }

        this.draw();
    }

    private strokeArc(
        g: Graphics,
        rx: number,
        ry: number,
        startAngle: number,
        endAngle: number,
        color: number,
        alpha: number,
        width: number,
    ): void {
        const steps = 64;
        const dAngle = (endAngle - startAngle) / steps;
        g.moveTo(rx * Math.cos(startAngle), ry * Math.sin(startAngle));
        for (let i = 1; i <= steps; i++) {
            const a = startAngle + dAngle * i;
            g.lineTo(rx * Math.cos(a), ry * Math.sin(a));
        }
        g.stroke({ color, alpha, width, cap: 'round' });
    }

    private draw(): void {
        const { radius, color, accent = color, ringColor, ringScale = 2.0, ringTilt = 0 } = this.config;

        if (ringColor !== undefined && this.ringBack && this.ringFront) {
            const rx = radius * ringScale;
            const ry = radius * ringScale * 0.30;
            const w = Math.max(2, radius * 0.10);

            this.ringBack.clear();
            this.ringBack.rotation = ringTilt;
            this.strokeArc(this.ringBack, rx, ry, Math.PI, Math.PI * 2, ringColor, 0.55, w);
            this.strokeArc(this.ringBack, rx * 0.82, ry * 0.82, Math.PI, Math.PI * 2, ringColor, 0.35, w * 0.65);

            this.ringFront.clear();
            this.ringFront.rotation = ringTilt;
            this.strokeArc(this.ringFront, rx, ry, 0, Math.PI, ringColor, 0.55, w);
            this.strokeArc(this.ringFront, rx * 0.82, ry * 0.82, 0, Math.PI, ringColor, 0.35, w * 0.65);
        }

        this.body.clear();
        this.body.circle(0, 0, radius * 1.7).fill({ color, alpha: 0.06 });
        this.body.circle(0, 0, radius * 1.3).fill({ color, alpha: 0.10 });
        this.body.circle(0, 0, radius).fill({ color });
        this.body.circle(radius * 0.35, radius * 0.35, radius * 0.95).fill({ color: accent, alpha: 0.35 });
        this.body.circle(radius * 0.55, radius * 0.55, radius * 0.55).fill({ color: 0x000000, alpha: 0.30 });
        this.body.circle(-radius * 0.32, -radius * 0.34, radius * 0.42).fill({ color: 0xffffff, alpha: 0.22 });
        this.body.circle(-radius * 0.45, -radius * 0.45, radius * 0.18).fill({ color: 0xffffff, alpha: 0.35 });
    }

    private drawMoonGraphic(g: Graphics, cfg: MoonConfig): void {
        const r = cfg.radius;
        const accent = cfg.accent ?? 0x000000;
        g.circle(0, 0, r * 1.4).fill({ color: cfg.color, alpha: 0.10 });
        g.circle(0, 0, r).fill({ color: cfg.color });
        g.circle(r * 0.30, r * 0.30, r * 0.95).fill({ color: accent, alpha: 0.32 });
        g.circle(r * 0.50, r * 0.50, r * 0.55).fill({ color: 0x000000, alpha: 0.35 });
        g.circle(-r * 0.30, -r * 0.30, r * 0.42).fill({ color: 0xffffff, alpha: 0.22 });
        g.circle(-r * 0.45, -r * 0.45, r * 0.16).fill({ color: 0xffffff, alpha: 0.40 });
        g.circle(r * 0.10, -r * 0.20, r * 0.10).fill({ color: 0x000000, alpha: 0.18 });
        g.circle(-r * 0.20, r * 0.15, r * 0.08).fill({ color: 0x000000, alpha: 0.20 });
    }

    public bake(renderer: Renderer): void {
        if (this.baked) return;

        const bounds = this.container.getLocalBounds();
        const cx = (bounds.minX + bounds.maxX) / 2;
        const cy = (bounds.minY + bounds.maxY) / 2;

        const texture = renderer.generateTexture({
            target: this.container,
            resolution: 1,
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

        this.ringBack = null;
        this.ringFront = null;
        this.centerOffsetX = cx;
        this.centerOffsetY = cy;

        if (this.config.moons && this.config.moons.length > 0) {
            this.backMoonsLayer = new Container();
            this.frontMoonsLayer = new Container();
            this.container.addChildAt(this.backMoonsLayer, 0);
            this.container.addChild(this.frontMoonsLayer);

            for (const moonCfg of this.config.moons) {
                const moonGfx = new Graphics();
                this.drawMoonGraphic(moonGfx, moonCfg);
                const moonTex = renderer.generateTexture({
                    target: moonGfx,
                    resolution: 1,
                    antialias: true,
                });
                moonGfx.destroy();

                const moonSprite = new Sprite(moonTex);
                moonSprite.anchor.set(0.5);
                this.frontMoonsLayer.addChild(moonSprite);
                this.moons.push({ sprite: moonSprite, config: moonCfg, inFront: true });
            }
        }

        this.baked = true;
    }

    public updateOrientation(isPortrait: boolean): void {
        this.baseX = isPortrait ? this.config.px : this.config.lx;
        this.baseY = isPortrait ? this.config.py : this.config.ly;
    }

    public getEffectiveZ(currentScrollZ: number): number {
        return this.config.z - currentScrollZ;
    }

    public update(
        effectiveZ: number,
        focalLength: number,
        time: number,
        centerX: number,
        centerY: number,
        mouseOffsetX: number,
        mouseOffsetY: number,
    ): void {
        if (effectiveZ < -focalLength + 200) {
            this.container.visible = false;
            return;
        }

        const scale = focalLength / (focalLength + effectiveZ);

        this.container.x = centerX + this.baseX * scale + mouseOffsetX;
        this.container.y = centerY + this.baseY * scale + mouseOffsetY;
        this.container.scale.set(scale);

        let alpha = 1;
        if (effectiveZ < PLANET.FADE_IN_FAR) {
            alpha *= Math.max(0, (effectiveZ - PLANET.FADE_IN_NEAR) / (PLANET.FADE_IN_FAR - PLANET.FADE_IN_NEAR));
        }
        if (effectiveZ > PLANET.FADE_OUT_NEAR) {
            alpha *= Math.max(0, 1 - (effectiveZ - PLANET.FADE_OUT_NEAR) / (PLANET.FADE_OUT_FAR - PLANET.FADE_OUT_NEAR));
        }
        this.container.alpha = Math.min(1, alpha);
        this.container.visible = alpha > 0.01;

        if (this.moons.length > 0 && this.backMoonsLayer && this.frontMoonsLayer) {
            for (const m of this.moons) {
                const angle = m.config.orbitPhase + time * m.config.orbitSpeed;
                m.sprite.x = this.centerOffsetX + m.config.orbitRadius * Math.cos(angle);
                m.sprite.y = this.centerOffsetY + m.config.orbitRadius * Math.sin(angle) * m.config.orbitTilt;

                const shouldBeFront = Math.sin(angle) > 0;
                if (shouldBeFront !== m.inFront) {
                    const target = shouldBeFront ? this.frontMoonsLayer : this.backMoonsLayer;
                    target.addChild(m.sprite);
                    m.inFront = shouldBeFront;
                }
            }
        }
    }

    public snapToTarget(centerX: number, centerY: number, effectiveZ: number): void {
        const scale = CAMERA.FOCAL_LENGTH / (CAMERA.FOCAL_LENGTH + effectiveZ);
        this.container.x = centerX + this.baseX * scale;
        this.container.y = centerY + this.baseY * scale;
        this.container.scale.set(scale);
    }
}
