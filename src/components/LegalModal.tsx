import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type LegalPage = "privacy" | "terms" | null;

interface LegalModalProps {
  page: LegalPage;
  onClose: () => void;
}

const content: Record<
  "privacy" | "terms",
  { title: string; sections: { heading: string; body: string }[] }
> = {
  privacy: {
    title: "Privacy Policy",
    sections: [
      {
        heading: "Introduction",
        body: "This Privacy Policy explains how Ilias Giannaros (GNRS) collects, uses, and protects information you provide through this website, accessible at gnrs.gr. By using this site, you agree to the practices described here.",
      },
      {
        heading: "Information We Collect",
        body: "When you submit the contact form, I collect your name, email address, phone number (if provided), subject, and message content. This information is used solely to respond to your inquiry. No payment or billing data is collected through this website.",
      },
      {
        heading: "How We Use Your Information",
        body: "Your submitted information is used exclusively to reply to your message and discuss potential projects or collaborations. I do not sell, rent, or share your personal data with third parties for marketing purposes.",
      },
      {
        heading: "Data Storage & Security",
        body: "Contact submissions are transmitted securely and stored in a customer relationship management system (HubSpot) accessible only to the site owner. Your data is retained only as long as necessary to fulfill the purpose of your inquiry.",
      },
      {
        heading: "Cookies & Analytics",
        body: "This website uses Buddystat (buddystat.com), a cookie-free web analytics service, to record aggregate traffic data such as page views, referring sites, device type, and web vitals. Buddystat stores a pseudonymous visitor identifier in your browser’s local storage. Session replay is disabled and all form inputs are masked, so anything you type into the contact form is never captured. No advertising or cross-site tracking cookies are used, and analytics data is not sold or shared with third parties. This processing relies on legitimate interest under GDPR; you may object at any time by emailing ilias@gnrs.gr.",
      },
      {
        heading: "Your Rights",
        body: "Under GDPR, you have the right to request access to, correction of, or deletion of your personal data. To exercise any of these rights, contact me at ilias@gnrs.gr.",
      },
      {
        heading: "Contact",
        body: "For any questions about this Privacy Policy, email ilias@gnrs.gr.",
      },
    ],
  },
  terms: {
    title: "Terms of Use",
    sections: [
      {
        heading: "Acceptance of Terms",
        body: "By accessing and using gnrs.gr, you accept and agree to be bound by these Terms of Use. If you do not agree, please do not use this website.",
      },
      {
        heading: "Use of Content",
        body: "All content on this website — including text, graphics, logos, project descriptions, and code examples — is the property of Ilias Giannaros (GNRS) unless otherwise stated. You may not reproduce, distribute, or republish any content without prior written permission.",
      },
      {
        heading: "Portfolio & Project Showcase",
        body: "Project descriptions and links are provided for informational purposes. The availability, functionality, or ownership of linked third-party websites may change over time. I am not responsible for the content or practices of any linked sites.",
      },
      {
        heading: "Contact Form",
        body: "By submitting the contact form, you agree that the information you provide may be used to respond to your inquiry. You are responsible for the accuracy of the information you submit.",
      },
      {
        heading: "Disclaimer of Warranties",
        body: 'This website is provided "as is" without warranties of any kind, express or implied. I do not guarantee that the website will be error-free, uninterrupted, or free of harmful components.',
      },
      {
        heading: "Limitation of Liability",
        body: "To the fullest extent permitted by law, Ilias Giannaros (GNRS) shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of or inability to use this website.",
      },
      {
        heading: "Changes to These Terms",
        body: "I reserve the right to update or modify these Terms of Use at any time. Continued use of the website after changes constitutes acceptance of the revised terms.",
      },
      {
        heading: "Contact",
        body: "For questions about these Terms of Use, email ilias@gnrs.gr.",
      },
    ],
  },
};

export default function LegalModal({ page, onClose }: LegalModalProps) {
  useEffect(() => {
    if (!page) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [page, onClose]);

  return (
    <AnimatePresence>
      {page && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-base-900/80 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="glass relative z-10 max-h-[80vh] w-full max-w-2xl overflow-y-auto p-8 sm:p-10"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-gray-400 transition-all hover:border-white/20 hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <h2
              id="legal-modal-title"
              className="mb-6 pr-10 font-display text-2xl font-bold text-white"
            >
              {content[page].title}
            </h2>

            <div className="space-y-6">
              {content[page].sections.map((section) => (
                <div key={section.heading}>
                  <h3 className="mb-2 font-display text-sm font-semibold text-accent-cyan">
                    {section.heading}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-400">
                    {section.body}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-8 border-t border-white/[0.06] pt-4 text-xs text-gray-400">
              Last updated: October 2026
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
