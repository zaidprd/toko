'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/types';
import { Calendar, Clock, ChevronRight, Search, Tag } from 'lucide-react';

interface BlogIndexListProps {
  initialPosts: BlogPost[];
}

export default function BlogIndexList({ initialPosts }: BlogIndexListProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Load persisted blog posts from localStorage on client
  useEffect(() => {
    try {
      const saved = localStorage.getItem('zaidly_blog_posts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPosts(parsed);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Unique categories
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['ALL', ...Array.from(set)];
  }, [posts]);

  // Filtered posts
  const filteredPosts = React.useMemo(() => {
    return posts.filter((post) => {
      const matchCat = selectedCategory === 'ALL' || post.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E6E1D8] shadow-2xs">
        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#DE5A35] text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-[#595959] hover:bg-[#EBE4D9] hover:text-[#222222]'
              }`}
            >
              {cat === 'ALL' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari artikel sunnah..."
            className="w-full pl-8.5 pr-3 py-1.5 bg-[#FAF7F2] border border-[#E6E1D8] focus:border-[#DE5A35] rounded-xl text-xs text-[#222222] outline-none"
          />
        </div>
      </div>

      {/* Articles Grid */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E6E1D8] p-10 text-center space-y-2">
          <p className="font-bold text-sm text-[#222222]">Tidak Ada Artikel yang Ditemukan</p>
          <p className="text-xs text-[#7A7A7A]">
            Coba pilih kategori lain atau gunakan kata kunci pencarian berbeda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-3xl border border-[#E6E1D8] overflow-hidden shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="block overflow-hidden aspect-16/9 bg-[#F3EEE7] relative"
              >
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
                      <Calendar className="w-3.5 h-3.5 text-[#DE5A35]" />
                      <span>{post.date}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#DE5A35]" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-[#222222] font-serif-title leading-snug group-hover:text-[#DE5A35] transition-colors mb-2.5">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>

                  <p className="text-xs text-[#595959] line-clamp-3 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  {Array.isArray(post.tags) && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {post.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] text-[#595959] bg-[#FAF7F2] border border-[#E6E1D8] px-2 py-0.5 rounded-md flex items-center gap-1"
                        >
                          <Tag className="w-2.5 h-2.5 text-[#7A7A7A]" />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[#F3EEE7] flex items-center justify-between">
                  <span className="text-[11px] text-[#7A7A7A]">Oleh: {post.author}</span>
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
      )}
    </div>
  );
}
