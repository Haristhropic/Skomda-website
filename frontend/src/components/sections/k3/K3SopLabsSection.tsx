"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  Network,
  Server,
  Radio,
  Cpu,
  CheckCircle2,
  XCircle,
  ShieldCheck,
} from "lucide-react";

interface SopLabData {
  id: string;
  tabLabelId: string;
  tabLabelEn: string;
  icon: React.ReactNode;
  labNameId: string;
  labNameEn: string;
  hazardBadgeId: string;
  hazardBadgeEn: string;
  overviewId: string;
  overviewEn: string;
  dosId: string[];
  dosEn: string[];
  dontsId: string[];
  dontsEn: string[];
  requiredApdId: string[];
  requiredApdEn: string[];
}

const labsData: SopLabData[] = [
  {
    id: "tjat",
    tabLabelId: "Lab Fiber Optik (TJAT)",
    tabLabelEn: "Fiber Optic Lab (TJAT)",
    icon: <Network className="size-5" />,
    labNameId: "Laboratorium Transmisi & Fiber Optik (TJAT)",
    labNameEn: "Transmission & Fiber Optic Laboratory (TJAT)",
    hazardBadgeId: "Bahaya: Serpihan Kaca & Radiasi Laser",
    hazardBadgeEn: "Hazard: Glass Shards & Invisible Laser",
    overviewId:
      "Aktivitas penyambungan kabel fiber optik (splicing) dan pengukuran redaman menggunakan Optical Time Domain Reflectometer (OTDR) mewajibkan disiplin tinggi penanganan pecahan kaca mikro dan proteksi mata.",
    overviewEn:
      "Fiber optic splicing and Optical Time Domain Reflectometer (OTDR) attenuation testing require strict protocols for microscopic glass fiber handling and optical radiation protection.",
    dosId: [
      "Wajib mengenakan kacamata safety saat proses pemotongan (cleaving) serat fiber.",
      "Segera buang pecahan ujung serat optik ke kotak penampung khusus (fiber scrap container) bertutup rapat.",
      "Bersihkan meja kerja dengan lap khusus berperekat setelah selesai proses splicing.",
      "Lakukan kalibrasi fusion splicer dan pastikan elektroda bersih sebelum digunakan.",
      "Pastikan ruangan praktikum memiliki ventilasi sirkulasi udara yang baik dan pencahayaan terang.",
    ],
    dosEn: [
      "Always wear safety glasses during fiber stripping and precision cleaving.",
      "Immediately dispose of fiber glass shards into designated sealed scrap containers.",
      "Wipe down work surfaces with adhesive lint-free wipes post-splicing.",
      "Calibrate fusion splicers and ensure clean electrodes before operation.",
      "Maintain well-ventilated laboratory airflow and adequate task lighting.",
    ],
    dontsId: [
      "DILARANG KERAS melihat langsung ke ujung konektor fiber optik atau port transmitter yang sedang aktif.",
      "Dilarang menyentuh atau mengusap mata saat sedang memegang serat kaca fiber optik.",
      "Dilarang membuang potongan serat optik ke tempat sampah umum atau membiarkannya tercecer di lantai.",
      "Dilarang membawa makanan dan minuman ke dalam area meja kerja penyambungan kabel.",
    ],
    dontsEn: [
      "STRICTLY FORBIDDEN to look directly into active fiber connector ends or laser transmitter ports.",
      "Do not touch or rub eyes while handling stripped optical glass fibers.",
      "Never discard optical glass shards into ordinary bins or leave them on floor surfaces.",
      "Food and beverages are strictly prohibited on optical workstation tables.",
    ],
    requiredApdId: ["Kacamata Safety", "Fiber Scrap Bin", "Sarung Tangan ESD", "Jas Praktikum"],
    requiredApdEn: ["Safety Glasses", "Fiber Scrap Bin", "ESD Gloves", "Lab Coat"],
  },
  {
    id: "sija",
    tabLabelId: "Lab Komputer & Cloud (SIJA)",
    tabLabelEn: "Computer & Cloud Lab (SIJA)",
    icon: <Server className="size-5" />,
    labNameId: "Laboratorium Komputer, Server & Jaringan (SIJA)",
    labNameEn: "Computer, Server & Network Laboratory (SIJA)",
    hazardBadgeId: "Bahaya: Sengatan Arus Listrik & Korsleting",
    hazardBadgeEn: "Hazard: Electrical Shock & Short Circuits",
    overviewId:
      "Praktikum administrasi server, instalasi perangkat rackmount, routing switch, dan sistem cloud menuntut kepatuhan manajemen kabel tertata dan pencegahan bahaya listrik statis.",
    overviewEn:
      "Server administration, rackmount hardware installations, managed switches, and cloud architectures require rigorous cable management and electrostatic discharge prevention.",
    dosId: [
      "Pastikan seluruh jalur kabel data dan listrik tertata rapi di dalam tray/duct pelindung kabel.",
      "Gunakan gelang anti-statis (ESD wrist strap) saat menyentuh motherboard atau komponen internal server.",
      "Matikan sakelar power supply dan cabut kabel daya sebelum melakukan perakitan atau perawatan hardware.",
      "Terapkan ergonomi postur tubuh yang benar dengan posisi monitor sejajar pandangan mata.",
      "Lakukan istirahat peregangan otot dan relaksasi mata minimal 5 menit setiap 60 menit praktikum.",
    ],
    dosEn: [
      "Ensure all power and ethernet cables are securely housed in protective cable ducts.",
      "Wear electrostatic discharge (ESD) wristbands when servicing motherboards or server internals.",
      "Power down server units and disconnect AC mains before undertaking component upgrades.",
      "Maintain proper ergonomic workstation postures with screen tops at eye level.",
      "Take 5-minute stretch intervals every hour to relieve muscle and eye strain.",
    ],
    dontsId: [
      "Dilarang menumpuk steker atau membebani stop kontak melebihi kapasitas daya terukur (anti-overload).",
      "Dilarang menarik kabel secara paksa pada bagian kawatnya (selalu pegang kepala konektor).",
      "Dilarang menggunakan perangkat atau kabel daya yang isolator plastiknya telah terkelupas.",
      "Dilarang meletakkan botol air minum terbuka di dekat rak server atau perangkat komputer.",
    ],
    dontsEn: [
      "Never daisy-chain power strips or overload socket capacities beyond rated wattage.",
      "Do not pull cables forcibly by the wire (always hold the connector body).",
      "Never utilize power cords with cracked or frayed protective insulation.",
      "Never place open beverage containers near server racks or computing units.",
    ],
    requiredApdId: ["Gelang Anti-Statis (ESD)", "Sepatu Sol Karet Isolator", "Obeng Berisolasi VDE"],
    requiredApdEn: ["ESD Wristband", "Rubber Sole Shoes", "VDE Insulated Screwdriver"],
  },
  {
    id: "outdoor",
    tabLabelId: "Instalasi Outdoor / Tiang",
    tabLabelEn: "Outdoor Pole Installation",
    icon: <Radio className="size-5" />,
    labNameId: "Area Praktik Instalasi Jaringan Lapangan & Menara",
    labNameEn: "Outdoor Network Field & Telecom Tower Training",
    hazardBadgeId: "Bahaya: Bekerja di Ketinggian & Jatuhan Benda",
    hazardBadgeEn: "Hazard: Working at Height & Falling Objects",
    overviewId:
      "Pelatihan penarikan kabel udara, pemasangan optical distribution point (ODP) pada tiang, dan instalasi perangkat radio microwave menuntut sertifikasi proteksi jatuh mutlak.",
    overviewEn:
      "Field aerial cabling, Optical Distribution Point (ODP) pole mounting, and microwave radio alignments necessitate mandatory fall-arrest safety protocols.",
    dosId: [
      "Wajib mengenakan Full Body Harness dengan double lanyard dan shock absorber sebelum menaiki tangga/tiang.",
      "Pasang safety helmet dengan tali dagu (chin strap) terkunci rapat dan periksa kondisi tangga kerja.",
      "Sterilkan area bawah tiang dengan memasang safety cone dan garis pembatas zona bahaya.",
      "Praktikum ketinggian wajib diawasi langsung oleh minimal satu instruktur berlisensi K3.",
      "Hentikan segera seluruh aktivitas praktik di luar ruangan apabila terjadi hujan lebat atau angin kencang.",
    ],
    dosEn: [
      "Wear certified Full Body Harnesses with twin lanyards and shock absorbers before ascending poles.",
      "Lock safety helmets securely using chin straps and verify ladder stability before climbing.",
      "Establish clear ground clearance perimeter using cones and caution barricade tape.",
      "Height training must be continuously monitored by licensed safety instructors.",
      "Immediately halt all outdoor training during rainfall, lightning, or high wind gusts.",
    ],
    dontsId: [
      "DILARANG memanjat tanpa mengaitkan karabiner pengaman ke titik angkur yang kokoh dan teruji.",
      "Dilarang membawa perkakas tanpa tas pinggang alat (tool bag) guna mencegah benda jatuh ke bawah.",
      "Dilarang berdiri tepat di bawah orang yang sedang bekerja di atas tiang tanpa pelindung kepala.",
      "Dilarang memanjat saat kondisi fisik sedang demam, lemas, atau mengalami gangguan keseimbangan.",
    ],
    dontsEn: [
      "NEVER climb without securing harness snap hooks to rated structural anchor points.",
      "Do not carry loose tools by hand (always utilize dedicated tool holsters).",
      "Never stand directly underneath personnel working aloft without head protection.",
      "Never ascend when experiencing vertigo, illness, fatigue, or balance impairments.",
    ],
    requiredApdId: ["Full Body Harness", "Helm Safety Chin-Strap", "Rompi Reflektif", "Sepatu Safety Baja"],
    requiredApdEn: ["Full Body Harness", "Safety Helmet Chin-Strap", "High-Vis Vest", "Steel-Toe Shoes"],
  },
  {
    id: "elektronika",
    tabLabelId: "Bengkel IoT & Elektronika",
    tabLabelEn: "IoT & Hardware Workshop",
    icon: <Cpu className="size-5" />,
    labNameId: "Bengkel Perakitan IoT & Sirkuit Elektronika",
    labNameEn: "IoT Prototyping & Electronics Circuit Workshop",
    hazardBadgeId: "Bahaya: Suhu Panas & Asap Timah Solder",
    hazardBadgeEn: "Hazard: High Heat & Solder Lead Fumes",
    overviewId:
      "Prototyping mikrokontroler, perakitan sensor IoT, dan penyolderan papan PCB memerlukan proteksi terhadap luka bakar termal serta penyedotan uap timah berbahaya.",
    overviewEn:
      "Microcontroller prototyping, IoT sensor assembly, and circuit soldering require active thermal safeguards and exhaust filtration for lead fumes.",
    dosId: [
      "Selalu letakkan solder listrik pada dudukan penyangga tahan panas (soldering stand) saat jeda kerja.",
      "Nyalakan alat penyedot asap (exhaust fume extractor) sebelum memulai proses penyolderan PCB.",
      "Gunakan kacamata pelindung untuk mencegah cipratan timah cair atau potongan kaki komponen melenting.",
      "Periksa polaritas kutub positif/negatif dan tegangan DC sebelum menghubungkan catu daya ke modul sirkuit.",
      "Cuci tangan dengan sabun hingga bersih setelah selesai memegang timah solder dan komponen logam.",
    ],
    dosEn: [
      "Always store soldering irons in heat-resistant metal cradles when not actively in hand.",
      "Engage fume extraction fans prior to soldering printed circuit board traces.",
      "Wear protective eyewear to deflect molten solder splashes and flying wire clippings.",
      "Verify DC supply polarities and voltage limits before energizing sensitive microchips.",
      "Thoroughly wash hands with soap after handling lead solder alloys and brass elements.",
    ],
    dontsId: [
      "Dilarang menyentuh ujung mata solder (tip) atau memegang komponen yang baru saja disolder.",
      "Dilarang meniup sisa timah panas dengan mulut yang berisiko memercik ke wajah orang lain.",
      "Dilarang meninggalkan solder dalam kondisi menyala tanpa pengawasan.",
      "Dilarang memotong kawat komponen tanpa menahan sisa potongannya agar tidak melayang bebas.",
    ],
    dontsEn: [
      "Do not touch heated soldering iron tips or freshly soldered components.",
      "Never blow vigorously on molten joints (risk of splattering hot solder droplets).",
      "Never leave active soldering stations powered on unattended.",
      "Do not snip component leads without capturing clippings to prevent eye hazards.",
    ],
    requiredApdId: ["Kacamata Pelindung", "Masker Anti-Uap Solder", "Alas Tahan Panas Silikon"],
    requiredApdEn: ["Safety Glasses", "Fume Filter Mask", "Silicone Heat Mat"],
  },
];

