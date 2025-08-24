import { motion } from "framer-motion";
import { Mail, Heart, Sparkles } from "lucide-react";

interface LetterboxHeroProps {
  messageCount: number;
  onCountClick?: () => void; // click handler for the counter row
}

export function LetterboxHero({ messageCount, onCountClick }: LetterboxHeroProps) {
  return (
    <section className="relative py-20 bg-gradient-to-br from-pink-100 via-blue-50 to-yellow-50 overflow-hidden">
      {/* Floating elements */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ y: "100vh", opacity: 0 }}
            animate={{ y: "-20vh", opacity: [0, 1, 0] }}
            transition={{
              duration: 8,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ left: `${10 + (i % 4) * 25}%`, fontSize: "2rem" }}
          >
            {["✈️", "💌", "🎈", "❤️", "🍭"][i % 5]}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* Animated mailbox */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "backOut" }}
        >
          <div className="relative inline-block">
            <div className="text-8xl">📮</div>
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="h-8 w-8 text-yellow-400" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
            Your Letters from the Children
          </h1>

          <p className="text-xl md:text-2xl text-text-muted mb-8 max-w-3xl mx-auto">
            Every message here was written by a child you&apos;ve touched with your generosity.
            Click on each letter to open their heartfelt thank you.
          </p>

          {/* Clickable counter (opens popup) */}
          <motion.button
            type="button"
            onClick={onCountClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-3 text-brand-primary mx-auto px-3 py-2 rounded-lg
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40
                       hover:bg-white/60 bg-white/40 backdrop-blur"
            aria-label={`${messageCount} letters waiting for you`}
          >
            <Mail className="h-6 w-6" />
            <span className="text-lg font-semibold">
              {messageCount} letters waiting for you
            </span>
            <Heart className="h-6 w-6 text-red-400" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
