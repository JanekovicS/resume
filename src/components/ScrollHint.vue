<script setup lang="ts">
defineProps<{
    visible: boolean;
}>();
</script>

<template>
    <Transition name="hint-fade">
        <div v-if="visible" class="scroll-hint" aria-hidden="true">
            <span class="label">SCROLL</span>
            <span class="chevron">
                <svg viewBox="0 0 24 24" width="22" height="22">
                    <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </span>
        </div>
    </Transition>
</template>

<style scoped>
.scroll-hint {
    position: fixed;
    left: 50%;
    bottom: 5.5rem;
    transform: translateX(-50%);
    z-index: 11;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    color: rgba(224, 255, 255, 0.55);
}

.label {
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.4em;
    text-transform: uppercase;
}

.chevron {
    display: inline-flex;
    color: #4facfe;
    animation: drop 2.6s ease-in-out infinite;
    filter: drop-shadow(0 0 6px rgba(79, 172, 254, 0.35));
}

@keyframes drop {
    0%   { transform: translateY(-4px); opacity: 0; }
    25%  { transform: translateY(2px);  opacity: 0.85; }
    55%  { transform: translateY(14px); opacity: 0; }
    100% { transform: translateY(-4px); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
    .chevron {
        animation: none;
        opacity: 0.85;
        transform: translateY(2px);
    }
}

.hint-fade-enter-active,
.hint-fade-leave-active {
    transition: opacity 0.6s ease, transform 0.6s ease;
}

.hint-fade-enter-from,
.hint-fade-leave-to {
    opacity: 0;
    transform: translate(-50%, 8px);
}

@media (max-width: 600px) {
    .scroll-hint {
        bottom: 4rem;
    }
}
</style>
