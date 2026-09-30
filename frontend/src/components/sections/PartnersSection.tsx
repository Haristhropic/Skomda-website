"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getBKKPartners } from "@/services/bkk";

const partners = [
  {
    name: "Politeknik Elektronika Negeri Surabaya (PENS)",
    src: "/images/partners/pens.webp",
  },
  {
    name: "Axelbit",
    src: "/images/partners/partner-axelbit.png",
  },
  {
    name: "PT Radnet Digital Indonesia (Radnext)",
    src: "/images/partners/partner-radnet.png",
  },
  {
    name: "Wowrack Indonesia",
    src: "/images/partners/wowrack.png",
  },
  {
    name: "Markaz Design",
    src: "/images/partners/partner-markazdesign.png",
  },
  {
    name: "DigiPrener",
    src: "/images/partners/partner-digiprener.png",
  },
  {
    name: "PT Garuda Telekomunikasi Indonesia",
    src: "/images/partners/partner-garuda.png",
  },
  {
    name: "PT TelkoMedika Indonesia",
    src: "/images/partners/TelkoMedika-v2.png",
  },
  {
    name: "Jagoan Hosting",
    src: "/images/partners/partner-jagoanhosting.png",
  },
  {
    name: "PT Digdaya Olah Teknologi (DOT Indonesia)",
    src: "/images/common/icons/DOT.svg",
  },
  {
    name: "LSP P1 / BNSP",
    src: "/images/partners/bnsp.png",
  },
  {
    name: "Jobnation IT Outsource",
    src: "/images/partners/jobnation.png",
  },
  {
    name: "PT Indev Solusi Digital (indev)",
    src: "/images/partners/indev.png",
  },
  {
    name: "PT Global Infra Teknologi (GIT)",
    src: "/images/partners/partner-globalinfra.png",
  },
  {
    name: "Weza Group",
    src: "/images/partners/weza-group.png",
  },
  {
    name: "PT Woodone Integra Tbk",
    src: "/images/partners/woodneintegra.png",
  },
  {
    name: "PT Trijaya Grafika Solutindo (TGS)",
    src: "/images/partners/trijaya.png",
  },
  {
    name: "Lasambara Karya Cipta",
    src: "/images/partners/lasambora.png",
  },
  {
    name: "RS Islam Surabaya Jemursari",
    src: "/images/partners/rsi.jpg",
  },
  {
    name: "UBIG.CO.ID",
    src: "/images/partners/partner-ubig.png",
  },
  {
    name: "PT Javacreatiox Network Intermedia",
    src: "/images/partners/partner-javacreatiox.png",
  },
  {
    name: "Moksha Indonesia",
    src: "/images/partners/moksha.png",
  },
];

export default function PartnersSection() {
  const [partnerList, setPartnerList] = useState<{ name: string; src: string }[]>(partners);

  useEffect(() => {
    let isMounted = true;
    getBKKPartners()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setPartnerList(
            data.map((p) => ({
              name: p.name,
              src: p.logo && p.logo.trim() ? p.logo.trim() : "/images/partners/pens.webp",
            }))
          );
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Slice to 12 diverse partners duplicated to 24 for a lightweight, performant infinite marquee
  const displayPartners = partnerList.slice(0, 12);
  const marqueeItems = [...displayPartners, ...displayPartners];

  return (
    <section id="mitra" className="relative w-full bg-[#f3f4f6] py-8 sm:py-10 overflow-hidden scroll-mt-24" data-node-id="95:312">
      {/* Infinite scrolling marquee track with generous padding to prevent shadow clipping */}
      <div className="flex w-full overflow-hidden py-5 -my-5">
        <div className="animate-marquee items-center py-4">
          {marqueeItems.map((p, index) => (
            <div
              key={`${p.name}-${index}`}
              className="flex h-[116px] sm:h-[128px] w-[184px] sm:w-[204px] shrink-0 items-center justify-center px-3 sm:px-4 py-3"
            >
              <div
                className="group relative flex h-[84px] sm:h-[92px] w-[156px] sm:w-[172px] items-center justify-center rounded-2xl neu-card-interactive p-2.5 sm:p-3"
              >
                {/* Logo Image */}
                <div className="relative h-[46px] sm:h-[52px] w-[116px] sm:w-[130px] opacity-80 transition-opacity duration-200 group-hover:opacity-100">
                  <Image
                    src={p.src}
                    alt={p.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 120px, 140px"
                    unoptimized={Boolean(p.src?.startsWith("http") && !p.src?.includes("res.cloudinary.com"))}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
