"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

export default function CVGallery() {
  const [currentImage, setCurrentImage] = useState(0)
  const images = [
    { src: "/page1.png", alt: "CV Template 1" },
    { src: "/page2.png", alt: "CV Template 2" },
    { src: "/page3.png", alt: "CV Template 3" },
    { src: "/page4.png", alt: "CV Template 4" },
    { src: "/page5.png", alt: "CV Template 5" },
    { src: "/page6.png", alt: "CV Template 6" },
    { src: "/page7.png", alt: "CV Template 7" },
    { src: "/page8.png", alt: "CV Template 8" },
    { src: "/page9.png", alt: "CV Template 9" },



  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="relative w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[500px] h-[240px] sm:h-[320px] lg:h-[400px] mx-auto bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl overflow-hidden">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentImage ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 z-0"
          }`}
        >
          <Image
            src={image.src || "/placeholder.svg"}
            alt={image.alt}
            width={500}
            height={400}
            className="object-contain w-full h-full p-2 sm:p-3 lg:p-4"
            priority={index === 0}
          />
        </div>
      ))}

      {/* Gallery indicators */}
      <div className="absolute bottom-2 sm:bottom-3 lg:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentImage ? "bg-white shadow-lg scale-110" : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`View CV template ${index + 1}`}
          />
        ))}
      </div>

      {/* Template counter */}
      <div className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4 bg-black/50 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium z-20">
        {currentImage + 1} / {images.length}
      </div>
    </div>
  )
}
