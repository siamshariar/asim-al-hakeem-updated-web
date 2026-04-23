import { server } from "../lib/config";
import Image from "next/image";
import { Facebook, Youtube, Mail, Award, BookOpen, Users, Globe, Calendar, MapPin } from 'lucide-react';
import { getAllPlaylists2, getAllQnaCategory, getHeaderLectures } from "../lib/fetch";
import Meta from "../components/meta";
import Header2 from "../components/header1";
import { motion } from "framer-motion";

export default function About({ playlists, headerLectures, qna_categories }) {
  const profile = {
    name: 'Asim Al Hakeem',
    title: 'Islamic Scholar & Educator',
    location: 'Jeddah, Saudi Arabia',
    imageSrc: '/img/about/about-img.jpg',
    socials: {
      facebook: 'https://www.facebook.com/SheikhAssimAlhakeemTeam/',
      youtube: 'https://www.youtube.com/user/assimalhakeem',
      email: 'asimalhakeem@gmail.com',
    },
    stats: [
      { label: 'Years of Experience', value: '35+', icon: Calendar },
      { label: 'Students Worldwide', value: '2M+', icon: Users },
      { label: 'Books Published', value: '20+', icon: BookOpen },
      { label: 'Countries Visited', value: '15+', icon: Globe },
    ],
  };

  return (
    <>
      <Meta title="About Sheikh Assim Al Hakeem" description="Learn about Sheikh Assim bin Luqman al-Hakeem's life and contributions" url={`${server}/about`} />
      <Header2 playlists={playlists} lectures={headerLectures} qna_categories={qna_categories} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a1f2e] to-[#2a3142] py-8 sm:py-12 lg:py-16">
        <div className="container max-w-[1260px] mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="page-title text-white mb-2 sm:mb-4">About Sheikh Assim Al Hakeem</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-sm sm:text-base lg:text-lg text-gray-300 max-w-3xl mx-auto">A lifetime dedicated to spreading authentic Islamic knowledge</motion.p>
        </div>
      </section>

      {/* Profile Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="container max-w-[1260px] mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="relative h-[250px] sm:h-[300px] lg:h-full">
                <Image src={profile.imageSrc} alt={profile.name} fill className="object-cover" />
              </div>
              <div className="p-5 sm:p-6 lg:p-8 xl:p-10">
                <div className="flex items-center gap-2 text-[#10b981] mb-2 sm:mb-3">
                  <Award size={18} className="sm:w-5 sm:h-5" />
                  <span className="font-semibold uppercase tracking-wider text-xs sm:text-sm">Islamic Scholar</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a1f2e] mb-1 sm:mb-2">{profile.name}</h2>
                <p className="text-base sm:text-lg text-gray-600 mb-1 sm:mb-2">{profile.title}</p>
                <p className="flex items-center gap-1 sm:gap-2 text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6"><MapPin size={14} className="sm:w-4 sm:h-4" />{profile.location}</p>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  {profile.stats.map((stat, idx) => (
                    <div key={idx} className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                      <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 text-[#10b981] mx-auto mb-1 sm:mb-2" />
                      <div className="text-xl sm:text-2xl font-bold text-[#1a1f2e]">{stat.value}</div>
                      <div className="text-xxs sm:text-xs text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2 sm:space-x-3">
                  <a href={profile.socials.facebook} target="_blank" className="p-2.5 sm:p-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#1877F2]/90"><Facebook size={16} className="sm:w-[18px] sm:h-[18px]" /></a>
                  <a href={profile.socials.youtube} target="_blank" className="p-2.5 sm:p-3 bg-[#FF0000] text-white rounded-lg hover:bg-[#FF0000]/90"><Youtube size={16} className="sm:w-[18px] sm:h-[18px]" /></a>
                  <a href={`mailto:${profile.socials.email}`} className="p-2.5 sm:p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"><Mail size={16} className="sm:w-[18px] sm:h-[18px]" /></a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Biography */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="container max-w-[900px] mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1a1f2e] mb-4 sm:mb-6 text-center">Biography</h2>
            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-700">
              <p className="mb-3 sm:mb-4 text-sm sm:text-base">Sheikh Assim bin Luqman al-Hakeem was born in 1962 in Al-Khobar, Saudi Arabia. He was raised there until age 12 before moving to Jeddah.</p>
              <p className="mb-3 sm:mb-4 text-sm sm:text-base">He attended King Fahd University of Petroleum and Minerals, graduating with a Major in Linguistics. His English proficiency became a blessing for spreading Islamic knowledge globally.</p>
              <p className="mb-3 sm:mb-4 text-sm sm:text-base">He began preaching in 1989, delivering Friday sermons in Arabic. His journey in English Da'wah started with programs on Saudi National TV and later expanded internationally.</p>
              <p className="text-sm sm:text-base">Today, Sheikh Assim is recognized worldwide for his authentic approach to Islamic education through lectures, books, Q&A sessions, and counseling.</p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

export async function getStaticProps() {
  const playlists = await getAllPlaylists2();
  const headerLectures = await getHeaderLectures();
  const qna_categories = await getAllQnaCategory();
  return { props: { playlists: playlists?.playlists || [], headerLectures: headerLectures || null, qna_categories: qna_categories || [] } };
}