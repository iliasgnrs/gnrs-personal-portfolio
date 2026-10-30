export interface TimelineItem {
  role: string;
  org: string;
  period: string;
  description: string;
  type: 'work' | 'education';
}

export const timeline: TimelineItem[] = [
  {
    role: 'Full-Stack Developer',
    org: 'Uphostt — Cloud Hosting',
    period: 'Owner',
    description:
      'Leading development of cloud hosting platforms and headless web architectures.',
    type: 'work',
  },
  {
    role: 'Founder & Engineer',
    org: 'Agrivate — Smart Agriculture Solutions',
    period: 'Owner',
    description:
      'Pioneering IoT-driven smart agriculture solutions, IoT hardware and software solutions for the agri-tech sector.',
    type: 'work',
  },
  {
    role: 'STEM Instructor',
    org: 'Anatolia College',
    period: '2022 — Present',
    description:
      'Teaching robotics, programming, and engineering principles; mentoring FIRST® LEGO® League teams.',
    type: 'work',
  },
  {
    role: 'Owner',
    org: 'Scalepath.ee',
    period: 'Owner',
    description:
      'European technology venture hub powering next-generation SaaS platforms, smart IoT ecosystems, and bespoke web developments.',
    type: 'work',
  },
  {
    role: 'Team Mentor & Regional Co-Host',
    org: 'FIRST® LEGO® League Greece',
    period: '2017 — 2024',
    description:
      'Mentoring robotics teams and co-hosting regional tournaments across Greece.',
    type: 'work',
  },
  {
    role: 'Web Design & Development',
    org: 'Berlin, Germany',
    period: '2015 — 2017',
    description: 'Professional training in web design, development, and modern frontend frameworks.',
    type: 'education',
  },
  {
    role: 'Networking & Cybersecurity',
    org: 'Munich, Germany',
    period: '2015 — 2017',
    description: 'Studies in network infrastructure, security protocols, and system administration.',
    type: 'education',
  },
  {
    role: 'Cloud Computing',
    org: 'Udacity',
    period: '',
    description: 'Certification in cloud architecture, deployment, and scalable infrastructure.',
    type: 'education',
  },
];
