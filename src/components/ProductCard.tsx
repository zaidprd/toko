'use client';

import React from 'react';
import { Product } from '@/types';
import { Star, Download, Truck, Heart, Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
}

export default function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onSelectProduct,
  onQuickAddToCart,
}: ProductCardProps) {
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const isDigital = product.type === 'DIGITAL_EBOOK';

  return (
    <div className="group etsy-card bg-white rounded-2xl border border-[#E6E1D8] overflow-hidden flex flex-col justify-between relative cursor-pointer">
      {/* Top Image Container */}
      <div className="relative aspect-4/3 w-full bg-[#F3EEE7] overflow-hidden" onClick={() => onSelectProduct(product)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.coverImage}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Floating Digital / Physical Badge */}
        <div className="absolute top-2.5 left-2.5">
          {isDigital ? (
            <span className="badge-digital text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
              <Download className="w-3 h-3" />
              <span>Digital Download</span>
            </span>
          ) : (
            <span className="badge-physical text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
              <Truck className="w-3 h-3" />
              <span>{product.category}</span>
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#222222] shadow-sm flex items-center justify-center transition-transform active:scale-90"
          aria-label="Tambah ke Favorit"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-[#DE5A35] text-[#DE5A35]' : 'text-[#595959] hover:text-[#DE5A35]'
            }`}
          />
        </button>

        {/* Hover Quick Add Overlay Button (Ala Etsy Screenshot 3) */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 hidden sm:block">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickAddToCart(product);
            }}
            className="w-full py-2 bg-white/95 hover:bg-white text-[#222222] text-xs font-bold rounded-full shadow-md border border-[#E6E1D8] flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#DE5A35]" />
            <span>Tambah ke Keranjang</span>
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between" onClick={() => onSelectProduct(product)}>
        <div>
          {/* Brand & Age tags */}
          <div className="flex items-center justify-between text-[11px] text-[#7A7A7A] mb-1.5 font-medium">
            <span className="truncate max-w-[65%]">{product.publisherOrBrand}</span>
            <span className="bg-[#F3EEE7] px-2 py-0.5 rounded text-[#595959] font-semibold">
              {product.targetAge}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="text-xs sm:text-sm font-semibold text-[#222222] line-clamp-2 leading-snug group-hover:text-[#DE5A35] transition-colors mb-2">
            {product.title}
          </h3>

          {/* Star Ratings */}
          <div className="flex items-center gap-1.5 text-xs mb-2.5">
            <div className="flex text-[#F59E0B]">
              <Star className="w-3.5 h-3.5 fill-[#F59E0B]" />
            </div>
            <span className="font-bold text-[#222222] text-xs">{product.rating.toFixed(1)}</span>
            <span className="text-[#7A7A7A] text-[11px]">({product.reviewsCount})</span>
            {product.isFaceless && (
              <span className="badge-faceless text-[10px] font-bold px-1.5 py-0.2 rounded ml-auto">
                Faceless
              </span>
            )}
          </div>
        </div>

        {/* Pricing Row */}
        <div className="pt-2 border-t border-[#F3EEE7]">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base font-extrabold text-[#222222]">
              {formatIDR(product.price)}
            </span>
          </div>

          {/* Delivery Note */}
          <div className="mt-1.5 text-[11px] text-[#595959] flex items-center gap-1">
            {isDigital ? (
              <span className="text-[#19583E] font-medium flex items-center gap-1">
                <Download className="w-3 h-3" /> Unduhan Digital (PDF)
              </span>
            ) : (
              <span className="text-[#7A7A7A] flex items-center gap-1">
                <Truck className="w-3 h-3" /> Pengiriman Ekspedisi Fisik
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
