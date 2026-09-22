"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
export function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { y: 24, opacity: 0.65 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
export function BrandLoader() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 850);
    return () => clearTimeout(timer);
  }, []);
  if (!visible) return null;
  return (
    <div className="brand-loader" aria-hidden="true">
      <img src="/brand/monogram.png" alt="" width="90" height="90" />
      <span>AN IDEA TAKES SHAPE</span>
      <div className="loader-line" />
    </div>
  );
}
