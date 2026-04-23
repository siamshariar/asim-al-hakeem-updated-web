import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, CheckCircle } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubscribed(true);
    setEmail("");
    setLoading(false);
    
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-[#10b981] to-[#059669]">
      <div className="container max-w-[1000px] mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-white"
        >
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
              <Mail size={24} className="sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
            </div>
          </div>
          
          <h2 className="section-title text-white mb-2 sm:mb-4">Stay Updated</h2>
          <p className="text-white/90 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Subscribe to receive notifications about new lectures, books, articles, 
            and answers to frequently asked questions.
          </p>

          {subscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 max-w-md mx-auto"
            >
              <CheckCircle size={32} className="sm:w-10 sm:h-10 text-white mx-auto mb-2 sm:mb-3" />
              <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Thank You for Subscribing!</h3>
              <p className="text-white/80 text-sm sm:text-base">
                You'll now receive updates about our latest content and events.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-4 sm:px-5 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm sm:text-base"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="px-5 sm:px-6 py-3 sm:py-4 bg-white text-[#10b981] rounded-lg sm:rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-sm sm:text-base whitespace-nowrap"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-[#10b981] border-t-transparent rounded-full animate-spin" />
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
                      <span>Subscribe</span>
                    </>
                  )}
                </motion.button>
              </div>
              <p className="text-white/60 text-xs sm:text-sm mt-3 sm:mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}