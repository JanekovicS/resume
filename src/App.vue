<script setup lang="ts">
import { ref, watch } from 'vue';
import PixiCanvas from './components/PixiCanvas.vue';
import OverlayUI from './components/OverlayUI.vue';
import StaticCV from './components/StaticCV.vue';
import type { Experience } from './data';

const selectedExperience = ref<Experience | null>(null);
const isCvOpen = ref(false);
const pixiCanvas = ref<InstanceType<typeof PixiCanvas> | null>(null);

const handleSelect = (exp: Experience | null) => {
  selectedExperience.value = exp;
};

const handleClose = () => {
  selectedExperience.value = null;
};

const handleContinue = () => {
  pixiCanvas.value?.scrollToNextYear();
  selectedExperience.value = null;
};

const handleOpenCv = () => {
  isCvOpen.value = true;
  pixiCanvas.value?.pause();
};

const handleCloseCv = () => {
  isCvOpen.value = false;
  pixiCanvas.value?.resume();
};

watch(selectedExperience, (newVal) => {
  if (newVal || isCvOpen.value) {
    pixiCanvas.value?.pause();
  } else {
    pixiCanvas.value?.resume();
  }
});
</script>

<template>
  <main class="app-container">
    <PixiCanvas ref="pixiCanvas" :on-select="handleSelect" />
    <OverlayUI :selected-experience="selectedExperience" :on-close="handleClose" :on-continue="handleContinue"
      @open-cv="handleOpenCv" />

    <Transition name="fade">
      <StaticCV v-if="isCvOpen" :on-close="handleCloseCv" />
    </Transition>
  </main>
</template>

<style>
:root {
  color-scheme: dark;
}

body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #000000;
}

.app-container {
  width: 100vw;
  height: 100vh;
  position: relative;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
