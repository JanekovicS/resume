import { SCROLL } from './constants';

export class ScrollController {
    private _currentZ: number = 0;
    private _targetZ: number = 0;
    private _prevZ: number = 0;
    private _lastInputTime: number = 0;
    private _hasInteracted: boolean = false;
    private _reducedMotion: boolean = false;

    public get currentZ(): number {
        return this._currentZ;
    }

    public get targetZ(): number {
        return this._targetZ;
    }

    public get lastInputTime(): number {
        return this._lastInputTime;
    }

    public get velocity(): number {
        return this._currentZ - this._prevZ;
    }

    public get progress(): number {
        return Math.max(0, Math.min(1, this._currentZ / SCROLL.MAX_Z));
    }

    public get snapIndex(): number {
        let nearest = 0;
        let minDist = Infinity;
        for (let i = 0; i < SCROLL.SNAP_POINTS.length; i++) {
            const d = Math.abs(SCROLL.SNAP_POINTS[i]! - this._currentZ);
            if (d < minDist) { minDist = d; nearest = i; }
        }
        return nearest;
    }

    public get hasInteracted(): boolean {
        return this._hasInteracted;
    }

    public setReducedMotion(value: boolean): void {
        this._reducedMotion = value;
    }

    public scrollBy(delta: number): void {
        this._targetZ += delta * SCROLL.SCROLL_MULTIPLIER;
        this._targetZ = Math.max(SCROLL.MIN_Z, Math.min(SCROLL.MAX_Z, this._targetZ));
        this._lastInputTime = performance.now();
        this._hasInteracted = true;
    }

    public update(deltaTime: number): void {
        this._prevZ = this._currentZ;

        if (this._reducedMotion) {
            const idx = this.targetSnapIndex();
            this._targetZ = SCROLL.SNAP_POINTS[idx]!;
            this._currentZ = this._targetZ;
            return;
        }

        if (performance.now() - this._lastInputTime > SCROLL.SNAP_DELAY_MS) {
            const nearestSnap = SCROLL.SNAP_POINTS.reduce((prev, curr) =>
                Math.abs(curr - this._targetZ) < Math.abs(prev - this._targetZ) ? curr : prev
            );
            this._targetZ += (nearestSnap - this._targetZ) * SCROLL.SNAP_LERP * deltaTime;
        }

        this._currentZ += (this._targetZ - this._currentZ) * SCROLL.SCROLL_LERP * deltaTime;
    }

    private targetSnapIndex(): number {
        let nearest = 0;
        let minDist = Infinity;
        for (let i = 0; i < SCROLL.SNAP_POINTS.length; i++) {
            const d = Math.abs(SCROLL.SNAP_POINTS[i]! - this._targetZ);
            if (d < minDist) { minDist = d; nearest = i; }
        }
        return nearest;
    }

    public scrollToNext(): void {
        this.scrollToIndex(this.targetSnapIndex() + 1);
    }

    public scrollToPrev(): void {
        this.scrollToIndex(this.targetSnapIndex() - 1);
    }

    public scrollToIndex(i: number): void {
        const clamped = Math.max(0, Math.min(SCROLL.SNAP_POINTS.length - 1, i));
        this._targetZ = SCROLL.SNAP_POINTS[clamped]!;
        this._lastInputTime = performance.now();
        this._hasInteracted = true;
    }

    public scrollToFirst(): void {
        this.scrollToIndex(0);
    }

    public scrollToLast(): void {
        this.scrollToIndex(SCROLL.SNAP_POINTS.length - 1);
    }

    public jumpToIndex(i: number): void {
        if (i < 0 || i >= SCROLL.SNAP_POINTS.length) return;
        this._targetZ = SCROLL.SNAP_POINTS[i]!;
        this._currentZ = this._targetZ;
    }

    public setPosition(z: number): void {
        this._targetZ = Math.max(SCROLL.MIN_Z, Math.min(SCROLL.MAX_Z, z));
        this._currentZ = this._targetZ;
    }
}
