import { useState, useEffect, useLayoutEffect, useMemo, useDeferredValue } from "react";
import { useRouter } from "next/router";
import { server } from "../../lib/config";
import { getAllPlaylists2, getHeaderLectures, getAllQnaCategory, getQnaByLimit } from "../../lib/fetch";
import Meta from "../../components/meta";
import Header2 from "../../components/header1";
import Link from "next/link";
import { motion } from "framer-motion";
import { HelpCircle, ChevronRight, Search, FolderOpen, MessageCircle, X } from "lucide-react";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
const LAST_QNA_CATEGORY_KEY = "qna_last_category";

export default function QnaPage({ playlists, headerLectures, qnaCategories, qnaItems }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const deferredSearchTerm = useDeferredValue(searchTerm);

  useIsomorphicLayoutEffect(() => {
    if (!router.isReady) return;
    const category = router.query.category;
    if (typeof category === 'string' && category.trim()) {
      const normalized = category.trim();
      const isValid = normalized === "all" || qnaCategories?.some(c => c.slug === normalized);
      setSelectedCategory(isValid ? normalized : "all");
    } else {
      const storedCategory = typeof window !== "undefined" ? window.sessionStorage.getItem(LAST_QNA_CATEGORY_KEY) : null;
      const isStoredValid = storedCategory === "all" || qnaCategories?.some(c => c.slug === storedCategory);
      const nextCategory = isStoredValid ? storedCategory : "all";
      setSelectedCategory(nextCategory);

      if (nextCategory && nextCategory !== "all") {
        router.replace(`/qna?category=${nextCategory}`, undefined, { shallow: true });
      }
    }
  }, [router.isReady, router.query.category, qnaCategories]);

  // Instant category change with URL update
  const EXCLUDE_SLUGS = ["books", "videos", "articles", "audios"];

  const handleCategoryChange = (slug) => {
    if (slug === selectedCategory) {
      setShowMobileFilters(false);
      return;
    }

    setSelectedCategory(slug);
    setShowMobileFilters(false);

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(LAST_QNA_CATEGORY_KEY, slug);
    }

    const url = slug === "all" ? "/qna" : `/qna?category=${slug}`;
    router.push(url, undefined, { shallow: true });
  };

  const qnaByCategory = useMemo(() => {
    const byCategory = { all: qnaItems || [] };
    for (const item of qnaItems || []) {
      const slug = item.cat_slug || "all";
      if (!byCategory[slug]) byCategory[slug] = [];
      byCategory[slug].push(item);
    }
    return byCategory;
  }, [qnaItems]);

  const categoryScopedQna = useMemo(() => {
    if (selectedCategory === "all") return qnaByCategory.all || [];
    return qnaByCategory[selectedCategory] || [];
  }, [selectedCategory, qnaByCategory]);

  const normalizedSearch = deferredSearchTerm.trim().toLowerCase();

  const filteredQna = useMemo(() => {
    if (!normalizedSearch) return categoryScopedQna;

    return categoryScopedQna.filter((item) => {
      const question = item.question?.toLowerCase() || "";
      const content = item.content?.toLowerCase() || "";
      const answer = item.answer?.toLowerCase() || "";
      return question.includes(normalizedSearch) || content.includes(normalizedSearch) || answer.includes(normalizedSearch);
    });
  }, [categoryScopedQna, normalizedSearch]);

  const activeCategoryName = selectedCategory === "all" 
    ? "All Categories" 
    : qnaCategories?.find(c => c.slug === selectedCategory)?.title || "All Categories";

  const visibleQnaCategories = qnaCategories?.filter(c => c.slug !== 'all' && !EXCLUDE_SLUGS.includes(c.slug)) || [];

  const listAnimationKey = `${selectedCategory}-${normalizedSearch}`;

  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.28,
        ease: "easeOut",
      },
    },
  };

  return (
    <>
      <Meta title="Q&A - Sheikh Assim Al Hakeem" description="Get answers to your Islamic questions from Sheikh Assim Al Hakeem" />
      <Header2 playlists={playlists} lectures={headerLectures} qna_categories={visibleQnaCategories} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a1f2e] to-[#2a3142] py-6 xs:py-8 sm:py-10 lg:py-14">
        <div className="max-w-[1260px] mx-auto px-3 xs:px-4 sm:px-5 lg:px-6 xl:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <HelpCircle size={28} className="xs:w-8 xs:h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#10b981] mx-auto mb-2 xs:mb-3 sm:mb-4" />
            <h1 className="page-title text-white mb-1 xs:mb-2 sm:mb-3">Questions & Answers</h1>
            <p className="text-xs xs:text-sm sm:text-base text-gray-300 max-w-2xl mx-auto px-2 xs:px-4">
              Find authentic Islamic answers from Sheikh Assim Al Hakeem
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-2.5 xs:py-3 sm:py-4 lg:py-6 bg-white border-b border-gray-100">
        <div className="max-w-[1260px] mx-auto px-3 xs:px-4 sm:px-5 lg:px-6 xl:px-8">
          <div className="flex flex-col lg:flex-row gap-2.5 xs:gap-3 lg:gap-4 items-start lg:items-center">
            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              {/* <Search size={14} className="xs:w-4 xs:h-4 sm:w-[18px] sm:h-[18px] absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" /> */}
              <input 
                type="text" 
                placeholder="Search questions..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 xs:pl-9 sm:pl-12 pr-7 xs:pr-8 sm:pr-10 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] text-xs xs:text-sm sm:text-base text-[#1a1f2e]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={12} className="xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                </button>
              )}
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center justify-between w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 rounded-lg text-xs xs:text-sm sm:text-base appearance-none border-0 focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:border-transparent focus-visible:border-transparent focus:shadow-none focus-visible:shadow-none"
            >
              <span className="text-gray-700">{activeCategoryName}</span>
              <ChevronRight size={14} className={`xs:w-4 xs:h-4 transition-transform ${showMobileFilters ? 'rotate-90' : ''}`} />
            </button>

            {/* Category Filters - Desktop */}
            <div className="hidden lg:flex gap-1.5 lg:gap-2 overflow-x-auto w-full lg:w-auto pb-1 scrollbar-thin">
              <button 
                onClick={() => handleCategoryChange("all")}
                onMouseDown={(e) => e.preventDefault()}
                className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-medium whitespace-nowrap transition-all appearance-none border-0 focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:border-transparent focus-visible:border-transparent focus:shadow-none focus-visible:shadow-none
                  ${selectedCategory === "all" 
                    ? "bg-[#10b981] text-white hover:bg-[#10b981] focus:bg-[#10b981] focus:text-white" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:bg-gray-200"}`}
              >
                All Categories
              </button>
              {visibleQnaCategories.map(cat => (
                <button 
                  key={cat.id} 
                  onClick={() => handleCategoryChange(cat.slug)}
                  onMouseDown={(e) => e.preventDefault()}
                  className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-medium whitespace-nowrap transition-all appearance-none border-0 focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:border-transparent focus-visible:border-transparent focus:shadow-none focus-visible:shadow-none
                    ${selectedCategory === cat.slug 
                      ? "bg-[#10b981] text-white hover:bg-[#10b981] focus:bg-[#10b981] focus:text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:bg-gray-200"}`}
                >
                  {cat.title}
                </button>
              ))}
            </div>

            {/* Result Count - Desktop */}
            <div className="hidden lg:block text-xs lg:text-sm text-gray-500 whitespace-nowrap ml-auto">
              {filteredQna.length} {filteredQna.length === 1 ? 'result' : 'results'}
            </div>
          </div>

          {/* Mobile Category Filters - Dropdown */}
          {showMobileFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-2.5 xs:mt-3 pt-2.5 xs:pt-3 border-t border-gray-100"
            >
              <div className="flex flex-wrap gap-1 xs:gap-1.5 sm:gap-2">
                <button 
                  onClick={() => handleCategoryChange("all")}
                  onMouseDown={(e) => e.preventDefault()}
                  className={`px-2.5 xs:px-3 py-1.5 rounded-full text-xs xs:text-sm font-medium transition-all appearance-none border-0 focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:border-transparent focus-visible:border-transparent focus:shadow-none focus-visible:shadow-none
                    ${selectedCategory === "all"
                      ? "bg-[#10b981] text-white hover:bg-[#10b981] focus:bg-[#10b981] focus:text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:bg-gray-200"}`}
                >
                  All Categories
                </button>
                {visibleQnaCategories.map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => handleCategoryChange(cat.slug)}
                    onMouseDown={(e) => e.preventDefault()}
                    className={`px-2.5 xs:px-3 py-1.5 rounded-full text-xs xs:text-sm font-medium transition-all appearance-none border-0 focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:border-transparent focus-visible:border-transparent focus:shadow-none focus-visible:shadow-none
                      ${selectedCategory === cat.slug 
                        ? "bg-[#10b981] text-white hover:bg-[#10b981] focus:bg-[#10b981] focus:text-white" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:bg-gray-200"}`}
                  >
                    {cat.title}
                  </button>
                ))}
              </div>
              <div className="text-xxs xs:text-xs text-gray-500 mt-2.5 xs:mt-3">
                {filteredQna.length} {filteredQna.length === 1 ? 'result' : 'results'} found
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Q&A List */}
      <section className="py-8 xs:py-8 sm:py-10 lg:py-4 bg-gray-50 min-h-[60vh]">
        <div className="max-w-[1000px] mx-auto px-3 xs:px-4 sm:px-5 lg:px-6 xl:px-8">
          <div>
            {filteredQna.length > 0 ? (
              <motion.div
                key={listAnimationKey}
                variants={listVariants}
                initial="hidden"
                animate="show"
                className="space-y-2.5 xs:space-y-3 sm:space-y-4"
              >
                {filteredQna.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={cardVariants}
                    className="bg-white rounded-lg xs:rounded-xl shadow-sm hover:shadow-md transition-all p-3.5 xs:p-4 sm:p-5 lg:p-6"
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <MessageCircle size={14} className="xs:w-4 xs:h-4 sm:w-[18px] sm:h-[18px] lg:w-5 lg:h-5 text-[#10b981] mt-0.5 xs:mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-[#1a1f2e] mb-1 sm:mb-2 line-clamp-2">
                          {item.question}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 sm:line-clamp-3 mb-1.5 sm:mb-3">
                          {item.content || item.answer}
                        </p>
                        <Link 
                          href={`/qna/answer/${item.id}?from=${selectedCategory}`}
                          className="inline-flex items-center gap-1 text-[#10b981] text-xs sm:text-sm font-medium hover:gap-2 transition-all"
                        >
                          Read Full Answer <ChevronRight size={10} className="xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center py-10 xs:py-12 sm:py-16"
              >
                <FolderOpen size={36} className="xs:w-10 xs:h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2.5 xs:mb-3 sm:mb-4" />
                <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-600 mb-1 sm:mb-2">No questions found</h3>
                <p className="text-xs xs:text-sm sm:text-base text-gray-500">Try adjusting your search or filter</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Ask Question CTA */}
      <section className="py-8 xs:py-10 sm:py-12 bg-gradient-to-r from-[#10b981] to-[#059669]">
        <div className="max-w-[800px] mx-auto px-3 xs:px-4 sm:px-5 lg:px-6 xl:px-8 text-center">
          <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1.5 xs:mb-2 sm:mb-3">Have a Question?</h2>
          <p className="text-xs xs:text-sm sm:text-base text-white/90 mb-4 xs:mb-5 sm:mb-6 max-w-md mx-auto">
            Submit your question to get guidance from Sheikh Assim Al Hakeem
          </p>
          <Link href="/ask-question">
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              className="px-5 xs:px-6 sm:px-8 py-2 sm:py-2.5 lg:py-3 bg-white text-[#10b981] rounded-full text-xs xs:text-sm sm:text-base font-medium shadow-lg hover:shadow-xl transition-all"
            >
              Ask a Question
            </motion.button>
          </Link>
        </div>
      </section>
    </>
  );
}

export async function getStaticProps() {
  try {
    const playlists = await getAllPlaylists2();
    const headerLectures = await getHeaderLectures();
    const qnaCategories = await getAllQnaCategory();
    const qnaItems = await getQnaByLimit(5000);

    return {
      props: {
        playlists: playlists?.playlists || [],
        headerLectures: headerLectures || null,
        qnaCategories: qnaCategories || [],
        qnaItems: qnaItems || [],
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      props: {
        playlists: [],
        headerLectures: null,
        qnaCategories: [],
        qnaItems: [],
      },
      revalidate: 60,
    };
  }
}