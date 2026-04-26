import { server } from "../../lib/config";
import { getBooks, getBookDetails, getAllPlaylists2, getHeaderLectures, getAllQnaCategory } from "../../lib/fetch";
import Image from "next/image";
import Meta from "../../components/meta";
import Header2 from "../../components/header1";
import Share from "../../components/share";
import { motion } from "framer-motion";
import { BookOpen, Download, ShoppingCart, FileText, User, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BookDetail({ detail, playlists, headerLectures, qnaCategories }) {
  if (!detail) {
    return (
      <>
        <Header2 playlists={playlists} lectures={headerLectures} qna_categories={qnaCategories} />
        <div className="container max-w-[1260px] mx-auto px-4 py-16 sm:py-20 text-center">
          <BookOpen size={40} className="sm:w-12 sm:h-12 text-gray-300 mx-auto mb-4" />
          <h1 className="text-xl sm:text-2xl font-bold text-[#1a1f2e] mb-2">Book Not Found</h1>
          <Link href="/books" className="text-[#10b981] hover:underline text-sm sm:text-base">Back to Books</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Meta title={detail.bookName} url={`${server}/books/${detail.bookSlug}`} image={detail.imageSrc}
        description={detail.bookExcerpt || "Islamic book by Sheikh Assim Al Hakeem"} type="website" />

      <Header2 playlists={playlists} lectures={headerLectures} qna_categories={qnaCategories} />

      <section className="blog-detail-ctn mt-0">
        <div className="py-6 lg:py-12">
          
          <div className="container max-w-[1260px] mx-auto">
                            <div className="col s12 l12 mb-4">
                  <Link href="/books" className="inline-flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-[#10b981] transition-colors text-sm sm:text-base">
                    <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" /> Back to Books
                  </Link>
                </div>
            <div className="blog-area lg:mx-0">
              <div className="row margin-bottom-0">

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="blog-detail book-detail">
                  <div className="row margin-bottom-0">
                    <div className="col s12 l5">
                      <div className="book-detail-left-wrapper">
                        <div className="book-detail-left">
                          <div className="book-detail-left-inner">
                            <Image
                              src={detail.imageSrc || "/img/books/default.jpg"}
                              alt={detail.bookName}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col s12 l7">
                      <div className="book-detail-right">
                        <h2 className="book-title">{detail.bookName}</h2>

                        <div className="book-writer-area">
                          <p>Writter: <i>{detail.writer || "Sheikh Assim Al Hakeem"}</i></p>
                          {detail.translator && (
                            <p>Translator: <i>{detail.translator}</i></p>
                          )}
                        </div>

                        <div className="book-action">
                          <div className="book-btn">
                            {detail.link && (
                              <a className="btn-r read-more" target="_blank" rel="noopener noreferrer" href={detail.link}>
                                <Download />
                                <span>Download</span>
                              </a>
                            )}
                            {detail.purchaseLink && (
                              <a className="btn-r read-more" target="_blank" rel="noopener noreferrer" href={detail.purchaseLink}>
                                <ShoppingCart />
                                <span>Buy</span>
                              </a>
                            )}
                            {detail.pdf && (
                              <a className="btn-r read-more" target="_blank" rel="noopener noreferrer" href={`${server}/pdf-viewer/web/viewer.html?file=${detail.pdf}`}>
                                <FileText />
                                <span>Read</span>
                              </a>
                            )}
                            {!detail.link && !detail.purchaseLink && !detail.pdf && (
                              <span className="no-link">{detail.linkNotAvailableText || "Link not available"}...</span>
                            )}
                          </div>

                          <div className="blog-share book-share">
                            <Share urlWeb={`books/${detail.bookSlug}`} urlMobile={detail.bookSlug} title={detail.bookName} />
                          </div>
                        </div>

                        <p className="book-detail-desc">{detail.bookDesc || detail.bookExcerpt}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export async function getStaticProps({ params }) {
  const slug = params.slug;
  const detail = await getBookDetails(slug);
  const playlists = await getAllPlaylists2();
  const headerLectures = await getHeaderLectures();
  const qnaCategories = await getAllQnaCategory();

  return {
    props: {
      detail: detail || null,
      playlists: playlists?.playlists || [],
      headerLectures: headerLectures || null,
      qnaCategories: qnaCategories || [],
    },
  };
}

export async function getStaticPaths() {
  const books = await getBooks();
  const paths = books?.map((book) => ({ params: { slug: book.bookSlug } })) || [];
  return { paths, fallback: false };
}