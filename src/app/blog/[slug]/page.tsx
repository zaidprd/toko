import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { INITIAL_BLOG_POSTS, INITIAL_PRODUCTS } from '@/data/mockData';
import Footer from '@/components/Footer';
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  BookOpen,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
} from 'lucide-react';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return INITIAL_BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = INITIAL_BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: 'Artikel Tidak Ditemukan | Toko Zaidly',
    };
  }

  const url = `https://toko.zaidly.com/blog/${post.slug}`;

  return {
    title: `${post.title} | Toko Zaidly`,
    description: post.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      siteName: 'Toko Zaidly',
      locale: 'id_ID',
      type: 'article',
      publishedTime: '2026-10-12T00:00:00Z',
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: post.coverImage,
          width: 800,
          height: 600,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = INITIAL_BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Related products from store
  const relatedProducts = INITIAL_PRODUCTS.slice(0, 3);

  // Schema.org Article Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Toko Zaidly',
      url: 'https://toko.zaidly.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://toko.zaidly.com/favicon.ico',
      },
    },
    datePublished: '2026-10-12',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://toko.zaidly.com/blog/${post.slug}`,
    },
  };

  const shareWhatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${post.title}\n\nBaca artikel selengkapnya di Toko Zaidly:\nhttps://toko.zaidly.com/blog/${post.slug}`
  )}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#222222]">
      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
          <div className="relative aspect-16/9 bg-[#F3EEE7]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Body */}
          <div className="p-6 sm:p-10">
            {/* Excerpt Lead */}
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E6E1D8] text-xs sm:text-sm text-[#444444] font-medium leading-relaxed mb-8 italic">
              &ldquo;{post.excerpt}&rdquo;
            </div>

            {/* Pure Content Renderer */}
            <div
              className="prose prose-stone max-w-none text-sm sm:text-base leading-relaxed text-[#333333] space-y-4 font-sans [&>h3]:text-lg [&>h3]:font-bold [&>h3]:font-serif-title [&>h3]:text-[#222222] [&>h3]:mt-6 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&>blockquote]:border-l-4 [&>blockquote]:border-[#1F6347] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-[#4A4A4A] [&>blockquote]:bg-[#E8F4EC]/40 [&>blockquote]:p-3 [&>blockquote]:rounded-r-xl"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />

            {/* Tags & Share */}
            <div className="mt-10 pt-6 border-t border-[#F0ECE1] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#7A7A7A]">Tag:</span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-[#FAF7F2] border border-[#E6E1D8] text-[11px] font-medium text-[#595959] rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <a
                href={shareWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold rounded-full transition-all shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Bagikan ke WhatsApp</span>
              </a>
            </div>
          </div>
        </article>

        {/* Rekomendasi Produk Terkait untuk Belajar Buah Hati */}
        <section className="mt-12 bg-white rounded-3xl border border-[#E6E1D8] p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#222222] font-serif-title">
                📚 Sarana Belajar Anak Terkait (Kurasi Shahih)
              </h2>
              <p className="text-xs text-[#7A7A7A] mt-0.5">
                Pilihan buku &amp; mainan tanpa wajah (faceless) untuk mendukung adab di rumah
              </p>
            </div>
            <Link
              href="/"
              className="text-xs font-bold text-[#DE5A35] hover:underline hidden sm:inline"
            >
              Lihat Semua Produk →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedProducts.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="group p-3 rounded-2xl border border-[#E6E1D8] hover:border-[#DE5A35] transition-all bg-[#FAF7F2] flex flex-col justify-between"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-white mb-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.coverImage}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#222222] line-clamp-2 group-hover:text-[#DE5A35]">
                    {p.title}
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-black text-[#DE5A35]">
                      Rp {p.price.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-[#19583E] font-semibold bg-[#E8F4EC] px-2 py-0.5 rounded-full">
                      Lihat Detail
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