export default function K3SopLabsSection() {
  const { isEn, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("tjat");

  const currentLab = labsData.find((lab) => lab.id === activeTab) || labsData[0];

  return (
    <section id="sop-laboratorium" className="relative w-full py-16 sm:py-20 lg:py-24 bg-white border-t border-gray-200/60 scroll-mt-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2 className="font-jakarta font-bold text-3xl sm:text-4xl text-[#101828] mb-3 tracking-tight">
            {t("k3.sopTitle", "Standar Operasional Prosedur (SOP) Laboratorium")}
          </h2>

          <div className="mx-auto h-1 w-12 rounded-full bg-[#bc0c11] mb-4" />

          <p className="font-jakarta text-sm sm:text-base text-[#4a5565] leading-relaxed">
            {t(
              "k3.sopSubtitle",
              "Setiap laboratorium memiliki protokol keselamatan yang dirancang khusus untuk mengantisipasi potensi risiko pada masing-masing bidang keahlian vokasi."
            )}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center gap-2 sm:gap-2.5 mb-8 sm:mb-10 scrollbar-none overscroll-x-contain">
          {labsData.map((lab) => {
            const isActive = activeTab === lab.id;
            return (
              <button
                key={lab.id}
                type="button"
                onClick={() => setActiveTab(lab.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold font-jakarta transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-[#bc0c11] text-white shadow-xs"
                    : "bg-white text-[#4a5565] border border-gray-200/80 hover:border-[#bc0c11] hover:text-[#bc0c11]"
                }`}
                aria-pressed={isActive}
              >
                {lab.icon}
                {isEn ? lab.tabLabelEn : lab.tabLabelId}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panel */}
        <div className="rounded-[28px] bg-white border-2 border-dashed border-[#d1d5dc] p-6 sm:p-9">
          {/* Lab Info Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-dashed border-gray-200">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="text-[#bc0c11] shrink-0">
                  {currentLab.icon}
                </div>
                <h3 className="font-jakarta font-bold text-xl sm:text-2xl text-[#101828]">
                  {isEn ? currentLab.labNameEn : currentLab.labNameId}
                </h3>
              </div>
              <p className="font-jakarta text-xs sm:text-sm text-[#4a5565] max-w-3xl leading-relaxed">
                {isEn ? currentLab.overviewEn : currentLab.overviewId}
              </p>
            </div>
          </div>

          {/* Do's & Don'ts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Do's Column */}
            <div className="rounded-[22px] bg-[#f9fafb] p-5 sm:p-6 border-2 border-dashed border-[#d1d5dc]">
              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-emerald-100">
                <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-jakarta font-bold text-sm sm:text-base text-[#101828]">
                    {isEn ? "Mandatory Procedures (DOs)" : "Prosedur Wajib Dilakukan"}
                  </h4>
                  <p className="font-jakarta text-xs text-emerald-700">
                    {isEn ? "Standard vocational safety protocol" : "Standar kepatuhan keselamatan kerja"}
                  </p>
                </div>
              </div>

              <ul className="space-y-2.5">
                {(isEn ? currentLab.dosEn : currentLab.dosId).map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <div className="size-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      ✓
                    </div>
                    <p className="font-jakarta text-xs sm:text-sm text-[#364153] leading-relaxed">
                      {rule}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Don'ts Column */}
            <div className="rounded-[22px] bg-[#f9fafb] p-5 sm:p-6 border-2 border-dashed border-[#d1d5dc]">
              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-red-100">
                <XCircle className="size-5 text-[#bc0c11] shrink-0" />
                <div>
                  <h4 className="font-jakarta font-bold text-sm sm:text-base text-[#101828]">
                    {isEn ? "Strict Prohibitions (DON'Ts)" : "Larangan Keras & Bahaya Fatal"}
                  </h4>
                  <p className="font-jakarta text-xs text-[#bc0c11]">
                    {isEn ? "Zero tolerance safety violations" : "Pelanggaran berisiko sanksi praktikum"}
                  </p>
                </div>
              </div>

              <ul className="space-y-2.5">
                {(isEn ? currentLab.dontsEn : currentLab.dontsId).map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <div className="size-4 rounded-full bg-red-100 text-[#bc0c11] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      ✕
                    </div>
                    <p className="font-jakarta text-xs sm:text-sm text-[#364153] leading-relaxed">
                      {rule}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Required APD for this lab */}
          <div className="rounded-[20px] bg-[#f9fafb] p-4 sm:p-5 border-2 border-dashed border-[#d1d5dc] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#101828]">
              <ShieldCheck className="size-4 text-[#bc0c11] shrink-0" />
              <p>{isEn ? "Mandatory Equipment for this Lab:" : "APD Wajib di Laboratorium Ini:"}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(isEn ? currentLab.requiredApdEn : currentLab.requiredApdId).map((apd, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-md bg-white border border-gray-200 px-2.5 py-1 text-xs font-semibold text-[#bc0c11]"
                >
                  {apd}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
