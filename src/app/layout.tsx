import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'toko.zaidly.com | Toko Buku, Mainan & Ebook Ramah Sunnah Anak',
  description: 'Toko online terpercaya pilihan buku anak, mainan edukasi kayu faceless, dan printable ebook sesuai manhaj salaf dan sunnah (Rujukan Rumaysho). Belanja amanah bebas riba.',
  keywords: ['buku anak sunnah', 'mainan kayu montessori islami', 'ebook anak printable', 'buku faceless', 'toko zaidly', 'rumaysho'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased text-[#222222] bg-[#FAF7F2]">
        {children}
      </body>
    </html>
  );
}
