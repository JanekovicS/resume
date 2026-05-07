<script setup lang="ts">
defineProps<{
    snapIndex: number;
    total: number;
    progress: number;
    labels?: string[];
}>();
</script>

<template>
    <aside class="scroll-rail" aria-hidden="true">
        <div class="track">
            <div class="fill" :style="{ height: `${progress * 100}%` }"></div>
        </div>
        <ol class="dots">
            <li
                v-for="i in total"
                :key="i"
                :class="{ active: i - 1 === snapIndex, passed: i - 1 < snapIndex }"
            >
                <span v-if="labels && labels[i - 1]" class="label">{{ labels[i - 1] }}</span>
            </li>
        </ol>
    </aside>
</template>

<style scoped>
.scroll-rail {
    position: fixed;
    top: 50%;
    right: 1.75rem;
    transform: translateY(-50%);
    z-index: 12;
    pointer-events: none;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    height: clamp(160px, 36vh, 300px);
}

.track {
    position: relative;
    width: 1px;
    height: 100%;
    background: rgba(255, 255, 255, 0.08);
    overflow: hidden;
}

.fill {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(to bottom, #4facfe, #00f2fe);
    transition: height 0.18s ease;
    box-shadow: 0 0 6px rgba(79, 172, 254, 0.45);
}

.dots {
    list-style: none;
    margin: 0;
    padding: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.dots li {
    position: relative;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.18);
    transition: background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
}

.dots li.passed {
    background: rgba(79, 172, 254, 0.55);
}

.dots li.active {
    background: #4facfe;
    transform: scale(1.6);
    box-shadow: 0 0 12px rgba(79, 172, 254, 0.7);
}

.label {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    font-family: 'Outfit', system-ui, sans-serif;
    font-size: 0.55rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.35);
    transition: color 0.3s ease, opacity 0.3s ease;
    white-space: nowrap;
}

.dots li.passed .label {
    color: rgba(79, 172, 254, 0.6);
}

.dots li.active .label {
    color: #e0f3ff;
    transform: translateY(-50%) scale(0.625);
    transform-origin: right center;
}

@media (max-width: 700px) {
    .label {
        display: none;
    }
}

@media (max-width: 600px) {
    .scroll-rail {
        right: 0.9rem;
        height: clamp(140px, 32vh, 240px);
    }
}
</style>
