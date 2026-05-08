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
        <div class="nodes">
            <template v-for="i in total" :key="i">
                <div
                    class="node"
                    :class="{
                        active: i - 1 === snapIndex,
                        passed: i - 1 < snapIndex
                    }"
                >
                    <span v-if="labels && labels[i - 1]" class="label">{{ labels[i - 1] }}</span>
                </div>
                <div
                    v-if="i < total"
                    class="connector"
                    :class="{
                        passed: i - 1 < snapIndex,
                        current: i - 1 === snapIndex
                    }"
                />
            </template>
        </div>
    </aside>
</template>

<style scoped>
.scroll-rail {
    position: fixed;
    top: 50%;
    right: 2rem;
    transform: translateY(-50%);
    z-index: 12;
    pointer-events: none;
    height: clamp(240px, 46vh, 400px);
    padding: 0.5rem 0;
}

.nodes {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
}

.node {
    position: relative;
    flex: 0 0 auto;
    padding: 0.3rem 0;
    text-align: center;
}

.label {
    font-family: 'Outfit', system-ui, sans-serif;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.42);
    transition:
        color 0.4s cubic-bezier(0.16, 1, 0.3, 1),
        transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
        text-shadow 0.4s ease;
    white-space: nowrap;
    display: block;
    transform-origin: center center;
}

.node.passed .label {
    color: rgba(79, 172, 254, 0.78);
}

.node.active .label {
    color: #e0f3ff;
    transform: scale(1.2);
    text-shadow:
        0 0 14px rgba(79, 172, 254, 0.55),
        0 0 28px rgba(79, 172, 254, 0.25);
}

.connector {
    flex: 1 1 0;
    min-height: 1.2rem;
    width: 1px;
    margin-right: 0;
    background: rgba(255, 255, 255, 0.12);
    transition: background 0.4s ease, box-shadow 0.4s ease;
}

.connector.passed {
    background: #4facfe;
    box-shadow: 0 0 5px rgba(79, 172, 254, 0.4);
}

.connector.current {
    background: linear-gradient(to bottom, #4facfe 0%, rgba(255, 255, 255, 0.12) 100%);
    box-shadow: 0 0 5px rgba(79, 172, 254, 0.25);
}

@media (max-width: 700px) {
    .scroll-rail {
        right: 1rem;
        height: clamp(180px, 38vh, 280px);
    }

    .label {
        display: none;
    }

    .node {
        width: 1px;
    }
}
</style>
