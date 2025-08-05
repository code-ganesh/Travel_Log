import { motion } from "framer-motion";

const variants = {
  initial: { rotateY: 90, opacity: 0, transformOrigin: "50% 50%" },
  animate: { rotateY: 0, opacity: 1, transformOrigin: "50% 50%" },
  exit: { rotateY: -90, opacity: 0, transformOrigin: "50% 50%" },
};

export default function AnimatedPage({ children }) {
  return (
    <motion.div
      style={{ perspective: 800 }}  // perspective for 3D effect
      className="min-h-screen w-full flex items-center justify-center"
    >
      <motion.div
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d" }}  // keep 3D transforms
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
