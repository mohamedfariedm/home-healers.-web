"use client"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowLeft } from "lucide-react"

function Card() {
  // Refs for different sections
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const cardImageRef = useRef<HTMLDivElement>(null)

  // Check if sections are in view
  const isSectionInView = useInView(sectionRef, { once: false, amount: 0.2 })
  const isCardsInView = useInView(cardsRef, { once: false, amount: 0.3 })
  const isCardImageInView = useInView(cardImageRef, { once: false, amount: 0.3 })

  // Card data
  const cards = [
    {
      id: 1,
      bgColor: "#00b5b4",
      iconUrl: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-13/oyagdjg0Uw.png",
      bgUrl: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-13/MYzDAtQX71.png",
      text: "يغطي أكثر من 4000\nمؤسسة طبية",
    },
    {
      id: 2,
      bgColor: "#62a0f6",
      iconUrl: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-13/rLXfmB2tP2.png",
      bgUrl: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-13/KFeLeCb3fU.png",
      text: "خصومات متنوعة قد تصل\nالي 90%",
    },
    {
      id: 3,
      bgColor: "#5ad0ae",
      iconUrl: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-13/vqOoD1wwb0.png",
      bgUrl: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-13/TzRKwKqjBT.png",
      text: "كل الخدمات والتخصصات التي تحتاجها",
    },
  ]

  return (
    <div ref={sectionRef} className="main-container w-full max-w-[1280px] xl:h-[913px] relative mx-auto my-0">
      {/* Header Section */}
      <motion.div
        className="flex w-full max-w-[610px] flex-col gap-[16px] items-end relative z-[24] mt-[60px] mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex gap-[10px] justify-center items-center self-stretch relative z-[25]">
          <div className="w-[610px] text-[30px] font-semibold leading-[40px] relative text-center xl:text-start z-[26]">
            <span className="text-[30px] font-semibold leading-[40px] text-[#1e1e1e] relative text-start">
              اطلب الان{" "}
            </span>
            <span className="text-[30px] font-semibold leading-[40px] text-[#62a0f6] relative text-start">
              الكارت الطبي
            </span>
            <span className="text-[30px] font-semibold leading-[40px] text-[#1e1e1e] relative text-start">
              {" "}
              الخاص بــ{" "}
            </span>
            <span className="text-[30px] font-semibold leading-[40px] text-[#62a0f6] relative text-start">
              هوم هيلرز
            </span>
          </div>
        </div>
        <div className="flex gap-[10px] justify-center items-center self-stretch relative z-[27]">
          <span className="flex w-[564px] justify-center items-start basis-auto text-[16px] font-medium leading-[24px] text-[#1e1e1e] relative text-center z-[28]">
            اطلب الان الكارت الطبي واستمتع بكل المميزات المتاحة الان
          </span>
        </div>
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
          {cards.map((card, index) => (
           <motion.div
          key={card.id}
          className="w-[301px] h-[227px] flex justify-center relative z-[15] cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          // animate={{ opacity: 1, y: 0 }}
          // transition={{ duration: 0.5, delay: index * 0.2 }}
          whileHover={{ y: -5 }}
          // Infinite animation
          animate={{
            y: ["0%", "-10%", "0%"], // Move up and down infinitely
            opacity: [1, 0.7, 1], // Fade in and out
          }}
          transition={{
            repeat: Infinity, // Infinite loop
            repeatType: "loop", // Loop back to the start after the animation ends
            duration: 2, // Duration of the animation cycle
            ease: "easeInOut", // Smooth easing for the infinite loop
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
          animate={isCardImageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
      <div className="holographic-card w-[480px] h-[290px]  flex justify-center items-center relative overflow-hidden rounded-[15px] transition-all duration-500 ease-in-out bg-cover bg-center"
        style={{
          backgroundImage: "url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-13/Z6UVEmXVtZ.png)",
          backgroundPosition: "center center",
          backgroundSize: "cover",
        }}
      >

        {/* Holographic shine effect */}
        <div
          className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-t from-transparent to-[rgba(0, 255, 255, 0.3)] rotate-[-45deg] opacity-0 transition-all duration-500 ease-in-out"
        ></div>
      </div>
          
        </motion.div>
      </div>

      {/* Button Section */}
      <motion.div
        className="flex w-[255px] h-[56px] pt-[8px] pr-[16px] pb-[8px] pl-[16px] gap-[10px] justify-center items-center bg-[#143087] rounded-[8px] border-solid border border-[#143087] relative z-[29] mt-[56px] mx-auto cursor-pointer"
        
              whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <span className="h-[28px] shrink-0 basis-auto text-[18px] font-medium leading-[28px] text-[#fff] relative text-start z-[32]">
          اطلب الكارت الطبي الان
        </span>
        <div className="w-[24px] h-[24px] relative overflow-hidden z-30">
          <ArrowLeft className="w-6 h-6" />
        </div>
      </motion.div>

      {/* Background container */}
      <div className="w-[1280px] h-[913px] rounded-[32px] absolute top-0 start-1/2 translate-x-[-50%] translate-y-0" />
    </div>
  )
}

export default Card
