"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import VirtualClassHero from "./VirtualClassHero";
import VirtualClassDtpGrid from "./VirtualClassDtpGrid";
import VirtualClassCtaBanner from "./VirtualClassCtaBanner";
import { VirtualClassDtpItem } from "@/data/virtualClassData";

export default function VirtualClassPageClient() {
  const searchParams = useSearchParams();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [ticketCode, setTicketCode] = useState<string | undefined>(undefined);
  const [userName, setUserName] = useState<string | undefined>(undefined);

  useEffect(() => {
    const urlTicket = searchParams.get("ticket");
    const urlName = searchParams.get("name");

    if (urlTicket) {
      setTicketCode(urlTicket);
      if (urlName) setUserName(urlName);
    } else if (typeof window !== "undefined") {
      const storedTicket = sessionStorage.getItem("trial_pass_code");
      const storedName = sessionStorage.getItem("trial_pass_name");
      if (storedTicket) {
        setTicketCode(storedTicket);
        if (storedName) setUserName(storedName);
      }
    }
  }, [searchParams]);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <VirtualClassHero ticketCode={ticketCode} userName={userName} />

      {/* DTP Grid / Split View (handles both states internally) */}
      <VirtualClassDtpGrid
        selectedClassId={selectedClassId}
        onSelectClass={(item: VirtualClassDtpItem) => setSelectedClassId(item.id)}
        onDeselectClass={() => setSelectedClassId(null)}
        ticketCode={ticketCode}
        userName={userName}
      />

      {/* CTA Banner only shown when no class is selected to avoid cluttering */}
      {!selectedClassId && <VirtualClassCtaBanner />}
    </div>
  );
}
