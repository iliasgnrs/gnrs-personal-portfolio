import { motion } from 'framer-motion';

interface ProfilePhotoProps {
  src?: string;
  alt: string;
}

export default function ProfilePhoto({ src, alt }: ProfilePhotoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative mx-auto mb-8 h-28 w-28 sm:h-32 sm:w-32"
    >
      <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-accent-blue to-accent-cyan opacity-70 blur-md animate-pulse" />
      <div className="absolute -inset-[3px] rounded-full bg-gradient-to-br from-accent-blue via-accent-cyan to-accent-blue" />
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border-4 border-base-900 bg-base-700">
        {src ? (
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <span className="font-display text-3xl font-bold text-white/80">IG</span>
        )}
      </div>
      <span
        className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-base-900 bg-green-400"
        aria-hidden="true"
      >
        <span className="h-1.5 w-1.5 animate-ping rounded-full bg-green-400" />
      </span>
    </motion.div>
  );
}
