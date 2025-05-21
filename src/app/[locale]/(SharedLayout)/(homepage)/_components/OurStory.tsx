"use client"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { ShowMore } from "@/components/Animations/ShowMore"

function OurStory() {
  // Refs for different sections
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const articlesRef = useRef<HTMLDivElement>(null)

  // Check if sections are in view
  const isSectionInView = useInView(sectionRef, { once: false, amount: 0.1 })
  const isHeaderInView = useInView(headerRef, { once: false, amount: 0.5 })
  const isArticlesInView = useInView(articlesRef, { once: false, amount: 0.2 })

  // Animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  }

  const headerItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  }

  const articlesContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3,
      },
    },
  }

  const leftColumnVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  }

  const rightColumnVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const articleCardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    hover: {
      y: -10,
      boxShadow: "0 10px 25px rgba(20, 48, 135, 0.1)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  }

  const buttonVariants = {
    hover: {
      scale: 1.1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.1,
      },
    },
  }

  return (
    <div ref={sectionRef} className="main-container ltr:rtl rtl:ltr w-full max-w-[1280px] mx-auto my-0 px-4 py-6">
      {/* Header Section */}
      <motion.div
        ref={headerRef}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6"
        variants={headerVariants}
        initial="hidden"
        animate={isHeaderInView ? "visible" : "hidden"}
      >
        <motion.div
          className="flex items-center gap-3 bg-[#143087] text-white px-4 py-2 rounded-[8px] border border-[#143087]"
          variants={headerItemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="text-[18px] font-medium leading-[28px]">جميع المقالات</span>
        </motion.div>

        <motion.div className="flex flex-col gap-2 items-end" variants={headerItemVariants}>
          <motion.span className="text-[16px] font-medium text-[#62a0f6]" variants={headerItemVariants}>
            اخر المقالات الطبية
          </motion.span>
          <motion.h2
            className="text-[30px] font-semibold leading-[40px] text-[#1e1e1e] text-end"
            variants={headerItemVariants}
          >
            استشكف اخر <span className="text-[#62a0f6]">المقالات</span> الطبية
          </motion.h2>
        </motion.div>
      </motion.div>

      {/* Articles Section */}
      <motion.div
        ref={articlesRef}
        className="flex flex-col lg:flex-row gap-8 mt-12"
        variants={articlesContainerVariants}
        initial="hidden"
        animate={isArticlesInView ? "visible" : "hidden"}
      >
        {/* Left Column */}
        <motion.div className="flex flex-col gap-8 flex-1" variants={leftColumnVariants}>
          {[0, 1].map((_, i) => (
            <motion.div
              key={i}
              className="relative bg-[#eff6fe] rounded-[24px] p-5 cursor-pointer"
              variants={articleCardVariants}
              whileHover="hover"
            >
              <div className="flex flex-col md:flex-row items-center gap-5">
                {/* Article Text */}
                <div className="flex flex-col gap-5 text-end items-end max-w-[353px]">
                  <span className="text-[16px] font-medium text-[#62a0f6]">3 ديسمبر 2025</span>
                  <div>
                    <h3 className="text-[20px] font-semibold text-[#1e1e1e] mb-2">اخر تطورات المجال الطبي</h3>
                    <p className="text-[16px] font-light text-[#1e1e1e] leading-[32px]">
                      هنا يكتب وصف بسيط عن المنتج في سطرين كمثال , هنا يكتب وصف بسيط عن المنتج في سطرين كمثال.
                    </p>
                  </div>
                              <ShowMore />
                  
                </div>
                {/* Image */}
                <motion.div
                  className="w-[219px] h-[268px] bg-[url('/assets/images/homehellers/Frame2.svg')] bg-cover bg-no-repeat rounded-[20px]"
                  variants={imageVariants}
                  whileHover={{ scale: 1.05 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Right Column */}
        <motion.div
          className="flex flex-col items-end bg-[#eff6fe] rounded-[24px] p-6 w-full xl:max-w-[612px] cursor-pointer"
          variants={rightColumnVariants}
          whileHover="hover"
        >
          <motion.div
            className="w-full h-[370px] bg-[url('/assets/images/homehellers/Frame3.svg')] bg-cover bg-no-repeat rounded-[20px] mb-6"
            variants={imageVariants}
            whileHover={{ scale: 1.03 }}
          />
            <ShowMore />
          <span className="text-[16px] font-medium text-[#62a0f6] mb-2 text-end">3 ديسمبر 2025</span>
          <h3 className="text-[20px] font-semibold text-[#1e1e1e] text-end mb-2">اخر تطورات المجال الطبي</h3>
          <p className="text-[16px] font-light text-[#1e1e1e] leading-[32px] text-end mb-4">
            هنا يكتب وصف بسيط عن المنتج في سطرين كمثال , هنا يكتب وصف بسيط عن المنتج في سطرين كمثال.
          </p>
          <div>

          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default OurStory
