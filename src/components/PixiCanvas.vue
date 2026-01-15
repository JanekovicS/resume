<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { PixiApp } from '../pixi/PixiApp';
import type { Experience } from '../data';

const props = defineProps<{
    onSelect: (exp: Experience | null) => void;
}>();

const pixiContainer = ref<HTMLElement | null>(null);
let pixiApp: PixiApp | null = null;

onMounted(() => {
    if (pixiContainer.value) {
        pixiApp = new PixiApp(pixiContainer.value, props.onSelect);
    }
});

onUnmounted(() => {
    if (pixiApp) {
        pixiApp.destroy();
    }
});

defineExpose({
    pause: () => pixiApp?.pause(),
    resume: () => pixiApp?.resume(),
    scrollToNextYear: () => pixiApp?.scrollToNextYear()
});
</script>

<template>
    <div ref="pixiContainer" class="pixi-container"></div>
</template>

<style scoped>
.pixi-container {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 0;
}
</style>
