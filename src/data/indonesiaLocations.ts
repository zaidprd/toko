export interface District {
  name: string;
  postalCode?: string;
}

export interface City {
  name: string;
  districts: string[];
}

export interface Province {
  name: string;
  cities: City[];
}

export const INDONESIA_PROVINCES: Province[] = [
  {
    name: 'DKI Jakarta',
    cities: [
      {
        name: 'Kota Jakarta Barat',
        districts: ['Kebon Jeruk', 'Palmerah', 'Kembangan', 'Grogol Petamburan', 'Cengkareng', 'Kalideres', 'Tambora', 'Taman Sari'],
      },
      {
        name: 'Kota Jakarta Selatan',
        districts: ['Tebet', 'Setiabudi', 'Mampang Prapatan', 'Pasar Minggu', 'Kebayoran Baru', 'Kebayoran Lama', 'Cilandak', 'Pancoran', 'Jagakarsa', 'Pesanggrahan'],
      },
      {
        name: 'Kota Jakarta Pusat',
        districts: ['Gambir', 'Tanah Abang', 'Menteng', 'Senen', 'Cempaka Putih', 'Johar Baru', 'Kemayoran', 'Sawah Besar'],
      },
      {
        name: 'Kota Jakarta Timur',
        districts: ['Matraman', 'Pulo Gadung', 'Jatinegara', 'Duren Sawit', 'Kramat Jati', 'Makasar', 'Pasar Rebo', 'Ciracas', 'Cipayung', 'Cakung'],
      },
      {
        name: 'Kota Jakarta Utara',
        districts: ['Penjaringan', 'Tanjung Priok', 'Koja', 'Kelapa Gading', 'Pademangan', 'Cilincing'],
      },
    ],
  },
  {
    name: 'Banten',
    cities: [
      {
        name: 'Kota Tangerang',
        districts: ['Tangerang', 'Cipondoh', 'Ciledug', 'Pinang', 'Karawaci', 'Batuceper', 'Benda', 'Larangan', 'Neglasari', 'Periuk'],
      },
      {
        name: 'Kota Tangerang Selatan',
        districts: ['Serpong', 'Serpong Utara', 'Pondok Aren', 'Ciputat', 'Ciputat Timur', 'Pamulang', 'Setu'],
      },
      {
        name: 'Kab. Tangerang',
        districts: ['Kelapa Dua', 'Curug', 'Legok', 'Pagedangan', 'Cikupa', 'Balaraja', 'Pasar Kemis', 'Sepatan', 'Tigaraksa'],
      },
      {
        name: 'Kota Serang',
        districts: ['Serang', 'Cipocok Jaya', 'Curug', 'Kasemen', 'Taktakan', 'Walantaka'],
      },
      {
        name: 'Kota Cilegon',
        districts: ['Cilegon', 'Cibeber', 'Citangkil', 'Ciwandan', 'Gerogol', 'Jombang', 'Pulomerak', 'Purwakarta'],
      },
    ],
  },
  {
    name: 'Jawa Barat',
    cities: [
      {
        name: 'Kota Bandung',
        districts: ['Coblong', 'Sukajadi', 'Cicendo', 'Andir', 'Lengkong', 'Regol', 'Batununggal', 'Cibeunying Kaler', 'Cibeunying Kidul', 'Buahbatu', 'Kiaracondong'],
      },
      {
        name: 'Kota Bogor',
        districts: ['Bogor Tengah', 'Bogor Barat', 'Bogor Selatan', 'Bogor Timur', 'Bogor Utara', 'Tanah Sareal'],
      },
      {
        name: 'Kota Depok',
        districts: ['Pancoran Mas', 'Sukmajaya', 'Beji', 'Cimanggis', 'Cinere', 'Sawangan', 'Limo', 'Tapos', 'Cilodong', 'Bojongsari'],
      },
      {
        name: 'Kota Bekasi',
        districts: ['Bekasi Barat', 'Bekasi Timur', 'Bekasi Selatan', 'Bekasi Utara', 'Rawa Lumbu', 'Pondok Gede', 'Medan Satria', 'Jatiasih', 'Jatisampurna'],
      },
      {
        name: 'Kab. Bogor',
        districts: ['Cibinong', 'Cileungsi', 'Gunung Putri', 'Bojonggede', 'Babakan Madang', 'Citeureup', 'Kemang', 'Parung'],
      },
      {
        name: 'Kab. Bandung',
        districts: ['Baleendah', 'Dayeuhkolot', 'Banjaran', 'Ciparay', 'Majalaya', 'Margahayu', 'Soreang'],
      },
      {
        name: 'Kota Cirebon',
        districts: ['Kejaksan', 'Kesambi', 'Lemahwungkuk', 'Harjamukti', 'Pekalipan'],
      },
      {
        name: 'Kab. Karawang',
        districts: ['Karawang Barat', 'Karawang Timur', 'Telukjambe Timur', 'Telukjambe Barat', 'Klari', 'Cikampek'],
      },
    ],
  },
  {
    name: 'D.I. Yogyakarta',
    cities: [
      {
        name: 'Kab. Sleman',
        districts: ['Depok', 'Mlati', 'Ngaglik', 'Gamping', 'Kalasan', 'Godean', 'Sleman', 'Ngemplak', 'Berbah'],
      },
      {
        name: 'Kota Yogyakarta',
        districts: ['Gondomanan', 'Danurejan', 'Kraton', 'Mantrijeron', 'Mergangsan', 'Umbulharjo', 'Kotagede', 'Jetis', 'Tegalrejo'],
      },
      {
        name: 'Kab. Bantul',
        districts: ['Bantul', 'Banguntapan', 'Sewon', 'Kasihan', 'Piyungan', 'Pleret', 'Imogiri'],
      },
      {
        name: 'Kab. Kulon Progo',
        districts: ['Wates', 'Pengasih', 'Sentolo', 'Temon', 'Lendah'],
      },
      {
        name: 'Kab. Gunungkidul',
        districts: ['Wonosari', 'Playen', 'Semanu', 'Karangmojo'],
      },
    ],
  },
  {
    name: 'Jawa Tengah',
    cities: [
      {
        name: 'Kota Semarang',
        districts: ['Semarang Tengah', 'Semarang Barat', 'Semarang Timur', 'Semarang Selatan', 'Semarang Utara', 'Banyumanik', 'Tembalang', 'Pedurungan', 'Gajahmungkur'],
      },
      {
        name: 'Kota Surakarta (Solo)',
        districts: ['Banjarsari', 'Jebres', 'Laweyan', 'Pasar Kliwon', 'Serengan'],
      },
      {
        name: 'Kab. Banyumas (Purwokerto)',
        districts: ['Purwokerto Barat', 'Purwokerto Timur', 'Purwokerto Selatan', 'Purwokerto Utara', 'Sokaraja', 'Banyumas'],
      },
      {
        name: 'Kab. Kudus',
        districts: ['Kota Kudus', 'Jati', 'Bae', 'Gebog', 'Kaliwungu', 'Mejobo'],
      },
      {
        name: 'Kota Tegal',
        districts: ['Tegal Barat', 'Tegal Timur', 'Tegal Selatan', 'Margadana'],
      },
    ],
  },
  {
    name: 'Jawa Timur',
    cities: [
      {
        name: 'Kota Surabaya',
        districts: ['Gubeng', 'Tegalsari', 'Wonokromo', 'Genteng', 'Rungkut', 'Sukolilo', 'Mulyorejo', 'Kenjeran', 'Sawahan', 'Sambikerep', 'Wiyung'],
      },
      {
        name: 'Kota Malang',
        districts: ['Klojen', 'Blimbing', 'Lowokwaru', 'Sukun', 'Kedungkandang'],
      },
      {
        name: 'Kab. Sidoarjo',
        districts: ['Sidoarjo', 'Waru', 'Candi', 'Gedangan', 'Taman', 'Sukodono', 'Krian'],
      },
      {
        name: 'Kab. Gresik',
        districts: ['Gresik', 'Kebomas', 'Manyar', 'Driyorejo', 'Menganti'],
      },
      {
        name: 'Kota Kediri',
        districts: ['Kota', 'Mojoroto', 'Pesantren'],
      },
    ],
  },
  {
    name: 'Sumatera Utara',
    cities: [
      {
        name: 'Kota Medan',
        districts: ['Medan Kota', 'Medan Barat', 'Medan Baru', 'Medan Petisah', 'Medan Helvetia', 'Medan Sunggal', 'Medan Denai', 'Medan Johor', 'Medan Tembung'],
      },
      {
        name: 'Kab. Deli Serdang',
        districts: ['Lubuk Pakam', 'Percut Sei Tuan', 'Sunggal', 'Tanjung Morawa'],
      },
    ],
  },
  {
    name: 'Sumatera Barat',
    cities: [
      {
        name: 'Kota Padang',
        districts: ['Padang Barat', 'Padang Timur', 'Padang Utara', 'Padang Selatan', 'Koto Tangah', 'Kuranji'],
      },
      {
        name: 'Kota Bukittinggi',
        districts: ['Guguk Panjang', 'Mandiangin Koto Selayan', 'Aur Birugo Tigo Baleh'],
      },
    ],
  },
  {
    name: 'Sumatera Selatan',
    cities: [
      {
        name: 'Kota Palembang',
        districts: ['Ilir Barat I', 'Ilir Barat II', 'Ilir Timur I', 'Ilir Timur II', 'Sukarami', 'Sako', 'Jakabaring', 'Kemuning'],
      },
    ],
  },
  {
    name: 'Riau',
    cities: [
      {
        name: 'Kota Pekanbaru',
        districts: ['Pekanbaru Kota', 'Sukajadi', 'Senapelan', 'Lima Puluh', 'Sail', 'Bukit Raya', 'Marpoyan Damai', 'Tampan', 'Rumbai'],
      },
    ],
  },
  {
    name: 'Lampung',
    cities: [
      {
        name: 'Kota Bandar Lampung',
        districts: ['Tanjung Karang Pusat', 'Tanjung Karang Barat', 'Tanjung Karang Timur', 'Kedaton', 'Teluk Betung Selatan', 'Way Halim', 'Sukarame'],
      },
    ],
  },
  {
    name: 'Bali',
    cities: [
      {
        name: 'Kota Denpasar',
        districts: ['Denpasar Barat', 'Denpasar Selatan', 'Denpasar Timur', 'Denpasar Utara'],
      },
      {
        name: 'Kab. Badung',
        districts: ['Kuta', 'Kuta Utara', 'Kuta Selatan', 'Mengwi', 'Abiansemal'],
      },
    ],
  },
  {
    name: 'Kalimantan Timur',
    cities: [
      {
        name: 'Kota Balikpapan',
        districts: ['Balikpapan Kota', 'Balikpapan Selatan', 'Balikpapan Tengah', 'Balikpapan Utara', 'Balikpapan Barat'],
      },
      {
        name: 'Kota Samarinda',
        districts: ['Samarinda Kota', 'Samarinda Ulu', 'Samarinda Ilir', 'Samarinda Seberang', 'Sungai Kunjang'],
      },
    ],
  },
  {
    name: 'Sulawesi Selatan',
    cities: [
      {
        name: 'Kota Makassar',
        districts: ['Ujung Pandang', 'Mariso', 'Mamajang', 'Makassar', 'Rappocini', 'Panakkukang', 'Tamalate', 'Bontoala', 'Wajo', 'Biringkanaya'],
      },
    ],
  },
];
