import { Product, BlogPost, CourierRate } from '@/types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    slug: 'lembar-aktivitas-hijaiyah-faceless-printable',
    title: 'Ebook Lembar Aktivitas Huruf Hijaiyah Anak TK (Printable Faceless Kit)',
    type: 'DIGITAL_EBOOK',
    category: 'Ebook Digital',
    price: 25000,
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=kXYiU_JCYtU',
    videoDurationSec: 30,
    rating: 4.9,
    reviewsCount: 54,
    publisherOrBrand: 'Pustaka Zaidly Kids',
    author: 'Tim Kurikulum Sunnah',
    targetAge: '4-6 Tahun',
    isFaceless: true,
    hasMusic: false,
    shortDescription: 'Paket printable 60 halaman lembar kerja menulis dan mewarnai huruf hijaiyah. Ilustrasi 100% faceless tanpa gambar wajah makhluk bernyawa, ramah syariat.',
    descriptionHtml: `
      <p>Alhamdulillah, lembar kerja hijaiyah ini dirancang khusus untuk memandu si kecil mengenal huruf Al-Qur'an dengan rasa bahagia dan tenang di atas sunnah.</p>
      <h4>Keutamaan Lembar Kerja Ini:</h4>
      <ul>
        <li><strong>100% Faceless:</strong> Ilustrasi flora, benda alam, dan karakter tanpa mata/wajah, menjaga adab syariat sesuai rujukan para ulama.</li>
        <li><strong>Latihan Motorik Halus:</strong> Tracing garis putus-putus, mewarnai pola, dan menghubungkan huruf hijaiyah.</li>
        <li><strong>Bisa Dicetak Berkali-kali:</strong> Cocok untuk dipakai seluruh anak di rumah tanpa perlu beli buku fisik ulang.</li>
      </ul>
    `,
    highlights: [
      '⚡ Unduhan Instan (Langsung aktif detik ini juga setelah bayar)',
      '📄 1 File PDF Siap Cetak Ukuran A4 (60 Halaman High-Res)',
      '🌿 Ilustrasi Faceless (Aman Syar\'i sesuai rujukan Rumaysho)',
      '🖨️ Lisensi Penggunaan Pribadi Keluarga Selamanya'
    ],
    digitalFormat: 'Printable Activity Kit',
    fileSizeMb: 14.8,
    totalPages: 60,
    previewPages: [
      'Halaman 1: Pengenalan Huruf Alif & Baa dengan Pola Mewarnai',
      'Halaman 2: Tracing Huruf Ta & Tsa dengan Garis Bantu',
      'Halaman 3: Latihan Mencari Jejak Huruf Hijaiyah'
    ]
  },
  {
    id: 'prod-2',
    slug: 'buku-25-kisah-nabi-anak-bergambar-faceless',
    title: 'Buku 25 Kisah Nabi & Rasul untuk Balita (Edisi Faceless Hardcover)',
    type: 'PHYSICAL_BOOK',
    category: 'Buku Fisik',
    price: 68000,
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=800&q=80',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
    videoDurationSec: 30,
    rating: 5.0,
    reviewsCount: 112,
    publisherOrBrand: 'Ahlan Pustaka Umat',
    author: 'Nizar Sa\'ad Jabal, Lc. M.Pd.',
    targetAge: '4-6 Tahun',
    isFaceless: true,
    hasMusic: false,
    shortDescription: 'Kisah shahih 25 Nabi dan Rasul dikemas dengan bahasa cinta dan ilustrasi lembut tanpa wajah detail. Menanamkan kecintaan kepada para Nabi sejak dini.',
    descriptionHtml: `
      <p>Buku rujukan terpercaya untuk mengenalkan keteladanan para Nabi 'alaihimussalam kepada anak-anak kita. Menggunakan sumber-sumber riwayat yang shahih tanpa bumbu dongeng israeliyat.</p>
      <h4>Spesifikasi Buku:</h4>
      <ul>
        <li>Kertas tebal Art Paper 150gr mengkilap dan tidak mudah sobek.</li>
        <li>Sudut buku rounded (tumpul) aman untuk balita.</li>
        <li>Ukuran pas digenggam tangan mungil si kecil (17 x 17 cm).</li>
      </ul>
    `,
    highlights: [
      '📦 Dikirim Fisik via Ekspedisi Resmi (KiriminAja)',
      '🛡️ Rujukan Riwayat Shahih & Bebas Dongeng Syubhat',
      '📖 Hardcover Laminasi Doff Mewah & Awet',
      '👶 Ujung Buku Rounded / Tumpul (Aman untuk Balita)'
    ],
    stock: 24,
    weightGrams: 380,
    dimensions: '17 x 17 x 1.5 cm'
  },
  {
    id: 'prod-3',
    slug: 'balok-susun-kayu-hijaiyah-montessori-natural',
    title: 'Mainan Edukasi Balok Susun Huruf Hijaiyah Kayu Pinus Alami (Montessori Non-Toxic)',
    type: 'PHYSICAL_TOY',
    category: 'Mainan Edukasi',
    price: 89000,
    coverImage: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    videoDurationSec: 25,
    rating: 4.9,
    reviewsCount: 37,
    publisherOrBrand: 'Zaidly Artisan Woodcraft',
    targetAge: '1-3 Tahun',
    isFaceless: true,
    hasMusic: false,
    shortDescription: 'Balok kayu pinus halus 30 pcs berukir huruf hijaiyah dan harakat. Membantu sensori rabaan balita tanpa suara musik dan tanpa figur makhluk bernyawa.',
    descriptionHtml: `
      <p>Mengasah kemampuan motorik, koordinasi mata-tangan, serta mengenalkan huruf Arab melalui media sentuhan fisik yang nyata.</p>
      <h4>Kelebihan Produk:</h4>
      <ul>
        <li>100% Kayu Pinus oven kering, diampelas halus tanpa serpihan tajam.</li>
        <li>Cat water-based bersertifikasi food-grade & non-toxic, aman jika masuk mulut bayi.</li>
        <li>Tanpa speaker/musik instrumen — hening, menenangkan, dan melatih fokus anak.</li>
      </ul>
    `,
    highlights: [
      '🪵 Kayu Pinus Alami Solid (Halus & Ramah Lingkungan)',
      '🌿 Cat Water-based Food Grade (Bebas Timbal & Racun)',
      '🔇 Bebas Suara Musik Instrumen (Tenang & Syar\'i)',
      '📦 Termasuk Pouch Katun Cantik untuk Tempat Simpan'
    ],
    stock: 15,
    weightGrams: 550,
    dimensions: '22 x 15 x 6 cm',
    material: 'Kayu Pinus Pilihan, Cat Food Grade Non-Toxic'
  },
  {
    id: 'prod-4',
    slug: 'ebook-doa-dan-dzikir-harian-anak-muslim-flashcard',
    title: 'Ebook Flashcard Doa & Dzikir Harian Sesuai Sunnah (Printable PDF Berwarna)',
    type: 'DIGITAL_EBOOK',
    category: 'Ebook Digital',
    price: 19000,
    coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 5.0,
    reviewsCount: 78,
    publisherOrBrand: 'Pustaka Zaidly Kids',
    author: 'Ustadz Pembina Materi',
    targetAge: 'Semua Usia',
    isFaceless: true,
    hasMusic: false,
    shortDescription: 'Kartu doa harian (bangun tidur, makan, masuk masjid, berpakaian) lengkap teks Arab, transliterasi, arti, dan faedah ringkas hadits shahih.',
    descriptionHtml: `
      <p>Doa-doa pilihan dari kitab Hisnul Muslim (Benteng Muslim) yang disederhanakan visualnya agar mudah dihafal oleh ananda tercinta.</p>
      <ul>
        <li>Format kartu saku (pocket card) siap potong.</li>
        <li>Bisa dilaminasi agar awet dan bisa ditempel di sudut rumah.</li>
      </ul>
    `,
    highlights: [
      '⚡ Download Langsung 1 Detik setelah Bayar',
      '🤲 32 Kartu Doa Shahih dari Hisnul Muslim',
      '🔤 Teks Arab Jernih Font Mushaf Madinah',
      '🎨 Desain Elegan Minimalis Bergaya Nordic'
    ],
    digitalFormat: 'PDF High-Resolution',
    fileSizeMb: 9.4,
    totalPages: 16,
    previewPages: [
      'Doa Sebelum Makan & Setelah Makan',
      'Doa Masuk Rumah & Keluar Rumah',
      'Doa Sebelum Tidur & Bangun Tidur'
    ]
  },
  {
    id: 'prod-5',
    slug: 'buku-mengenal-tauhid-sejak-dini-balita',
    title: 'Buku Mengenal Tauhid Sejak Dini untuk Anak (Pustaka Imam Syafi\'i)',
    type: 'PHYSICAL_BOOK',
    category: 'Buku Fisik',
    price: 45000,
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=kXYiU_JCYtU',
    videoDurationSec: 30,
    rating: 4.9,
    reviewsCount: 89,
    publisherOrBrand: 'Pustaka Imam Syafi\'i',
    author: 'Syaikh Muhammad bin Abdul Wahhab (Adaptasi Anak)',
    targetAge: '4-6 Tahun',
    isFaceless: true,
    hasMusic: false,
    shortDescription: 'Buku pengenalan Siapa Rabb-mu, Apa Agamamu, dan Siapa Nabimu melalui dialog sederhana antara orang tua dan anak tercinta.',
    descriptionHtml: `
      <p>Pondasi utama seorang muslim adalah Aqidah Tauhid yang lurus. Buku ini menyajikan Tiga Landasan Utama (Al-Ushul Ats-Tsalatsah) dengan bahasa yang amat mudah dipahami anak usia dini.</p>
    `,
    highlights: [
      '📦 Pengiriman Aman Dibungkus Bubble Wrap Berlapis',
      '🌿 Pondasi Aqidah Shahih Sesuai Salafush Shalih',
      '📝 Dilengkapi Pertanyaan Interaktif Penguji Pemahaman'
    ],
    stock: 40,
    weightGrams: 220,
    dimensions: '20 x 14 x 1 cm'
  },
  {
    id: 'prod-6',
    slug: 'puzzle-kayu-3d-rukun-islam-dan-shalat',
    title: 'Puzzle Kayu Jam Shalat 5 Waktu & Rukun Islam 3D (Edukasi Motorik Anak)',
    type: 'PHYSICAL_TOY',
    category: 'Mainan Edukasi',
    price: 94000,
    coverImage: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.8,
    reviewsCount: 29,
    publisherOrBrand: 'Zaidly Artisan Woodcraft',
    targetAge: '4-6 Tahun',
    isFaceless: true,
    hasMusic: false,
    shortDescription: 'Papan puzzle kayu interaktif untuk belajar urutan waktu shalat (Subuh s.d Isya) dan 5 Rukun Islam. Kuat, awet, dan ramah tangan anak.',
    descriptionHtml: `
      <p>Membantu anak memahami konsep waktu shalat wajib sehari-hari secara visual dan kinestetik yang mengasyikkan.</p>
    `,
    highlights: [
      '🧩 Puzzle Kayu Tebal 8mm Solid',
      '🕰️ Jarum Jam Bisa Diputar Melatih Konsep Waktu',
      '🎨 Warna Earthy Pastel Menenangkan'
    ],
    stock: 18,
    weightGrams: 420,
    dimensions: '25 x 25 x 1.5 cm',
    material: 'MDF Kayu Ramah Lingkungan & Kayu Pinus Alami'
  },
  {
    id: 'prod-7',
    slug: 'ebook-jurnal-shalat-dan-adab-harian-anak-shalih',
    title: 'Ebook Jurnal & Tracker Shalat 5 Waktu Anak Shalih (Interactive Printable)',
    type: 'DIGITAL_EBOOK',
    category: 'Ebook Digital',
    price: 22000,
    coverImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.9,
    reviewsCount: 46,
    publisherOrBrand: 'Pustaka Zaidly Kids',
    targetAge: '7-10 Tahun',
    isFaceless: true,
    hasMusic: false,
    shortDescription: 'Buku catatan harian untuk memotivasi anak mendirikan shalat tepat waktu, membaca Al-Qur\'an, dan berbakti kepada orang tua dengan sistem stiker mandiri.',
    descriptionHtml: `
      <p>Jurnal 30 hari yang mendampingi ananda menumbuhkan kebiasaan ibadah shalat tanpa paksaan, melainkan dengan cinta dan kesadaran diri.</p>
    `,
    highlights: [
      '⚡ Langsung Unduh Detik Ini Juga',
      '📅 Lembar Evaluasi Bulanan & Tracker Bintang',
      '🕌 Dilengkapi Hadits Pilihan Keutamaan Shalat Berjamaah'
    ],
    digitalFormat: 'Printable Activity Kit',
    fileSizeMb: 11.2,
    totalPages: 35
  },
  {
    id: 'prod-8',
    slug: 'buku-adab-dan-akhlak-anak-muslim-faceless',
    title: 'Buku Seri Adab Anak Shalih: Adab Bertetangga, Makan & Berbicara',
    type: 'PHYSICAL_BOOK',
    category: 'Buku Fisik',
    price: 52000,
    coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=800&q=80',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
    videoDurationSec: 30,
    rating: 5.0,
    reviewsCount: 65,
    publisherOrBrand: 'Pustaka Attuqa',
    author: 'Abu Abdillah Syahrul Fatwa',
    targetAge: '7-10 Tahun',
    isFaceless: true,
    hasMusic: false,
    shortDescription: 'Kumpulan adab islami yang dicontohkan Rasulullah ﷺ dalam keseharian. Berisi contoh aplikatif yang mudah ditiru anak-anak.',
    descriptionHtml: `
      <p>Mengajarkan adab sebelum ilmu. Buku ini menjadi pegangan wajib bagi keluarga muslim yang ingin membina karakter anak berbudi luhur.</p>
    `,
    highlights: [
      '📦 Kirim Fisik Packing Aman & Rapi',
      '🌸 Disertai Dalil Al-Qur\'an & As-Sunnah',
      '👦 Contoh Nyata dalam Kehidupan Rumah Tangga'
    ],
    stock: 35,
    weightGrams: 280,
    dimensions: '21 x 15 x 0.8 cm'
  }
];

