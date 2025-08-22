import { motion } from "framer-motion";
import { Trophy, Users, Heart } from "lucide-react";

export default function Leaderboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "backOut" }}
            className="mb-8"
          >
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
              <Trophy className="h-12 w-12 text-white" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold mb-6 text-gray-900"
          >
            Donor Leaderboard
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            See who's making the biggest impact and track your ranking among our generous community
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="bg-white rounded-xl p-8 shadow-lg text-center"
            >
              <Users className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Top Donors</h3>
              <p className="text-gray-600">Coming soon - view our most generous supporters</p>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="bg-white rounded-xl p-8 shadow-lg text-center"
            >
              <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Monthly Rankings</h3>
              <p className="text-gray-600">Coming soon - see who's leading this month</p>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="bg-white rounded-xl p-8 shadow-lg text-center"
            >
              <Heart className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Impact Stories</h3>
              <p className="text-gray-600">Coming soon - read about lives changed</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
