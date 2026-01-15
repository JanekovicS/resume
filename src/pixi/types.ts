import type { Container } from 'pixi.js';
import type { Experience } from '../data';

export interface DesignDimensions {
    width: number;
    height: number;
}

export interface TimelineNodeData {
    container: Container;
    exp: Experience;
    baseX: number;
    baseY: number;
}

export interface StarParticle {
    x: number;
    y: number;
    alpha: number;
    baseAlpha: number;
    blinkSpeed: number;
    blinkOffset: number;
}
