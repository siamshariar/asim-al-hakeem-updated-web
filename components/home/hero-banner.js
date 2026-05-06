import { motion } from "framer-motion";
import Link from "next/link";
import { PlayCircle, BookOpen, HelpCircle } from "lucide-react";

export default function HeroBanner() {
    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const stats = [
        { value: "2M+", label: "Students" },
        { value: "5K+", label: "Lectures" },
        { value: "20+", label: "Books" },
        { value: "50K+", label: "Questions Answered" },
    ];

    return (
        <section className="relative bg-gradient-to-br from-primary via-primary-light to-primary overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 45, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [45, 0, 45],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-secondary/10 rounded-full blur-3xl"
                />
            </div>

            <div className="container mx-auto px-4 sm:px-6 max-w-[1260px] relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[520px] sm:min-h-[600px] lg:min-h-[700px] py-12 lg:py-16">
                    {/* Left Content */}
                    <motion.div {...fadeIn} className="text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-block px-4 py-2 bg-accent/10 rounded-full text-accent text-sm font-medium mb-6"
                        >
                            Official Website
                        </motion.div>
                        <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            Sheikh{" "}
                            <span className="text-accent">Assim</span>
                            <br />
                            Al Hakeem
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            Authentic Islamic knowledge from one of the most trusted scholars. 
                            Lectures, books, Q&A, and counseling for Muslims worldwide.
                        </p>
                        
                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                            <Link href="/lectures/UUWsdcrre0WbCWML_PnuzoAg">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-full font-medium shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 transition-all"
                                >
                                    <PlayCircle size={20} />
                                    <span>Watch Lectures</span>
                                </motion.button>
                            </Link>
                            <Link href="/books">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-full font-medium hover:bg-white/20 transition-all"
                                >
                                    <BookOpen size={20} />
                                    <span>Explore Books</span>
                                </motion.button>
                            </Link>
                            <Link href="/ask-question">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-full font-medium hover:bg-white/20 transition-all"
                                >
                                    <HelpCircle size={20} />
                                    <span>Ask Question</span>
                                </motion.button>
                            </Link>
                        </div>

                        {/* Stats */}
                        {/* <div className="grid grid-cols-2 gap-4 mt-12 max-w-xl mx-auto lg:mx-0">
                            {stats.map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + idx * 0.1 }}
                                    className="text-center lg:text-left"
                                >
                                    <div className="text-2xl lg:text-3xl font-bold text-white">{stat.value}</div>
                                    <div className="text-xs lg:text-sm text-gray-400">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div> */}
                    </motion.div>

                    {/* Right Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative">
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="relative z-10"
                            >
                                <img 
                                    src="/img/profile-banner.png" 
                                    alt="Sheikh Assim Al Hakeem" 
                                    className="w-full object-contain"
                                />
                            </motion.div>
                            <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent z-20" />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
                >
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-1 h-2 bg-white/60 rounded-full mt-2"
                    />
                </motion.div>
            </motion.div>
        </section>
    );
}