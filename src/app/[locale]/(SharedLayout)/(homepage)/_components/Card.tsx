"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Post {
  id: number;
  title: string;
  description?: string;
  section_id: number;
  active: number;
  created_at: string;
  updated_at: string;
}

interface Section {
  id: number;
  title: string;
  slug: string | null;
  page_id: number;
  Posts: Post[];
  active: number;
  priority: number;
  created_at: string;
  updated_at: string;
}

interface CardProps {
  locale: string;
  section: Section;
}

function Card({ locale, section }: CardProps) {
  // Refs for different sections
  console.log("Card Section Data:", section);

  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const cardImageRef = useRef<HTMLDivElement>(null);

  // Check if sections are in view
  const isSectionInView = useInView(sectionRef, { once: false, amount: 0.2 });
  const isCardsInView = useInView(cardsRef, { once: false, amount: 0.3 });
  const isCardImageInView = useInView(cardImageRef, {
    once: false,
    amount: 0.3,
  });

  // Extract data from section
  const mainPost =
    section?.Posts.find((post) => post.description) || section?.Posts[0];
  const cardPosts = section?.Posts.filter(
    (post) => !post.description && post.id !== mainPost?.id
  ).slice(0, 3);

  // Card styling data - keeping the visual design but making content dynamic
  const cardStyles = [
    {
      bgColor: "#00b5b4",
      iconUrl:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-13/oyagdjg0Uw.png",
      bgUrl:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-13/MYzDAtQX71.png",
    },
    {
      bgColor: "#62a0f6",
      iconUrl:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-13/rLXfmB2tP2.png",
      bgUrl:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-13/KFeLeCb3fU.png",
    },
    {
      bgColor: "#5ad0ae",
      iconUrl:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-13/vqOoD1wwb0.png",
      bgUrl:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-13/TzRKwKqjBT.png",
    },
  ];

  // Combine posts with styling
  const cards = cardPosts?.map((post, index) => ({
    id: post.id,
    text: post.title,
    ...cardStyles[index],
  }));

  // Parse the main title to highlight specific parts
  const parseTitle = (title: string) => {
    const parts = title?.split(" ");
    return parts?.map((part, index) => {
      const isHighlighted = part.includes("الطبي") || part.includes("هيلرز");
      return (
        <span
          key={index}
          className={`text-[30px] font-semibold leading-[40px] relative text-start ${
            isHighlighted ? "text-[#62a0f6]" : "text-[#1e1e1e]"
          }`}
        >
          {part}
          {index < parts?.length - 1 ? " " : ""}
        </span>
      );
    });
  };

  return (
    <div
      ref={sectionRef}
      className="main-container w-full max-w-[1280px] xl:h-[913px] relative mx-auto my-0"
    >
      {/* Header Section */}
      <motion.div
        className="flex w-full max-w-[610px] flex-col gap-[16px] items-end relative z-[24] mt-[60px] mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={
          isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }
        }
        transition={{ duration: 0.5 }}
      >
        <div className="flex gap-[10px] justify-center items-center self-stretch relative z-[25]">
          <div className="w-[610px] text-[30px] font-semibold leading-[40px] relative text-center xl:text-center z-[26]">
            {parseTitle(mainPost?.title || section?.title)}
          </div>
        </div>
        {mainPost?.description && (
          <div className="flex gap-[10px] justify-center items-center self-stretch relative z-[27]">
            <span className="flex w-[564px] justify-center items-start basis-auto text-[16px] font-medium leading-[24px] text-[#1e1e1e] relative text-center z-[28]">
              {mainPost.description}
            </span>
          </div>
        )}
      </motion.div>

      {/* Cards Section */}
      <div
        ref={cardsRef}
        className="flex w-full max-w-[1075px] flex-col gap-[24px] items-center justify-center relative z-[1] mt-[33px] mx-auto"
      >
        <motion.div
          className="flex gap-5 xl:gap-[86px] flex-col md:flex-row flex-wrap justify-center items-center relative z-[2]"
          initial={{ opacity: 0, y: 30 }}
          animate={isCardsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, staggerChildren: 0.2 }}
        >
          {cards?.map((card, index) => (
            <motion.div
              key={card.id}
              className="w-[301px] h-[227px] flex justify-center relative z-[15] cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ y: -5 }}
              animate={{
                y: ["0%", "-10%", "0%"],
                opacity: [1, 0.7, 1],
              }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 2 + index * 0.5, // Stagger the animation timing
                ease: "easeInOut",
              }}
            >
              <div
                className="flex w-[26.91%] h-[35.68%] pt-[16px] pr-[16px] pb-[16px] pl-[16px] gap-[10px] justify-center items-center rounded-[50%] border-solid border-4 border-[#fff] absolute top-[-10%] box-content z-[18]"
                style={{ backgroundColor: card.bgColor }}
              >
                <div className="w-[56px] h-[56px] relative overflow-hidden z-[19] flex justify-center items-center">
                  <div
                    className="w-[44.333px] h-[46.667px] bg-no-repeat relative z-20"
                    style={{
                      backgroundImage: `url(${card.iconUrl})`,
                      backgroundSize: "100% 100%",
                    }}
                  />
                </div>
              </div>

              <div
                className="w-full h-[83.26%] bg-no-repeat absolute top-[16.74%] start-0 z-[16]"
                style={{
                  backgroundImage: `url(${card.bgUrl})`,
                  backgroundSize: "100% 100%",
                }}
              />

              <span className="flex w-[275px] h-[26.43%] justify-center items-start text-[20px] font-semibold leading-[30px] text-[#fff] absolute top-[45.37%] start-[4.32%] text-center overflow-hidden z-[17]">
                {card.text}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Card Image Section */}
        <motion.div
          ref={cardImageRef}
          className="flex w-full max-w-[480px] flex-col gap-[32px] items-center relative z-[21]"
          initial={{ opacity: 0, y: 30 }}
          animate={
            isCardImageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
          }
          transition={{ duration: 0.6 }}
        >
          <div
            className="holographic-card w-[480px] h-[290px] flex justify-center items-center relative overflow-hidden rounded-[15px] transition-all duration-500 ease-in-out bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-13/Z6UVEmXVtZ.png)",
              backgroundPosition: "center center",
              backgroundSize: "cover",
            }}
          >
            {/* Holographic shine effect */}
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-t from-transparent to-[rgba(0, 255, 255, 0.3)] rotate-[-45deg] opacity-0 transition-all duration-500 ease-in-out"></div>
          </div>
        </motion.div>
      </div>

      {/* Button Section */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Link
          className="flex rtl:w-[255px] ltr:w-[400px] h-[56px] pt-[8px] pr-[16px] pb-[8px] pl-[16px] gap-[10px] justify-center items-center bg-[#143087] rounded-[8px] border-solid border border-[#143087] relative z-[29] mt-[56px] mx-auto cursor-pointer hover:scale-110 transition-all duration-500"
          href={`${locale === "ar" ? "" : "/en"}/contact`}
        >
          <span className="h-[28px] shrink-0 basis-auto text-[18px] font-medium leading-[28px] text-[#fff] relative text-start z-[32]">
            {locale === "ar"
              ? "اطلب الكارت الطبي الان"
              : "Request Your Medical Card"}
          </span>
          <div className="w-[24px] h-[24px] relative overflow-hidden z-30">
            <ArrowLeft className="w-6 h-6 text-white" />
          </div>
        </Link>
      </motion.div>

      {/* Background container */}
    </div>
  );
}

export default Card;
