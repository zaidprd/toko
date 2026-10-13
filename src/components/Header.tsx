'use client';

import React from 'react';
import { Search, ShoppingBag, Heart, Sparkles, BookOpen, Layers } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenAdmin?: () => void;
  onScrollToBlog: () => void;
}

export default function Header({
  searchQuery,
  onSearchChange,
  activeCategory,
  onSelectCategory,
  cartCount,
  wishlistCount,
  onOpenCart,
  onScrollToBlog,
}: HeaderProps) {
  const categories = [
    { id: 'ALL', label: 'Semua Produk' },
    { id: 'Ebook Digital', label: '⚡ Ebook Unduhan Instan' },
    { id: 'Buku Fisik', label: '📚 Buku Sunnah Fisik' },
    { id: 'Mainan Edukasi', label: '🧩 Mainan Kayu & Montessori' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E6E1D8] transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#1F6347] text-white text-xs font-medium py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
        <span>Bebas Ongkir se-Jawa Min. 150rb</span>
        <span className="opacity-60">•</span>
        <span>🌿 Kurasi Shahih Manhaj Salaf (Rujukan Rumaysho)</span>
        <span className="opacity-60">•</span>
        <span className="hidden sm:inline">⚡ Ebook Langsung Unduh via Mayar</span>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onSelectCategory('ALL')}>
          <div className="w-10 h-10 rounded-xl bg-[#DE5A35] text-white flex items-center justify-center font-bold text-xl shadow-sm">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#222222] font-serif-title flex items-center gap-1.5">
              toko.zaidly.com
            </span>
            <p className="text-[11px] text-[#7A7A7A] tracking-wider uppercase font-medium -mt-1 hidden sm:block">
              Kids Books, Toys & Ebooks Sesuai Sunnah
            </p>
          </div>
        </div>

        {/* Etsy-Style Search Bar */}
        <div className="flex-1 max-w-xl mx-2">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari buku tauhid, mainan kayu faceless, ebook printable..."
              className="w-full bg-white border-2 border-[#E6E1D8] focus:border-[#DE5A35] rounded-full py-2 pl-4 pr-11 text-sm text-[#222222] placeholder-[#8A8A8A] outline-none transition-all shadow-sm focus:shadow-md"
            />
            <button
              type="button"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#DE5A35] hover:bg-[#C54724] text-white flex items-center justify-center transition-colors shadow-sm"
              aria-label="Cari"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Actions: Wishlist, Cart, Lacak & Blog */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="/lacak"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#595959] hover:bg-[#EBE4D9] rounded-full border border-[#E6E1D8] transition-all"
            title="Lacak paket atau unduh ulang ebook tanpa login"
          >
            <span>📦 Lacak Pesanan</span>
          </a>

          <button
            onClick={onScrollToBlog}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1F6347] hover:bg-[#E8F4EC] rounded-full border border-[#1F6347]/20 transition-all"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Blog Parenting</span>
          </button>

          {/* Wishlist */}
          <button
            className="relative p-2 rounded-full hover:bg-[#EBE4D9] text-[#222222] transition-colors"
            title="Favorit Saya"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#DE5A35] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 bg-white hover:bg-[#F5EFEB] border border-[#E6E1D8] py-1.5 px-3.5 rounded-full text-[#222222] shadow-sm transition-all hover:shadow"
            title="Keranjang Belanja"
          >
            <ShoppingBag className="w-5 h-5 text-[#DE5A35]" />
            <span className="text-xs font-bold hidden sm:inline">Keranjang</span>
            {cartCount > 0 && (
              <span className="bg-[#DE5A35] text-white text-xs font-bold px-1.5 py-0.2 rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Horizontal Category Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2.5 pt-0.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`text-xs font-semibold px-4 py-1.5 rounded-full whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#222222] text-white shadow-sm'
                  : 'bg-white/80 hover:bg-white text-[#595959] hover:text-[#222222] border border-[#E6E1D8]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
