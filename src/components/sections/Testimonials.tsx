import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';
import { clientLogos, services } from '@/data/clients';

export default function Testimonials() {
  return (
    <section className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          label="Clients"
          title="Trusted By"
          description="Brands and organizations across eCommerce, culture, education, and services that ship on the systems I build."
        />

        {/* Services snapshot */}
        <Reveal className="mb-10">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {services.map((service) => (
              <span
                key={service}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-gray-300 backdrop-blur-sm"
              >
                {service}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Logo strip */}
        <Reveal delay={0.1}>
          <div className="glass p-8 sm:p-10">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {clientLogos.map((logo, i) => (
                <div
                  key={logo}
                  className="flex items-center justify-center rounded-xl border border-white/[0.04] bg-white/[0.01] px-4 py-6 text-center transition-all duration-300 hover:border-white/10 hover:bg-white/[0.03]"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span className="font-display text-sm font-semibold text-gray-400 transition-colors hover:text-white sm:text-base">
                    {logo}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
