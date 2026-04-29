import React from 'react';
import { PlusCircle } from 'lucide-react';

export default function AskQuestionCounselling() {
  return (
    <section className="py-12 lg:py-20 bg-gradient-to-br from-[#f9f5ff] via-[#efe6ff] to-[#ffffff]">
      <div className="container max-w-[1260px] mx-auto px-4 sm:px-6">
        <div className="grid gap-8 md:gap-16 lg:gap-8 lg:grid-cols-2">
          <div className="bg-green-50 rounded-lg p-6 shadow-md relative">
            <div className="absolute top-0 sm:-top-8 left-1/2 sm:left-20 -translate-x-1/2 sm:translate-x-0 w-48 h-24 bg-white rounded shadow-2xl transform -rotate-6 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-green-200" />
              <div className="relative p-4 flex items-center">
                <PlusCircle className="text-green-500 mr-2" size={28} />
                <span className="text-2xl font-semibold text-green-700">Ask a Question</span>
              </div>
            </div>
            <div className="mt-24">
              <h3 className="text-xl font-semibold mb-2">Assalamu alaikum wa rahmatullahi wa barakatuhu</h3>
              <p className="text-lg mt-4 text-gray-600 mb-4">
                Our timing for taking questions is from 6 p.m (Makkah Time).
              </p>
              <ul className="text-[16px] text-gray-600 mb-12 space-y-2">
                <li>• The quota finishes which is usually done in the first 5 to10 minutes.</li>
                <li>• Our quota of taking questions is over for the day.</li>
                <li>• Please try submitting your question early, as soon as we open (6 p.m Makkah time).</li>
              </ul>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-4">
                <a href="/ask-question" rel="Ask a Question">
                  <button className="bg-[#BBF7D0] text-xl text-black-800 font-bold px-6 py-4 rounded-xl hover:bg-green-600 hover:text-white transition-colors w-full sm:w-auto">
                    See more
                  </button>
                </a>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg sm:mt-6 md:mt-0 lg:mt-0 p-6 shadow-md relative">
            <div className="absolute top-0 sm:-top-8 left-1/2 sm:left-20 -translate-x-1/2 sm:translate-x-0 w-48 h-24 bg-white rounded shadow-2xl transform -rotate-6 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-purple-200" />
              <div className="relative p-4 flex items-center">
                <PlusCircle className="text-purple-500 mr-2" size={44} />
                <span className="text-2xl font-semibold text-purple-700">Counseling Sessions</span>
              </div>
            </div>
            <div className="mt-24">
              <h3 className="text-xl font-semibold mb-2">COUNSELING SESSIONS</h3>
              <p className="text-lg text-gray-600 mt-4 mb-4">
                Need marriage counseling? Or any other one to one live counseling via Skype, FaceTime etc by Sheikh Assim al hakeem?
              </p>
              <ul className="text-[16px] text-gray-600 mb-8 space-y-2">
                <li>• SheikhAssimAlhakeem.com</li>
                <li>• sheikhassim.bookings@gmail.com</li>
                <li>• $100 / Half Hour</li>
              </ul>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-4">
                <a href="/counselling" rel="Counselling">
                  <button className="bg-[#E9D5FF] text-xl text-black-800 font-bold px-6 py-4 rounded-xl hover:bg-purple-600 hover:text-white transition-colors w-full sm:w-auto">
                    See more
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
