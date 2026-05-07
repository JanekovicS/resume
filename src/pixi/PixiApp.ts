import { Application, Container, Graphics, Ticker } from 'pixi.js';
import { experiences } from '../data';
import type { Experience } from '../data';
import { DESIGN, CAMERA, NODE, SCROLL, CONSTELLATION } from './constants';
import { Starfield } from './Starfield';
import { ScrollController } from './ScrollController';
import { TimelineNode } from './TimelineNode';
import { InputManager } from './InputManager';

export interface ScrollInfo {
    progress: number;
    snapIndex: number;
    total: number;
    hasInteracted: boolean;
}

export class PixiApp {
    public app: Application;
    private container: Container;
    private debugGraphics: Graphics;
    private constellation: Graphics;
    private nodes: TimelineNode[] = [];
    private onSelectExperience: (exp: Experience | null) => void;
    private onScrollChange?: (info: ScrollInfo) => void;

    private isPortrait: boolean = false;
    private starfield!: Starfield;
    private scrollController: ScrollController;
    private inputManager!: InputManager;

    private reducedMotion: boolean = false;
    private reducedMotionMQL: MediaQueryList | null = null;
    private readonly onReducedMotionChange: (e: MediaQueryListEvent) => void;
    private readonly onResize: () => void;

    constructor(
        containerElement: HTMLElement,
        onSelectExperience: (exp: Experience | null) => void,
        onScrollChange?: (info: ScrollInfo) => void,
    ) {
        this.app = new Application();
        this.container = new Container();
        this.debugGraphics = new Graphics();
        this.debugGraphics.visible = import.meta.env.DEV;
        this.constellation = new Graphics();
        this.onSelectExperience = onSelectExperience;
        this.onScrollChange = onScrollChange;
        this.scrollController = new ScrollController();
        this.onResize = () => {
            this.app.resize();
            this.centerContainer();
            this.starfield?.resize();
        };
        this.onReducedMotionChange = (e: MediaQueryListEvent) => {
            this.reducedMotion = e.matches;
            this.scrollController.setReducedMotion(e.matches);
        };
        this.init(containerElement);
    }

    private async init(containerElement: HTMLElement): Promise<void> {
        await this.app.init({
            resizeTo: containerElement,
            backgroundAlpha: 0,
            antialias: true,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        });

        containerElement.appendChild(this.app.canvas);
        this.app.stage.addChild(this.container);
        this.container.addChild(this.debugGraphics);
        this.container.addChild(this.constellation);

        this.starfield = new Starfield(this.app);
        this.starfield.create();

        this.inputManager = new InputManager(this.scrollController);
        this.inputManager.setupStageTap(this.app, () => this.onSelectExperience(null));

        if (typeof window !== 'undefined' && window.matchMedia) {
            this.reducedMotionMQL = window.matchMedia('(prefers-reduced-motion: reduce)');
            this.reducedMotion = this.reducedMotionMQL.matches;
            this.scrollController.setReducedMotion(this.reducedMotion);
            this.reducedMotionMQL.addEventListener('change', this.onReducedMotionChange);
        }

        this.createNodes();
        this.centerContainer();

        this.emitScroll();

        this.app.ticker.add((ticker: Ticker) => this.animate(ticker.deltaTime));

        window.addEventListener('resize', this.onResize);
    }

    private createNodes(): void {
        this.isPortrait = this.app.screen.height > this.app.screen.width;

        experiences.forEach((exp) => {
            const node = new TimelineNode(exp, this.isPortrait, (selected) => {
                this.onSelectExperience(selected);
            });
            this.container.addChild(node.container);
            this.nodes.push(node);
        });
    }

    private centerContainer(): void {
        const screenWidth = this.app.screen.width;
        const screenHeight = this.app.screen.height;

        const wasPortrait = this.isPortrait;
        this.isPortrait = screenHeight > screenWidth;
        const design = this.isPortrait ? DESIGN.PORTRAIT : DESIGN.LANDSCAPE;

        if (wasPortrait !== this.isPortrait) {
            this.nodes.forEach(node => node.updateOrientation(this.isPortrait));
        }

        const scale = Math.min(screenWidth / design.width, screenHeight / design.height);
        this.container.scale.set(scale);
        this.container.x = (screenWidth - design.width * scale) / 2;
        this.container.y = (screenHeight - design.height * scale) / 2;

        const currentZ = this.scrollController.currentZ;
        const centerX = design.width / 2;
        const centerY = design.height / 2;
        this.nodes.forEach(node => {
            const effectiveZ = node.getEffectiveZ(currentZ);
            node.snapToTarget(centerX, centerY, effectiveZ);
        });

        this.debugGraphics.clear();
        this.debugGraphics.rect(0, 0, design.width, design.height)
            .stroke({ color: 0x00ff00, width: 2, alpha: 0.3 });
    }

