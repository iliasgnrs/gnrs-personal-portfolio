import Reveal from './Reveal';

interface SectionHeadingProps {
  label: string;
  title: string;
  description?: string;
}

export default function SectionHeading({ label, title, description }: SectionHeadingProps) {
  return (
    <Reveal className="mb-12 text-center">
      <span className="inline-block rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-accent-cyan backdrop-blur-sm">
        {label}
      </span>
      <h2 className="mt-5 font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mx-auto mt-4 max-w-2xl text-balance text-gray-400 leading-relaxed">
          {description}
        </p>
      )}
    </Reveal>
  );
}
