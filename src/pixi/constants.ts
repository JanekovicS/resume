export const DESIGN = {
    LANDSCAPE: { width: 1920, height: 1080 },
    PORTRAIT: { width: 750, height: 1334 },
} as const;

export const SCROLL = {
    SNAP_POINTS: [0, 1500, 3000, 4500, 6000, 7500],
    MIN_Z: 0,
    MAX_Z: 7500,
    SCROLL_MULTIPLIER: 2,
    SNAP_DELAY_MS: 400,
    SNAP_LERP: 0.15,
    SCROLL_LERP: 0.12,
} as const;

export const CAMERA = {
    FOCAL_LENGTH: 1000,
} as const;

export const STARFIELD = {
    PARTICLE_COUNT: 200,
    COLORS: [0xffffff, 0xfffacd, 0xadd8e6, 0xd4a574],
    MIN_SIZE: 0.5,
    MAX_SIZE: 2.5,
    MIN_ALPHA: 0.2,
    MAX_ALPHA: 0.8,
    MIN_BLINK_SPEED: 1,
    MAX_BLINK_SPEED: 4,
    PARALLAX_X: 18,
    PARALLAX_Y: 12,
} as const;

export const NODE = {
    FOCUS_RANGE: 750,
    INTRO_FOCUS_RANGE: 1200,
    PREVIEW_RANGE: 1800,
    PREVIEW_ALPHA: 0.45,
    BREATHING_AMPLITUDE: 0.04,
    BREATHING_SPEED: 3,
    HOVER_SCALE: 1.08,
    HOVER_LERP: 0.2,
    POSITION_LERP: 0.2,
    MAX_WIDTH_RATIO: 0.9,
    FADE_DISTANCE: 800,
    PARALLAX_X: 35,
    PARALLAX_Y: 22,
} as const;

export const CONSTELLATION = {
    COLOR: 0x4facfe,
    ALPHA: 0.35,
    WIDTH: 1.5,
} as const;