    private animate(delta: number): void {
        const time = performance.now() / 1000;
        const design = this.isPortrait ? DESIGN.PORTRAIT : DESIGN.LANDSCAPE;
        const centerX = design.width / 2;
        const centerY = design.height / 2;

        this.scrollController.update(delta);
        this.inputManager.updateSmoothing(delta);

        const currentZ = this.scrollController.currentZ;
        const mouseNX = this.reducedMotion ? 0 : this.inputManager.mouseNX;
        const mouseNY = this.reducedMotion ? 0 : this.inputManager.mouseNY;
        const offsetX = mouseNX * NODE.PARALLAX_X;
        const offsetY = mouseNY * NODE.PARALLAX_Y;

        this.nodes.forEach((node) => {
            const effectiveZ = node.getEffectiveZ(currentZ);
            node.update(
                effectiveZ,
                CAMERA.FOCAL_LENGTH,
                time,
                delta,
                centerX,
                centerY,
                offsetX,
                offsetY,
                design
            );
        });

        this.drawConstellation(currentZ);

        const sorted = this.nodes
            .slice()
            .sort((a, b) => b.getEffectiveZ(currentZ) - a.getEffectiveZ(currentZ));
        sorted.forEach((node, i) => this.container.setChildIndex(node.container, i));
        this.container.setChildIndex(this.constellation, 0);

        this.starfield.update(time, this.scrollController.velocity, this.scrollController.lastInputTime, mouseNX, mouseNY);

        this.emitScroll();
    }

    private drawConstellation(currentZ: number): void {
        this.constellation.clear();
        const sp = SCROLL.SNAP_POINTS;
        if (currentZ <= sp[0]! || currentZ >= sp[sp.length - 1]!) return;

        let prevIdx = 0;
        for (let i = 0; i < sp.length - 1; i++) {
            if (currentZ >= sp[i]! && currentZ < sp[i + 1]!) {
                prevIdx = i;
                break;
            }
        }
        const nextIdx = prevIdx + 1;
        const a = this.nodes[prevIdx];
        const b = this.nodes[nextIdx];
        if (!a || !b) return;

        const t = (currentZ - sp[prevIdx]!) / (sp[nextIdx]! - sp[prevIdx]!);
        const fade = Math.sin(t * Math.PI);
        if (fade < 0.05) return;

        this.constellation.moveTo(a.container.x, a.container.y)
            .lineTo(b.container.x, b.container.y)
            .stroke({
                width: CONSTELLATION.WIDTH,
                color: CONSTELLATION.COLOR,
                alpha: CONSTELLATION.ALPHA * fade,
            });
    }

    private emitScroll(): void {
        if (!this.onScrollChange) return;
        this.onScrollChange({
            progress: this.scrollController.progress,
            snapIndex: this.scrollController.snapIndex,
            total: this.nodes.length || experiences.length,
            hasInteracted: this.scrollController.hasInteracted,
        });
    }

    public pause(): void {
        this.app.ticker.stop();
        this.inputManager.enabled = false;
    }

    public resume(): void {
        this.app.ticker.start();
        this.inputManager.enabled = true;
    }

    public scrollToNextYear(): void {
        this.scrollController.scrollToNext();
    }

    public scrollToIndex(i: number): void {
        this.scrollController.scrollToIndex(i);
    }

    public jumpToIndex(i: number): void {
        this.scrollController.jumpToIndex(i);
        this.emitScroll();
    }

    public destroy(): void {
        window.removeEventListener('resize', this.onResize);
        if (this.reducedMotionMQL) {
            this.reducedMotionMQL.removeEventListener('change', this.onReducedMotionChange);
            this.reducedMotionMQL = null;
        }
        this.inputManager?.destroy();
        this.starfield?.destroy();
        this.app.destroy(true, { children: true, texture: true });
    }
}
