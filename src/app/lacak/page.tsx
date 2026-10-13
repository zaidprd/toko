'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Truck, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function TrackingPage() {
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setHasSearched(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#595959] hover:text-[#DE5A35] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        <div className="bg-white rounded-3xl border border-[#E6E1D8] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-bold text-[#19583E] bg-[#E8F4EC] px-3 py-1 rounded-full">
              Layanan Pembeli Tanpa Perlu Akun / Password
            </span>
            <h1 className="text-2xl font-bold font-serif-title text-[#222222]">
              Lacak Pesanan &amp; Unduh Ulang Ebook
            </h1>
            <p className="text-xs text-[#595959] max-w-md mx-auto">
              Cukup masukkan <strong>Nomor Pesanan</strong> (contoh: <code>ORD-991201</code>) atau <strong>Nomor WhatsApp</strong> yang digunakan saat checkout.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Masukkan No. Pesanan atau WhatsApp..."
              className="flex-1 bg-[#FAF7F2] border border-[#E6E1D8] focus:border-[#DE5A35] rounded-full px-4 py-2.5 text-xs text-[#222222] outline-none"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#DE5A35] hover:bg-[#C54724] text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Cari</span>
            </button>
          </form>

          {hasSearched && (
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E6E1D8] space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E1D8]">
                <div>
                  <div className="text-xs font-bold text-[#222222]">Pesanan #ORD-882190</div>
                  <div className="text-[10px] text-[#7A7A7A]">Status: Lunas via Mayar.id QRIS</div>
                </div>
                <span className="text-[10px] font-bold text-[#19583E] bg-[#E8F4EC] px-2.5 py-1 rounded-full">
                  ✓ Terverifikasi
                </span>
              </div>

              {/* Digital download */}
              <div className="p-3 bg-white rounded-xl border border-[#E6E1D8] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#222222]">
                    Ebook Lembar Aktivitas Huruf Hijaiyah
                  </h4>
                  <div className="text-[10px] text-[#7A7A7A]">PDF Siap Cetak • 14.8 MB</div>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Mengunduh berkas PDF resmi dari Cloudflare R2...')}
                  className="px-3.5 py-1.5 bg-[#1F6347] hover:bg-[#164E36] text-white text-[11px] font-bold rounded-full flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh File</span>
                </button>
              </div>

              {/* Physical courier tracking */}
              <div className="p-3 bg-white rounded-xl border border-[#E6E1D8] space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#222222] flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#DE5A35]" />
                    <span>J&amp;T Express (KiriminAja)</span>
                  </span>
                  <span className="font-mono font-bold text-[#595959]">JNTID928172918</span>
                </div>
                <div className="text-[11px] text-[#19583E] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1F6347]" />
                  <span>Kurir sedang menuju alamat pengantaran</span>
                </div>
              </div>
            </div>
          )}

          <div className="pt-2 text-center text-[11px] text-[#7A7A7A] flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#1F6347]" />
            <span>Privasi terlindungi. Tautan download hanya bisa diakses pembeli sah.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
