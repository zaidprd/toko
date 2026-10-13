import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { INITIAL_BLOG_POSTS } from '@/data/mockData';
import Footer from '@/components/Footer';
import BlogIndexList from '@/components/BlogIndexList';
import { BookOpen, Sparkles, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog Parenting Sunnah & Fikih Edukasi Anak | Toko Zaidly',
  description:
    'Kumpulan artikel tarbiyah buah hati di atas manhaj Salafush Shalih, rujukan fatwa Rumaysho seputar mainan faceless anak, dan tips menanamkan tauhid sejak usia dini.',
  alternates: {
    canonical: 'https://toko.zaidly.com/blog',
  },
  openGraph: {
    title: 'Blog Parenting Sunnah & Fikih Edukasi Anak | Toko Zaidly',
    description:
      'Artikel panduan mendidik anak sesuai sunnah dan rujukan fatwa ulama seputar adab & mainan anak islami.',
    url: 'https://toko.zaidly.com/blog',
    siteName: 'Toko Zaidly',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#222222]">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E6E1D8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-[#595959] hover:text-[#DE5A35] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda Toko</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#DE5A35] text-white flex items-center justify-center font-bold text-base shadow-sm">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="font-bold font-serif-title text-[#222222] text-sm">
              toko.zaidly.com / blog
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-10 w-full">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-[#7A7A7A]">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-[#DE5A35]">
                Beranda
              </Link>
            </li>
            <li>/</li>
            <li className="font-semibold text-[#222222]">Blog Tarbiyah Sunnah</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E8F4EC] text-[#19583E] text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Fikih & Panduan Parenting Sunnah</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-[#222222] font-serif-title tracking-tight leading-tight">
            Nasehat & Edukasi Buah Hati di Atas Manhaj Salaf
          </h1>
          <p className="text-xs sm:text-sm text-[#595959] mt-3 leading-relaxed">
            Rujukan fatwa dan artikel tarbiyah anak dari asatidzah terpercaya (Rumaysho, Ulama Ahlus Sunnah) untuk ketenangan hati orang tua dalam memilih sarana belajar anak.
          </p>
        </div>

        {/* Articles List with Category Filter & Search */}
        <BlogIndexList initialPosts={INITIAL_BLOG_POSTS} />
      </main>

      <Footer />
    </div>
  );
}
