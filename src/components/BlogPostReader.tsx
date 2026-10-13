'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogPost, Product } from '@/types';
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  BookOpen,
  Sparkles,
  ShoppingBag,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import Footer from './Footer';

interface BlogPostReaderProps {
  serverPost: BlogPost | null;
  slug: string;
  relatedProducts: Product[];
}

export default function BlogPostReader({
  serverPost,
  slug,
  relatedProducts,
}: BlogPostReaderProps) {
  const [post, setPost] = useState<BlogPost | null>(serverPost);
  const [copiedLink, setCopiedLink] = useState(false);

  // Check localStorage for newly created/edited articles
  useEffect(() => {
    try {
      const saved = localStorage.getItem('zaidly_blog_posts');
      if (saved) {
        const parsed: BlogPost[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const match = parsed.find((p) => p.slug === slug);
          if (match) {
            setPost(match);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#222222]">
        <header className="bg-white border-b border-[#E6E1D8] py-4 px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#595959] hover:text-[#DE5A35]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Blog</span>
          </Link>
        </header>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white p-10 rounded-3xl border border-[#E6E1D8] text-center max-w-md space-y-3 shadow-xs">
            <h2 className="text-xl font-bold font-serif-title text-[#222222]">Artikel Tidak Ditemukan</h2>
            <p className="text-xs text-[#7A7A7A]">
              Artikel dengan tautan ini belum tersedia atau telah dipindahkan.
            </p>
            <Link
              href="/blog"
              className="inline-block px-5 py-2.5 bg-[#DE5A35] text-white text-xs font-bold rounded-full hover:bg-[#C54724] transition-colors"
            >
              Lihat Semua Artikel Sunnah
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const shareWhatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${post.title}\n\nBaca artikel selengkapnya di Toko Zaidly:\nhttps://toko.zaidly.com/blog/${post.slug}`
  )}`;

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#222222]">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E6E1D8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-xs font-bold text-[#595959] hover:text-[#DE5A35] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Semua Artikel</span>
          </Link>

          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#DE5A35] text-white flex items-center justify-center font-bold text-base shadow-sm">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="font-bold font-serif-title text-[#222222] text-sm hidden sm:inline">
              toko.zaidly.com
            </span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-[#7A7A7A]">
          <ol className="flex items-center gap-2 flex-wrap">
            <li>
              <Link href="/" className="hover:text-[#DE5A35]">
                Beranda
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/blog" className="hover:text-[#DE5A35]">
                Blog Parenting
              </Link>
            </li>
            <li>/</li>
            <li className="font-semibold text-[#222222] line-clamp-1">{post.title}</li>
          </ol>
        </nav>

        <article className="bg-white rounded-3xl border border-[#E6E1D8] shadow-xs overflow-hidden">
          {/* Article Header */}
          <div className="p-6 sm:p-10 border-b border-[#F0ECE1]">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F4EC] text-[#19583E] text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>{post.category}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold text-[#222222] font-serif-title leading-tight mb-4">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-[#7A7A7A] flex-wrap">
              <span className="flex items-center gap-1.5 font-medium text-[#222222]">
                <User className="w-3.5 h-3.5 text-[#DE5A35]" />
                {post.author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {post.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
            </div>
          </div>

          {/* Featured Image */}
          {post.coverImage && (
            <div className="w-full aspect-16/9 bg-[#F3EEE7] overflow-hidden border-b border-[#E6E1D8]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Body */}
          <div className="p-6 sm:p-10 space-y-6">
            <div
              className="prose prose-sm sm:prose-base max-w-none text-[#333333] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />

            {/* Tags */}
            {Array.isArray(post.tags) && post.tags.length > 0 && (
              <div className="pt-6 border-t border-[#F0ECE1] flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#222222] flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-[#DE5A35]" />
                  <span>Topik Terkait:</span>
                </span>
                {post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs text-[#595959] bg-[#FAF7F2] border border-[#E6E1D8] px-2.5 py-1 rounded-full font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share Buttons */}
            <div className="pt-6 border-t border-[#F0ECE1] flex items-center justify-between flex-wrap gap-4">
              <span className="text-xs font-bold text-[#222222] flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-[#DE5A35]" />
                <span>Bagikan Faedah Artikel Ini:</span>
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={shareWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>WhatsApp</span>
                </a>

                <button
                  onClick={handleCopyLink}
                  className="px-3.5 py-2 bg-white hover:bg-[#FAF7F2] text-[#222222] border border-[#E6E1D8] rounded-full text-xs font-bold transition-colors cursor-pointer"
                >
                  {copiedLink ? '✓ Tautan Tersalin!' : 'Salin Tautan'}
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Recommended Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 bg-white rounded-3xl border border-[#E6E1D8] p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#19583E] uppercase tracking-wider bg-[#E8F4EC] px-2.5 py-0.5 rounded-full">
                  Katalog Terkait
                </span>
                <h3 className="text-lg font-bold font-serif-title text-[#222222] mt-1">
                  Sarana Edukasi &amp; Buku Penunjang Belajar Anak
                </h3>
              </div>
              <Link
                href="/"
                className="text-xs font-bold text-[#DE5A35] hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedProducts.map((prod) => (
                <Link
                  key={prod.id}
                  href={`/products/${prod.slug}`}
                  className="p-3 bg-[#FAF7F2] hover:bg-[#F3EEE7] rounded-2xl border border-[#E6E1D8] flex items-center gap-3 transition-colors group"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-white shrink-0 border border-[#E6E1D8]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={prod.coverImage}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#222222] truncate group-hover:text-[#DE5A35]">
                      {prod.title}
                    </h4>
                    <span className="text-xs font-black text-[#DE5A35] block mt-0.5">
                      Rp {prod.price.toLocaleString('id-ID')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
