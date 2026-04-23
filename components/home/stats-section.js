import { motion } from "framer-motion";
import { Users, Video, BookOpen, MessageCircle, Award } from "lucide-react";

export default function StatsSection() {
  const stats = [
    { icon: Users, value: "2M+", label: "Global Students", color: "bg-blue-500" },
    { icon: Video, value: "5K+", label: "Video Lectures", color: "bg-red-500" },
    { icon: BookOpen, value: "20+", label: "Published Books", color: "bg-green-500" },
    { icon: MessageCircle, value: "50K+", label: "Questions Answered", color: "bg-purple-500" },
    { icon: Award, value: "35+", label: "Years Experience", color: "bg-orange-500" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-8 sm:py-10 lg:py-12 bg-gradient-to-br from-[#eff6ff] via-[#f8fbff] to-[#ffffff]">
      <div className="container max-w-[1260px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-accent font-semibold uppercase tracking-wider text-sm">Our Impact</span>
            <h2 className="section-title text-[#1a1f2e] mt-2">Quick Stats</h2>
          </div>
          <p className="text-gray-500 max-w-xl">
            Measurable results from Sheikh Assim Al Hakeem’s global lectures, books, and question-answer sessions.
          </p>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -3 }}
              className="text-center p-4 sm:p-5 lg:p-6 bg-gray-50 rounded-xl sm:rounded-2xl hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 ${stat.color} rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-md`}>
                <stat.icon size={20} className="sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a1f2e] mb-0.5 sm:mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}