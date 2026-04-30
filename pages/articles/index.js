import { useRouter } from 'next/router';
import { server } from "../../lib/config";
import { getAllPlaylists2, getHeaderLectures, getAllQnaCategory } from "../../lib/fetch";
import Meta from "../../components/meta";
import Header2 from "../../components/header1";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import { useState } from 'react';
import articles from '../../data/airticles-data';

export default function Articles({ playlists, headerLectures, qnaCategories }) {
  const router = useRouter();
  const isArticlesPage = router.pathname === '/articles';
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArticles = articles.filter(article =>
    article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {isArticlesPage && (
        <Meta
          title="Islamic Articles - Sheikh Assim Al Hakeem"
          description="Read authentic Islamic articles by Sheikh Assim bin Luqman al-Hakeem covering various topics of Islamic knowledge and guidance."
          url={`${server}/articles`}
          image={`${server}/img/id/default_share.jpeg`}
          type="website"
        />
      )}

      {isArticlesPage && (
        <Header2 playlists={playlists} lectures={headerLectures} qna_categories={qnaCategories} />
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a1f2e] to-[#2a3142] py-12 lg:py-16">
        <div className="container max-w-[1260px] mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="page-title text-white mb-3">Islamic Articles</h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Authentic Islamic knowledge and guidance through well-researched articles
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="container max-w-[1260px] mx-auto px-4">
          <div className="relative max-w-md">
            {/* <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /> */}
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] text-[#1a1f2e]"
            />
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-8 md:py-12 lg:py-12 lg:py-16 bg-gray-50">
        <div className="container max-w-[1260px] mx-auto px-4">
          {filteredArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article, idx) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <a href={`/articles/${article.slug || article.postSlug}`} className="block">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={article.image || article.imageSrc}
                        alt={article.title || article.postTitle}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-[#10b981]" />
                          {article.date || article.postDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <User size={12} className="text-[#10b981]" />
                          Sheikh Assim
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[#1a1f2e] mb-2 line-clamp-2 group-hover:text-[#10b981] transition-colors">
                        {article.title || article.postTitle}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {article.description || article.postExcerpt}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[#10b981] text-sm font-medium group-hover:gap-2 transition-all">
                        Read More <ArrowRight size={14} />
                      </span>
                    </div>
                  </a>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No articles found matching your search.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export async function getStaticProps(context) {
  const playlists = await getAllPlaylists2();
  const headerLectures = await getHeaderLectures();
  const qnaCategories = await getAllQnaCategory();

  return {
    props: {
      playlists: playlists?.playlists || [],
      headerLectures: headerLectures || [],
      qnaCategories: qnaCategories || [],
    },
  };
}