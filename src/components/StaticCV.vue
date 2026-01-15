<script setup lang="ts">
import { fullResume } from '../data';

defineProps<{
  onClose: () => void;
}>();
</script>

<template>
  <div class="static-cv-overlay">
    <div class="cv-container">
      <button class="close-cv" @click="onClose">
        <span>BACK TO JOURNEY</span>
        <span class="icon">×</span>
      </button>

      <div class="cv-content">
        <header class="cv-header">
          <h1>{{ fullResume.name }}</h1>
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
  background: #0a0a0a;
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
  position: sticky;
  top: -1rem;
  float: right;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.6rem 1.25rem;
  border-radius: 100px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  transition: all 0.3s ease;
  backdrop-filter: blur(20px);
  z-index: 1000;
  margin-bottom: 2rem;
}

.close-cv:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.cv-content {
  background: #111;
  padding: clamp(2rem, 8vw, 4rem);
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  clear: both;
}

.cv-header {
  border-bottom: 2px solid #333;
  padding-bottom: 2rem;
  margin-bottom: 3rem;
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
  border-left: 3px solid #4facfe;
  padding-left: 1rem;
  text-transform: uppercase;
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
</style>
