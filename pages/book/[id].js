import { Download, Share2 } from 'lucide-react'; 
import Image from 'next/image';
import { useRouter } from 'next/router';
import Meta from '../../components/meta';
import { getAllPlaylists2, getHeaderLectures, getAllQnaCategory } from "../../lib/fetch";
import Header2 from '../../components/header1';
import { useState, useEffect } from 'react';

// Book data
const bookData = {
  1: {
    id: 1,
    name: 'The Islamic Faith',
    writer: 'Assim Alhakeem',
    translator: 'Adil Salhi',
    image: '/img/books/book-1.jpg', 
    description: `Here is a very interesting book on the fundamentals of belief. Its author wrote it in response to the question: "What will the servant be questioned on the day of judgment?`,
    quote: '',
    rating: 3.94,
    totalRatings: '2,637,456',
    totalReviews: '53,272',
    downloadLink: '/path/to/download', 
  },
  2: {
    id: 2,
    name: 'The Islamic Faith',
    writer: 'Assim Alhakeem',
    translator: 'Adil Salhi',
    image: '/img/books/book-2.jpg', 
    description: `Here is a very interesting book on the fundamentals of belief. Its author wrote it in response to the question: "What will the servant be questioned on the day of judgment?`,
    quote: '',
    rating: 3.94,
    totalRatings: '2,637,456',
    totalReviews: '53,272',
    downloadLink: '/path/to/download', 
  },
  3: {
    id: 3,
    name: 'The Islamic Faith',
    writer: 'Assim Alhakeem',
    translator: 'Adil Salhi',
    image: '/img/books/book-3.jpg', 
    description: `Here is a very interesting book on the fundamentals of belief. Its author wrote it in response to the question: "What will the servant be questioned on the day of judgment?`,
    quote: '',
    rating: 3.94,
    totalRatings: '2,637,456',
    totalReviews: '53,272',
    downloadLink: '/path/to/download', 
  },
  4: {
    id: 4,
    name: 'The Islamic Faith',
    writer: 'Assim Alhakeem',
    translator: 'Adil Salhi',
    image: '/img/books/book-4.jpg', 
    description: `Here is a very interesting book on the fundamentals of belief. Its author wrote it in response to the question: "What will the servant be questioned on the day of judgment?`,
    quote: '',
    rating: 3.94,
    totalRatings: '2,637,456',
    totalReviews: '53,272',
    downloadLink: '/path/to/download', 
  },
  // Add other book data here...
};

// Book Detail component
const BookDetail = ({ playlists, headerLectures, qnaCategories }) => {
  const router = useRouter();
  const { id } = router.query;
  
  // Ensure the book is available by checking if `id` exists
  const book = id ? bookData[id] : null;

  const [showMore, setShowMore] = useState(false);

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Meta
        title={book.name}
        description={book.description}
        url={`/book/${id}`}
        image={book.image}
        type="article"
      />
      <Header2
        playlists={playlists}
        lectures={headerLectures}
        qna_categories={qnaCategories}
      />
      <div className="container mx-auto py-12 px-4 lg:px-0">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6 flex flex-col sm:flex-row">
        <div className="flex justify-center sm:justify-start">
          <Image 
            src={book.image} 
            alt={book.name} 
            width={150} 
            height={230} 
            className="rounded-lg shadow-md"
          />
        </div>
        <div className="mt-6 sm:mt-0 sm:ml-6 flex-1">
          <h1 className="text-2xl ml-3 font-bold text-gray-800 text-center sm:text-left">
            {book.name}
          </h1>
          <p className="text-gray-600 text-lg mt-4 ml-4 text-center sm:text-left">
            <strong>Writer:</strong> {book.writer}
          </p>
          <p className="text-gray-600 pb-4 border-b-[2px] border-[#DCDCDC] text-lg mt-2 ml-4 text-center sm:text-left">
            <strong>Translator:</strong> {book.translator}
          </p>
          <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-center sm:justify-start gap-3 w-full">
            <a
              href={book.downloadLink}
              download
              className="bg-teal-500 text-white mt-0 sm:mt-2 px-4 py-2.5 text-sm sm:text-base lg:text-lg rounded-lg inline-flex items-center justify-center gap-2 w-full sm:flex-1 hover:bg-teal-500 hover:text-white transition"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex-shrink-0" />
              Download
            </a>

            <button
              className="ml-0 sm:ml-auto bg-gray-500 text-white px-4 py-2.5 text-sm sm:text-base lg:text-lg rounded-lg inline-flex items-center justify-center gap-2 w-full sm:flex-1 hover:bg-gray-500 hover:text-white transition"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: book.name,
                    text: 'Check out this book!',
                    url: window.location.href,
                  });
                } else {
                  alert('Sharing not supported in this browser');
                }
              }}
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex-shrink-0" />
              Share
            </button>
          </div>

          <div className="mt-6 ml-5 text-center sm:text-left">
            <p className="text-gray-600 text-lg">
              {book.description}
            </p>
            {showMore && (
              <p className="text-gray-600 mt-2">
                {book.quote}
              </p>
            )}
            <button
              onClick={() => setShowMore(!showMore)}
              className="text-teal-600 mt-2 text-sm sm:text-base hover:text-teal-700"
            >
              {showMore ? 'See less' : 'See more'}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

// Fetch the playlists, header lectures, and QnA categories
export async function getStaticProps() {
  const playlists = await getAllPlaylists2();
  const headerLectures = await getHeaderLectures();
  const qnaCategories = await getAllQnaCategory();

  return {
    props: {
      playlists: playlists.playlists, // Assuming playlists is an object with a playlists property
      headerLectures,
      qnaCategories,
    },
    revalidate: 10, // ISR: Revalidate the data every 10 seconds
  };
}

// Define dynamic paths for each book
export async function getStaticPaths() {
  const paths = Object.keys(bookData).map((id) => ({
    params: { id }, // Map each book ID to a path
  }));

  return { paths, fallback: false };
}

export default BookDetail;
