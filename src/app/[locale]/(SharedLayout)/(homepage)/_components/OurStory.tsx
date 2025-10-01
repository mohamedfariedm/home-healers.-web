"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import parse from "html-react-parser";
import { ShowMore } from "@/components/Animations/ShowMore";

export default function OurStory({ locale, data }: { locale: string; data: any[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isSectionInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
console.log("Data:", data);

const visibleArticles = data?.filter(article => article.show_in_home_page);

const featuredArticle = visibleArticles[0];
const otherArticles = visibleArticles.slice(1);

  return (
    <section
      ref={sectionRef}
      className="main-container w-full max-w-[1280px] mx-auto px-4 py-10"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      {/* Header */}
      <motion.div
        className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={isSectionInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >

         <div className="text-start">
          <span className="text-sm text-[#62a0f6] font-medium block mb-1">
            {locale === "ar"
              ? "استشكف اخر المقالات الطبية"
              : "Explore the Latest Medical Articles"}
          </span>
          <h2 className="text-2xl lg:text-3xl font-semibold text-[#1e1e1e] leading-snug">
            {locale === "ar" ? "استكشف آخر " : "Explore the latest "}
            <span className="text-[#62a0f6]">
              {locale === "ar" ? "المقالات الطبية" : "Medical Articles"}
            </span>
          </h2>
        </div>
        <Link href={`/${locale}/blog`}>
          <motion.div className="flex items-center gap-3 hover:scale-105 transition-all duration-500  rounded-xl bg-[#143087] text-white px-4 py-2 ">
            <span className="text-base font-medium">
              {locale === "ar" ? "جميع المقالات" : "All Articles"}
            </span>
                        <ArrowLeft className="w-5 h-5" />

          </motion.div>
        </Link>

       
      </motion.div>

      {/* Featured Article */}
      {featuredArticle && (
        <Link className="hover:scale-105 transition-all duration-500 block" href={`/${locale}/blog/${featuredArticle.slug[locale]}`} >
          <motion.div
            className="mt-12 bg-[#eff6fe] rounded-3xl overflow-hidden flex flex-col lg:flex-row gap-6 p-6 cursor-pointer hover:shadow-xl transition"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isSectionInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
          >
            {/* Image */}
            <div
              className="w-full lg:w-[360px] h-[260px] lg:h-[360px] bg-cover bg-center rounded-2xl"
              style={{
                backgroundImage: `url(${
                  featuredArticle.image?.[0]?.original || "/assets/images/placeholder.jpg"
                })`,
              }}
            />

            {/* Text */}
            <div className="flex flex-col  gap-6 text-start flex-1">
              <span className="text-sm text-[#62a0f6] font-medium w-full text-end">
                {formatDate(featuredArticle.date)}
              </span>
              <h3 className="text-xl font-bold text-[#1e1e1e]">{featuredArticle.name}</h3>
              <div className="text-[#1e1e1e] text-base font-light leading-[28px] line-clamp-6 ">
                {parse(featuredArticle.description)}
              </div>
              
            </div>
          </motion.div>
        </Link>
      )}

      {/* Other Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {otherArticles.map((article, index) => (
          <Link className="hover:scale-105 transition-all duration-500" key={article.id} href={`/${locale}/blog/${article.slug[locale]}`}>
            <motion.div
              className="bg-[#eff6fe] rounded-2xl p-5 h-full flex flex-col justify-between hover:shadow-md hover:scale-105 transition-all duration-500 "
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div
                className="w-full h-[200px] bg-cover bg-center rounded-xl mb-4"
                style={{
                  backgroundImage: `url(${
                    article.image?.[0]?.original || "/assets/images/placeholder.jpg"
                  })`,
                }}
              />
              <div className="flex flex-col gap-3 text-start">
                <span className="text-sm text-[#62a0f6] font-medium w-full text-end">
                  {formatDate(article.date)}
                </span>
                <h4 className="text-lg font-semibold text-[#1e1e1e]">{article.name}</h4>
                <div className="text-sm text-[#1e1e1e] leading-6 font-light line-clamp-4">
                  {parse(article.description)}
                </div>
                
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}
