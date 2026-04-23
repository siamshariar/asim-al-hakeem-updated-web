import Link from "next/link";
import { motion } from "framer-motion";
import { Award, BookOpen, Users, ArrowRight } from "lucide-react";

export default function AboutPreview() {
  return (
    <section className="py-12 lg:py-24 bg-gradient-to-br from-[#f0fdf4] via-[#ffffff] to-[#e6fffa]">
      <div className="container max-w-[1260px] mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#10b981] font-semibold uppercase tracking-wider text-sm">About Sheikh Assim</span>
            <h2 className="section-title text-[#1a1f2e] mt-2 mb-4 leading-tight">
              Guiding the Ummah with Authentic Knowledge
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Sheikh Assim bin Luqman al-Hakeem was born in 1962 in Al-Khobar, Saudi Arabia. 
              With decades of experience in Islamic scholarship and a unique ability to communicate 
              in both Arabic and English, he has become one of the most trusted voices in Islamic 
              education worldwide.
            </p>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Award className="w-8 h-8 text-[#10b981] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#1a1f2e]">35+</div>
                <div className="text-sm text-gray-500">Years Experience</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <BookOpen className="w-8 h-8 text-[#10b981] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#1a1f2e]">20+</div>
                <div className="text-sm text-gray-500">Books Published</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Users className="w-8 h-8 text-[#10b981] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#1a1f2e]">2M+</div>
                <div className="text-sm text-gray-500">Students Worldwide</div>
              </div>
            </div>

            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-base tracking-wide sm:px-6 sm:py-3 md:px-7 md:py-3.5 bg-[#10b981] text-white rounded-full font-medium shadow-lg shadow-[#10b981]/25 hover:shadow-xl transition-all"
              >
                <span>Learn more</span>
                <ArrowRight size={18} />
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#10b981]/20 to-transparent rounded-3xl -rotate-3"></div>
            <img 
              src="/img/about/about-img.jpg" 
              alt="Sheikh Assim Al Hakeem" 
              className="rounded-3xl shadow-2xl relative z-10 w-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}