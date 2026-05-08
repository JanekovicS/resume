<script setup lang="ts">
defineProps<{
    visible: boolean;
}>();
</script>

<template>
    <Transition name="hint-fade">
        <div v-if="visible" class="scroll-hint" aria-hidden="true">
            <span class="label">SCROLL</span>
            <span class="chevrons">
                <svg class="chev chev-1" viewBox="0 0 24 24" width="20" height="20">
                    <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <svg class="chev chev-2" viewBox="0 0 24 24" width="20" height="20">
                    <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <svg class="chev chev-3" viewBox="0 0 24 24" width="20" height="20">
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

.chevrons {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    height: 38px;
    width: 22px;
    color: #4facfe;
    filter: drop-shadow(0 0 6px rgba(79, 172, 254, 0.3));
}

.chev {
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -10px;
    opacity: 0;
    animation: chev-drop 2.4s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}

.chev-1 { animation-delay: 0s; }
.chev-2 { animation-delay: 0.2s; }
.chev-3 { animation-delay: 0.4s; }

@keyframes chev-drop {
    0%   { transform: translateY(-6px); opacity: 0; }
    30%  { transform: translateY(4px);  opacity: 0.9; }
    70%  { transform: translateY(14px); opacity: 0.4; }
    100% { transform: translateY(22px); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
    .chev {
        animation: none;
        opacity: 0;
    }
    .chev-2 {
        opacity: 0.85;
        transform: translateY(4px);
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
