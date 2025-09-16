'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function FaqPage() {
  const t = useTranslations('Faq');

  const faqData = [
    {
      question: t('questions.q1.question'),
      answer: t('questions.q1.answer'),
    },
    {
      question: t('questions.q2.question'),
      answer: t('questions.q2.answer'),
    },
    {
      question: t('questions.q3.question'),
      answer: t('questions.q3.answer'),
    },
    {
      question: t('questions.q4.question'),
      answer: t('questions.q4.answer'),
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaq = faqData.filter((item) =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 dark:from-gray-900 dark:via-[#0D1B2A] dark:to-[#0D1B2A] py-10 px-4 sm:px-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-700 dark:text-white mb-2">
        {t('header.title')}
      </h1>
      <p className="text-center text-orange-600 font-semibold text-lg mb-6 dark:text-orange-400">
        {t('header.subtitle')}
      </p>

      <div className="max-w-2xl mx-auto mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder={t('search.placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
          />
          <Search className="absolute right-3 top-3.5 h-5 w-5 text-gray-500 dark:text-gray-400" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {filteredFaq.map((item, index) => (
          <div
            key={index}
            className="bg-blue-100 dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700"
          >
            <button
              onClick={() => setOpenIndex(index === openIndex ? null : index)}
              className="flex items-center justify-between w-full p-4 font-semibold text-blue-800 dark:text-white text-left"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                {item.question}
              </div>
              {index === openIndex ? (
                <ChevronUp className="text-blue-600 dark:text-blue-300" />
              ) : (
                <ChevronDown className="text-blue-600 dark:text-blue-300" />
              )}
            </button>
            {index === openIndex && (
              <div className="bg-blue-200 dark:bg-gray-700 dark:text-gray-100 px-5 py-3 rounded-b-lg border-t border-blue-300 dark:border-gray-600">
                {item.answer}
              </div>
            )}
          </div>
        ))}

        {filteredFaq.length === 0 && (
          <div className="text-center text-gray-600 dark:text-gray-300 font-medium">
            {t('noResults')}
          </div>
        )}
      </div>
    </div>
  );
}