'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { Download, Truck, Play, Film, Image as ImageIcon } from 'lucide-react';
import { isYouTubeUrl, getYouTubeEmbedUrl } from '@/lib/mediaUtils';

interface ProductGalleryProps {
  product: Product;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  // Deduplicate all gallery images, ensure cover is at front
  const allImages = React.useMemo(() => {
    const list: string[] = [];
    if (product.coverImage) list.push(product.coverImage);
    if (Array.isArray(product.galleryImages)) {
      product.galleryImages.forEach((img) => {
        if (img && !list.includes(img)) {
          list.push(img);
        }
      });
    }
    return list.length > 0
      ? list
      : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'];
  }, [product.coverImage, product.galleryImages]);

  const [selectedImage, setSelectedImage] = useState<string>(allImages[0]);
  const [isVideoActive, setIsVideoActive] = useState<boolean>(false);

  const isDigital = product.type === 'DIGITAL_EBOOK';
  const hasVideo = Boolean(product.videoUrl && product.videoUrl.trim().length > 0);
  const isYt = hasVideo ? isYouTubeUrl(product.videoUrl || '') : false;
  const ytEmbedUrl = isYt && product.videoUrl ? getYouTubeEmbedUrl(product.videoUrl) : null;

  return (
    <div className="space-y-3.5">
      {/* Main Media Display Viewport */}
      <div className="relative aspect-4/3 w-full bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#E6E1D8] shadow-xs">
        {isVideoActive && hasVideo ? (
          <div className="w-full h-full flex items-center justify-center bg-black relative">
            {isYt && ytEmbedUrl ? (
              <iframe
                src={ytEmbedUrl}
                title={`${product.title} - Video Review`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={product.videoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              >
                Browser Anda tidak mendukung pemutar video HTML5.
              </video>
            )}

            {/* Back to Photo Button */}
            <button
              onClick={() => setIsVideoActive(false)}
              className="absolute top-3 right-3 z-10 px-3 py-1.5 bg-black/75 hover:bg-black text-white text-[11px] font-bold rounded-full backdrop-blur-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-white/20"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Kembali ke Foto</span>
            </button>
          </div>
        ) : (
          <div className="w-full h-full relative bg-[#F3EEE7]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full h-full object-cover transition-opacity duration-200"
            />

            {/* Type Badge */}
            <div className="absolute top-3 left-3">
              {isDigital ? (
                <span className="badge-digital text-xs font-bold px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" />
                  <span>⚡ Unduhan Digital Instan</span>
                </span>
              ) : (
                <span className="badge-physical text-xs font-bold px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  <span>{product.category} Fisik</span>
                </span>
              )}
            </div>

            {/* Watch Video Floating Pill if video available */}
            {hasVideo && (
              <button
                onClick={() => setIsVideoActive(true)}
                className="absolute bottom-3 right-3 px-3.5 py-2 bg-[#DE5A35] hover:bg-[#C54724] text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs"
              >
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-white text-white ml-0.5" />
                </div>
                <span>Tonton Video Produk (Maks 30s)</span>
              </button>
            )}

            {/* Total Photos Indicator */}
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <ImageIcon className="w-3 h-3" />
              <span>
                {allImages.indexOf(selectedImage) + 1} / {allImages.length} Foto
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {/* Video Thumbnail Button if video exists */}
        {hasVideo && (
          <button
            type="button"
            onClick={() => setIsVideoActive(true)}
            className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 relative bg-neutral-900 flex flex-col items-center justify-center transition-all cursor-pointer ${
              isVideoActive ? 'border-[#DE5A35] ring-2 ring-[#DE5A35]/30' : 'border-[#E6E1D8] hover:border-[#DE5A35]/60'
            }`}
            title="Putar Video Produk"
          >
            <div className="w-7 h-7 rounded-full bg-[#DE5A35] text-white flex items-center justify-center shadow-xs">
              <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
            </div>
            <span className="text-[9px] font-bold text-white mt-1 leading-tight flex items-center gap-0.5">
              <Film className="w-2.5 h-2.5" />
              <span>Video</span>
            </span>
          </button>
        )}

        {/* Image Thumbnails */}
        {allImages.map((img, idx) => {
          const isActive = !isVideoActive && selectedImage === img;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSelectedImage(img);
                setIsVideoActive(false);
              }}
              className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 relative transition-all cursor-pointer bg-[#F3EEE7] ${
                isActive ? 'border-[#DE5A35] ring-2 ring-[#DE5A35]/30' : 'border-[#E6E1D8] hover:border-[#DE5A35]/60 opacity-80 hover:opacity-100'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`${product.title} foto ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              {idx === 0 && (
                <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-white font-bold text-center py-0.5">
                  Utama
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
