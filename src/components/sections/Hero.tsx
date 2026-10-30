import { motion } from 'framer-motion';
import { ArrowDown, Sparkles, Mail } from 'lucide-react';
import { useTypewriter } from '@/hooks/useTypewriter';

const stats = [
  { value: '10+', label: 'Years Experience' },
  { value: '100+', label: 'Projects Delivered' },
  { value: '30+', label: 'Live Products' },
];

export default function Hero() {
  const typed = useTypewriter();

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center px-4 pt-24">
      <div className="mx-auto max-w-4xl text-center">
        {/* Profile picture */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mb-8 h-28 w-28 sm:h-32 sm:w-32"
        >
          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-accent-blue to-accent-cyan opacity-70 blur-md" />
          <div className="absolute -inset-[3px] rounded-full bg-gradient-to-br from-accent-blue via-accent-cyan to-accent-blue" />
          <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-base-900 bg-base-700">
            <img
              src="/portrait.webp"
              srcSet="/portrait-256.webp 256w, /portrait.webp 800w"
              sizes="(min-width: 640px) 128px, 112px"
              alt="Ilias Giannaros"
              width={800}
              height={800}
              // React 18 drops fetchPriority on SSR; pass the real HTML attribute.
              {...{ fetchpriority: 'high' }}
              className="h-full w-full object-cover"
            />
          </div>
          <span
            className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-base-900 bg-green-400"
            aria-hidden="true"
          >
            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-green-400" />
          </span>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-gray-300 backdrop-blur-sm"
        >
          <Sparkles className="h-4 w-4 text-accent-cyan" />
          <span>Full-Stack Engineer · AI Augmented Development · Kalamaria, Greece</span>
        </motion.div>

        {/* Name */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <h1 className="font-display text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl">
            <span className="gradient-text">Ilias Giannaros</span>
          </h1>
        </motion.div>

        {/* Typewriter role */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-4 h-8 text-lg font-medium text-gray-300 sm:text-xl md:text-2xl"
        >
          <span className="text-accent-cyan">{typed}</span>
          <span
            className="ml-0.5 inline-block w-0.5 animate-pulse bg-accent-cyan align-middle"
            style={{ height: '1em' }}
          />
        </motion.div>

        {/* Subtext */}
        <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-gray-400 sm:text-lg">
          Building production web apps and custom systems, supercharging the development lifecycle with AI-driven tooling and MCP servers.
        </p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <button
            onClick={() => scrollTo('#projects')}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#f51de3,#c416b9)] px-7 py-3.5 font-semibold text-white shadow-lg shadow-accent-blue/25 transition-all hover:shadow-accent-blue/50 hover:brightness-110 sm:w-auto"
          >
            View Work
            <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </button>
          <button
            onClick={() => scrollTo('#contact')}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-7 py-3.5 font-semibold text-white backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/[0.06] sm:w-auto"
          >
            <Mail className="h-4 w-4" />
            Let's Talk
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="mx-auto mt-14 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass glass-hover px-6 py-5 text-center"
            >
              <div className="font-display text-3xl font-bold text-white sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/15 p-1.5">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="h-2 w-1 rounded-full bg-accent-cyan"
          />
        </div>
      </motion.div>
    </section>
  );
}
