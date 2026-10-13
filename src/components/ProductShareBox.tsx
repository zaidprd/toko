'use client';

import React, { useState } from 'react';
import { Share2, Copy, Check, MessageCircle } from 'lucide-react';

interface ProductShareBoxProps {
  productTitle: string;
  productSlug: string;
}

export default function ProductShareBox({ productTitle, productSlug }: ProductShareBoxProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/products/${productSlug}`;
    }
    return `https://toko.zaidly.com/products/${productSlug}`;
  };

  const handleCopyLink = async () => {
    const url = getShareUrl();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const input = document.createElement('input');
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const getWhatsAppShareUrl = () => {
    const url = getShareUrl();
    const text = `Bismillah, lihat produk "${productTitle}" di toko.zaid:\n${url}`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E6E1D8] space-y-2.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-[#222222] flex items-center gap-1.5">
          <Share2 className="w-3.5 h-3.5 text-[#DE5A35]" />
          <span>Bagikan Produk Ini:</span>
        </span>
        {copied && (
          <span className="text-[11px] font-bold text-[#1F6347] animate-fade-in flex items-center gap-1">
            <Check className="w-3 h-3" /> Tautan Berhasil Disalin!
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-[#F3EEE7] border border-[#E6E1D8] rounded-xl text-xs font-semibold text-[#222222] transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#1F6347]" />
              <span className="text-[#1F6347] font-bold">Tersalin!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#595959]" />
              <span>Salin Tautan</span>
            </>
          )}
        </button>
        <a
          href={getWhatsAppShareUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer text-center"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Bagikan WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
