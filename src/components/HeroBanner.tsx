'use client';

import React from 'react';
import { Download, Truck, ShieldCheck, HeartHandshake } from 'lucide-react';

interface HeroBannerProps {
  onSelectEbook: () => void;
  onSelectPhysical: () => void;
}

export default function HeroBanner({ onSelectEbook, onSelectPhysical }: HeroBannerProps) {
  return (
    <div className="bg-gradient-to-b from-[#F5EFEB] to-[#FAF7F2] border-b border-[#E6E1D8] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F4EC] text-[#19583E] text-xs font-semibold mb-3 border border-[#19583E]/20">
            <span>🌿 Pasar Khusus Edukasi Anak Sesuai Manhaj Salaf</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#222222] font-serif-title tracking-tight leading-tight mb-4">
            Mendidik Buah Hati dengan Cinta, Akal Sehat & Sunnah Nabi ﷺ
          </h1>
          <p className="text-sm sm:text-base text-[#595959] leading-relaxed mb-6 font-normal">
            Koleksi buku rujukan shahih, mainan kayu sensori non-toxic bebas musik & tahayul, serta paket printable lembar aktivitas yang dapat diunduh instan untuk belajar di rumah.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onSelectEbook}
              className="px-5 py-2.5 bg-[#DE5A35] hover:bg-[#C54724] text-white text-sm font-semibold rounded-full shadow-sm hover:shadow transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Lihat Ebook Printable (Instan)</span>
            </button>
            <button
              onClick={onSelectPhysical}
              className="px-5 py-2.5 bg-white hover:bg-[#F3EEE7] text-[#222222] border border-[#E6E1D8] text-sm font-semibold rounded-full shadow-sm hover:shadow transition-all flex items-center gap-2"
            >
              <Truck className="w-4 h-4 text-[#1F6347]" />
              <span>Koleksi Buku & Mainan Fisik</span>
            </button>
          </div>
        </div>

        {/* 4 Pilar Trust Badges ala Etsy */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
          <div className="bg-white/80 p-3.5 sm:p-4 rounded-2xl border border-[#E6E1D8] shadow-xs flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E8F4EC] text-[#19583E] flex items-center justify-center shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#222222]">Unduhan Instan</h4>
              <p className="text-[11px] text-[#7A7A7A] mt-0.5 leading-snug">
                File PDF jernih langsung aktif detik ini juga setelah bayar.
              </p>
            </div>
          </div>

          <div className="bg-white/80 p-3.5 sm:p-4 rounded-2xl border border-[#E6E1D8] shadow-xs flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] text-[#92400E] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#222222]">Kurir KiriminAja</h4>
              <p className="text-[11px] text-[#7A7A7A] mt-0.5 leading-snug">
                Cek ongkir real-time & kirim cepat J&T, SiCepat, JNE.
              </p>
            </div>
          </div>

          <div className="bg-white/80 p-3.5 sm:p-4 rounded-2xl border border-[#E6E1D8] shadow-xs flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#1E40AF] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#222222]">Bebas Riba (Mayar)</h4>
              <p className="text-[11px] text-[#7A7A7A] mt-0.5 leading-snug">
                QRIS & Virtual Account BSI langsung, tanpa bunga/PayLater.
              </p>
            </div>
          </div>

          <div className="bg-white/80 p-3.5 sm:p-4 rounded-2xl border border-[#E6E1D8] shadow-xs flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F3E8FF] text-[#6B21A8] flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#222222]">Kurasi Syar&apos;i</h4>
              <p className="text-[11px] text-[#7A7A7A] mt-0.5 leading-snug">
                Ilustrasi faceless, tanpa musik/tahayul, rujukan shahih.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
