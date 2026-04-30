import { useRouter } from 'next/router';
import { Facebook, Twitter, Mail, Share2, ArrowLeft, Calendar, User, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getAllPlaylists2, getHeaderLectures, getAllQnaCategory } from "../../lib/fetch";
import Meta from "../../components/meta";
import Header2 from "../../components/header1";
import { server } from "../../lib/config";
import articles from '../../data/airticles-data';
import { motion } from "framer-motion";

export default function ArticleDetail({ article, playlists, headerLectures, qnaCategories }) {
  const router = useRouter();

  if (!article) {
    return (
      <>
        <Header2 playlists={playlists} lectures={headerLectures} qna_categories={qnaCategories} />
        <div className="container max-w-[1260px] mx-auto px-4 py-16 sm:py-20 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-[#1a1f2e] mb-2">Article Not Found</h1>
          <Link href="/articles" className="text-[#10b981] hover:underline text-sm sm:text-base">Back to Articles</Link>
        </div>
      </>
    );
  }

  const { slug } = router.query;
  const shareUrl = `${server}/articles/${slug}`;

  return (
    <>
      <Meta title={article.title} description={article.description} url={shareUrl} image={article.image} type="article" />

      <Header2 playlists={playlists} lectures={headerLectures} qna_categories={qnaCategories} />

      <article className="py-8 sm:py-8 lg:py-10 bg-gray-50">
        <div className="container max-w-[900px] mx-auto px-4">
          <Link href="/articles" className="inline-flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-[#10b981] mb-4 sm:mb-6 transition-colors text-sm sm:text-base">
            <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" /> Back to Articles
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
            {/* Featured Image */}
            <div className="relative h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px]">
              <Image src={article.image || article.imageSrc} alt={article.title || article.postTitle} fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6 lg:p-8">
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                <span className="flex items-center gap-1">
                  <Calendar size={12} className="sm:w-3.5 sm:h-3.5 text-[#10b981]" />
                  {article.date || article.postDate}
                </span>
                <span className="flex items-center gap-1">
                  <User size={12} className="sm:w-3.5 sm:h-3.5 text-[#10b981]" />
                  Sheikh Assim Al Hakeem
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} className="sm:w-3.5 sm:h-3.5 text-[#10b981]" />
                  5 min read
                </span>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-[#1a1f2e] mb-4 sm:mb-6 leading-tight">
                {article.title || article.postTitle}
              </h1>

              {/* Content */}
              <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none mb-6 sm:mb-8">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{article.description || article.postExcerpt}</p>
              </div>

              {/* Share Section */}
              <div className="pt-4 sm:pt-6 border-t border-gray-100">
                <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Share this article</p>
                <div className="flex gap-2 sm:gap-3">
                  <a href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer"
                    className="p-2 sm:p-2.5 bg-[#1877F2] text-white rounded-lg hover:bg-[#1877F2]/90 transition-colors">
                    <Facebook size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </a>
                  <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title || article.postTitle)}`} target="_blank" rel="noopener noreferrer"
                    className="p-2 sm:p-2.5 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1DA1F2]/90 transition-colors">
                    <Twitter size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </a>
                  <a href={`mailto:?subject=${encodeURIComponent(article.title || article.postTitle)}&body=${encodeURIComponent(shareUrl)}`}
                    className="p-2 sm:p-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                    <Mail size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </a>
                  <button onClick={() => { navigator.clipboard.writeText(shareUrl); alert('Link copied!'); }}
                    className="p-2 sm:p-2.5 bg-[#10b981] text-white rounded-lg hover:bg-[#059669] transition-colors">
                    <Share2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </article>
    </>
  );
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const article = articles.find(article => article.slug === slug || article.postSlug === slug);
  const playlists = await getAllPlaylists2();
  const headerLectures = await getHeaderLectures();
  const qnaCategories = await getAllQnaCategory();

  return {
    props: {
      article: article || null,
      playlists: playlists?.playlists || [],
      headerLectures: headerLectures || null,
      qnaCategories: qnaCategories || [],
    },
  };
}

export async function getStaticPaths() {
  const paths = articles.map(article => ({ params: { slug: article.slug || article.postSlug } }));
  return { paths, fallback: false };
}