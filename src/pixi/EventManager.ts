import { Container } from 'pixi.js';
import { Comet } from './Comet';
import { UFO } from './UFO';
import type { DesignDimensions } from './types';
import { EVENT } from './constants';

export interface SpaceEvent {
    container: Container;
    done: boolean;
    update(delta: number, scrollZ: number): void;
    getEffectiveZ(scrollZ: number): number;
}

export class EventManager {
    private parent: Container;
    private events: SpaceEvent[] = [];
    private clock: number = 0;
    private nextSpawnTime: number = 0;
    private reducedMotion: boolean = false;
    private initialized: boolean = false;

    constructor(parent: Container) {
        this.parent = parent;
    }

    public setReducedMotion(reduced: boolean): void {
        this.reducedMotion = reduced;
        if (reduced) this.clear();
    }

    public getEvents(): SpaceEvent[] {
        return this.events;
    }

    public update(delta: number, scrollZ: number, design: DesignDimensions): void {
        const dt = delta / 60;
        this.clock += dt;

        if (!this.initialized) {
            this.initialized = true;
            this.nextSpawnTime = this.clock + EVENT.FIRST_DELAY_MIN +
                Math.random() * (EVENT.FIRST_DELAY_MAX - EVENT.FIRST_DELAY_MIN);
        }

        if (!this.reducedMotion && this.clock >= this.nextSpawnTime) {
            this.spawn(design, scrollZ);
            this.scheduleNext();
        }

        for (let i = this.events.length - 1; i >= 0; i--) {
            const e = this.events[i]!;
            e.update(delta, scrollZ);
            if (e.done) {
                this.parent.removeChild(e.container);
                e.container.destroy({ children: true });
                this.events.splice(i, 1);
            }
        }
    }

    public clear(): void {
        for (const e of this.events) {
            this.parent.removeChild(e.container);
            e.container.destroy({ children: true });
        }
        this.events = [];
    }

    private scheduleNext(): void {
        this.nextSpawnTime = this.clock + EVENT.SPAWN_INTERVAL_MIN +
            Math.random() * (EVENT.SPAWN_INTERVAL_MAX - EVENT.SPAWN_INTERVAL_MIN);
    }

    private spawn(design: DesignDimensions, scrollZ: number): void {
        const event: SpaceEvent = Math.random() < EVENT.COMET_PROBABILITY
            ? new Comet(design, scrollZ)
            : new UFO(design, scrollZ);
        this.parent.addChild(event.container);
        this.events.push(event);
    }
}
