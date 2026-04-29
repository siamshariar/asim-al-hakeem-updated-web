import Link from "next/link";
import { motion } from "framer-motion";
import { HelpCircle, ChevronRight, MessageCircle } from "lucide-react";

export default function QASection({ qna }) {
  const recentQuestions = qna?.slice(0, 3) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-[#10b981]/5 to-[#059669]/5 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8"
    >
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#10b981] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-[#10b981]/25">
          <HelpCircle size={20} className="sm:w-6 sm:h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#1a1f2e]">Recent Q&A</h3>
          <p className="text-xs sm:text-sm text-gray-600">Answers from Sheikh Assim</p>
        </div>
      </div>

      {recentQuestions.length > 0 ? (
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          {recentQuestions.map((item, idx) => (
            <Link key={item.id || idx} href={`/qna/answer/${item.id}`} className="block">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <MessageCircle size={16} className="sm:w-[18px] sm:h-[18px] text-[#10b981] mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[#1a1f2e] font-medium text-sm sm:text-base mb-1 sm:mb-2 line-clamp-2">
                      {item.question || item.title}
                    </p>
                    <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
                      {item.answer || item.excerpt}
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6 sm:p-8 text-center mb-6 sm:mb-8">
          <MessageCircle size={32} className="sm:w-10 sm:h-10 text-gray-300 mx-auto mb-2 sm:mb-3" />
          <p className="text-sm sm:text-base text-gray-500">Submit your question to get guidance from Sheikh Assim</p>
        </div>
      )}

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