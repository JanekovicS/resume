<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import PixiCanvas from './components/PixiCanvas.vue';
import OverlayUI from './components/OverlayUI.vue';
import StaticCV from './components/StaticCV.vue';
import ScrollRail from './components/ScrollRail.vue';
import ScrollHint from './components/ScrollHint.vue';
import { experiences, type Experience } from './data';
import type { ScrollInfo } from './pixi/PixiApp';

const selectedExperience = ref<Experience | null>(null);
const isCvOpen = ref(false);
const pixiCanvas = ref<InstanceType<typeof PixiCanvas> | null>(null);

const scrollInfo = ref<ScrollInfo>({ progress: 0, snapIndex: 0, total: experiences.length, hasInteracted: false });

const railLabels = experiences.map(e => e.id === 'intro' ? 'INTRO' : e.year);

const handleScroll = (info: ScrollInfo) => {
  scrollInfo.value = info;
};

const showScrollHint = computed(() =>
  !scrollInfo.value.hasInteracted &&
  scrollInfo.value.snapIndex === 0 &&
  !selectedExperience.value &&
  !isCvOpen.value
);

const showHeader = computed(() =>
  scrollInfo.value.snapIndex !== 0 &&
  !selectedExperience.value &&
  !isCvOpen.value
);

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

// --- Hash routing ---

const indexToHash = (idx: number) => idx <= 0 ? '' : `#${experiences[idx]!.id}`;

const hashToIndex = (hash: string): number => {
  const cleaned = hash.replace(/^#\/?/, '').trim();
  if (!cleaned) return 0;
  const i = experiences.findIndex(e => e.id === cleaned);
  return i >= 0 ? i : 0;
};

const writeHash = (idx: number) => {
  const newHash = indexToHash(idx);
  const current = window.location.hash;
  const target = newHash || (current ? '#' : '');
  if (current !== target) {
    history.replaceState(null, '', target || window.location.pathname + window.location.search);
  }
};

watch(() => scrollInfo.value.snapIndex, (idx, prev) => {
  if (idx !== prev && scrollInfo.value.hasInteracted) writeHash(idx);
});

const onHashChange = () => {
  const idx = hashToIndex(window.location.hash);
  pixiCanvas.value?.scrollToIndex(idx);
};

// --- Keyboard (Escape) ---

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    if (isCvOpen.value) {
      handleCloseCv();
      e.preventDefault();
    } else if (selectedExperience.value) {
      handleClose();
      e.preventDefault();
    }
  }
};

onMounted(() => {
  const initialIdx = hashToIndex(window.location.hash);
  if (initialIdx > 0) {
    requestAnimationFrame(() => pixiCanvas.value?.jumpToIndex(initialIdx));
  }
  window.addEventListener('hashchange', onHashChange);
  window.addEventListener('keydown', onKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('hashchange', onHashChange);
  window.removeEventListener('keydown', onKeyDown);
});
</script>

<template>
  <main class="app-container">
    <PixiCanvas ref="pixiCanvas" :on-select="handleSelect" :on-scroll="handleScroll" />

    <ScrollRail
      :snap-index="scrollInfo.snapIndex"
      :total="scrollInfo.total"
      :progress="scrollInfo.progress"
      :labels="railLabels"
    />

    <ScrollHint :visible="showScrollHint" />

    <OverlayUI
      :selected-experience="selectedExperience"
      :show-header="showHeader"
      :on-close="handleClose"
      :on-continue="handleContinue"
      @open-cv="handleOpenCv"
    />

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
  background-image:
    radial-gradient(ellipse at 20% 100%, rgba(20, 30, 70, 0.45) 0%, transparent 55%),
    radial-gradient(ellipse at 80% 0%, rgba(10, 50, 80, 0.35) 0%, transparent 55%),
    radial-gradient(ellipse at center, rgba(0, 0, 0, 1) 0%, rgba(2, 4, 12, 1) 100%);
  background-attachment: fixed;
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

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
</style>
