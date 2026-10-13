'use client';

import React, { useState } from 'react';
import { BlogPost } from '@/types';
import { BookOpen, Calendar, Clock, ChevronRight, X, Sparkles } from 'lucide-react';

interface BlogSectionProps {
  posts: BlogPost[];
}

export default function BlogSection({ posts }: BlogSectionProps) {
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

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
            <article
              key={post.id}
              onClick={() => setActivePost(post)}
              className="bg-white rounded-3xl border border-[#E6E1D8] overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group etsy-card"
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
                  <span>Baca Selengkapnya</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Article Detail Reader Modal (100% Pure HTML Renderer!) */}
      {activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#E6E1D8] overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="p-4 sm:p-5 border-b border-[#E6E1D8] bg-[#FAF7F2] flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#DE5A35]" />
                <span className="text-xs font-bold text-[#595959]">Artikel Tarbiyah Sunnah</span>
              </div>
              <button
                onClick={() => setActivePost(null)}
                className="w-8 h-8 rounded-full bg-white hover:bg-[#EBE4D9] flex items-center justify-center text-[#595959]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-5 sm:p-8 space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#19583E] bg-[#E8F4EC] px-3 py-1 rounded-full">
                  {activePost.category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#222222] font-serif-title leading-tight">
                  {activePost.title}
                </h1>
                <div className="flex items-center gap-3 text-xs text-[#7A7A7A] pt-1">
                  <span>Penulis: <strong>{activePost.author}</strong></span>
                  <span>•</span>
                  <span>{activePost.date}</span>
                </div>
              </div>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activePost.coverImage}
                alt={activePost.title}
                className="w-full h-64 object-cover rounded-2xl border border-[#E6E1D8]"
              />

              {/* Pure HTML Rendered Content */}
              <div
                className="text-sm text-[#333333] leading-relaxed space-y-3 pt-2 prose"
                dangerouslySetInnerHTML={{ __html: activePost.contentHtml }}
              />

              <div className="mt-8 p-4 bg-[#FAF7F2] rounded-2xl border border-[#E6E1D8] text-xs text-[#595959] space-y-1">
                <p className="font-bold text-[#222222]">Catatan Redaksi:</p>
                <p>
                  Seluruh isi artikel disarikan dari rujukan para ulama Ahlus Sunnah wal Jama&apos;ah dan kajian terpercaya (seperti Rumaysho.com oleh Ustadz Muhammad Abduh Tuasikal).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
