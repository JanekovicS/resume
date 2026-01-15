<script setup lang="ts">
import type { Experience } from '../data';

defineProps<{
    selectedExperience: Experience | null;
    onClose: () => void;
    onContinue: () => void;
}>();
</script>

<template>
    <div class="overlay-ui" :class="{ 'has-selection': !!selectedExperience }">
        <header class="header">
            <h1>SRĐAN JANEKOVIĆ</h1>
            <p>TECHNICAL LEAD • WEB GAMES • HIGH-PERFORMANCE SDKs</p>
        </header>

        <Transition name="overlay-fade">
            <div v-if="selectedExperience" class="detail-card">
                <button class="close-btn" @click="onClose">
                    <span class="close-text">CLOSE</span>
                    <span class="close-icon">×</span>
                </button>

                <div class="card-content">
                    <div class="content-inner">
                        <span class="period">{{ selectedExperience.period }}</span>
                        <h2>{{ selectedExperience.title }}</h2>
                        <h3>{{ selectedExperience.company }}</h3>
                        <div class="line"></div>
                        <p class="description">{{ selectedExperience.description }}</p>

                        <ul v-if="selectedExperience.highlights" class="highlights-list">
                            <li v-for="point in selectedExperience.highlights" :key="point">{{ point }}</li>
                        </ul>

                        <div class="actions">
                            <button class="primary-btn" @click="onContinue">Continue Journey</button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>

        <footer class="footer" :class="{ 'hidden': !!selectedExperience }">
            <button class="ghost-btn" @click="$emit('open-cv')">VIEW FULL CV</button>
        </footer>
    </div>
</template>

<style scoped>
.overlay-ui {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 10;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: white;
    font-family: 'Outfit', system-ui, -apple-system, sans-serif;
}

.header,
.footer {
    transition: opacity 0.3s ease;
}

.header {
    text-align: left;
    margin: 1.5rem 2rem;
    padding-left: 1.25rem;
    pointer-events: none;
}

.footer {
    text-align: center;
}

h1 {
    font-size: clamp(1rem, 2.5vw, 1.4rem);
    margin: 0;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #fff;
    line-height: 1.1;
}

.header p {
    font-size: clamp(0.55rem, 1.2vw, 0.65rem);
    letter-spacing: 0.35em;
    text-transform: uppercase;
    margin: 0.5rem 0 0;
    color: #4facfe;
    font-weight: 700;
    opacity: 0.8;
}

.detail-card {
    position: fixed;
    inset: 0;
    pointer-events: auto;
    background: rgba(10, 12, 16, 0.95);
    backdrop-filter: blur(20px);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    overflow-y: auto;
}

.card-content {
    max-width: 800px;
    width: 100%;
    margin: auto;
    animation: contentSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.content-inner {
    text-align: center;
    padding: 2rem 0;
}

.close-btn {
    position: fixed;
    top: 1.5rem;
    right: 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0.5rem 1rem;
    border-radius: 100px;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    z-index: 101;
}

.close-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
}

.close-text {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.2rem;
}

.close-icon {
    font-size: 1.5rem;
    line-height: 1;
}

.period {
    color: #4facfe;
    font-weight: 600;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    font-size: clamp(0.75rem, 2vw, 1rem);
    display: block;
    margin-bottom: 1rem;
}

h2 {
    font-size: clamp(2rem, 8vw, 4.5rem);
    line-height: 1.1;
    margin: 0;
    font-weight: 900;
}

h3 {
    font-size: clamp(1.1rem, 4vw, 1.5rem);
    font-weight: 400;
    opacity: 0.6;
    margin: 0.5rem 0 0;
}

.line {
    width: 40px;
    height: 3px;
    background: linear-gradient(to right, #4facfe, #00f2fe);
    margin: 2rem auto;
}

.description {
    max-width: 600px;
    margin: 0 auto 2rem;
    line-height: 1.6;
    font-size: clamp(1rem, 3vw, 1.25rem);
    opacity: 0.8;
    color: #e0e0e0;
}

.highlights-list {
    list-style: none;
    padding: 0;
    margin: 0 auto 2.5rem;
    max-width: 500px;
    text-align: left;
}

.highlights-list li {
    position: relative;
    padding-left: 1.75rem;
    margin-bottom: 0.75rem;
    line-height: 1.5;
    font-size: clamp(0.9rem, 2.5vw, 1.1rem);
    opacity: 0.7;
}

.highlights-list li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.6em;
    width: 6px;
    height: 6px;
    background: #4facfe;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(79, 172, 254, 0.5);
}

.primary-btn {
    background: white;
    border: none;
    padding: 1rem 2.5rem;
    border-radius: 100px;
    color: #0a0c10;
    font-weight: 800;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: all 0.3s ease;
}

.primary-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
}

@keyframes contentSlideUp {
    from {
        opacity: 0;
        transform: translateY(40px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.footer {
    padding: 2rem;
    pointer-events: auto;
    transition: all 0.5s ease;
}

.footer.hidden {
    opacity: 0;
    pointer-events: none;
    transform: translateY(20px);
}

.ghost-btn {
    background: rgba(0, 255, 255, 0.03);
    border: 1px solid rgba(0, 255, 255, 0.15);
    color: rgba(224, 255, 255, 0.6);
    padding: 0.5rem 1.5rem;
    border-radius: 100px;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    cursor: pointer;
    transition: all 0.3s ease;
}

.ghost-btn:hover {
    background: rgba(0, 255, 255, 0.08);
    border-color: rgba(0, 255, 255, 0.4);
    color: #e0ffff;
    transform: translateY(-1px);
}

@media (max-width: 600px) {
    .detail-card {
        padding: 1.5rem;
        align-items: flex-start;
    }

    .content-inner {
        text-align: left;
        padding: 4rem 0 2rem;
    }

    .line {
        margin: 1.5rem 0;
    }

    .highlights-list {
        margin-left: 0;
    }
}

/* Animations */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
    transition: opacity 0.6s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
    opacity: 0;
}
</style>
