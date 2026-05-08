<script setup lang="ts">
import { fullResume } from '../data';

defineProps<{
  onClose: () => void;
}>();
</script>

<template>
  <div class="static-cv-overlay" role="dialog" aria-modal="true" aria-labelledby="cv-title">
    <div class="cv-container">
      <button class="close-cv" @click="onClose" aria-label="Close">
        <span class="icon">×</span>
      </button>

      <div class="cv-content">
        <header class="cv-header">
          <h1 id="cv-title">{{ fullResume.name }}</h1>
          <div class="contact-info">
            <span>{{ fullResume.location }}</span>
            <span class="dot">•</span>
            <span>{{ fullResume.email }}</span>
            <span class="dot">•</span>
            <a :href="'https://' + fullResume.linkedin" target="_blank">{{ fullResume.linkedin }}</a>
          </div>
        </header>

        <section class="cv-section">
          <h2>SUMMARY</h2>
          <p>{{ fullResume.summary }}</p>
        </section>

        <section class="cv-section">
          <h2>CORE SKILLS</h2>
          <ul class="skills-list">
            <li v-for="skill in fullResume.skills" :key="skill">{{ skill }}</li>
          </ul>
        </section>

        <section class="cv-section">
          <h2>EXPERIENCE</h2>
          <div v-for="exp in fullResume.experience" :key="exp.company" class="experience-block">
            <div class="exp-header">
              <h3>{{ exp.company }}</h3>
              <span class="location">{{ exp.location }}</span>
            </div>

            <div v-for="role in exp.roles" :key="role.title" class="role-block">
              <div class="role-header">
                <h4>{{ role.title }}</h4>
                <span class="period">{{ role.period }}</span>
              </div>
              <ul class="highlights">
                <li v-for="highlight in role.highlights" :key="highlight">{{ highlight }}</li>
              </ul>
            </div>
          </div>
        </section>

        <section class="cv-section">
          <h2>EDUCATION</h2>
          <div v-for="edu in fullResume.education" :key="edu.degree" class="edu-block">
            <div class="edu-header">
              <h3>{{ edu.degree }}</h3>
              <span v-if="edu.period" class="period">{{ edu.period }}</span>
            </div>
            <p v-if="edu.school" class="school">{{ edu.school }}</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.static-cv-overlay {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 40% at 50% 0%, rgba(79, 172, 254, 0.08), transparent 70%),
    radial-gradient(ellipse 60% 30% at 50% 100%, rgba(0, 242, 254, 0.04), transparent 70%),
    #0a0c10;
  z-index: 200;
  overflow-y: auto;
  color: #e0e0e0;
  font-family: 'Outfit', sans-serif;
  padding: clamp(1rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem);
}

.cv-container {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
}

.close-cv {
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  background: transparent;
  border: none;
  padding: 0.25rem;
  width: 32px;
  height: 32px;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  z-index: 1000;
}

.close-cv:hover,
.close-cv:focus-visible {
  color: rgba(255, 255, 255, 0.95);
}

.close-cv .icon {
  font-size: 1.5rem;
  line-height: 1;
  font-weight: 300;
}

.cv-content {
  background: rgba(15, 18, 24, 0.6);
  backdrop-filter: blur(10px);
  padding: clamp(2rem, 8vw, 4rem);
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  clear: both;
}

.cv-header {
  border-bottom: 1px solid #2a2f38;
  padding-bottom: 2rem;
  margin-bottom: 3rem;
  position: relative;
}

.cv-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 80px;
  height: 1px;
  background: linear-gradient(to right, #4facfe, #00f2fe);
}

.cv-header h1 {
  font-size: clamp(2rem, 10vw, 3.5rem);
  margin: 0;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #fff;
  line-height: 1;
}

.contact-info {
  margin-top: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  font-size: 0.9rem;
  opacity: 0.7;
}

.dot {
  opacity: 0.3;
  display: inline-block;
}

