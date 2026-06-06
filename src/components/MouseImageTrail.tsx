"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 10 loaded images
const images = [
  "/1.jpeg",
  "/2.jpeg",
  "/3.jpeg",
  "/4.jpeg",
  "/5.jpeg",
  "/6.jpeg",
  "/7.jpeg",
  "/8.jpeg",
  "/9.jpeg",
  "/10.jpeg",
];

interface TrailImage {
  id: number;
  x: number;
  y: number;
  imgSrc: string;
  rotation: number;
}

export default function MouseImageTrail() {
  const [trail, setTrail] = useState<TrailImage[]>([]);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const imageIndex = useRef(0);
  const idCounter = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate distance from last recorded point
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Only spawn a new image if moved enough distance
      if (distance > 100) { // Spacing between images
        lastMousePos.current = { x: e.clientX, y: e.clientY };

        const newId = idCounter.current++;
        const newImage: TrailImage = {
          id: newId,
          x: e.clientX,
          y: e.clientY,
          imgSrc: images[imageIndex.current],
          rotation: (Math.sin(newId * 12.9898)) * 15, // Deterministic pseudo-random rotation
        };

        // Next image in array
        imageIndex.current = (imageIndex.current + 1) % images.length;

        setTrail((prev) => [...prev, newImage]);

        // Remove the image after a delay to create the trail disappearing effect
        setTimeout(() => {
          setTrail((prev) => prev.filter((img) => img.id !== newImage.id));
        }, 1200); // Exists for 1.2 seconds before disappearing
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      <AnimatePresence>
        {trail.map((item) => (
          <motion.img
            key={item.id}
            src={item.imgSrc}
            alt="trail"
            initial={{ opacity: 0, scale: 0.5, x: item.x - 150, y: item.y - 200, rotate: item.rotation - 10 }}
            animate={{ opacity: 1, scale: 1, x: item.x - 150, y: item.y - 200, rotate: item.rotation }}
            exit={{ opacity: 0, scale: 0.8, y: item.y - 150 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute w-[300px] h-[400px] object-cover rounded-2xl shadow-2xl border border-white/10"
            // Adjust w-[300px] h-[400px] and offsets (x - 150, y - 200) based on desired image size
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
