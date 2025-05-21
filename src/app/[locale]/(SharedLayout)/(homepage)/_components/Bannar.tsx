"use client"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"

function Banner() {
  // Create a ref for the banner element
  const bannerRef = useRef<HTMLDivElement>(null)

  // Use useInView with once: false to detect every time the element enters the viewport
  const isInView = useInView(bannerRef, {
    once: false,
    amount: 0.3, // Trigger when 30% of the element is visible
  })

  // Animation variants
  const bannerVariants = {
    hidden: { scale: 1.5, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  }

  return (
    <div ref={bannerRef}>
      <motion.div
        style={{
          background: "linear-gradient(135deg, #143087 0%, #111F4C 100%)",
        }}
        className="main-container w-full max-w-[1280px] h-auto rounded-[24px] relative overflow-hidden mx-auto my-0 flex flex-col lg:flex-row items-center justify-between px-4 py-6"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={bannerVariants}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 25,
          delay: 0.3,
        }}
      >
        {/* Decorative Image */}
        <div className="w-full sm:w-[30%] sm:max-w-[300px] h-[74.24%] min-h-[184px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/uFz0LWmGp6.png)] bg-[length:100%_100%] bg-no-repeat" />

        {/* Center Text */}
        <span className="w-full lg:w-[40%] text-[32px] lg:text-[48px] leading-[48px] lg:leading-[72px] font-medium text-white text-center my-4">
          استـــــمتع بخصــــــومات
          <br /> تصــــل الي 50%
        </span>

        {/* Left Image */}
        <div className="w-[25%] max-w-[244px] aspect-square bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/EO8G8yncmw.png)] bg-cover bg-no-repeat hidden lg:block" />
      </motion.div>
    </div>
  )
}

export default Banner
