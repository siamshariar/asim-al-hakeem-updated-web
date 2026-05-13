import Link from "next/link";
import { motion } from "framer-motion";
import { HelpCircle, ChevronRight, Clock, AlertCircle, Send } from "lucide-react";

export default function QASection({ qna }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="h-full bg-gradient-to-br from-[#10b981]/5 to-[#059669]/5 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 flex flex-col"
    >
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#10b981] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-[#10b981]/25">
          <HelpCircle size={20} className="sm:w-6 sm:h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#1a1f2e]">Ask Question</h3>
          <p className="text-xs sm:text-sm text-gray-600">Please read the timing note below</p>
        </div>
      </div>

      <div className="flex-1 bg-white/90 backdrop-blur rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm border border-white/70 mb-5 sm:mb-6 lg:mb-8 flex flex-col justify-between">
        <div className="space-y-3 sm:space-y-4 text-[#1a1f2e]">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#10b981]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Clock size={18} className="sm:w-[20px] sm:h-[20px] text-[#10b981]" />
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-gray-700">
              Our timing for taking questions is from <span className="font-semibold text-[#1a1f2e]">6 p.m (Makkah Time)</span>.
            </p>
          </div>

          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertCircle size={18} className="sm:w-[20px] sm:h-[20px] text-amber-600" />
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-gray-700">
              The quota finishes, which is usually done in the first <span className="font-semibold text-[#1a1f2e]">5 to 10 minutes</span>.
            </p>
          </div>

          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#1a1f2e]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Send size={18} className="sm:w-[20px] sm:h-[20px] text-[#1a1f2e]" />
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-gray-700">
              Please try submitting your question early, as soon as we open at <span className="font-semibold text-[#1a1f2e]">6 p.m Makkah time</span>.
            </p>
          </div>
        </div>

        <div className="mt-5 sm:mt-6 rounded-xl bg-[#f8fafc] border border-gray-100 p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            <span className="font-semibold text-[#1a1f2e]">Note:</span> Our quota of taking questions is over for the day when the limit is reached.
          </p>
        </div>
      </div>

      <Link href="/ask-question">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 sm:py-4 bg-[#10b981] text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-medium shadow-lg shadow-[#10b981]/25 hover:shadow-xl hover:shadow-[#10b981]/30 transition-all flex items-center justify-center gap-1.5 sm:gap-2"
        >
          <span>Ask a Question</span>
          <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
        </motion.button>
      </Link>
    </motion.div>
  );
}