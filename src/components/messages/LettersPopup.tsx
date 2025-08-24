import { motion } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Heart } from "lucide-react";

interface LettersPopupProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onOpenLetters: () => void;
  count: number;
}

export function LettersPopup({
  open,
  onOpenChange,
  onOpenLetters,
  count,
}: LettersPopupProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-gradient-to-br from-pink-50 via-white to-yellow-50 overflow-hidden">
        <div className="relative">
          {/* Floating hearts */}
          {[...Array(8)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-2xl select-none"
              style={{ left: `${10 + i * 10}%`, top: i % 2 ? "10%" : "75%" }}
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: i % 2 ? -20 : 20, opacity: 1, rotate: [0, 8, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2 + (i % 3), delay: i * 0.12 }}
            >
              💖
            </motion.span>
          ))}

          {/* Envelope pop */}
          <motion.div
            className="flex flex-col items-center text-center py-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <motion.div
              initial={{ y: 12 }}
              animate={{ y: [12, -6, 0] }}
              transition={{ duration: 0.9 }}
              className="relative"
            >
              <Mail className="h-16 w-16 text-brand-primary drop-shadow" />
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              >
                <Heart className="h-6 w-6 text-red-400" />
              </motion.div>
            </motion.div>

            <h3 className="mt-4 text-2xl font-semibold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
              {count} letters are waiting for you
            </h3>
            <p className="mt-2 text-text-muted">
              Tap below and I&apos;ll take you straight to them.
            </p>

            <Button onClick={onOpenLetters} className="mt-6 text-base px-6 py-5 rounded-xl">
              Open my letters
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
