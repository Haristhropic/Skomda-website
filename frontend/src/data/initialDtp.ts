import { DtpItem } from "@/services/dtp";

export const INITIAL_DTP_ITEMS: DtpItem[] = [
  {
    id: 1,
    slug: "software-developer",
    number: "01",
    title: "Software Developer",
    category: "Software & AI",
    image: "/images/tentang-kami/fasilitas/fasilitas-lab-komputer-1.png",
    badgeText: "Full Stack Track",
    shortDesc:
      "Pembuatan website dan aplikasi modern mulai dari perancangan basis data, arsitektur REST API, hingga deployment berbasis container.",
    fullDesc:
      "Mempelajari cara membuat website dan aplikasi mulai dari merancang database, menulis kode program, menghubungkan data melalui API, hingga mempublikasikan aplikasi agar dapat digunakan oleh pengguna dengan standar industri.",
    coreSkills:
      "Algoritma Pemrograman, HTML, CSS, JavaScript Modern, PHP & Framework Laravel, Perancangan & Optimasi Database, RESTful API Development, Version Control (Git & GitHub), Containerization dengan Docker, Linux Server Environment, Web Application Deployment",
    supportingSkills:
      "UI/UX Fundamental & Wireframing, Git Collaboration Workflow, AI Coding Assistant Mastery, Agile & Scrum Development, Software Testing & Quality Assurance",
    careerProspects:
      "Software Developer, Backend Developer, Frontend Developer, Full Stack Developer, Junior Web Engineer",
    tools: "VS Code, GitHub, Laravel, MySQL, Postman, Docker, Linux, Figma",
    orderIndex: 1,
    isActive: true,
  },
  {
    id: 2,
    slug: "network-sysadmin",
    number: "02",
    title: "Network System Administrator",
    category: "Network & Cloud",
    image: "/images/tentang-kami/fasilitas/fasilitas-lab-komputer-2.png",
    badgeText: "Enterprise Ops",
    shortDesc:
      "Pengelolaan server fisik maupun virtual agar aman, stabil, serta siap mendukung layanan operasional skala enterprise.",
    fullDesc:
      "Mempelajari cara mengelola server agar dapat digunakan bersama, aman, stabil, serta mendukung berbagai layanan di lingkungan sekolah maupun perusahaan dengan keandalan tinggi.",
    coreSkills:
      "Linux Server Administration, Windows Server & Active Directory, Virtualization Technology, DNS & DHCP Core Services, Web & Database Server Management, Disaster Recovery & Backup, Server Security Hardening",
    supportingSkills:
      "Server Troubleshooting, Technical Documentation, Basic Automation dengan Python, AI Productivity untuk Sysadmin, IT Service Management (ITSM)",
    careerProspects:
      "System Administrator, Network Administrator, NOC Engineer, IT Support Specialist",
    tools:
      "Ubuntu Server, Rocky Linux, Windows Server, Proxmox, VMware, Zabbix, Bash, PowerShell",
    orderIndex: 2,
    isActive: true,
  },
  {
    id: 3,
    slug: "network-infrastructure",
    number: "03",
    title: "Network Infrastructure Engineer",
    category: "Network & Cloud",
    image: "/images/tentang-kami/fasilitas/fasilitas-lab-fiber-optik.png",
    badgeText: "Cisco & Mikrotik",
    shortDesc:
      "Perancangan dan pemeliharaan jalur data, routing jaringan skala besar, switching cerdas, dan infrastruktur kabel fiber optik.",
    fullDesc:
      "Mempelajari teknik merancang topologi, mengonfigurasi router dan switch berstandar Cisco dan Mikrotik, hingga instalasi jaringan fiber optik andal.",
    coreSkills:
      "VLAN & Trunking Configuration, Routing Protocols (OSPF & BGP), Fiber Optic Splicing & Testing, Wireless LAN Enterprise, Mikrotik RouterOS Advanced, Cisco IOS CLI Configuration, Network Troubleshooting & Analysis, Bandwidth Management & QoS",
    supportingSkills:
      "Cabling Standard TIA/EIA, Network Documentation & Topology Design, Field Work Ethics, OTDR Testing Analysis",
    careerProspects:
      "Network Engineer, Network Administrator, Fiber Optic Technician, ISP Support Specialist, Field Engineer",
    tools:
      "Mikrotik RouterBoard, Cisco Catalyst, Wireshark, Fusion Splicer, OTDR, Packet Tracer, Winbox",
    orderIndex: 3,
    isActive: true,
  },
  {
    id: 4,
    slug: "visual-communication-design",
    number: "04",
    title: "Visual Communication Designer",
    category: "Design & Creative",
    image: "/images/tentang-kami/fasilitas/fasilitas-studio-multimedia.png",
    badgeText: "Creative Lab",
    shortDesc:
      "Kreasi identitas visual, UI/UX antarmuka digital, ilustrasi profesional, serta konten promosi digital berdaya tarik tinggi.",
    fullDesc:
      "Mempelajari cara menciptakan bahasa visual yang komunikatif dan estetis melalui desain grafis vektor, tipografi, user interface mobile/web, dan branding.",
    coreSkills:
      "Desain UI/UX & Wireframing, Tipografi & Teori Warna, Desain Grafis Vektor, Motion Graphics Fundamental, Digital Photo Retouching, Brand Identity Guidelines, Layouting Majalah & Poster, Asset Exporting Berstandar Web/Mobile",
    supportingSkills:
      "Creative Storytelling, Creative Pitching & Presentation, Design System Architecture, Micro-Interactions",
    careerProspects:
      "UI/UX Designer, Graphic Designer, Visual Designer, Brand Identity Specialist, Creative Content Creator",
    tools: "Figma, Adobe Illustrator, Adobe Photoshop, After Effects, Canva Pro",
    orderIndex: 4,
    isActive: true,
  },
  {
    id: 5,
    slug: "iot-engineer",
    number: "05",
    title: "IoT & Embedded System Engineer",
    category: "Hardware & Security",
    image: "/images/tentang-kami/fasilitas/fasilitas-ruang-tefa.png",
    badgeText: "Hardware Track",
    shortDesc:
      "Integrasi mikrokontroler, sensor cerdas, protokol nirkabel, dan otomatisasi perangkat keras berbasis cloud internet of things.",
    fullDesc:
      "Mempelajari cara menghubungkan dunia fisik ke dunia digital dengan memprogram sensor, aktuator, modul komunikasi LoRa/WiFi, dan dashboard kontrol.",
    coreSkills:
      "Pemrograman C/C++ Mikrokontroler, Sensor & Actuator Interfacing, Protokol IoT (MQTT, HTTP, WebSockets), Skematik & PCB Design, ESP32 & Arduino Eco-System, Integrasi IoT Cloud Platform, Telemetri Real-Time Dashboard",
    supportingSkills:
      "Elektronika Dasar & Pengukuran Multimeter, Soldering Presisi, 3D Printing Prototyping, Low Power Optimization",
    careerProspects:
      "IoT Engineer, Embedded System Developer, Hardware Specialist, Automation Engineer, Smart Device Technician",
    tools: "ESP32, Arduino IDE, PlatformIO, MQTT Broker, Node-RED, KiCAD, Fusion 360",
    orderIndex: 5,
    isActive: true,
  },
  {
    id: 6,
    slug: "cloud-engineer",
    number: "06",
    title: "Cloud Engineer",
    category: "Network & Cloud",
    image: "/images/tentang-kami/fasilitas/fasilitas-datacenter.png",
    badgeText: "GCP & AWS",
    shortDesc:
      "Arsitektur komputasi awan andal, otomatisasi infrastruktur CI/CD, manajemen kontainer Kubernetes, dan layanan cloud AWS / GCP.",
    fullDesc:
      "Mempelajari cara membangun dan mengelola infrastruktur modern di cloud publik, orkestrasi kontainer dengan Kubernetes, dan pipeline continuous integration.",
    coreSkills:
      "Cloud Computing Architecture, Container Orchestration (Kubernetes), Infrastructure as Code (Terraform), CI/CD Pipeline Automation, Cloud Networking & VPC, Cloud Storage & Database Services, Auto-scaling & High Availability",
    supportingSkills:
      "FinOps & Cloud Cost Optimization, Microservices Architecture, Observability & Monitoring",
    careerProspects:
      "Cloud Engineer, DevOps Engineer, Site Reliability Engineer (SRE), Platform Engineer, Cloud Infrastructure Architect",
    tools:
      "Google Cloud Platform, AWS, Kubernetes, Docker, Terraform, GitHub Actions, Helm",
    orderIndex: 6,
    isActive: true,
  },
  {
    id: 7,
    slug: "ai-specialist",
    number: "07",
    title: "AI & Data Specialist",
    category: "Software & AI",
    image: "/images/tentang-kami/fasilitas/fasilitas-lab-komputer-3.png",
    badgeText: "Next-Gen AI",
    shortDesc:
      "Pengolahan data skala besar, visualisasi analitik, integrasi Machine Learning, serta implementasi agen cerdas berbasis Generative AI.",
    fullDesc:
      "Mempelajari cara mengeksplorasi data, melatih model prediktif dasar, memanfaatkan LLM API modern, dan membangun otomasi bertenaga AI.",
    coreSkills:
      "Python for Data & AI, Data Cleaning & Preprocessing, Exploratory Data Analysis (EDA), Machine Learning Algorithms, LLM & Prompt Engineering, Vector Database & RAG, Data Visualization Interactive",
    supportingSkills:
      "Statistika Terapan, Model Evaluation Metrics, Data Ethics, AI API Integration",
    careerProspects:
      "AI Engineer, Data Analyst, Machine Learning Junior, Prompt Engineer, BI Analyst",
    tools:
      "Python, Jupyter Notebook, Pandas, NumPy, Scikit-Learn, Gemini API, HuggingFace, Streamlit",
    orderIndex: 7,
    isActive: true,
  },
  {
    id: 8,
    slug: "digital-marketing",
    number: "08",
    title: "Digital Marketer",
    category: "Design & Creative",
    image: "/images/tentang-kami/fasilitas/fasilitas-gedung-smk.png",
    badgeText: "Growth Track",
    shortDesc:
      "Strategi akuisisi audiens daring, Search Engine Optimization (SEO), iklan berbayar (Meta & Google Ads), serta analitik konversi.",
    fullDesc:
      "Mempelajari cara memasarkan produk teknologi dan jasa secara digital melalui riset audiens, copywriting persuasif, SEO on-page, dan optimasi kampanye berbayar.",
    coreSkills:
      "Search Engine Optimization (SEO), Content Strategy & Copywriting, Social Media Advertising (Meta Ads), Google Ads & Search Campaigns, Google Analytics & Web Traffic, Email Marketing Automation, Conversion Rate Optimization",
    supportingSkills:
      "Market Research, Landing Page Optimization, Creative Briefing, Customer Journey Mapping",
    careerProspects:
      "Digital Marketing Specialist, SEO Specialist, Performance Marketer, Social Media Manager, Growth Specialist",
    tools:
      "Google Analytics 4, Meta Ads Manager, Google Search Console, SEMrush, Mailchimp, WordPress",
    orderIndex: 8,
    isActive: true,
  },
  {
    id: 9,
    slug: "cyber-security",
    number: "09",
    title: "Cyber Security Analyst",
    category: "Hardware & Security",
    image: "/images/tentang-kami/fasilitas/fasilitas-lab-iot.png",
    badgeText: "Cyber Defense",
    shortDesc:
      "Pengujian penetrasi keamanan sistem, hardening konfigurasi jaringan, analisis ancaman siber, dan penanganan insiden keamanan digital.",
    fullDesc:
      "Mempelajari teknik mendeteksi kerentanan sistem, pengujian keamanan aplikasi web, enkripsi data, firewalling, dan audit kepatuhan keamanan informasi.",
    coreSkills:
      "Vulnerability Assessment, Web Application Security (OWASP Top 10), Network Packet Inspection, Kali Linux Penetration Testing, Firewall & IPS/IDS Configuration, Cryptography Fundamentals, Incident Response & Digital Forensics",
    supportingSkills:
      "Security Compliance & ISO 27001, Ethical Hacking Methodology, Log Analysis & SIEM",
    careerProspects:
      "Cyber Security Analyst, Junior Penetration Tester, Security Operations Center (SOC) Tier 1, Information Security Officer",
    tools:
      "Kali Linux, Burp Suite, Nmap, Wireshark, Metasploit, Snort, pfSense, OpenSSL",
    orderIndex: 9,
    isActive: true,
  },
];
