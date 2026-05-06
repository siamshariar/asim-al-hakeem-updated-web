import { server } from "../../lib/config";
import { getAllPlaylists2, getHeaderLectures, getAllQnaCategory, getQnaByLimit, getQnCatTitle } from "../../lib/fetch";
import Meta from "../../components/meta";
import Header2 from "../../components/header1";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, ChevronRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";

export default function QnaCategoryPage({ playlists, headerLectures, qnaCategories, qnaItems, categoryTitle }) {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <>
      <Meta title={`${categoryTitle} - Q&A`} description={`Islamic Q&A on ${categoryTitle}`} />
      <Header2 playlists={playlists} lectures={headerLectures} qna_categories={qnaCategories} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a1f2e] to-[#2a3142] py-8 sm:py-10 lg:py-14">
        <div className="container max-w-[1260px] mx-auto px-4">
          <Link href="/qna" className="inline-flex items-center gap-1.5 sm:gap-2 text-gray-300 hover:text-white mb-3 sm:mb-4 transition-colors text-sm sm:text-base">
            <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" /> Back to Q&A
          </Link>
          <h1 className="page-title text-white">{categoryTitle}</h1>
          <p className="text-sm sm:text-base text-gray-400 mt-1 sm:mt-2">
            {qnaItems?.length || 0} {qnaItems?.length === 1 ? 'question' : 'questions'} in this category
          </p>
        </div>
      </section>

      {/* Q&A List */}
      <section className="py-8 sm:py-10 lg:py-14 bg-gray-50 min-h-[60vh]">
        <div className="container max-w-[1000px] mx-auto px-4">
          {qnaItems?.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {qnaItems.map((item, idx) => (
                <motion.div 
                  key={item.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }} 
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4 sm:p-5 lg:p-6"
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <MessageCircle size={16} className="sm:w-[18px] sm:h-[18px] lg:w-5 lg:h-5 text-[#10b981] mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-[#1a1f2e] mb-1.5 sm:mb-2 line-clamp-2">
                        {item.question}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 sm:line-clamp-3 mb-2 sm:mb-3">
                        {item.content || item.answer}
                      </p>
                      <Link 
                        href={`/qna/answer/${item.id}`} 
                        className="inline-flex items-center gap-1 text-[#10b981] text-xs sm:text-sm font-medium hover:gap-2 transition-all"
                      >
                        Read Full Answer <ChevronRight size={12} className="sm:w-3.5 sm:h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <MessageCircle size={40} className="sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-1 sm:mb-2">No questions found</h3>
              <p className="text-sm sm:text-base text-gray-500">No questions in this category yet.</p>
              <Link href="/ask-question" className="inline-block mt-4 sm:mt-6 text-[#10b981] hover:underline text-sm sm:text-base">
                Be the first to ask a question →
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const playlists = await getAllPlaylists2();
  const headerLectures = await getHeaderLectures();
  const qnaCategories = await getAllQnaCategory();
  const allQna = await getQnaByLimit(5000);
  const qnaItems = allQna?.filter(item => item.cat_slug === slug || item.categories?.includes(slug)) || [];
  const categoryTitle = await getQnCatTitle(slug);

  return {
    props: {
      playlists: playlists?.playlists || [],
      headerLectures: headerLectures || null,
      qnaCategories: qnaCategories || [],
      qnaItems,
      categoryTitle: categoryTitle || slug,
    },
  };
}

export async function getStaticPaths() {
  const qnaCategories = await getAllQnaCategory();
  const paths = qnaCategories?.filter(c => c.slug !== "all").map(cat => ({
    params: { slug: cat.slug },
  })) || [];

  return { paths, fallback: false };
}