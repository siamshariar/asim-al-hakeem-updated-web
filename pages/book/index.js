import Link from 'next/link';
import React, { useEffect } from 'react';
import Swiper from 'swiper/bundle';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useRouter } from 'next/router';
import { getAllPlaylists2, getHeaderLectures, getAllQnaCategory } from "../../lib/fetch";
import Meta from "../../components/meta"; // Meta component for SEO
import Header2 from "../../components/header1";

const BookSlider = ({ playlists, headerLectures, qnaCategories }) => {
  const router = useRouter();
  
  // Detect if the current route is the home page or the book page
  const isHomePage = router.pathname === '/';
  const isBookPage = router.pathname === '/book';

  const books = [
    {
      id: 1,
      title: 'Understanding Pediatrics',
      author: 'Dr. Asim Al Hakeem',
      image: '/img/books/book-1.jpg',
      description: 'A comprehensive guide to pediatric care.',
      width: 100,
      height: 100,
    },
    {
      id: 2,
      title: 'The Heart of Medicine',
      author: 'Dr. Asim Al Hakeem',
      image: '/img/books/book-2.jpg',
      description: 'Insights into cardiology and heart health.',
      width: 250,
      height: 350,
    }
  ];

  useEffect(() => {
    if (isHomePage) {
      // Initialize Swiper only on the homepage
      const swiper = new Swiper('.swiper', {
        direction: 'horizontal',
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      });
    }
  }, [router.pathname]); // Re-initialize Swiper on route change

  return (
    <>
      <Meta
        title=""
        description="Explore our collection of medical books."
        image="/img/id/default_share.jpeg"
        url="/counselling-session"
        type="website"
      />
  
      {/* Conditionally display the header only if not on the home page */}
      {!isHomePage && (
        <Header2
          playlists={playlists}
          lectures={headerLectures}
          qna_categories={qnaCategories}
        />
      )}
  
      {/* Conditionally show the slider on the home page */}
      {isHomePage && (
       <section className="books pb-100 py-6 section pb-[100px]">
       <div className="container mx-auto">
         <h2 className="books__title page-title mb-[50px] text-center md:text-left">Books</h2>
         <div className="books__slider swiper min-h-[430px]">
           <div className="swiper-wrapper">
             {books.map((book, index) => {
               if (index % 2 === 0) {
                 return (
                   <div key={index} className="swiper-slide pb-24">
                     <div className="flex flex-col md:flex-col lg:flex-row  gap-9">
                       {/* First Book */}
                       <div className="flex-1 flex flex-row sm:flex-row md:flex-row lg:flex-row items-center gap-[30px]">
                         <div className="flex-1">
                           <Link href={`/book/${books[index].id}`}>
                             <img
                               src={books[index].image}
                               alt={books[index].title}
                               className="w-full h-auto rounded-lg cursor-pointer"
                               width={books[index].width || 'auto'}
                               height={books[index].height || 'auto'}
                             />
                           </Link>
                         </div>
                         <div className="flex-1 flex flex-col mt-8 sm:pl-6 md:pl-6">
                           <Link href={`/book/${books[index].id}`}>
                             <h4 className="h4 text-[#4C5354] font-bold text-3xl mb-[8px] cursor-pointer text-center md:text-left">
                               {books[index].title}
                             </h4>
                           </Link>
                           <div className="text-card-meta text-[#9AB4B7] mb-[6px] text-center md:text-left max-w-[320px]">
                             {books[index].author}
                           </div>
                           <p className="text-card-description text-[#777F81] mb-[26px] text-center md:text-left max-w-[320px]">
                             {books[index].description}
                           </p>
                         </div>
                       </div>
     
                       {/* Second Book (if available) */}
                       {books[index + 1] && (
                         <div className="flex-1 flex flex-row sm:flex-row md:flex-row items-center gap-[30px]">
                           <div className="flex-1">
                             <Link href={`/book/${books[index + 1].id}`}>
                               <img
                                 src={books[index + 1].image}
                                 alt={books[index + 1].title}
                                 className="w-full h-auto rounded-lg cursor-pointer"
                                 width={books[index + 1].width || 'auto'}
                                 height={books[index + 1].height || 'auto'}
                               />
                             </Link>
                           </div>
                           <div className="flex-1 flex flex-col sm:pl-6 md:pl-6">
                             <Link href={`/book/${books[index + 1].id}`}>
                               <h4 className="h4 text-[#4C5354] font-bold text-3xl mb-[8px] cursor-pointer text-center md:text-left">
                                 {books[index + 1].title}
                               </h4>
                             </Link>
                             <div className="text-[#9AB4B7] text-[18px] mb-[6px] text-center md:text-left max-w-[320px]">
                               {books[index + 1].author}
                             </div>
                             <p className="font-light text-[#777F81] text-[18px] mb-[26px] text-center md:text-left max-w-[320px]">
                               {books[index + 1].description}
                             </p>
                           </div>
                         </div>
                       )}
                     </div>
                   </div>
                 );
               }
               return null;
             })}
           </div>
           <div className="swiper-pagination"></div>
         </div>
       </div>
     </section>
     
     
     
      
      )}
  
      {/* Conditionally show the books in a simple list/grid on the book page */}
      {isBookPage && (
        <section className="books pb-100 py-12 section pb-[100px]">
        <div className="container mx-auto">
          <h2 className="books__title text-4xl font-bold mb-[50px] text-center xl:text-left">Books</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {books.map((book) => (
              <div key={book.id} className="book-item flex flex-row md:flex-col items-center md:items-center">
                <Link href={`/book/${book.id}`} className="w-1/2 md:w-full">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-auto rounded-lg cursor-pointer mb-4 md:mb-0"
                    width={book.width || 'auto'}
                    height={book.height || 'auto'}
                  />
                </Link>
                <div className="w-1/2 md:w-full md:mt-4 md:pl-0 pl-4 flex flex-col items-start md:items-center">
                  <h4 className="h4 text-[#4C5354] sm:text-2xl md:text-[26px] font-bold mb-[8px] text-left md:text-center">
                    <Link href={`/book/${book.id}`}>{book.title}</Link>
                  </h4>
                  <div className="text-[#9AB4B7] sm:text-xl sm:mt-3 text-[22px] mb-[12px] text-left md:text-center">
                    {book.author}
                  </div>
                  <p className="font-light text-[#777F81] sm:mt-2 sm:text-lg text-[20px] mb-[26px] text-left md:text-center">
                    {book.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      
      )}
    </>
  );
  
};

export default BookSlider;

export async function getStaticProps() {
  const playlists = await getAllPlaylists2();
  const headerLectures = await getHeaderLectures();
  const qnaCategories = await getAllQnaCategory();

  return {
    props: {
      playlists: playlists.playlists,
      headerLectures,
      qnaCategories,
    },
  };
}
