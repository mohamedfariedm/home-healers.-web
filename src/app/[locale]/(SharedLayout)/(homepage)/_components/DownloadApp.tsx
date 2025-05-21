"use client"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import AppHeader from "./AppHeader"
import AppRating from "./AppRating"
import DownloadButtons from "./DownloadButtons"

function DownloadApp() {
  // Create a ref for the container element
  const containerRef = useRef<HTMLDivElement>(null)

  // Use useInView with once: false to detect every time the element enters the viewport
  const isInView = useInView(containerRef, {
    once: false,
    amount: 0.3,
  })

  return (
    <div className="w-full max-w-7xl mx-auto my-16 relative overflow-hidden bg-[#eff6fe] rounded-[32px] shadow-lg">
      <div className="flex flex-col lg:flex-row">
        {/* End side with content - becomes bottom on mobile */}
        <div className="w-full lg:w-1/2 p-6 lg:p-10 flex flex-col justify-center relative">

          <div className="flex flex-col gap-8 items-start relative z-10">
            <AppHeader />
            <AppRating />
            <DownloadButtons />
          </div>
        </div>

        {/* Left side with app image - becomes top on mobile */}
        <div ref={containerRef} className="w-full lg:w-1/2 relative">
          {/* First Image (coming from left to right) */}
          <motion.div
            className="absolute top-0 left-0 w-full h-full z-10"
            initial={{ x: "-100%" }}
            animate={isInView ? { x: 0 } : { x: "-100%" }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 25,
              // Reset the animation when isInView changes
              restDelta: 0.001,
            }}
          >
            <img
              src="/assets/images/homehellers/Elements1.svg"
              alt="Background shape"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Second Image (coming from bottom to top) */}
          <motion.div
            className="relative z-20 mx-auto lg:mx-0 px-4 py-6 lg:p-0"
            initial={{ y: "100%" }}
            animate={isInView ? { y: 0 } : { y: "100%" }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 25,
              // Add a slight delay to the second animation
              delay: 0.2,
              restDelta: 0.001,
            }}
          >
            <img
              src="/assets/images/homehellers/landing_page_01.svg"
              alt="App screenshot"
              className="w-full max-w-xs lg:max-w-md mx-auto lg:mx-8 h-auto object-contain"
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default DownloadApp