.contact-info a {
  color: #4facfe;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s;
}

.contact-info a:hover {
  border-color: #4facfe;
}

.cv-section {
  margin-bottom: 3.5rem;
}

.cv-section h2 {
  font-size: 0.75rem;
  letter-spacing: 0.25em;
  color: #4facfe;
  margin-bottom: 1.5rem;
  padding-left: 1rem;
  text-transform: uppercase;
  position: relative;
}

.cv-section h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, #4facfe, #00f2fe);
  border-radius: 2px;
}

.cv-section p {
  line-height: 1.8;
  font-size: 1.05rem;
  color: #ccc;
}

.skills-list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
}

.skills-list li {
  position: relative;
  padding-left: 1.5rem;
  line-height: 1.5;
  font-size: 0.95rem;
  color: #bbb;
}

.skills-list li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: #4facfe;
  font-weight: bold;
}

.experience-block {
  margin-bottom: 3rem;
}

.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.exp-header h3 {
  font-size: 1.4rem;
  color: #fff;
  margin: 0;
  line-height: 1.2;
}

.location {
  font-size: 0.85rem;
  opacity: 0.5;
  font-weight: 500;
}

.role-block {
  margin-bottom: 2.5rem;
  padding-left: 1.5rem;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.role-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.role-header h4 {
  font-size: 1.1rem;
  color: #4facfe;
  margin: 0;
  line-height: 1.3;
}

.period {
  font-size: 0.8rem;
  opacity: 0.6;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
}

.highlights {
  padding-left: 1.25rem;
  margin: 0;
}

.highlights li {
  margin-bottom: 0.6rem;
  line-height: 1.7;
  font-size: 0.95rem;
  color: #bbb;
}

.edu-block {
  margin-bottom: 2rem;
}

.edu-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.5rem;
}

@media (max-width: 600px) {
  .cv-header h1 {
    font-size: 2.25rem;
  }

  .contact-info {
    flex-direction: column;
    gap: 0.5rem;
  }

  .dot {
    display: none;
  }

  .cv-content {
    padding: 1.5rem;
  }

  .role-block {
    padding-left: 1rem;
  }
}

@media print {
  .static-cv-overlay {
    position: static;
    background: white !important;
    color: #111 !important;
    padding: 0;
    overflow: visible;
  }

  .close-cv {
    display: none !important;
  }

  .cv-container {
    max-width: none;
  }

  .cv-content {
    background: white !important;
    box-shadow: none !important;
    border: none !important;
    padding: 0 !important;
    backdrop-filter: none !important;
    border-radius: 0 !important;
  }

  .cv-header {
    border-bottom: 1px solid #ccc !important;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
  }

  .cv-header::after {
    background: #1565c0 !important;
  }

  .cv-header h1,
  .exp-header h3,
  .edu-header h3 {
    color: #111 !important;
  }

  .cv-section h2 {
    color: #1565c0 !important;
  }

  .cv-section h2::before {
    background: #1565c0 !important;
  }

  .role-header h4 {
    color: #1565c0 !important;
  }

  .cv-section p,
  .skills-list li,
  .highlights li {
    color: #222 !important;
  }

  .skills-list li::before {
    color: #1565c0 !important;
  }

  .contact-info {
    opacity: 1 !important;
    color: #333 !important;
  }

  .contact-info a {
    color: #1565c0 !important;
    border-bottom: none !important;
  }

  .period {
    background: transparent !important;
    opacity: 0.8 !important;
    color: #333 !important;
    padding: 0 !important;
  }

  .location {
    color: #555 !important;
    opacity: 1 !important;
  }

  .role-block {
    border-left-color: #ccc !important;
  }

  .cv-section,
  .experience-block,
  .role-block,
  .edu-block {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .cv-section {
    margin-bottom: 1.5rem;
  }

  a[href]::after {
    content: '';
  }
}
</style>
