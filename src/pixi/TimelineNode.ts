import { Container, Graphics, Text, TextStyle, FederatedPointerEvent } from 'pixi.js';
import type { Experience } from '../data';
import { NODE, CAMERA } from './constants';
import type { DesignDimensions } from './types';

export class TimelineNode {
    public readonly container: Container;
    public readonly exp: Experience;
    public baseX: number;
    public baseY: number;

    private glow!: Graphics;
    private label!: Text;

    private hoverScale: number = 1.0;
    private currentHoverScale: number = 1.0;

    constructor(exp: Experience, isPortrait: boolean, onSelect: (exp: Experience) => void) {
        this.exp = exp;
        this.container = new Container();
        this.baseX = isPortrait ? exp.px : exp.lx;
        this.baseY = isPortrait ? exp.py : exp.ly;
        this.createVisuals();
        this.setupInteraction(onSelect);
    }

    private createVisuals(): void {
        this.glow = new Graphics();
        this.glow.circle(0, 0, 100).fill({ color: this.exp.color, alpha: 0.15 });
        this.glow.visible = false;

        const style = new TextStyle({
            fill: '#' + this.exp.color.toString(16).padStart(6, '0'),
            fontSize: this.exp.id === 'intro' ? 200 : 300,
            fontWeight: '900',
            fontFamily: 'Outfit',
            dropShadow: {
                color: '#000000',
                blur: 15,
                distance: 0,
                alpha: 0.5
            }
        });
        this.label = new Text({ text: this.exp.year, style });
        this.label.anchor.set(0.5);

        const hintStyle = new TextStyle({
            fill: '#4facfe',
            fontSize: 24,
            fontWeight: 'bold',
            fontFamily: 'Outfit',
            letterSpacing: 4,
        });
        const isTouch = matchMedia('(hover: none) and (pointer: coarse)').matches;
        const hint = new Text({
            text: this.exp.id === 'intro' ? '' : (isTouch ? 'TAP TO EXPLORE' : 'CLICK TO EXPLORE'),
            style: hintStyle
        });
        hint.anchor.set(0.5);
        hint.y = 180;
        hint.alpha = 0.7;

        this.container.addChild(this.glow, this.label, hint);
    }

    private setupInteraction(onSelect: (exp: Experience) => void): void {
        this.container.eventMode = 'none';
        this.container.cursor = 'pointer';

        this.container.on('pointerover', () => {
            this.container.alpha = 1;
            this.hoverScale = NODE.HOVER_SCALE;
        });

        this.container.on('pointerout', () => {
            this.hoverScale = 1.0;
        });

        this.container.on('pointertap', (e: FederatedPointerEvent) => {
            e.stopPropagation();
            onSelect(this.exp);
        });
    }

    public updateOrientation(isPortrait: boolean): void {
        this.baseX = isPortrait ? this.exp.px : this.exp.lx;
        this.baseY = isPortrait ? this.exp.py : this.exp.ly;
    }

    public update(
        effectiveZ: number,
        focalLength: number,
        time: number,
        deltaTime: number,
        centerX: number,
        centerY: number,
        mouseOffsetX: number,
        mouseOffsetY: number,
        design: DesignDimensions
    ): void {
        const scale = focalLength / (focalLength + effectiveZ);

        if (effectiveZ < -focalLength + 100) {
            this.container.visible = false;
            return;
        }

        this.container.visible = true;

        let targetX = centerX + mouseOffsetX;
        let targetY = centerY + mouseOffsetY;

        const marginX = design.width * 0.08;
        const marginY = design.height * 0.08;
        targetX = Math.max(centerX - marginX, Math.min(centerX + marginX, targetX));
        targetY = Math.max(centerY - marginY, Math.min(centerY + marginY, targetY));

        this.container.x += (targetX - this.container.x) * NODE.POSITION_LERP * deltaTime;
        this.container.y += (targetY - this.container.y) * NODE.POSITION_LERP * deltaTime;

        this.container.scale.set(scale);

        const distFromFocus = Math.abs(effectiveZ);
        const focusRange = this.exp.id === 'intro' ? NODE.INTRO_FOCUS_RANGE : NODE.FOCUS_RANGE;
        const isInFocus = distFromFocus < focusRange;
        const isPreview = effectiveZ > 0 && effectiveZ < NODE.PREVIEW_RANGE && !isInFocus;

        if (isInFocus) {
            let alpha = 1 - (distFromFocus / focusRange);
            this.container.visible = true;
            this.container.eventMode = 'static';

            const isHovering = this.hoverScale > 1.0;
            let finalScale = isHovering
                ? scale
                : scale * (1 + Math.sin(time * NODE.BREATHING_SPEED) * NODE.BREATHING_AMPLITUDE);

            this.currentHoverScale += (this.hoverScale - this.currentHoverScale) * NODE.HOVER_LERP * deltaTime;
            finalScale *= this.currentHoverScale;

            const textWidth = this.label.width / this.container.scale.x;
            const widthRatio = this.exp.id === 'intro' ? 0.85 : NODE.MAX_WIDTH_RATIO;
            const maxWidth = design.width * widthRatio;
            const maxScale = maxWidth / textWidth;
            finalScale = Math.min(finalScale, maxScale);

            this.container.scale.set(finalScale);

            if (effectiveZ < 0) {
                alpha *= (1 + effectiveZ / NODE.FADE_DISTANCE);
            }

            const saturatedAlpha = Math.pow(alpha, 0.5);
            this.container.alpha = Math.max(0, Math.min(1, saturatedAlpha));

            this.glow.visible = true;
            this.glow.alpha = this.container.alpha * 0.3;
        } else if (isPreview) {
            this.container.visible = true;
            this.container.eventMode = 'none';
            const previewProgress = (effectiveZ - focusRange) / (NODE.PREVIEW_RANGE - focusRange);
            this.container.alpha = NODE.PREVIEW_ALPHA * (1 - previewProgress);
            const previewOffsetY = -200 * previewProgress;
            this.container.y = centerY + previewOffsetY;
        } else {
            this.container.visible = false;
            this.container.eventMode = 'none';
        }
    }

    public getEffectiveZ(currentScrollZ: number): number {
        return this.exp.z - currentScrollZ;
    }

    public snapToTarget(centerX: number, centerY: number, effectiveZ: number): void {
        this.container.x = centerX;
        this.container.y = centerY;

        const scale = CAMERA.FOCAL_LENGTH / (CAMERA.FOCAL_LENGTH + effectiveZ);
        this.container.scale.set(scale);
    }
}
