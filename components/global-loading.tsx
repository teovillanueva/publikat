import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Spinner } from "./ui/spinner";

export function GlobalLoading({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, speed: 2.5 }}
          exit={{ opacity: 0 }}
          className={cn(
            "absolute inset-0 backdrop-blur-sm z-50 items-center justify-center flex"
          )}
        >
          <Spinner />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
