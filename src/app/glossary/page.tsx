import type { Metadata } from "next";
import { BookA } from "lucide-react";
import { GLOSSARY, GLOSSARY_CATEGORIES } from "@/lib/glossary-data";
import { GlossaryBrowser } from "@/components/glossary/glossary-browser";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "FRC Glossary",
  description:
    "A searchable glossary of FRC terms, acronyms, and jargon — from roboRIO and swerve to OPR and the Impact Award.",
};

export default function GlossaryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        <Badge variant="primary" className="mb-4">
          <BookA className="h-3.5 w-3.5" />
          {GLOSSARY.length} terms
        </Badge>
        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          The FRC <span className="text-gradient">glossary</span>
        </h1>
        <p className="mt-4 text-pretty text-lg text-muted-foreground">
          Every acronym and bit of jargon you'll hear in the pit, decoded.
          Search it, filter it, learn the language.
        </p>
      </Reveal>

      <div className="mt-12">
        <GlossaryBrowser terms={GLOSSARY} categories={GLOSSARY_CATEGORIES} />
      </div>
    </div>
  );
}
