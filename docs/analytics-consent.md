# Consent Analytics Website SKOMDA

Status: banner consent dan loading GA4/Clarity sudah diimplementasikan di branch `deploy`. Tracking tetap nonaktif sampai ID layanan diatur dan pengunjung memilih **Terima analytics**. Tidak ada kredensial rahasia di kedua ID ini; nilainya memang tersedia di bundle frontend.

## Perilaku persetujuan

- Pilihan `accepted` atau `rejected` disimpan di `localStorage` browser sebagai `skomda.analytics-consent.v1`.
- Sebelum `accepted`, browser tidak memuat script GA4 maupun Clarity.
- Pengunjung dapat membuka kembali **Pengaturan privasi** dari tombol tetap di halaman publik, lalu menolak. Saat pencabutan, kode memberi sinyal penolakan ke vendor, menghapus cookie analytics yang dapat diakses, dan memuat ulang halaman agar script yang sudah berjalan berhenti.
- Tracking tidak dijalankan pada `/admin`, `/gate-internal-skomda`, `/trial-class`, `/ppdb`, `/tefa/request`, `/program/bkk`, `/program/digital-talent`, atau `/informasi/pengumuman-kelulusan`.
- Navigasi link dari halaman yang sedang dilacak menuju halaman sensitif menjadi navigasi dokumen penuh; jalur router/browser history yang lain juga dihentikan dan dimuat ulang sebelum tracking dilanjutkan.
- GA4 mengirim `page_view` manual dengan pathname saja. Query string, hash, event form, isi input, dan identitas pengguna tidak dikirim. Sinyal iklan/personalization dinonaktifkan.
- Jika Clarity dikonfigurasi, semua elemen `<form>` ditandai `data-clarity-mask="true"` sebelum script Clarity dimuat; form dinamis juga ditandai. Field input dan dropdown juga dimasking secara default oleh Clarity.

## Mengaktifkan ID untuk image frontend demo

1. Buat/akses properti GA4 sekolah dan ambil Measurement ID dengan format `G-...` dari web data stream.
2. Buat/akses project Microsoft Clarity dan ambil Project ID dari pengaturan instalasi.
3. Di GitHub repository, tambahkan **Repository variables** berikut (bukan secrets):

   | Nama | Nilai |
   | --- | --- |
   | `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Measurement ID GA4, misalnya `G-XXXXXXXXXX` |
   | `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Project ID Clarity |

4. Push perubahan berikutnya ke branch `deploy` untuk membangun image frontend baru. Nilai `NEXT_PUBLIC_*` ditanam saat build; mengubah variable saja tidak mengubah image yang sudah terbit. CI sengaja membangun langkah typecheck tanpa ID agar build tetap aman/nonaktif sebelum pemilik siap.
5. Setelah image baru terpasang, pengunjung yang sudah memilih **Terima** akan mulai dilacak. Pilihan **Tolak** tetap dihormati.

Jangan menaruh ID di source code, secret VPS, atau `.env` backend. ID analytics bukan password, sedangkan akses akun GA4/Clarity tetap harus diberikan hanya kepada operator yang berwenang.

## Setelan properti GA4

Integrasi mengirim pageview secara manual untuk mendukung navigasi App Router dan menghilangkan query string. Di GA4, matikan pengukuran otomatis **page changes based on browser history events** pada Enhanced Measurement web stream agar pageview tidak tercatat dua kali. Jangan aktifkan event form interaction atau parameter yang mengambil nilai input. Jika event konversi diperlukan, sepakati nama event kategori terlebih dahulu dan jangan kirim data pendaftar.

GA4 `send_page_view: false` sendiri tidak mematikan pageview dari Enhanced Measurement pada perubahan browser history; periksa setelan stream setelah membuat property. Lihat [panduan Google untuk pageview GA4](https://developers.google.com/analytics/devguides/collection/ga4/views) dan [referensi konfigurasi `send_page_view`](https://developers.google.com/analytics/devguides/collection/ga4/reference/config).

## Setelan Clarity dan rilis

- Pertahankan masking default Clarity; jangan mengatur elemen sensitif sebagai unmasked.
- Tambahkan disclosure analytics pada kebijakan privasi sekolah sebelum tracking diaktifkan secara publik.
- Pastikan admin dan pemilik project hanya membagikan akses recording kepada pihak yang berwenang.
- Pengujian perilaku consent, bukti tidak ada request tracking sebelum persetujuan, masking form, dan pengecualian URL masih perlu dilakukan pada browser setelah ID tersedia. Jangan mengaktifkan ID sebelum sekolah menyetujui privacy notice dan setelan project.

Integrasi memberi Clarity sinyal `consentv2` (`analytics_Storage: granted`, `ad_Storage: denied`) hanya setelah pilihan Terima. Saat pilihan ditarik kembali, Clarity menerima sinyal penolakan dan halaman dimuat ulang.

Rujukan Microsoft: [masking content](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-masking), [Clarity client API](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-api), dan [Consent API v2](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2).
