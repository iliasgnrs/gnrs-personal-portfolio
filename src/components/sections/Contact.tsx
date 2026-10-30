import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MapPin,
  Linkedin,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { submitToCrm } from "@/lib/crm";

type Status = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      full_name: formData.get("full_name") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || null,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    if (!data.full_name || !data.email || !data.subject || !data.message) {
      setStatus("error");
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    const error = await submitToCrm(data);

    if (error) {
      setStatus("error");
      setErrorMsg(
        "Something went wrong sending your message. Please try again.",
      );
      return;
    }

    setStatus("success");
    form.reset();
  };

  return (
    <section id="contact" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          label="Contact"
          title="Let's Build Something"
          description="Have a project, a plugin, or an AI agent idea? Send the details and I'll get back to you."
        />

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Contact info */}
          <Reveal className="lg:col-span-2" delay={0.1}>
            <div className="glass h-full p-8">
              <h3 className="mb-6 font-display text-lg font-semibold text-white">
                Get in Touch
              </h3>

              <div className="space-y-5">
                <a
                  href="mailto:ilias@gnrs.gr"
                  className="flex items-center gap-4 text-gray-300 transition-colors hover:text-white"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[linear-gradient(135deg,rgba(245,29,227,0.15),rgba(196,22,185,0.15))]">
                    <Mail className="h-5 w-5 text-accent-cyan" />
                  </span>
                  <div>
                    <div className="text-xs text-gray-400">Email</div>
                    <div className="text-sm font-medium">ilias@gnrs.gr</div>
                  </div>
                </a>

                <a
                  href="https://gr.linkedin.com/in/iliasgnrs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-gray-300 transition-colors hover:text-white"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[linear-gradient(135deg,rgba(196,22,185,0.15),rgba(255,105,232,0.15))]">
                    <Linkedin className="h-5 w-5 text-accent-cyan" />
                  </span>
                  <div>
                    <div className="text-xs text-gray-400">LinkedIn</div>
                    <div className="text-sm font-medium">/in/iliasgnrs</div>
                  </div>
                </a>

                <div className="flex items-center gap-4 text-gray-300">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[linear-gradient(135deg,rgba(255,105,232,0.15),rgba(245,29,227,0.15))]">
                    <MapPin className="h-5 w-5 text-accent-cyan" />
                  </span>
                  <div>
                    <div className="text-xs text-gray-400">Location</div>
                    <div className="text-sm font-medium">Kalamaria, Greece</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="text-xs leading-relaxed text-gray-400">
                  Typically responds within 24 hours. For urgent inquiries,
                  include a phone number.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal className="lg:col-span-3" delay={0.2}>
            <form onSubmit={handleSubmit} className="glass h-full p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name" name="full_name" required />
                <Field label="Email" name="email" type="email" required />
                <Field label="Phone" name="phone" type="tel" />
                <Field label="Subject" name="subject" required />
              </div>

              <div className="mt-4">
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-gray-300">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-200 outline-none transition-colors focus:border-accent-blue/50 focus:bg-white/[0.05]"
                  placeholder="Tell me about your project, timeline, and goals…"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#f51de3,#c416b9)] px-6 py-3.5 font-semibold text-white shadow-lg shadow-accent-blue/25 transition-all hover:shadow-accent-blue/50 hover:brightness-110 disabled:opacity-60"
              >
                {status === "loading" && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {status === "success" && <CheckCircle2 className="h-4 w-4" />}
                {status === "idle" && <Send className="h-4 w-4" />}
                {status === "error" && <AlertCircle className="h-4 w-4" />}
                {status === "loading"
                  ? "Sending…"
                  : status === "success"
                    ? "Message Sent!"
                    : "Send Message"}
              </button>

              <AnimatePresence>
                {status === "error" && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 text-sm text-red-400"
                  >
                    {errorMsg}
                  </motion.p>
                )}
                {status === "success" && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 text-sm text-green-400"
                  >
                    Thanks for reaching out! I'll get back to you shortly.
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}

function Field({ label, name, type = "text", required }: FieldProps) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-gray-300">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-200 outline-none transition-colors focus:border-accent-blue/50 focus:bg-white/[0.05]"
      />
    </div>
  );
}
