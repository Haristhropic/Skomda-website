"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import TrialClassHero from "./TrialClassHero";
import TrialClassFeelingsSection from "./TrialClassFeelingsSection";
import TrialClassStepsSection from "./TrialClassStepsSection";

const TrialClassRegistrationModal = dynamic(
  () => import("./TrialClassRegistrationModal"),
  { ssr: false }
);

export default function TrialClassClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full">
      {/* Unified Hero & Upcoming Event Section matching */}
      <TrialClassHero onOpenRegister={() => setIsModalOpen(true)} />
      <TrialClassFeelingsSection />
      <TrialClassStepsSection />
      <TrialClassRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
