import { motion } from 'framer-motion';
import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';
import { expertise } from '@/data/expertise';

const glowMap = {
  blue: 'group-hover:glow-blue',
  violet: 'group-hover:glow-violet',
  cyan: 'group-hover:glow-cyan',
};

const iconBgMap = {
  blue: 'from-accent-blue/20 to-accent-blue/5 text-accent-blue',
  violet: 'from-accent-violet/20 to-accent-violet/5 text-accent-violet',
  cyan: 'from-accent-cyan/20 to-accent-cyan/5 text-accent-cyan',
};

const accentOrder: ('blue' | 'violet' | 'cyan')[] = [
  'blue', 'violet', 'cyan', 'blue', 'violet', 'cyan', 'blue', 'violet',
];

export default function Expertise() {
  return (
    <section id="expertise" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label="Core Expertise"
          title="What I Engineer"
          description="Eight pillars spanning headless web architecture, eCommerce systems, and the frontier of AI agent development."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {expertise.map((item, i) => {
            const accent = accentOrder[i % accentOrder.length];
            return (
              <Reveal key={item.title} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`group glass glass-hover h-full p-6 ${glowMap[accent]}`}
                >
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${iconBgMap[accent]} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">
                    {item.description}
                  </p>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