export const MOCK_COURIER_RATES: CourierRate[] = [
  {
    courierCode: 'JNT',
    courierName: 'J&T Express',
    service: 'EZ (Reguler)',
    etd: '1-2 Hari',
    cost: 11000,
    logo: '🔴'
  },
  {
    courierCode: 'SICEPAT',
    courierName: 'SiCepat Ekspres',
    service: 'REG (Reguler Cepat)',
    etd: '1-2 Hari',
    cost: 12000,
    logo: '⚡'
  },
  {
    courierCode: 'JNE',
    courierName: 'JNE Express',
    service: 'REG (Layanan Reguler)',
    etd: '2-3 Hari',
    cost: 13000,
    logo: '📦'
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'hukum-gambar-dan-boneka-mainan-anak-menurut-fatwa-salaf-rumaysho',
    title: 'Hukum Gambar & Boneka Mainan Anak Menurut Penjelasan Para Ulama (Rujukan Rumaysho)',
    excerpt: 'Memahami rukhshah (keringanan) mainan anak perempuan berdasarkan hadits Aisyah radhiyallahu \'anha dan mengapa pendekatan ilustrasi faceless lebih menenangkan bagi orang tua.',
    contentHtml: `
      <p>Sebagai orang tua yang berusaha membimbing keluarga di atas manhaj Salafush Shalih, pertanyaan seputar mainan anak dan buku bergambar sering kali muncul di benak kita.</p>
      
      <h3>1. Dalil Keringanan (Rukhshah) Mainan Anak</h3>
      <p>Sebagaimana diulas secara mendalam di <em>Rumaysho.com</em> (Ustadz Muhammad Abduh Tuasikal) dan fatwa Syaikh Muhammad bin Shalih Al-Utsaimin <em>rahimahullah</em>, hukum asal menggambar dan membentuk patung makhluk bernyawa adalah terlarang. Akan tetapi, ada pengecualian khusus untuk <strong>mainan anak-anak</strong>.</p>
      
      <blockquote>
        <p>"Dari 'Aisyah radhiyallahu 'anha, ia berkata: Aku dahulu bermain boneka anak-anak perempuan (banat) di sisi Nabi shallallahu 'alaihi wa sallam..." (HR. Bukhari no. 6130 dan Muslim no. 2440).</p>
      </blockquote>
      
      <p>Para ulama menjelaskan bahwa hikmah diperbolehkannya mainan bagi anak adalah sebagai sarana tarbiyah (latihan mendidik dan mengasuh) serta fitrah masa kanak-kanak yang butuh media belajar.</p>
      
      <h3>2. Mengapa Ilustrasi Faceless Menjadi Pilihan Terbaik?</h3>
      <p>Sebagian ulama kontemporer (seperti Syaikh Ibnu Utsaimin) merinci bahwa mainan atau ilustrasi yang paling aman dan disepakati tanpa perselisihan adalah yang <strong>tidak berwajah sempurna</strong> (tidak memiliki mata, hidung, atau mulut detail). Hal ini meneladani bentuk boneka sederhana dari kain di zaman para shahabat.</p>
      <p>Oleh karena itu, di <strong>toko.zaidly.com</strong>, seluruh materi edukasi dan buku kami kurasi dengan gaya <em>faceless illustration</em> agar menghadirkan ketenangan hati bagi orang tua serta menanamkan adab syariat sejak dini.</p>
    `,
    author: 'Tim Asatidzah & Edukasi Zaidly',
    date: '12 Oktober 2026',
    readTime: '4 menit baca',
    category: 'Fiqih & Adab Anak',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    tags: ['Rumaysho', 'Mainan Anak', 'Faceless', 'Fiqih Muamalah']
  },
  {
    id: 'blog-2',
    slug: 'cara-menanamkan-tauhid-sejak-dini-pada-anak-usia-emas',
    title: 'Cara Praktis Menanamkan Aqidah Tauhid pada Balita Usia Emas (0-6 Tahun)',
    excerpt: 'Metode menanamkan kecintaan kepada Allah, mengenal ciptaan-Nya, dan membiasakan kalimat thoyyibah dalam kehidupan sehari-hari anak tanpa membebani mereka.',
    contentHtml: `
      <p>Imam Ibnu Qayyim Al-Jauziyyah <em>rahimahullah</em> dalam kitab <em>Tuhfatul Maudud bi Ahkamil Maulud</em> menekankan pentingnya kalimat Tauhid sebagai kalimat pertama yang diperdengarkan dan dipahami oleh anak saat mulai bisa berbicara.</p>
      
      <h3>Langkah Aplikatif di Rumah:</h3>
      <ul>
        <li><strong>Mentadaburi Alam:</strong> Saat melihat awan, hujan, atau tanaman yang tumbuh, tanyakan: <em>"Siapa yang menurunkan air hujan yang sejuk ini, sayang?"</em> Biarkan mereka menjawab dengan penuh takzim: <em>"Allah Ta'ala."</em></li>
        <li><strong>Membiasakan Doa Bersandar Hanya pada Allah:</strong> Ajari anak meminta pertolongan kepada Allah saat menemui kesulitan kecil, misalnya saat mainannya tersangkut.</li>
        <li><strong>Media Bacaan yang Bersih:</strong> Pilihlah buku-buku yang mengisahkan kemahabesaran Allah dan kisah para Nabi daripada dongeng khayalan sihir yang merusak aqidah.</li>
      </ul>
    `,
    author: 'Ummu Zaid (Praktisi Parenting Sunnah)',
    date: '10 Oktober 2026',
    readTime: '5 menit baca',
    category: 'Parenting Sunnah',
    coverImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
    tags: ['Tauhid Anak', 'Pendidikan Usia Dini', 'Aqidah Shahihah']
  }
];
