import { Application, Container, Graphics, Ticker } from 'pixi.js';
import { experiences } from '../data';
import type { Experience } from '../data';
import { DESIGN, CAMERA } from './constants';
import { Starfield } from './Starfield';
import { ScrollController } from './ScrollController';
import { TimelineNode } from './TimelineNode';
import { InputManager } from './InputManager';

export class PixiApp {
    public app: Application;
    private container: Container;
    private debugGraphics: Graphics;
    private nodes: TimelineNode[] = [];
    private onSelectExperience: (exp: Experience | null) => void;

    private isPortrait: boolean = false;
    private starfield!: Starfield;
    private scrollController: ScrollController;
    private inputManager!: InputManager;

    constructor(containerElement: HTMLElement, onSelectExperience: (exp: Experience | null) => void) {
        this.app = new Application();
        this.container = new Container();
        this.debugGraphics = new Graphics();
        this.debugGraphics.visible = import.meta.env.DEV;
        this.onSelectExperience = onSelectExperience;
        this.scrollController = new ScrollController();
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

        this.starfield = new Starfield(this.app);
        this.starfield.create();

        this.inputManager = new InputManager(this.scrollController);
        this.inputManager.setupStageTap(this.app, () => this.onSelectExperience(null));

        this.createNodes();
        this.centerContainer();

        this.app.ticker.add((ticker: Ticker) => this.animate(ticker.deltaTime));

        window.addEventListener('resize', () => {
            this.app.resize();
            this.centerContainer();
            this.starfield.resize();
        });
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
        const time = Date.now() / 1000;
        const design = this.isPortrait ? DESIGN.PORTRAIT : DESIGN.LANDSCAPE;
        const centerX = design.width / 2;
        const centerY = design.height / 2;

        this.scrollController.update(delta);
        const currentZ = this.scrollController.currentZ;

        this.nodes.forEach((node) => {
            const effectiveZ = node.getEffectiveZ(currentZ);
            node.update(
                effectiveZ,
                CAMERA.FOCAL_LENGTH,
                time,
                delta,
                centerX,
                centerY,
                0,
                0,
                design
            );
        });

        this.container.children.sort((a, b) => {
            const nodeA = this.nodes.find(n => n.container === a);
            const nodeB = this.nodes.find(n => n.container === b);
            if (!nodeA || !nodeB) return 0;
            return nodeB.getEffectiveZ(currentZ) - nodeA.getEffectiveZ(currentZ);
        });

        this.starfield.update(time, this.scrollController.velocity, this.scrollController.lastWheelTime);
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

    public destroy(): void {
        this.starfield.destroy();
        this.app.destroy(true, { children: true, texture: true });
    }
}
