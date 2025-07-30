"use client"

import Image from "next/image" // Assuming Image component is imported
import { useEffect, useState } from "react"

export default function CVGallery() {
  const [currentImage, setCurrentImage] = useState(0)
  const images = [
    { src: "/page1.png", alt: "CV Template 1" },
    { src: "/page2.png", alt: "CV Template 2" },
    { src: "/page3.png", alt: "CV Template 3" },
    { src: "/page4.png", alt: "CV Template 4" },
    { src: "/page5.png", alt: "CV Template 5" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 2000) // Changed to 2 seconds for better visibility

    return () => clearInterval(interval)
  }, [images.length])

  return (
    // The main container is now fixed to the viewport and has adjusted dimensions
    <div className="absolute top-1/2 right-4 -translate-y-1/2 w-[550px] h-[400px] bg-white rounded-2xl shadow-2xl overflow-hidden z-50">
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
            width={350} // Updated width to match container
            height={400} // Updated height to match container
            className="object-contain w-full h-full" // Changed to object-contain
            priority={index === 0}
          />
        </div>
      ))}

      {/* Gallery indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImage ? "bg-white shadow-lg scale-110" : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`View CV template ${index + 1}`}
          />
        ))}
      </div>

      {/* Template counter */}
      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium z-20">
        {currentImage + 1} / {images.length}
      </div>
    </div>
  )
}
