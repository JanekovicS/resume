import { SCROLL } from './constants';

export class ScrollController {
    private _currentZ: number = 0;
    private _targetZ: number = 0;
    private _prevZ: number = 0;
    private _lastInputTime: number = 0;

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

    public scrollBy(delta: number): void {
        this._targetZ += delta * SCROLL.SCROLL_MULTIPLIER;
        this._targetZ = Math.max(SCROLL.MIN_Z, Math.min(SCROLL.MAX_Z, this._targetZ));
        this._lastInputTime = performance.now();
    }

    public update(deltaTime: number): void {
        this._prevZ = this._currentZ;

        if (performance.now() - this._lastInputTime > SCROLL.SNAP_DELAY_MS) {
            const nearestSnap = SCROLL.SNAP_POINTS.reduce((prev, curr) =>
                Math.abs(curr - this._targetZ) < Math.abs(prev - this._targetZ) ? curr : prev
            );
            this._targetZ += (nearestSnap - this._targetZ) * SCROLL.SNAP_LERP * deltaTime;
        }

        this._currentZ += (this._targetZ - this._currentZ) * SCROLL.SCROLL_LERP * deltaTime;
    }

    public scrollToNext(): void {
        const currentSnap = SCROLL.SNAP_POINTS.find(z => Math.abs(z - this._targetZ) < 100);
        const currentIndex = currentSnap !== undefined ? SCROLL.SNAP_POINTS.indexOf(currentSnap) : -1;

        if (currentIndex >= 0 && currentIndex < SCROLL.SNAP_POINTS.length - 1) {
            this._targetZ = SCROLL.SNAP_POINTS[currentIndex + 1]!;
        }
    }

    public setPosition(z: number): void {
        this._targetZ = Math.max(SCROLL.MIN_Z, Math.min(SCROLL.MAX_Z, z));
        this._currentZ = this._targetZ;
    }
}
