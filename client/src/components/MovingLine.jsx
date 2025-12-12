import { motion } from "framer-motion";

export default function MovingLine() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.svg
        width="150%"
        height="100%"
        viewBox="0 0 800 400"
        preserveAspectRatio="none"
        className="absolute -top-40 -left-40 opacity-40"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: 1,
          opacity: 1,
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
        }}
      >
        <motion.path
          d="
            M 0 200
            C 200 80, 280 350, 500 200
            C 700 80, 780 350, 1000 220
          "
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="20"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      </motion.svg>
    </div>
  );
}
