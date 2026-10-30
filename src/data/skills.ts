export interface SkillTier {
  tier: string;
  skills: string[];
}

export const skillTiers: SkillTier[] = [
  {
    tier: 'Core Engineering',
    skills: ['TypeScript', 'React', 'Vite', 'Capacitor', 'PHP', 'WordPress', 'WooCommerce', 'JavaScript', 'Vue'],
  },
  {
    tier: 'AI & Automation',
    skills: ['MCP', 'Custom AI Agent Skills', 'LLM Integration'],
  },
  {
    tier: 'Tools & Platforms',
    skills: ['Figma', 'Canva', 'Git', 'VS Code', 'Hetzner', 'Cloudflare'],
  },
];
