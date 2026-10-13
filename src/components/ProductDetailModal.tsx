'use client';

import React, { useState } from 'react';
import { Product, CourierRate } from '@/types';
import { MOCK_COURIER_RATES } from '@/data/mockData';
import ProductGallery from './ProductGallery';
import {
  X,
  Star,
  Download,
  Truck,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Calculator,
  ShoppingBag,
  Zap,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onDirectCheckout: (product: Product, quantity: number) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onDirectCheckout,
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [calcSubdistrict, setCalcSubdistrict] = useState('Kelapa Dua, Kebon Jeruk, Jakarta Barat');
  const [courierRates, setCourierRates] = useState<CourierRate[]>(MOCK_COURIER_RATES);
  const [selectedCourierRate, setSelectedCourierRate] = useState<CourierRate>(MOCK_COURIER_RATES[0]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Auto fetch ongkir saat destinasi diubah
  const handleCalculateShipping = async (dest: string) => {
    setCalcSubdistrict(dest);
    try {
      const res = await fetch('/api/shipping/cost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationCity: dest,
          destinationDistrict: dest,
          weightGrams: product?.weightGrams || 1000,
        }),
      });
      const data = await res.json();
      if (data.rates && data.rates.length > 0) {
        setCourierRates(data.rates);
        setSelectedCourierRate(data.rates[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!product) return null;

  const isDigital = product.type === 'DIGITAL_EBOOK';

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#E6E1D8] overflow-hidden my-auto animate-fade-in max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#222222] shadow-md flex items-center justify-center transition-transform active:scale-90"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-7 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
            {/* Left Column: Gallery & Previews */}
            <div className="md:col-span-6 space-y-3">
              <ProductGallery product={product} />

              {/* Digital Preview Trigger */}
              {isDigital && product.previewPages && (
                <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E6E1D8] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#222222]">
                    <FileText className="w-4 h-4 text-[#DE5A35]" />
                    <span>Pratinjau Halaman Sampel (Faceless)</span>
                  </div>
                  <button
                    onClick={() => setShowPreviewModal(!showPreviewModal)}
                    className="text-xs font-bold text-[#DE5A35] hover:underline"
                  >
                    {showPreviewModal ? 'Sembunyikan' : 'Lihat Cuplikan'}
                  </button>
                </div>
              )}

              {showPreviewModal && product.previewPages && (
                <div className="p-3 bg-[#E8F4EC] rounded-xl text-xs text-[#19583E] space-y-1.5 border border-[#19583E]/20 animate-fade-in">
                  <p className="font-bold">Cuplikan Isi Lembar Aktivitas:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {product.previewPages.map((page, i) => (
                      <li key={i}>{page}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column: Buy Box ala Etsy */}
            <div className="md:col-span-6 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-[#7A7A7A] mb-1">
                  <span className="font-medium">{product.publisherOrBrand}</span>
                  <span className="bg-[#F3EEE7] px-2.5 py-0.5 rounded-full font-semibold text-[#595959]">
                    Usia: {product.targetAge}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#222222] font-serif-title leading-snug">
                  {product.title}
                </h2>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 text-xs">
                <div className="flex text-[#F59E0B]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F59E0B]" />
                  ))}
                </div>
                <span className="font-bold text-[#222222]">{product.rating.toFixed(1)}</span>
                <span className="text-[#7A7A7A]">({product.reviewsCount} Ulasan Pembeli Terverifikasi)</span>
              </div>

              {/* Price */}
              <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E6E1D8]">
                <div className="flex items-baseline gap-2.5">
                  {product.price === 0 ? (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-lg sm:text-xl font-black bg-[#EBF7EE] text-[#1F6347] border border-[#1F6347]/30">
                      🎉 GRATIS (Rp 0)
                    </span>
                  ) : (
                    <span className="text-2xl font-black text-[#222222]">
                      {formatIDR(product.price)}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#7A7A7A] mt-1">
                  {isDigital
                    ? '⚡ Akses unduhan langsung file PDF resolusi tinggi.'
                    : '📦 Belum termasuk ongkos kirim. Dihitung otomatis saat checkout.'}
                </p>
              </div>

              {/* Highlights Box ala Etsy */}
              <div className="bg-white p-3.5 rounded-2xl border border-[#E6E1D8] space-y-2">
                <h4 className="text-xs font-bold text-[#222222] uppercase tracking-wider">
                  Highlights & Jaminan Produk
                </h4>
                <div className="space-y-1.5 text-xs text-[#4A4A4A]">
                  {product.highlights.map((hl, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1F6347] shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Estimator (Khusus Barang Fisik via KiriminAja) */}
              {!isDigital && (
                <div className="p-3.5 bg-[#F5EFEB] rounded-2xl border border-[#E6E1D8] space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-[#222222]">
                    <span className="flex items-center gap-1.5">
                      <Calculator className="w-3.5 h-3.5 text-[#DE5A35]" />
                      <span>Cek Tarif KiriminAja (Real-Time)</span>
                    </span>
                    <span className="text-[11px] font-normal text-[#7A7A7A]">
                      Berat: {product.weightGrams} gr
                    </span>
                  </div>

                  <div className="bg-white/80 p-2 rounded-xl text-[11px] text-[#595959] border border-[#E6E1D8] flex items-center justify-between">
                    <span>📍 <strong>Asal Toko:</strong> Kebon Jeruk, Jakarta Barat (11550)</span>
                    <span className="text-[10px] text-[#1F6347] font-bold">Gudang Utama</span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-semibold text-[#595959]">
                        Kota / Kecamatan Tujuan:
                      </label>
                      <span className="text-[10px] text-[#DE5A35] font-medium">Klik Cepat / Ketik</span>
                    </div>

                    {/* Quick clickable city chips */}
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      {['Jakarta Barat', 'Bandung', 'Surabaya', 'Sleman', 'Medan', 'Makassar'].map((quickCity) => (
                        <button
                          key={quickCity}
                          type="button"
                          onClick={() => handleCalculateShipping(quickCity)}
                          className={`text-[10px] px-2 py-0.5 rounded-md border transition-all ${
                            calcSubdistrict.toLowerCase().includes(quickCity.toLowerCase())
                              ? 'bg-[#19583E] text-white border-[#19583E] font-bold'
                              : 'bg-white text-[#595959] border-[#E6E1D8] hover:border-[#19583E]'
                          }`}
                        >
                          {quickCity}
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      value={calcSubdistrict}
                      onChange={(e) => handleCalculateShipping(e.target.value)}
                      className="w-full bg-white border border-[#E6E1D8] rounded-xl px-3 py-1.5 text-xs text-[#222222] focus:border-[#DE5A35] outline-none"
                      placeholder="Atau ketik nama kota / kecamatan lain..."
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    {courierRates.map((rate) => (
                      <button
                        key={rate.courierCode}
                        type="button"
                        onClick={() => setSelectedCourierRate(rate)}
                        className={`p-2 rounded-xl border text-left transition-all ${
                          selectedCourierRate.courierCode === rate.courierCode
                            ? 'bg-white border-[#DE5A35] shadow-xs'
                            : 'bg-white/60 border-[#E6E1D8] opacity-75'
                        }`}
                      >
                        <div className="text-[10px] font-bold text-[#222222] truncate">{rate.courierName}</div>
                        <div className="text-[11px] font-extrabold text-[#1F6347]">{formatIDR(rate.cost)}</div>
                        <div className="text-[9px] text-[#7A7A7A] truncate">{rate.etd}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & CTA Buttons */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#222222]">Jumlah:</span>
                  <div className="flex items-center border border-[#E6E1D8] rounded-full bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center text-sm font-bold text-[#595959] hover:text-[#222222]"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-sm font-bold text-[#595959] hover:text-[#222222]"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onAddToCart(product, quantity);
                      onClose();
                    }}
                    className="w-full py-3 bg-white hover:bg-[#F3EEE7] text-[#222222] border-2 border-[#222222] rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>+ Tambah Keranjang</span>
                  </button>

                  <button
                    onClick={() => {
                      onDirectCheckout(product, quantity);
                      onClose();
                    }}
                    className="w-full py-3 bg-[#DE5A35] hover:bg-[#C54724] text-white rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    {product.price === 0 ? (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Klaim Gratis Sekarang</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-white" />
                        <span>Beli Sekarang (Instan)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Trust statement */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-[#7A7A7A] pt-1">
                <ShieldCheck className="w-4 h-4 text-[#1F6347]" />
                <span>Transaksi Amanah &amp; Bergaransi Cacat Kirim</span>
              </div>
            </div>
          </div>

          {/* Bottom Tabs: Deskripsi, Spesifikasi & Ulasan ala Etsy */}
          <div className="border-t border-[#E6E1D8] pt-6">
            <div className="flex border-b border-[#E6E1D8] gap-6 text-xs font-bold">
              <button
                onClick={() => setActiveTab('desc')}
                className={`pb-3 transition-colors ${
                  activeTab === 'desc'
                    ? 'border-b-2 border-[#DE5A35] text-[#222222]'
                    : 'text-[#7A7A7A] hover:text-[#222222]'
                }`}
              >
                Deskripsi & Faedah Syar&apos;i
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-3 transition-colors ${
                  activeTab === 'specs'
                    ? 'border-b-2 border-[#DE5A35] text-[#222222]'
                    : 'text-[#7A7A7A] hover:text-[#222222]'
                }`}
              >
                Rincian Teknis & Format
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-b-2 border-[#DE5A35] text-[#222222]'
                    : 'text-[#7A7A7A] hover:text-[#222222]'
                }`}
              >
                Ulasan Pembeli ({product.reviewsCount})
              </button>
            </div>

            <div className="pt-4 text-xs text-[#4A4A4A] leading-relaxed">
              {activeTab === 'desc' && (
                <div
                  className="space-y-3 prose-sm"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                />
              )}

              {activeTab === 'specs' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E6E1D8]">
                    <div className="text-[10px] text-[#7A7A7A] uppercase font-bold">Jenis Produk</div>
                    <div className="text-xs font-bold text-[#222222] mt-0.5">{product.category}</div>
                  </div>
                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E6E1D8]">
                    <div className="text-[10px] text-[#7A7A7A] uppercase font-bold">Rekomendasi Usia</div>
                    <div className="text-xs font-bold text-[#222222] mt-0.5">{product.targetAge}</div>
                  </div>
                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E6E1D8]">
                    <div className="text-[10px] text-[#7A7A7A] uppercase font-bold">Kaidah Gambar</div>
                    <div className="text-xs font-bold text-[#1F6347] mt-0.5">
                      {product.isFaceless ? '100% Faceless (Aman Syar\'i)' : 'Standar Edukasi'}
                    </div>
                  </div>
                  {isDigital ? (
                    <>
                      <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E6E1D8]">
                        <div className="text-[10px] text-[#7A7A7A] uppercase font-bold">Format Berkas</div>
                        <div className="text-xs font-bold text-[#222222] mt-0.5">{product.digitalFormat}</div>
                      </div>
                      <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E6E1D8]">
                        <div className="text-[10px] text-[#7A7A7A] uppercase font-bold">Ukuran File</div>
                        <div className="text-xs font-bold text-[#222222] mt-0.5">{product.fileSizeMb} MB</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E6E1D8]">
                        <div className="text-[10px] text-[#7A7A7A] uppercase font-bold">Berat Kirim</div>
                        <div className="text-xs font-bold text-[#222222] mt-0.5">{product.weightGrams} gram</div>
                      </div>
                      <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E6E1D8]">
                        <div className="text-[10px] text-[#7A7A7A] uppercase font-bold">Dimensi</div>
                        <div className="text-xs font-bold text-[#222222] mt-0.5">{product.dimensions}</div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {/* Review Summary Breakdown ala Etsy Screenshot 2 */}
                  <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6E1D8] flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="text-2xl font-black text-[#222222] flex items-center gap-2">
                        <span>{product.rating.toFixed(1)}</span>
                        <div className="flex text-[#F59E0B]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-[#F59E0B]" />
                          ))}
                        </div>
                      </div>
                      <p className="text-[11px] text-[#7A7A7A] mt-0.5">
                        Rata-rata dari {product.reviewsCount} pembeli terverifikasi
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
                      <span className="bg-white px-3 py-1.5 rounded-full border border-[#E6E1D8] text-[#19583E]">
                        ✓ Kualitas Cetak Jernih (98%)
                      </span>
                      <span className="bg-white px-3 py-1.5 rounded-full border border-[#E6E1D8] text-[#19583E]">
                        ✓ Pengiriman Cepat (100%)
                      </span>
                      <span className="bg-white px-3 py-1.5 rounded-full border border-[#E6E1D8] text-[#19583E]">
                        ✓ Anak Antusias Belajar (95%)
                      </span>
                    </div>
                  </div>

                  {/* Individual Review Item */}
                  <div className="border-b border-[#E6E1D8] pb-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#222222]">Ummu Abdillah (Jakarta Selatan)</span>
                      <span className="text-[10px] text-[#7A7A7A]">11 Oktober 2026</span>
                    </div>
                    <div className="flex text-[#F59E0B]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B]" />
                      ))}
                    </div>
                    <p className="text-xs text-[#595959] mt-1">
                      &quot;Baaarakallahu feekum, sangat senang menemukan toko yang menjaga adab gambar syar&apos;i untuk anak. Kualitas gambarnya tajam saat dicetak dan anak senang sekali latihan hijaiyah.&quot;
                    </p>
                  </div>

                  <div className="border-b border-[#E6E1D8] pb-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#222222]">Abu Faruq (Surabaya)</span>
                      <span className="text-[10px] text-[#7A7A7A]">9 Oktober 2026</span>
                    </div>
                    <div className="flex text-[#F59E0B]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B]" />
                      ))}
                    </div>
                    <p className="text-xs text-[#595959] mt-1">
                      &quot;Pengiriman sangat rapi dengan bubble wrap tebal, barang sampai tanpa cacat. Kayu halus dan baunya segar alami tanpa bahan kimia tajam.&quot;
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
