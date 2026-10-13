import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { INITIAL_BLOG_POSTS } from '@/data/mockData';
import Footer from '@/components/Footer';
import { BookOpen, Calendar, Clock, ChevronRight, Sparkles, ArrowLeft } from 'lucide-react';

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

        {/* Articles List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {INITIAL_BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-3xl border border-[#E6E1D8] overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <Link href={`/blog/${post.slug}`} className="block overflow-hidden aspect-16/9 bg-[#F3EEE7] relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#19583E] text-[10px] font-bold px-3 py-1 rounded-full shadow-xs">
                  {post.category}
                </span>
              </Link>

              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center gap-3 text-[11px] text-[#7A7A7A] mb-2.5 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-[#222222] font-serif-title leading-snug group-hover:text-[#DE5A35] transition-colors mb-2.5">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>

                  <p className="text-xs text-[#595959] line-clamp-3 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F3EEE7] flex items-center justify-between">
                  <span className="text-[11px] text-[#7A7A7A]">Penulis: {post.author}</span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#DE5A35] hover:text-[#C54724]"
                  >
                    <span>Baca Lengkap</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
