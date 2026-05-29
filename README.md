# Birthday Meisya — V6 Mobile Clean

Website ulang tahun static premium untuk **Meisya Al Zahra**.

Detail konten:

- Nama: Meisya Al Zahra
- Usia: 23 Tahun
- Tanggal: 30 Mei 2026
- Pesan PDF: Google Drive preview modal

Library yang digunakan:

- HTML
- Tailwind CSS CDN
- Custom CSS
- GSAP + ScrollTrigger
- Anime.js
- Lenis smooth scroll
- canvas-confetti

## Update versi ini

- Default background putih/clean.
- Tombol light/dark mode tetap tersedia di navbar.
- Scroll hint pada hero sudah dihapus.
- Animasi digabung: GSAP untuk intro, scroll animation, modal, 3D tilt; Anime.js untuk api lilin, cake glow, orbit 3D, dan floating pill.
- Marquee dibuat seamless.
- Card cake memiliki efek 3D depth.
- Api lilin bergerak terus dengan Anime.js.

## Cara menjalankan

1. Extract ZIP.
2. Buka folder di VS Code.
3. Jalankan menggunakan Live Server.
4. Pastikan internet aktif karena library menggunakan CDN.

## Catatan Google Drive

Agar PDF tampil di modal, ubah permission file Google Drive menjadi:

`Anyone with the link can view`

Kalau PDF tidak tampil di iframe, klik tombol **Buka Tab**.


## Fix V6

- Layout mobile dibuat lebih clean: teks tampil dulu, cake compact, countdown/floating pill disembunyikan di layar kecil.
- Marquee tetap digerakkan dengan GSAP secara seamless.
- Jika GSAP gagal dimuat, CSS animation tetap menjadi fallback.
- Hover tidak lagi menghentikan marquee.
- Default tema memakai key baru `birthday-theme-v5`, jadi pertama kali dibuka kembali ke light mode.
- Proteksi reduce-motion yang sebelumnya bisa mematikan animasi sudah dinonaktifkan untuk website ini.
