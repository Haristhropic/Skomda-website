# Audit role Editor dan CRUD draft di VPS

Target: `https://linear.smktelkom-sidoarjo.my.id`, revisi aktif `86cc6ef`. Pemeriksaan dilakukan 4 Oktober 2026 pukul 11:23–11:24 UTC memakai akun editor sementara. Token, kata sandi, alamat email, dan isi record pengguna tidak dicatat dalam evidence.

## Hasil

| Pemeriksaan | Respons | Hasil |
| --- | --- | --- |
| Login, identitas, membaca konten admin | 200 | Lulus |
| Editor mengakses monitoring dan Grafana | 403 | Lulus |
| Editor mengakses penyediaan akun admin | 403 | Lulus |
| Mutasi dengan Origin asing | 403 | Lulus |
| Membuat draft berita audit tersendiri | 201 | Lulus |
| Membaca dan memperbarui draft sendiri | 200 | Lulus |
| Pengunjung anonim membuka detail draft | 404 | Lulus |
| Pengunjung anonim meminta list dengan `status=draft` | 200, data kosong | Lulus |
| Menghapus draft sendiri dan membaca kembali list | 200, record tidak muncul | Lulus |
| Logout | 200 | Lulus |

Hanya draft audit dengan slug acak dan ID 13 yang dibuat, diperbarui, lalu dihapus. Kepemilikan ID/slug/penulis audit diperiksa sebelum penghapusan. Tidak ada konten lama atau record pendaftar/siswa yang diubah. Penghapusan mengikuti soft-delete API berita; record tersebut sudah tidak aktif dan tidak muncul pada readback. Akun editor sementara masih dipertahankan untuk audit navigasi browser; pemilik deployment menghapusnya sesudah semua pemeriksaan selesai.

Evidence terstruktur: [`auth-editor-86cc6ef.json`](../artifacts/auth-editor-86cc6ef.json) dan [`editor-crud-86cc6ef.json`](../artifacts/editor-crud-86cc6ef.json). Penolakan mutasi oleh Super admin diperiksa terpisah oleh koordinator audit. Hasil ini membuktikan skenario role/CRUD yang tercantum; kapasitas traffic serta tampilan lintas perangkat dinilai pada laporan pengujian lainnya.
