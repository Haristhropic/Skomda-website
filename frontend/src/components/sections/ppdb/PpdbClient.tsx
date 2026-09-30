"use client";

import { useState, useEffect } from "react";
import PpdbHeroSection from "./PpdbHeroSection";
import PpdbAlurSection from "./PpdbAlurSection";
import PpdbLearningJourneySection from "./PpdbLearningJourneySection";
import PpdbFaqSection from "./PpdbFaqSection";
import PpdbBrochureModal from "./PpdbBrochureModal";
import { DocumentItem, getActiveBrochure } from "@/services/documents";

export default function PpdbClient() {
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [activeBrochure, setActiveBrochure] = useState<DocumentItem | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    let isMounted = true;
    getActiveBrochure()
      .then((data) => {
        if (isMounted && data) {
          setActiveBrochure(data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="w-full">
      <PpdbHeroSection onOpenBrochure={() => setIsBrochureOpen(true)} />
      <PpdbAlurSection />
      <PpdbLearningJourneySection />
      <PpdbFaqSection />

      <PpdbBrochureModal
        isOpen={isBrochureOpen}
        onClose={() => setIsBrochureOpen(false)}
        brochure={activeBrochure}
      />
    </div>
  );
}
