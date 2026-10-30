import { motion } from 'framer-motion';
import { Briefcase, GraduationCap } from 'lucide-react';
import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';
import { timeline } from '@/data/timeline';

export default function Experience() {
  return (
    <section id="experience" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          label="Experience"
          title="Journey & Timeline"
          description="From cloud hosting entrepreneurship to STEM education and IoT research — the path that shaped a full-stack engineering career."
        />

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-accent-blue via-accent-violet to-accent-cyan opacity-40 sm:left-1/2 sm:-translate-x-1/2" />

          <div className="space-y-8">
            {timeline.map((item, i) => {
              const isLeft = i % 2 === 0;
              const Icon = item.type === 'education' ? GraduationCap : Briefcase;

              return (
                <Reveal key={`${item.role}-${i}`} delay={i * 0.05}>
                  <div
                    className={`relative flex items-start gap-6 sm:gap-0 ${
                      isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'
                    }`}
                  >
                    {/* Node */}
                    <div className="absolute left-4 top-1 z-10 -translate-x-1/2 sm:left-1/2">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: i * 0.05 }}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-base-700 shadow-lg"
                      >
                        <Icon className="h-4 w-4 text-accent-cyan" />
                      </motion.div>
                    </div>

                    {/* Card */}
                    <div
                      className={`ml-12 w-full sm:ml-0 sm:w-[calc(50%-2rem)] ${
                        isLeft ? 'sm:pr-8 sm:text-right' : 'sm:pl-8'
                      }`}
                    >
                      <div className="glass glass-hover p-5">
                        <span className="text-xs font-medium uppercase tracking-wider text-accent-cyan">
                          {item.period || (item.type === 'education' ? 'Education' : 'Ongoing')}
                        </span>
                        <h3 className="mt-1.5 font-display text-base font-semibold text-white">
                          {item.role}
                        </h3>
                        <p className="text-sm font-medium text-gray-300">{item.org}</p>
                        <p className="mt-2 text-sm leading-relaxed text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Spacer for the other half */}
                    <div className="hidden sm:block sm:w-[calc(50%-2rem)]" />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
