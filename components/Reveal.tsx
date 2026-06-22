"use client";
import { motion } from "framer-motion";
export function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 34, scale: .985 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: "-70px" }} transition={{ duration: .75, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}
