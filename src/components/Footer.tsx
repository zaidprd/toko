'use client';

import React from 'react';
import { BookOpen, ShieldCheck, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#F5EFEB] border-t border-[#E6E1D8] text-[#222222] mt-auto">
      {/* Etsy-Style Mission Statement Banner (Screenshot 4) */}
      <div className="border-b border-[#E6E1D8] py-10 px-4 sm:px-6 lg:px-8 text-center bg-white/60">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#E8F4EC] text-[#19583E] flex items-center justify-center mx-auto">
            <Sparkles className="w-5 h-5 text-[#DE5A35]" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif-title text-[#222222]">
            &quot;Misi Kami: Menemani Tumbuh Kembang Buah Hati di Atas Sunnah &amp; Akhlaq Mulia.&quot;
          </h3>
          <p className="text-xs sm:text-sm text-[#595959] leading-relaxed max-w-xl mx-auto">
            Setiap buku, mainan kayu sensori, dan lembar aktivitas digital yang kami hadirkan dikurasi dengan prinsip ketenangan hati, bebas gambar bernyawa sempurna (faceless), bebas musik, dan bersumber dari riwayat shahih.
          </p>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
        {/* Kolom 1: Brand */}
        <div className="col-span-2 md:col-span-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#DE5A35] text-white flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base font-serif-title">toko.zaidly.com</span>
          </div>
          <p className="text-[#595959] leading-relaxed text-[11px]">
            Toko online edukasi anak berbasis syariat Islam dan manhaj Salafush Shalih. Dikelola dengan amanah dan kejujuran.
          </p>
          <div className="bg-white/80 p-2.5 rounded-xl border border-[#E6E1D8] text-[11px] text-[#4A4A4A] space-y-0.5">
            <span className="font-bold text-[#222222] block">📍 Lokasi Gudang Toko:</span>
            <span>Kebon Jeruk, Jakarta Barat 11550</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#19583E] font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#1F6347]" />
            <span>Transaksi Amanah &amp; Terpercaya</span>
          </div>
        </div>

        {/* Kolom 2: Produk & Kategori */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#222222]">Koleksi Pilihan</h4>
          <ul className="space-y-1.5 text-[#595959]">
            <li><a href="#" className="hover:text-[#DE5A35]">Ebook Printable (Instan PDF)</a></li>
            <li><a href="#" className="hover:text-[#DE5A35]">Buku Kisah 25 Nabi Anak</a></li>
            <li><a href="#" className="hover:text-[#DE5A35]">Mainan Kayu Montessori Faceless</a></li>
            <li><a href="#" className="hover:text-[#DE5A35]">Flashcard Doa &amp; Dzikir Harian</a></li>
            <li><a href="#" className="hover:text-[#DE5A35]">Buku Aqidah &amp; Tauhid Balita</a></li>
          </ul>
        </div>

        {/* Kolom 3: Fikih & Muamalah */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#222222]">Prinsip Toko Kami</h4>
          <ul className="space-y-1.5 text-[#595959]">
            <li><a href="#blog-section" className="hover:text-[#DE5A35]">Fatwa Gambar &amp; Mainan (Rumaysho)</a></li>
            <li><a href="#" className="hover:text-[#DE5A35]">Kaidah Faceless Illustration</a></li>
            <li><a href="#" className="hover:text-[#DE5A35]">Ketentuan Hak Khiyar &amp; Retur Cacat</a></li>
            <li><a href="#" className="hover:text-[#DE5A35]">Akad Jual Beli Jelas &amp; Transparan</a></li>
            <li><a href="#" className="hover:text-[#DE5A35]">Pembayaran QRIS &amp; Virtual Account BSI</a></li>
          </ul>
        </div>

        {/* Kolom 4: Logistik & Pembayaran */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#222222]">Integrasi Resmi</h4>
          <p className="text-[11px] text-[#595959] leading-relaxed">
            <strong>Logistik:</strong> Ekspedisi KiriminAja (J&amp;T Express, SiCepat, JNE).
          </p>
          <p className="text-[11px] text-[#595959] leading-relaxed">
            <strong>Pembayaran:</strong> QRIS Instan &amp; Virtual Account BSI.
          </p>
          <p className="text-[11px] text-[#595959] leading-relaxed">
            <strong>Penyimpanan:</strong> Cloudflare R2 (Akses Cepat &amp; Bebas Biaya Egress).
          </p>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[#E6E1D8] py-4 px-4 text-center text-[11px] text-[#7A7A7A] max-w-7xl mx-auto">
        <p>© 2026 toko.zaidly.com. Hak cipta dilindungi undang-undang &amp; syariat.</p>
      </div>
    </footer>
  );
}
