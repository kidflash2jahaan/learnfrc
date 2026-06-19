"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80svh] flex-col items-center justify-center px-4 text-center">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-grid mask-radial-faded opacity-40" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <div className="font-display text-8xl font-bold text-gradient sm:text-9xl">
          404
        </div>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-4 text-2xl font-bold tracking-tight"
      >
        This page took an autonomous detour
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-2 max-w-md text-muted-foreground"
      >
        We couldn't find what you were looking for. Let's get you back on the
        field.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-7 flex flex-wrap items-center justify-center gap-3"
      >
        <Button asChild variant="brand">
          <Link href="/">
            <Home className="h-4 w-4" /> Home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/guides">
            <BookOpen className="h-4 w-4" /> Browse guides
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
