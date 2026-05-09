import { useState, useEffect, useLayoutEffect, useMemo, useDeferredValue, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import { getAllPlaylists2, getHeaderLectures, getAllQnaCategory, getAllQuestions } from "../../lib/fetch";
import Meta from "../../components/meta";
import Header2 from "../../components/header1";
import Link from "next/link";
import { motion } from "framer-motion";
import useOnScreen from "../../hooks/useOnScreen";
import { HelpCircle, ChevronRight, FolderOpen, MessageCircle, X } from "lucide-react";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
const LAST_QNA_CATEGORY_KEY = "qna_last_category";
const PAGE_SIZE = 10;
const LOADING_DELAY = 1000;

export default function QnaPage({ playlists, headerLectures, qnaCategories, initialQnaPage }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [loadedPages, setLoadedPages] = useState(initialQnaPage?.qaItems?.length ? [initialQnaPage.qaItems] : []);
  const [currentPage, setCurrentPage] = useState(initialQnaPage?.currentPage || 1);
  const [totalPages, setTotalPages] = useState(initialQnaPage?.numberOfPages || 1);
  const [isLoadingInitial, setIsLoadingInitial] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef(null);
  const lastLoadTimeRef = useRef(0);
  const initialScrollDoneRef = useRef(false);
  const isInitialMountRef = useRef(true);
  const fetchingRef = useRef(false);
  const loadingTimeoutRef = useRef(null);
  const containerRef = useRef(null);
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const isLoadMoreVisible = useOnScreen(loadMoreRef, { rootMargin: '300px', threshold: 0 });

  const scrollToTopInstantly = useCallback(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!router.isReady) return;
    
    const category = router.query.category;
    let targetCategory = "all";
    
    if (typeof category === 'string' && category.trim()) {
      const normalized = category.trim();
      const isValid = normalized === "all" || qnaCategories?.some(c => c.slug === normalized);
      targetCategory = isValid ? normalized : "all";
    } else {
      const storedCategory = typeof window !== "undefined" ? window.sessionStorage.getItem(LAST_QNA_CATEGORY_KEY) : null;
      const isStoredValid = storedCategory === "all" || qnaCategories?.some(c => c.slug === storedCategory);
      targetCategory = isStoredValid ? storedCategory : "all";
    }

    if (targetCategory !== selectedCategory || isInitialMountRef.current) {
      scrollToTopInstantly();
      
      if (targetCategory !== selectedCategory) {
        setSelectedCategory(targetCategory);
        fetchingRef.current = false;
      }
      
      isInitialMountRef.current = false;
    }

    if (targetCategory && targetCategory !== "all" && !router.query.category) {
      router.replace(`/qna?category=${targetCategory}`, undefined, { shallow: true });
    }
  }, [router.isReady, router.query.category, qnaCategories]);

  const EXCLUDE_SLUGS = ["books", "videos", "articles", "audios"];

  const handleCategoryChange = useCallback((slug) => {
    if (slug === selectedCategory) {
      setShowMobileFilters(false);
      return;
    }

    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }

    scrollToTopInstantly();
    
    setLoadedPages([]);
    setCurrentPage(1);
    setTotalPages(1);
    setIsLoadingMore(false);
    initialScrollDoneRef.current = false;
    lastLoadTimeRef.current = 0;
    fetchingRef.current = false;
    
    setSelectedCategory(slug);
    setShowMobileFilters(false);

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(LAST_QNA_CATEGORY_KEY, slug);
    }

    const url = slug === "all" ? "/qna" : `/qna?category=${slug}`;
    router.push(url, undefined, { shallow: true });
  }, [selectedCategory, router, scrollToTopInstantly]);

  useEffect(() => {
    let cancelled = false;
    let scrollTimeout;

    const loadInitialPage = async () => {
      setIsLoadingInitial(true);
      setLoadedPages([]);

      try {
        const initialPage = await getAllQuestions({ currentPage: 1, cat_slug: selectedCategory, pageSize: PAGE_SIZE });
        if (cancelled) return;

        if (initialPage?.qaItems?.length) {
          setLoadedPages([initialPage.qaItems]);
          setCurrentPage(initialPage.currentPage || 1);
          setTotalPages(initialPage.numberOfPages || 1);
        } else {
          setLoadedPages([]);
          setCurrentPage(1);
          setTotalPages(1);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadedPages([]);
          setCurrentPage(1);
          setTotalPages(1);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingInitial(false);
          fetchingRef.current = false;
          
          scrollTimeout = setTimeout(() => {
            if (!cancelled) {
              scrollToTopInstantly();
              initialScrollDoneRef.current = true;
            }
          }, 200);
        }
      }
    };

    loadInitialPage();

    return () => {
      cancelled = true;
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [selectedCategory, scrollToTopInstantly]);

  useEffect(() => {
    if (!isLoadMoreVisible || isLoadingInitial || currentPage >= totalPages) {
      return;
    }

    if (!initialScrollDoneRef.current) {
      return;
    }

    if (fetchingRef.current) {
      return;
    }

    const now = Date.now();
    if (now - lastLoadTimeRef.current < 1500) {
      return;
    }

    let cancelled = false;

    const loadNextPage = async () => {
      fetchingRef.current = true;
      lastLoadTimeRef.current = now;
      
      setIsLoadingMore(true);

      try {
        const nextPageNumber = currentPage + 1;
        const nextPage = await getAllQuestions({ currentPage: nextPageNumber, cat_slug: selectedCategory, pageSize: PAGE_SIZE });
        
        if (cancelled) return;

        await new Promise(resolve => {
          loadingTimeoutRef.current = setTimeout(resolve, LOADING_DELAY);
        });

        if (cancelled) return;

        if (nextPage?.qaItems?.length) {
          setLoadedPages((prev) => {
            const existingIds = new Set(prev.flat().map(item => item.id));
            const newItems = nextPage.qaItems.filter(item => !existingIds.has(item.id));
            return newItems.length > 0 ? [...prev, newItems] : prev;
          });
          setCurrentPage(nextPage.currentPage || nextPageNumber);
          setTotalPages(nextPage.numberOfPages || totalPages);
        } else {
          setCurrentPage(totalPages);
        }
      } catch (error) {
        console.error("Error loading more:", error);
      } finally {
        if (!cancelled) {
          setIsLoadingMore(false);
          fetchingRef.current = false;
        }
      }
    };

    loadNextPage();

    return () => {
      cancelled = true;
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };
  }, [isLoadMoreVisible, isLoadingInitial, currentPage, totalPages, selectedCategory]);

  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  const loadedQna = useMemo(() => loadedPages.flat(), [loadedPages]);

  const normalizedSearch = deferredSearchTerm.trim().toLowerCase();

  const filteredQna = useMemo(() => {
    if (!normalizedSearch) return loadedQna;

    return loadedQna.filter((item) => {
      const question = item.question?.toLowerCase() || "";
      const content = item.content?.toLowerCase() || "";
      const answer = item.answer?.toLowerCase() || "";
      return question.includes(normalizedSearch) || content.includes(normalizedSearch) || answer.includes(normalizedSearch);
    });
  }, [loadedQna, normalizedSearch]);

  const activeCategoryName = selectedCategory === "all" 
    ? "All Categories" 
    : qnaCategories?.find(c => c.slug === selectedCategory)?.title || "All Categories";

  const visibleQnaCategories = qnaCategories?.filter(c => c.slug !== 'all' && !EXCLUDE_SLUGS.includes(c.slug)) || [];

  const hasMoreToLoad = currentPage < totalPages;

  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.25,
        ease: "easeOut",
      },
    },
  };

  return (
    <>
      <style jsx global>{`
        button:focus,
        button:focus-visible,
        button:active:focus,
        button:focus:not(:focus-visible) {
          outline: none !important;
          box-shadow: none !important;
        }
        
        button:focus-visible {
          outline: none !important;
          ring: none !important;
        }
        
        button::-moz-focus-inner {
          border: 0;
        }
        
        button {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
      
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
      <section className="py-2.5 xs:py-3 sm:py-4 lg:py-6 bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-[1260px] mx-auto px-3 xs:px-4 sm:px-5 lg:px-6 xl:px-8">
          <div className="flex flex-col lg:flex-row gap-2.5 xs:gap-3 lg:gap-4 items-start lg:items-center">
            <div className="relative w-full lg:w-80">
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

            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center justify-between w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 rounded-lg text-xs xs:text-sm sm:text-base border-0 outline-none focus:outline-none"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <span className="text-gray-700">{activeCategoryName}</span>
              <ChevronRight size={14} className={`xs:w-4 xs:h-4 transition-transform ${showMobileFilters ? 'rotate-90' : ''}`} />
            </button>

            {deferredSearchTerm.trim().length > 0 && (
              <div className="hidden lg:block text-xs lg:text-sm text-gray-500 whitespace-nowrap ml-auto">
                {filteredQna.length} {filteredQna.length === 1 ? 'result' : 'results'}
              </div>
            )}
          </div>

          {/* Mobile Category Filters */}
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
                  className={`px-2.5 xs:px-3 py-1.5 rounded-full text-xs xs:text-sm font-medium transition-all duration-200 border-0 outline-none appearance-none
                    ${selectedCategory === "all"
                      ? "bg-[#10b981] text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  style={{ 
                    WebkitTapHighlightColor: 'transparent',
                    boxShadow: selectedCategory === "all" ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
                  }}
                >
                  All Categories
                </button>
                {visibleQnaCategories.map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => handleCategoryChange(cat.slug)}
                    onMouseDown={(e) => e.preventDefault()}
                    className={`px-2.5 xs:px-3 py-1.5 rounded-full text-xs xs:text-sm font-medium transition-all duration-200 border-0 outline-none appearance-none
                      ${selectedCategory === cat.slug 
                        ? "bg-[#10b981] text-white shadow-md" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    style={{ 
                      WebkitTapHighlightColor: 'transparent',
                      boxShadow: selectedCategory === cat.slug ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
                    }}
                  >
                    {cat.title}
                  </button>
                ))}
              </div>
              {deferredSearchTerm.trim().length > 0 && (
                <div className="text-xxs xs:text-xs text-gray-500 mt-2.5 xs:mt-3">
                  {filteredQna.length} {filteredQna.length === 1 ? 'result' : 'results'} found
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Q&A List */}
      <section className="py-8 xs:py-8 sm:py-10 lg:py-10 bg-gray-50 min-h-[60vh]">
        <div className="max-w-[1260px] mx-auto px-3 xs:px-4 sm:px-5 lg:px-6 xl:px-8" ref={containerRef}>
          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block self-start sticky top-24">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 xl:p-5">
                <div className="mb-4 pb-2 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-[#1a1f2e]">Q&A categories</h2>
                </div>
                <div className="space-y-2">
                  <button 
                    onClick={() => handleCategoryChange("all")}
                    onMouseDown={(e) => e.preventDefault()}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border-0 outline-none appearance-none
                      ${selectedCategory === "all" 
                        ? "bg-[#10b981] text-white shadow-md" 
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}
                    style={{ 
                      WebkitTapHighlightColor: 'transparent',
                      boxShadow: selectedCategory === "all" ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
                    }}
                  >
                    All Categories
                  </button>
                  {visibleQnaCategories.map((cat) => (
                    <button 
                      key={cat.id} 
                      onClick={() => handleCategoryChange(cat.slug)}
                      onMouseDown={(e) => e.preventDefault()}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border-0 outline-none appearance-none
                        ${selectedCategory === cat.slug 
                          ? "bg-[#10b981] text-white shadow-md" 
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}
                      style={{ 
                        WebkitTapHighlightColor: 'transparent',
                        boxShadow: selectedCategory === cat.slug ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
                      }}
                    >
                      {cat.title}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="min-w-0">
              {(isLoadingInitial && loadedQna.length === 0) ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 sm:py-16"
                >
                  <div className="mx-auto mb-3 sm:mb-4 h-10 w-10 sm:h-12 sm:w-12 rounded-full border-4 border-[#10b981] border-t-transparent animate-spin" />
                  <p className="text-sm sm:text-base text-gray-500">Loading questions...</p>
                </motion.div>
              ) : filteredQna.length > 0 ? (
                <motion.div
                  key={selectedCategory}
                  variants={listVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-2.5 xs:space-y-3 sm:space-y-4"
                >
                  {filteredQna.map((item) => (
                    <motion.div
                      key={`${selectedCategory}-${item.id}`}
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

                  <div ref={loadMoreRef} className="flex items-center justify-center py-8 min-h-[80px]">
                    {isLoadingMore && hasMoreToLoad && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center gap-3"
                      >
                        <svg className="animate-spin h-6 w-6 sm:h-7 sm:w-7 text-[#10b981]" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        <span className="text-sm sm:text-base text-gray-500 font-medium">Loading more questions...</span>
                      </motion.div>
                    )}
                  </div>
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
    const initialQnaPage = await getAllQuestions({ currentPage: 1, cat_slug: "all", pageSize: PAGE_SIZE });

    return {
      props: {
        playlists: playlists?.playlists || [],
        headerLectures: headerLectures || null,
        qnaCategories: qnaCategories || [],
        initialQnaPage: initialQnaPage || { qaItems: [], numberOfPages: 1, currentPage: 1 },
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      props: {
        playlists: [],
        headerLectures: null,
        qnaCategories: [],
        initialQnaPage: { qaItems: [], numberOfPages: 1, currentPage: 1 },
      },
      revalidate: 300,
    };
  }
}