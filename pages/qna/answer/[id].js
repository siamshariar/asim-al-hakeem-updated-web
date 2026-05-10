import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';
import { server } from "../../../lib/config";
import { getAllPlaylists2, getHeaderLectures, getAllQnaCategory } from "../../../lib/fetch";
import Meta from "../../../components/meta";
import Header2 from "../../../components/header1";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, Share2, Calendar, Folder, ChevronRight, CheckCircle, Copy } from "lucide-react";
import { qna, qnCat } from "../../../data/qna";
import { getAnsById } from "../../../lib/fetch";

const LAST_QNA_CATEGORY_KEY = "qna_last_category";

const toYoutubeEmbedUrl = (url) => {
  if (!url || typeof url !== "string") return "";
  if (url.includes("youtube.com/embed/")) return url;

  const watchMatch = url.match(/[?&]v=([^&]+)/i);
  if (watchMatch?.[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }

  const shortMatch = url.match(/youtu\.be\/([^?&/]+)/i);
  if (shortMatch?.[1]) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }

  return "";
};

export default function QnaAnswerDetail({ answer, playlists, headerLectures, qnaCategories }) {
  const router = useRouter();
  const [copiedShare, setCopiedShare] = useState(false);
  const shareTimeoutRef = useRef(null);

  const fromCategory = typeof router.query.from === "string"
    ? router.query.from
    : typeof router.query.category === "string"
      ? router.query.category
      : "";

  // Cleanup share timeout on unmount
  useEffect(() => {
    return () => {
      if (shareTimeoutRef.current) clearTimeout(shareTimeoutRef.current);
    };
  }, []);

  if (router.isFallback) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-[#10b981] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!answer) {
    return (
      <>
        <Header2 playlists={playlists} lectures={headerLectures} qna_categories={qnaCategories} />
        <section className="min-h-[60vh] flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center">
            <MessageCircle size={40} className="sm:w-12 sm:h-12 text-gray-300 mx-auto mb-4" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#1a1f2e] mb-2">Answer Not Found</h1>
            <p className="text-sm sm:text-base text-gray-500 mb-6">The answer you're looking for doesn't exist or has been removed.</p>
            <Link href="/qna" className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 bg-[#10b981] text-white rounded-full text-sm sm:text-base font-medium hover:bg-[#059669] transition-colors">
              Back to Q&A
            </Link>
          </div>
        </section>
      </>
    );
  }

  const categorySlug = answer.cat_slug || answer.category_slug || "all";
  const storedCategory = typeof window !== "undefined" ? window.sessionStorage.getItem(LAST_QNA_CATEGORY_KEY) : "";
  const sourceCategory = fromCategory || storedCategory || categorySlug;
  const backCategory = sourceCategory && sourceCategory !== "all" ? sourceCategory : "";
  const backUrl = backCategory ? `/qna?category=${backCategory}` : `/qna`;
  const category = qnaCategories?.find(cat => cat.slug === categorySlug) || qnCat.find(cat => cat.slug === categorySlug);
  const shareUrl = `${server}/qna/answer/${answer.id}`;
  const videoSources = [
    ...(Array.isArray(answer.youtube_videos)
      ? answer.youtube_videos.map((video) => video?.embed_url || toYoutubeEmbedUrl(video?.url || video?.video_url || video?.link)).filter(Boolean)
      : []),
    toYoutubeEmbedUrl(answer.embed_url),
    toYoutubeEmbedUrl(answer.video),
    toYoutubeEmbedUrl(answer.video_url),
  ].filter(Boolean);
  const uniqueVideoSources = [...new Set(videoSources)];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedShare(true);
      if (shareTimeoutRef.current) clearTimeout(shareTimeoutRef.current);
      shareTimeoutRef.current = setTimeout(() => setCopiedShare(false), 2000);
    }).catch(() => {
      alert('Failed to copy link. Please try again.');
    });
  };

  return (
    <>
      <Meta
        title={`${answer.question} - Sheikh Assim Al Hakeem`}
        description={answer.answer.substring(0, 160) + '...'}
        url={shareUrl}
        type="article"
      />

      <Header2 playlists={playlists} lectures={headerLectures} qna_categories={qnaCategories} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a1f2e] to-[#2a3142] py-8 sm:py-10 lg:py-12">
        <div className="container max-w-[1000px] mx-auto px-4">
          <Link 
            href={backUrl} 
            className="inline-flex items-center gap-1.5 sm:gap-2 text-gray-300 hover:text-white mb-3 sm:mb-4 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" /> Back to Q&A
          </Link>
          {category && (
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm mb-3 sm:mb-4 flex-wrap">
              <Link href={`/qna?category=all`} className="text-gray-400 hover:text-white focus:outline-none focus:ring-0 focus:border-transparent">Q&A</Link>
              <ChevronRight size={12} className="sm:w-3.5 sm:h-3.5 text-gray-500" />
              <Link href={`/qna?category=${category.slug}`} className="text-[#10b981] hover:text-[#34d399] focus:outline-none focus:ring-0 focus:border-transparent">{category.title}</Link>
            </div>
          )}
          <motion.h1 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight"
          >
            {answer.question}
          </motion.h1>
        </div>
      </section>

      {/* Answer Content */}
      <section className="py-8 sm:py-10 lg:py-14 bg-gray-50">
        <div className="container max-w-[1000px] mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="p-5 sm:p-6 lg:p-8">
                  <div className="mb-6">
                    <img
                      src="/img/qna/qna.jpg"
                      alt={answer.question}
                      className="w-full h-56 rounded-lg"
                    />
                  </div>
                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-5 sm:mb-6 pb-4 border-b border-gray-100">
                    <span className="flex items-center gap-1">
                      <Folder size={14} className="text-[#10b981]" />
                      {category?.title || 'General'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} className="text-[#10b981]" />
                      Answered by Sheikh Assim
                    </span>
                  </div>

                  {/* Question */}
                  <div className="mb-6 sm:mb-8">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#10b981]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MessageCircle size={14} className="sm:w-4 sm:h-4 text-[#10b981]" />
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-semibold text-[#1a1f2e] mb-2">Question:</h2>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{answer.question}</p>
                        {answer.excerpt && (
                          <p className="text-sm sm:text-base text-gray-500 mt-3">{answer.excerpt}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Answer */}
                  <div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#059669] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs sm:text-sm font-bold">A</span>
                      </div>
                      <div className="w-full">
                        <h2 className="text-base sm:text-lg font-semibold text-[#1a1f2e] mb-2">Answer:</h2>
                        <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
                          <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">{answer.answer}</p>
                        </div>

                        {uniqueVideoSources.length > 0 && (
                          <div className="mt-6 space-y-4">
                            {uniqueVideoSources.map((src, idx) => (
                              <div key={src} className="w-full">
                                <iframe
                                  src={src}
                                  title={`${answer.question} - Video ${idx + 1}`}
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  className="w-full rounded-xl"
                                  style={{ aspectRatio: '16/9', minHeight: '300px' }}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Share */}
                  <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-gray-100">
                    <p className="text-xs sm:text-sm text-gray-500 mb-3">Share this answer</p>
                    <div className="flex gap-2 sm:gap-3">
                      <motion.a 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 sm:p-2.5 bg-[#1877F2] text-white rounded-lg hover:bg-[#1877F2]/90 inline-flex items-center justify-center"
                        style={{ color: 'white', outline: 'none' }}
                        title="Share on Facebook"
                        aria-label="Share on Facebook"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="white" viewBox="0 0 24 24">
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                        </svg>
                      </motion.a>
                      <motion.a 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(answer.question + ' - Answered by Sheikh Assim Al-Hakeem')}&via=AssimAlHakeem`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 sm:p-2.5 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1DA1F2]/90 inline-flex items-center justify-center"
                        style={{ color: 'white', outline: 'none' }}
                        title="Share on Twitter"
                        aria-label="Share on Twitter"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="white" viewBox="0 0 24 24">
                          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                        </svg>
                      </motion.a>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCopyLink}
                        className={`p-2 sm:p-2.5 rounded-lg inline-flex items-center justify-center ${copiedShare ? 'bg-green-500' : 'bg-[#10b981] hover:bg-[#059669]'}`}
                        style={{ color: 'white', outline: 'none', border: 'none', cursor: 'pointer' }}
                        title={copiedShare ? 'Copied to clipboard!' : 'Copy link to clipboard'}
                        aria-label={copiedShare ? 'Copied to clipboard!' : 'Copy link to clipboard'}
                      >
                        {copiedShare ? (
                          <CheckCircle size={16} className="sm:w-[18px] sm:h-[18px] !text-white" />
                        ) : (
                          <Copy size={16} className="sm:w-[18px] sm:h-[18px] !text-white" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.1 }}
                className="space-y-5 sm:space-y-6"
              >
                {/* Ask Question CTA */}
                <div className="bg-gradient-to-br from-[#10b981] to-[#059669] rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-6 text-white">
                  <h3 className="text-white text-base sm:text-lg font-bold mb-2">Have a Question?</h3>
                  <p className="text-white/90 text-xs sm:text-sm mb-4">
                    Submit your question to get authentic Islamic guidance from Sheikh Assim Al Hakeem.
                  </p>
                  <Link 
                    href="/ask-question"
                    className="inline-block w-full text-center py-2 sm:py-2.5 bg-white text-[#10b981] rounded-lg text-sm sm:text-base font-medium hover:bg-gray-50 transition-colors"
                  >
                    Ask a Question
                  </Link>
                </div>

                {/* Categories */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-[#1a1f2e] mb-3 sm:mb-4">Categories</h3>
                  <div className="space-y-1.5 sm:space-y-2">
                    {(qnaCategories?.filter((cat) => cat.slug !== "all") || qnCat).map((cat) => (
                      <Link 
                          key={cat.id} 
                          href={`/qna?category=${cat.slug}`}
                          className={`block p-2 rounded-lg text-xs sm:text-sm transition-colors focus:outline-none focus:ring-0 focus:border-transparent ${
                            cat.slug === answer.cat_slug 
                              ? 'bg-[#10b981]/10 text-[#10b981] font-medium' 
                              : 'text-gray-600 hover:bg-gray-50 hover:text-[#10b981]'
                          }`}
                        >
                          {cat.title}
                        </Link>
                    ))}
                    <Link 
                      href="/qna"
                      className="block p-2 rounded-lg text-xs sm:text-sm text-[#10b981] font-medium hover:bg-[#10b981]/5 transition-colors"
                    >
                      View All Categories →
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export async function getStaticProps({ params }) {
  const { id } = params;
  const answers = await getAnsById(id);
  const answer = answers?.[0] || null;
  const playlists = await getAllPlaylists2();
  const headerLectures = await getHeaderLectures();
  const qnaCategories = await getAllQnaCategory();

  return {
    props: {
      answer,
      playlists: playlists?.playlists || [],
      headerLectures: headerLectures || null,
      qnaCategories: qnaCategories || [],
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const paths = qna.map(item => ({
    params: { id: item.id.toString() },
  }));

  return {
    paths,
    fallback: true,
  };
}
