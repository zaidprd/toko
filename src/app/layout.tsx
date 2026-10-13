import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://toko.zaidly.com'),
  title: {
    default: 'toko.zaidly.com | Toko Buku, Mainan & Ebook Ramah Sunnah Anak',
    template: '%s | Toko Zaidly',
  },
  description:
    'Toko online terpercaya pilihan buku anak, mainan edukasi kayu faceless, dan printable ebook sesuai manhaj salaf dan sunnah (Rujukan Rumaysho). Belanja amanah & terpercaya.',
  keywords: [
    'buku anak sunnah',
    'mainan kayu montessori islami',
    'ebook anak printable',
    'buku faceless',
    'toko zaidly',
    'parenting sunnah',
    'rumaysho',
  ],
  authors: [{ name: 'Ahmad Zaid (Toko Zaidly)' }],
  creator: 'Toko Zaidly',
  publisher: 'Toko Zaidly',
  alternates: {
    canonical: 'https://toko.zaidly.com',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'toko.zaidly.com | Toko Buku, Mainan & Ebook Ramah Sunnah Anak',
    description:
      'Koleksi buku rujukan shahih, mainan kayu sensori non-toxic bebas musik & tahayul, serta paket printable lembar aktivitas untuk belajar di rumah.',
    url: 'https://toko.zaidly.com',
    siteName: 'Toko Zaidly',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'toko.zaidly.com | Toko Buku, Mainan & Ebook Ramah Sunnah Anak',
    description:
      'Toko online terpercaya pilihan buku anak, mainan edukasi kayu faceless, dan printable ebook ramah sunnah.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    name: 'Toko Zaidly',
    url: 'https://toko.zaidly.com',
    description:
      'Toko buku anak islami, mainan kayu sensori faceless tanpa musik, dan printable ebook ramah sunnah (Rujukan Rumaysho).',
    currenciesAccepted: 'IDR',
    paymentAccepted: 'QRIS, Virtual Account',
    areaServed: 'ID',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kebon Jeruk',
      addressRegion: 'Jakarta Barat',
      postalCode: '11550',
      addressCountry: 'ID',
    },
  };

  return (
    <html lang="id" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased text-[#222222] bg-[#FAF7F2]">
        {children}
      </body>
    </html>
  );
}
