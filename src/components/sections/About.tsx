import { motion } from 'framer-motion';
import { Rocket, Users, GraduationCap, Cpu } from 'lucide-react';
import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';

const highlights = [
  { icon: Rocket, text: 'Founder at Scalepath.ee, Buddystat.com, Agrivate.com and Menuvi.app' },
  { icon: Users, text: 'Co-Founder at Therosapp.eu and Adapedu.com' },
  { icon: GraduationCap, text: 'STEM Instructor' },
  { icon: Cpu, text: 'IoT Researcher' },
];

const techFocus = [
  'Decoupled / headless systems',
  'Custom PHP plugins & WooCommerce extensions',
  'TypeScript / React frontends',
  'MCP servers + custom AI agent skills',
];

export default function About() {
  return (
    <section id="about" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label="About"
          title="The Engineer Behind the Build"
        />

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Bio */}
          <Reveal className="lg:col-span-3" delay={0.1}>
            <div className="glass glass-hover h-full p-8">
              <p className="text-lg leading-relaxed text-gray-300">
                I'm a full-stack developer from Xanthi, Greece, now based in Kalamaria. My
                work spans <span className="text-white font-medium">headless architectures</span>,
                custom WordPress and WooCommerce plugins in PHP, and decoupled{' '}
                <span className="text-white font-medium">React / TypeScript / Vite</span>{' '}
                frontends — not just themes and templates, but engineered systems built for scale.
              </p>
              <p className="mt-4 leading-relaxed text-gray-400">
                Beyond the web, I'm a STEM instructor and IoT researcher pioneering smart
                agriculture solutions. I'm currently building{' '}
                <span className="text-accent-cyan font-medium">MCP servers</span> and custom{' '}
                <span className="text-accent-cyan font-medium">AI agent skills</span> that
                automate development workflows, reporting, compliance, and content pipelines —
                bridging traditional engineering with the agentic future.
              </p>

              {/* Tech focus chips */}
              <div className="mt-6 flex flex-wrap gap-2">
                {techFocus.map((item) => (
                  <span
                    key={item}
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-gray-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Highlights */}
          <Reveal className="lg:col-span-2" delay={0.2}>
            <div className="glass h-full p-8">
              <h3 className="mb-6 font-display text-lg font-semibold text-white">Quick Facts</h3>
              <ul className="space-y-4">
                {highlights.map((item, i) => (
                  <motion.li
                    key={item.text}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i + 0.3 }}
                    className="flex items-center gap-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[linear-gradient(135deg,rgba(245,29,227,0.15),rgba(196,22,185,0.15))]">
                      <item.icon className="h-5 w-5 text-accent-cyan" />
                    </span>
                    <span className="text-sm text-gray-300">{item.text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
