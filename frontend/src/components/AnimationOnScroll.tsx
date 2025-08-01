"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const AnimateOnScroll = ({
  children,
  animationType = "fadeUp",
  threshold = 0.1,
  duration = 0.6,
  delay = 0,
  staggerChildren = false,
  staggerDelay = 0.1,
}) => {
  const { ref, inView, entry } = useInView({
    threshold,
    triggerOnce: true,
  });

  // Animation variants
  const variants = {
    fadeUp: {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 },
    },
    fadeDown: {
      hidden: { opacity: 0, y: -30 },
      visible: { opacity: 1, y: 0 },
    },
    fadeLeft: {
      hidden: { opacity: 0, x: 30 },
      visible: { opacity: 1, x: 0 },
    },
    fadeRight: {
      hidden: { opacity: 0, x: -30 },
      visible: { opacity: 1, x: 0 },
    },
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1 },
    },
  };

  // Container variants for staggered animations
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const selectedVariant = variants[animationType] || variants.fadeUp;

  return (
    <motion.div
      ref={ref}
      variants={staggerChildren ? containerVariants : undefined}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {staggerChildren ? (
        <motion.div variants={selectedVariant}>
          {children}
        </motion.div>
      ) : (
        <motion.div
          variants={selectedVariant}
          transition={{ duration, delay }}
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AnimateOnScroll;