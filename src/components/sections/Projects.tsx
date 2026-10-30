import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';
import { projects, projectFilters } from '@/data/projects';

const accentGlow = {
  blue: 'hover:glow-blue',
  violet: 'hover:glow-violet',
  cyan: 'hover:glow-cyan',
};

const accentBar = {
  blue: 'from-accent-blue to-accent-cyan',
  violet: 'from-accent-violet to-accent-blue',
  cyan: 'from-accent-cyan to-accent-violet',
};

export default function Projects() {
  const [filter, setFilter] = useState<string>('All');

  const filtered = useMemo(() => {
    if (filter === 'All') return projects;
    return projects.filter((p) => p.categories.includes(filter));
  }, [filter]);

  return (
    <section id="projects" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label="Featured Work"
          title="Projects & Products"
          description="A selection of headless SaaS platforms, eCommerce builds, PWAs, and WordPress systems shipped over a decade of engineering."
        />

        {/* Filter pills */}
        <Reveal className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {projectFilters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all ${
                filter === f
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {filter === f && (
                <motion.span
                  layoutId="filterActive"
                  className="absolute inset-0 -z-10 rounded-full bg-[linear-gradient(135deg,rgba(245,29,227,0.3),rgba(196,22,185,0.3))] border border-white/10"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              {filter !== f && (
                <span className="absolute inset-0 -z-10 rounded-full border border-white/[0.06] bg-white/[0.02]" />
              )}
              {f}
            </button>
          ))}
        </Reveal>

        {/* Grid */}
        <motion.div
          layout
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.article
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className={`group glass glass-hover flex flex-col overflow-hidden p-6 ${accentGlow[project.accent]}`}
              >
                <span className={`mb-4 block h-1 w-12 rounded-full bg-gradient-to-r ${accentBar[project.accent]}`} />

                <h3 className="font-display text-base font-semibold leading-tight text-white">
                  {project.title}
                </h3>
                <p className="mt-1.5 text-sm text-gray-400">{project.subtitle}</p>

                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-xs text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Link */}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto flex items-center gap-1.5 pt-4 text-sm font-medium text-accent-cyan transition-colors hover:text-white"
                  >
                    Visit Live
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
