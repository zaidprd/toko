import React from 'react';
import Link from 'next/link';
import { BlogPost } from '@/types';
import { Calendar, Clock, ChevronRight, Sparkles, BookOpen } from 'lucide-react';

interface BlogSectionProps {
  posts: BlogPost[];
}

export default function BlogSection({ posts }: BlogSectionProps) {
  return (
    <section id="blog-section" className="py-12 sm:py-16 bg-[#FAF7F2] border-t border-[#E6E1D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F4EC] text-[#19583E] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Fikih & Panduan Parenting Sunnah</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#222222] font-serif-title tracking-tight">
            Nasehat & Edukasi Buah Hati di Atas Manhaj Salaf
          </h2>
          <p className="text-xs sm:text-sm text-[#595959] mt-2">
            Rujukan fatwa dan artikel tarbiyah anak dari situs-situs terpercaya (Rumaysho, Ulama Ahlus Sunnah) untuk ketenangan hati orang tua.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="bg-white rounded-3xl border border-[#E6E1D8] overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div className="relative aspect-16/9 overflow-hidden bg-[#F3EEE7]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#19583E] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                  {post.category}
                </span>
              </div>

              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center gap-3 text-[11px] text-[#7A7A7A] mb-2 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#222222] font-serif-title leading-snug group-hover:text-[#DE5A35] transition-colors mb-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-[#595959] line-clamp-3 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F3EEE7] flex items-center justify-between text-xs font-bold text-[#DE5A35]">
                  <span>Baca Artikel Lengkap</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Blog Link */}
        <div className="text-center mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-[#FAF7F2] text-[#222222] text-xs font-bold rounded-full border border-[#E6E1D8] shadow-xs hover:shadow transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#DE5A35]" />
            <span>Lihat Semua Artikel di Halaman Blog →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
