import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';
import { skillTiers } from '@/data/skills';

const tierAccents = [
  { border: 'border-accent-blue/30', glow: 'hover:glow-blue', dot: 'bg-accent-blue' },
  { border: 'border-accent-violet/30', glow: 'hover:glow-violet', dot: 'bg-accent-violet' },
  { border: 'border-accent-cyan/30', glow: 'hover:glow-cyan', dot: 'bg-accent-cyan' },
];

export default function Skills() {
  return (
    <section id="skills" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          label="Skills"
          title="Tech Stack, Tiered"
          description="Not a flat logo grid — skills organized by depth of expertise, from core engineering to AI and tooling."
        />

        <div className="space-y-6">
          {skillTiers.map((tier, i) => {
            const accent = tierAccents[i];
            return (
              <Reveal key={tier.tier} delay={i * 0.15}>
                <div className={`glass glass-hover p-7 ${accent.border}`}>
                  <div className="mb-5 flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${accent.dot} animate-pulse-glow`} />
                    <h3 className="font-display text-lg font-semibold text-white">
                      {tier.tier}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {tier.skills.map((skill) => (
                      <span
                        key={skill}
                        className={`rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-gray-200 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07] hover:text-white ${accent.glow}`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
