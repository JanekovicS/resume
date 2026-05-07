export interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  year: string;
  description: string;
  highlights?: string[];
  tags?: string[];
  color: number;
  lx: number;
  ly: number;
  px: number;
  py: number;
  z: number;
}

export const experiences: Experience[] = [
  {
    id: 'intro',
    title: 'Srđan Janeković',
    company: 'Technical Lead | Web Games',
    period: '2013 – Present',
    year: 'SCROLL TO START',
    description: '12+ years delivering digital games and web-based products. Specialist in JavaScript/TypeScript, Phaser, and high-performance SDKs.',
    highlights: [
      'Web games & UI systems (Phaser, PixiJS)',
      'TypeScript, Vue.js, modern frontend architecture',
      'Platform / SDK engineering & developer tooling',
      'Technical delivery in regulated environments'
    ],
    tags: ['TypeScript', 'Phaser', 'Vue 3', 'SDK', 'Vite'],
    color: 0xebf7ff,
    lx: 960,
    ly: 540,
    px: 375,
    py: 667,
    z: 0,
  },
  {
    id: 'education',
    title: 'B.S., Information Technology',
    company: 'ITS (Information Technology School)',
    period: '2009 - 2013',
    year: '2009',
    description: 'Foundation in IT and software engineering — the launchpad for a career in production game development.',
    highlights: [
      'B.S. in Information Technology',
      'Focus on Applicative Software engineering',
      'Practical, project-based curriculum'
    ],
    tags: ['B.S. IT', 'Software Engineering'],
    color: 0x90caf9,
    lx: 960,
    ly: 540,
    px: 375,
    py: 667,
    z: 1500,
  },
  {
    id: 'novomatic',
    title: 'Software Developer',
    company: 'NOVOMATIC LOTTERY SOLUTIONS',
    period: 'Apr 2013 - Dec 2019',
    year: '2013',
    description: 'Developed eInstant lottery games across multiple tech generations (Flex -> CreateJS -> Phaser). Supported end-to-end delivery in regulated environments.',
    highlights: [
      'Developed games across multiple tech generations',
      'Built logistics web applications (React)',
      'Supported end-to-end delivery in regulated environments',
      'Maintenance and debugging of legacy components'
    ],
    tags: ['Phaser', 'CreateJS', 'Flex', 'React', 'Lottery / Regulated'],
    color: 0x42a5f5,
    lx: 960,
    ly: 540,
    px: 375,
    py: 667,
    z: 3000,
  },
  {
    id: 'pollard-senior',
    title: 'Senior Software Engineer',
    company: 'Pollard Digital Solutions',
    period: 'Dec 2019 - Oct 2021',
    year: '2019',
    description: 'Delivered production features for eInstant games. Built reusable modules and improved build/release workflows that shaped the studio SDK foundations.',
    highlights: [
      'Delivered production features for eInstant games',
      'Built reusable modules and SDK foundations',
      'Improved build/release workflows',
      'Collaborated on early studio ramp-up'
    ],
    tags: ['Phaser', 'TypeScript', 'Build Tooling', 'Reusable Modules'],
    color: 0x2196f3,
    lx: 960,
    ly: 540,
    px: 375,
    py: 667,
    z: 4500,
  },
  {
    id: 'pollard-lead',
    title: 'Technical Lead',
    company: 'Pollard Digital Solutions',
    period: 'Oct 2021 - Present',
    year: '2021',
    description: 'Owned a studio-wide Game Development SDK. Delivered shared frameworks, UI kits, and automated asset pipelines. Led technical delivery of complex, feature-defining games.',
    highlights: [
      'Created and owned studio-wide Game Dev SDK',
      'Standardized architecture and tooling across teams',
      'Built automated asset pipelines and UI kits',
      'Led delivery of complex games (jackpots, bonus logic)'
    ],
    tags: ['SDK Owner', 'TypeScript', 'Vue 3', 'Vite Plugins', 'CI/CD', 'Mentoring'],
    color: 0x1565c0,
    lx: 960,
    ly: 540,
    px: 375,
    py: 667,
    z: 6000,
  }
];

export const fullResume = {
  name: 'Srđan Janeković',
  location: 'Belgrade, Serbia',
  email: 'srdjan.janekovic@gmail.com',
  linkedin: 'www.linkedin.com/in/srdjan-janekovic-47711862',
  summary: 'Technical Lead with 12+ years of professional experience delivering digital games and web-based products in regulated/lottery environments. Strong JavaScript/TypeScript engineering and platform ownership, focused on scalable SDKs/frameworks, developer experience, release discipline, and performance. Effective cross-functional partner, translating design intent into polished, responsive UI through close collaboration with designers (Figma handoff, specs, iteration).',
  skills: [
    'Languages: TypeScript, JavaScript, SQL',
    'Frameworks: Vue 3, Phaser, PixiJS, React',
    'Game engineering: UI systems, performance, responsive layout, debugging',
    'Tooling: Vite, Rollup, custom plugins, code generation',
    'Platform / SDK: shared libraries, CLIs, templates, asset pipelines, docs',
    'Delivery: CI/CD, release management, build standardization',
    'Collaboration: Figma handoff, interaction specs, design fidelity'
  ],
  experience: [
    {
      company: 'Pollard Digital Solutions – Europe',
      location: 'Belgrade, Serbia',
      roles: [
        {
          title: 'Technical Lead for Digital Games Studio',
          period: 'Oct 2021 – Present',
          highlights: [
            'Created from scratch and owned a studio-wide Game Development SDK used to build and ship all digital games.',
            'Delivered core capabilities: shared framework, game template + CLI, Phaser scene architecture, UI kit, localization, asset pipeline.',
            'Built and maintained SDK documentation as a VitePress static site.',
            'Built a Vue.js game-wrapper component for platform integration.',
            'Delivered POC/MVP Vue.js Backoffice application for RGS.',
            'Led technical delivery of complex games (jackpots, bonus games, special symbols).',
            'Mentored developers and QAs; partnered with designers via Figma.'
          ]
        },
        {
          title: 'Senior Software Engineer',
          period: 'Dec 2019 – Oct 2021',
          highlights: [
            'Delivered production features across eInstant games and platform components.',
            'Built reusable modules and improved build/release workflows.',
            'Contributed to early studio ramp-up and interview support.'
          ]
        }
      ]
    },
    {
      company: 'NOVOMATIC LOTTERY SOLUTIONS NORTH AMERICA, LLC',
      location: 'Belgrade, Serbia',
      roles: [
        {
          title: 'Software Developer',
          period: 'Apr 2013 – Dec 2019',
          highlights: [
            'Developed and maintained eInstant lottery games (Flex -> CreateJS -> Phaser).',
            'Delivered lottery logistics web applications (React) and related tooling.',
            'Supported end-to-end delivery: implementation, debugging, maintenance, and releases.'
          ]
        }
      ]
    }
  ],
  education: [
    {
      degree: 'B.S., Information Technology',
      school: 'ITS (Information Technology School)',
      period: '2009 – 2013'
    }
  ]
};
