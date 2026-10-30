import { useCallback, useState } from "react";
import { Linkedin, Mail, Github } from "lucide-react";
import LegalModal from "@/components/LegalModal";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Expertise", href: "#expertise" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const [legalPage, setLegalPage] = useState<"privacy" | "terms" | null>(null);
  const closeLegal = useCallback(() => setLegalPage(null), []);

  const handleNav = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-white/[0.06] px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/logo.webp" alt="GNRS" width={72} height={36} className="h-9 w-auto" decoding="async" />
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Socials */}
          <div className="flex items-center gap-3">
            <a
              href="mailto:ilias@gnrs.gr"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-gray-400 transition-all hover:border-white/20 hover:text-white"
              aria-label="Email"
            >
              <Mail className="h-4 w-4" />
            </a>
            <a
              href="https://gr.linkedin.com/in/iliasgnrs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-gray-400 transition-all hover:border-white/20 hover:text-white"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="https://github.com/iliasgnrs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-gray-400 transition-all hover:border-white/20 hover:text-white"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-white/[0.04] pt-6 text-xs text-gray-400 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Ilias Giannaros (GNRS). All rights
            reserved.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLegalPage("privacy")}
              className="transition-colors hover:text-white"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setLegalPage("terms")}
              className="transition-colors hover:text-white"
            >
              Terms of Use
            </button>
          </div>
        </div>
      </div>

      <LegalModal page={legalPage} onClose={closeLegal} />
    </footer>
  );
}
