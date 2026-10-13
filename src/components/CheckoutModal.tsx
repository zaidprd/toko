'use client';

import React, { useState, useEffect } from 'react';
import { CartItem, CourierRate, CompletedOrder } from '@/types';
import { INDONESIA_PROVINCES } from '@/data/indonesiaLocations';
import {
  X,
  ShieldCheck,
  Truck,
  Download,
  QrCode,
  Building2,
  CheckCircle2,
  Lock,
  ArrowRight,
  Loader2,
  Search,
} from 'lucide-react';

// Simulator pembayaran hanya boleh muncul saat pengembangan lokal, tidak pernah di produksi
const IS_DEV = process.env.NODE_ENV !== 'production';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: (order: CompletedOrder) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  items,
}: CheckoutModalProps) {
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');

  // Shipping (Default Jakarta Barat, se-area dengan gudang di Kebon Jeruk)
  const [province, setProvince] = useState('DKI Jakarta');
  const [city, setCity] = useState('Kota Jakarta Barat');
  const [subdistrict, setSubdistrict] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [isSearchingPostal, setIsSearchingPostal] = useState(false);
  const [postalSuggestions, setPostalSuggestions] = useState<any[]>([]);
  const [postalError, setPostalError] = useState('');
  const [courierRates, setCourierRates] = useState<CourierRate[]>([]);
  const [selectedCourier, setSelectedCourier] = useState<CourierRate | null>(null);
  const [rateSource, setRateSource] = useState<string>('');
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const currentProvObj = INDONESIA_PROVINCES.find((p) => p.name === province) || INDONESIA_PROVINCES[0];
  const availableCities = currentProvObj.cities;

  const updateRatesForDestination = async (pName: string, cName: string, dName: string) => {
    setIsLoadingRates(true);
    try {
      const res = await fetch('/api/shipping/cost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationProvince: pName,
          destinationCity: cName,
          destinationDistrict: dName,
          weightGrams: items.reduce((acc, i) => acc + (i.product.weightGrams || 400) * i.quantity, 0),
        }),
      });
      const data = await res.json();
      if (data.rates && data.rates.length > 0) {
        setCourierRates(data.rates);
        setSelectedCourier(data.rates[0]);
        setRateSource(data.source || '');
      } else {
        setCourierRates([]);
        setSelectedCourier(null);
      }
    } catch (e) {
      console.error(e);
      setCourierRates([]);
      setSelectedCourier(null);
    } finally {
      setIsLoadingRates(false);
    }
  };

  const executePostalLookup = async (query: string) => {
    if (!query || query.trim().length < 3) return;
    setIsSearchingPostal(true);
    setPostalError('');
    try {
      const res = await fetch(`/api/shipping/postal-code?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        setPostalSuggestions(data.results);
        if (data.results.length === 1 || /^\d{5}$/.test(query.trim())) {
          applyPostalSelection(data.results[0]);
        }
      } else {
        setPostalError('Wilayah tidak ditemukan via kode pos ini. Silakan pilih provinsi & kota manual.');
        setPostalSuggestions([]);
      }
    } catch (e) {
      console.error(e);
      setPostalError('Gagal mencari wilayah. Silakan gunakan pilihan manual.');
    } finally {
      setIsSearchingPostal(false);
    }
  };

  const applyPostalSelection = (item: {
    postalCode: string;
    village: string;
    district: string;
    regency: string;
    province: string;
  }) => {
    setPostalCode(item.postalCode);
    setPostalSuggestions([]);
    setPostalError('');

    // 1. Cocokkan Provinsi
    const matchedProv = INDONESIA_PROVINCES.find(
      (p) =>
        p.name.toLowerCase().includes(item.province.toLowerCase()) ||
        item.province.toLowerCase().includes(p.name.toLowerCase())
    ) || INDONESIA_PROVINCES[0];
    setProvince(matchedProv.name);

    // 2. Cocokkan Kota
    const cleanRegency = item.regency.replace(/^(Kab\.|Kota|Kabupaten|Administrasi)\s+/i, '').toLowerCase();
    const matchedCity = matchedProv.cities.find(
      (c) =>
        c.name.toLowerCase().includes(cleanRegency) ||
        cleanRegency.includes(c.name.replace(/^(Kab\.|Kota|Kabupaten|Administrasi)\s+/i, '').toLowerCase())
    ) || matchedProv.cities[0] || { name: item.regency };
    setCity(matchedCity.name);

    // 3. Set Kecamatan
    setSubdistrict(item.district);

    // 4. Pre-fill Alamat Lengkap & Patokan Rumah (agar pembeli tinggal isi nomor rumah)
    setAddressDetail((prev) => {
      if (prev && prev.trim().length > 15) return prev;
      return `Kelurahan ${item.village}, RT ... / RW ..., No. `;
    });

    // 5. Update Tarif Ekspedisi
    updateRatesForDestination(matchedProv.name, matchedCity.name, item.district);
  };

  const handlePostalCodeChange = (val: string) => {
    setPostalCode(val);
    if (val.trim().length === 5 && /^\d{5}$/.test(val.trim())) {
      executePostalLookup(val.trim());
    }
  };

  const handleProvinceChange = (newProv: string) => {
    setProvince(newProv);
    const provObj = INDONESIA_PROVINCES.find((p) => p.name === newProv);
    if (provObj && provObj.cities.length > 0) {
      const firstCity = provObj.cities[0].name;
      setCity(firstCity);
      updateRatesForDestination(newProv, firstCity, subdistrict);
    }
  };

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    updateRatesForDestination(province, newCity, subdistrict);
  };

  const handleDistrictChange = (newDist: string) => {
    setSubdistrict(newDist);
    updateRatesForDestination(province, city, newDist);
  };

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'VA_BSI' | 'VA_MANDIRI' | 'VA_BCA'>('QRIS');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'form' | 'mayar_gateway'>('form');

  const needsShipping = items.some((item) => item.product.type !== 'DIGITAL_EBOOK');

  // Muat tarif asli dari server saat checkout dibuka (bukan angka contoh)
  useEffect(() => {
    if (isOpen && needsShipping && courierRates.length === 0 && !isLoadingRates) {
      updateRatesForDestination(province, city, subdistrict);
    }
    if (isOpen) setPaymentError('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, needsShipping]);

  if (!isOpen) return null;

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const hasPhysical = items.some((item) => item.product.type !== 'DIGITAL_EBOOK');
  const hasDigital = items.some((item) => item.product.type === 'DIGITAL_EBOOK');

  // Free shipping check min 150rb
  const isFreeShipping = hasPhysical && subtotal >= 150000;
  const shippingCost = hasPhysical ? (isFreeShipping ? 0 : selectedCourier?.cost ?? 0) : 0;
  const grandTotal = subtotal + shippingCost;

  const handleStartMayarPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError('');

    if (hasPhysical && !selectedCourier) {
      setPaymentError('Ongkir belum tersedia. Lengkapi alamat lalu pilih kurir terlebih dahulu.');
      return;
    }

    setIsProcessing(true);

    try {
      // Hanya kirim ID produk + jumlah + kode kurir. Harga & ongkir dihitung ulang di server.
      const res = await fetch('/api/payment/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            fullName,
            whatsapp,
            email,
            province,
            city,
            subdistrict,
            postalCode,
            addressDetail,
          },
          items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
          courierCode: hasPhysical ? selectedCourier?.courierCode : undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));

      // Link invoice resmi → arahkan pembeli ke halaman pembayaran
      if (res.ok && data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }

      // Simulator HANYA di lingkungan pengembangan dan hanya jika server memang mode simulasi
      if (res.ok && data.isSimulation && IS_DEV) {
        setStep('mayar_gateway');
        return;
      }

      setPaymentError(
        data.error || 'Tagihan pembayaran gagal dibuat. Pesanan BELUM dibayar. Silakan coba lagi.'
      );
    } catch (err) {
      console.error('Error create invoice:', err);
      setPaymentError('Koneksi ke server pembayaran gagal. Pesanan BELUM dibayar. Silakan coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Tidak ada jalur yang dapat menetapkan lunas dari browser, termasuk development.
  const handleConfirmMayarPaid = () => {
    setPaymentError('Status pembayaran hanya dapat dikonfirmasi oleh webhook Mayar yang terverifikasi.');
    setStep('form');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#E6E1D8] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E6E1D8] bg-[#FAF7F2] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#19583E] bg-[#E8F4EC] px-2.5 py-0.5 rounded-full border border-[#19583E]/20">
              Konfirmasi Pesanan
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#222222] font-serif-title mt-1">
              {step === 'form' ? 'Informasi Pengiriman & Pembayaran' : 'Portal Pembayaran Online'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#EBE4D9] flex items-center justify-center text-[#595959]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-7">
          {step === 'form' ? (
            <form onSubmit={handleStartMayarPayment} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left: Input Form */}
                <div className="md:col-span-7 space-y-4">
                  {/* Data Kontak */}
                  <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6E1D8] space-y-3">
                    <h3 className="text-xs font-bold text-[#222222] uppercase tracking-wider flex items-center gap-1.5">
                      <span>1. Data Pemesan</span>
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <label className="text-[11px] font-semibold text-[#595959]">Nama Lengkap</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-white border border-[#E6E1D8] rounded-xl px-3 py-2 text-xs text-[#222222] focus:border-[#DE5A35] outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-semibold text-[#595959]">No. WhatsApp</label>
                          <input
                            type="tel"
                            required
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                            className="w-full bg-white border border-[#E6E1D8] rounded-xl px-3 py-2 text-xs text-[#222222] focus:border-[#DE5A35] outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-[#595959]">Email Aktif</label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white border border-[#E6E1D8] rounded-xl px-3 py-2 text-xs text-[#222222] focus:border-[#DE5A35] outline-none"
                          />
                        </div>
                      </div>
                      <p className="text-[10px] text-[#7A7A7A]">
                        *Link download ebook & resi ekspedisi akan dikirimkan ke WhatsApp & Email di atas.
                      </p>
                    </div>
                  </div>

                  {/* Alamat Kirim (Jika ada Fisik) */}
                  {hasPhysical ? (
                    <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6E1D8] space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-[#222222] uppercase tracking-wider flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-[#DE5A35]" />
                          <span>2. Alamat Kirim (KiriminAja)</span>
                        </h3>
                        <span className="text-[10px] text-[#19583E] font-bold">
                          {rateSource === 'KIRIMINAJA_API_LIVE' ? 'Tarif KiriminAja' : rateSource ? 'Estimasi tarif' : ''}
                        </span>
                      </div>

                      <div className="bg-white/80 p-2 rounded-xl text-[11px] text-[#595959] border border-[#E6E1D8] flex items-center justify-between">
                        <span>📍 <strong>Dikirim dari Gudang:</strong> Kebon Jeruk, Jakarta Barat (11550)</span>
                        <span className="text-[10px] text-[#1F6347] font-bold">JNE, J&T, SiCepat</span>
                      </div>

                      {/* Pencarian Cepat via Kode Pos (Otomatis Isi Alamat) */}
                      <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#E6E1D8] space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-[#222222] flex items-center gap-1.5">
                            <span>📮 Cari Cepat via Kode Pos (Otomatis Isi Alamat)</span>
                          </label>
                          {isSearchingPostal && (
                            <span className="text-[10px] text-[#DE5A35] animate-pulse font-medium flex items-center gap-1">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Mencari wilayah...
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            maxLength={5}
                            value={postalCode}
                            onChange={(e) => handlePostalCodeChange(e.target.value)}
                            placeholder="Ketik 5 digit kode pos (misal: 11550, 22919, 40115)..."
                            className="flex-1 bg-white border border-[#E6E1D8] focus:border-[#DE5A35] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none font-semibold"
                          />
                          <button
                            type="button"
                            onClick={() => executePostalLookup(postalCode)}
                            className="px-3.5 py-2 bg-[#DE5A35] hover:bg-[#C54724] text-white text-xs font-bold rounded-xl cursor-pointer shrink-0 transition-colors flex items-center gap-1"
                          >
                            <Search className="w-3.5 h-3.5" />
                            <span>Cari</span>
                          </button>
                        </div>
                        {postalError && (
                          <p className="text-[10px] text-red-500">{postalError}</p>
                        )}
                        {postalSuggestions.length > 0 && (
                          <div className="bg-white border border-[#E6E1D8] rounded-xl p-2 space-y-1 max-h-40 overflow-y-auto shadow-sm">
                            <p className="text-[10px] text-[#7A7A7A] font-semibold">Pilih Wilayah Anda:</p>
                            {postalSuggestions.map((s, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => applyPostalSelection(s)}
                                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-[#FAF7F2] flex items-center justify-between border-b border-[#F0ECE1] last:border-0 cursor-pointer transition-colors"
                              >
                                <span className="font-semibold text-[#222222]">
                                  Kel. {s.village}, Kec. {s.district}
                                </span>
                                <span className="text-[10px] text-[#7A7A7A]">
                                  {s.regency}, {s.province} ({s.postalCode})
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Pilihan Wilayah Pengiriman Lengkap */}
                      <div className="space-y-2.5">
                        <div>
                          <label className="text-[11px] font-semibold text-[#595959] block mb-1">
                            Provinsi
                          </label>
                          <select
                            value={province}
                            onChange={(e) => handleProvinceChange(e.target.value)}
                            className="w-full bg-white border border-[#E6E1D8] focus:border-[#DE5A35] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none"
                          >
                            {INDONESIA_PROVINCES.map((prov) => (
                              <option key={prov.name} value={prov.name}>
                                {prov.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] font-semibold text-[#595959] block mb-1">
                              Kota / Kabupaten ({availableCities.length} Wilayah)
                            </label>
                            <select
                              value={city}
                              onChange={(e) => handleCityChange(e.target.value)}
                              className="w-full bg-white border border-[#E6E1D8] focus:border-[#DE5A35] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none"
                            >
                              {availableCities.map((c) => (
                                <option key={c.name} value={c.name}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-[#595959] block mb-1">
                              Kecamatan
                            </label>
                            <input
                              type="text"
                              required
                              value={subdistrict}
                              onChange={(e) => handleDistrictChange(e.target.value)}
                              placeholder="Ketik nama kecamatan..."
                              className="w-full bg-white border border-[#E6E1D8] focus:border-[#DE5A35] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-semibold text-[#595959]">
                            Alamat Lengkap &amp; Patokan Rumah
                          </label>
                          <span className="text-[10px] text-[#7A7A7A]">Lengkapi nomor rumah &amp; RT/RW</span>
                        </div>
                        <textarea
                          required
                          rows={2}
                          value={addressDetail}
                          onChange={(e) => setAddressDetail(e.target.value)}
                          placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, atau patokan..."
                          className="w-full bg-white border border-[#E6E1D8] focus:border-[#DE5A35] rounded-xl px-3 py-1.5 text-xs text-[#222222] outline-none"
                        />
                      </div>

                      {/* Ekspedisi Pilihan */}
                      <div className="pt-2">
                        <label className="text-[11px] font-bold text-[#222222] mb-1.5 block">
                          Pilihan Layanan Ekspedisi:
                        </label>
                        <div className="space-y-1.5">
                          {isLoadingRates && (
                            <p className="text-[11px] text-[#7A7A7A] flex items-center gap-1.5">
                              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Menghitung ongkir...
                            </p>
                          )}
                          {!isLoadingRates && courierRates.length === 0 && (
                            <p className="text-[11px] text-red-500">
                              Ongkir belum tersedia. Isi kode pos / kecamatan untuk menghitung ongkir.
                            </p>
                          )}
                          {courierRates.map((rate) => {
                            const isSelected = selectedCourier?.courierCode === rate.courierCode;
                            return (
                              <label
                                key={rate.courierCode}
                                className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                                  isSelected
                                    ? 'bg-white border-[#DE5A35] shadow-xs'
                                    : 'bg-white/60 border-[#E6E1D8]'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name="courier"
                                    checked={isSelected}
                                    onChange={() => setSelectedCourier(rate)}
                                    className="accent-[#DE5A35]"
                                  />
                                  <div>
                                    <div className="text-xs font-bold text-[#222222]">
                                      {rate.courierName} ({rate.service})
                                    </div>
                                    <div className="text-[10px] text-[#7A7A7A]">
                                      Estimasi sampai: {rate.etd}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-xs font-black text-[#1F6347]">
                                  {isFreeShipping ? 'GRATIS' : formatIDR(rate.cost)}
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#E8F4EC] p-4 rounded-2xl border border-[#19583E]/20 flex items-start gap-3">
                      <Download className="w-5 h-5 text-[#19583E] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-[#19583E]">Produk Digital (Tanpa Ongkir)</h4>
                        <p className="text-[11px] text-[#19583E]/90 mt-0.5">
                          Keranjang Anda 100% berisi ebook printable. File PDF akan langsung aktif untuk diunduh segera setelah pembayaran terkonfirmasi.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Order Summary */}
                <div className="md:col-span-5 space-y-4">
                  <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6E1D8] space-y-3">
                    <h3 className="text-xs font-bold text-[#222222] uppercase tracking-wider">
                      Ringkasan Pesanan ({items.length} Item)
                    </h3>

                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex gap-2 text-xs pb-2 border-b border-[#E6E1D8]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.product.coverImage}
                            alt={item.product.title}
                            className="w-10 h-10 rounded-lg object-cover border border-[#E6E1D8]"
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-[#222222] line-clamp-1">
                              {item.product.title}
                            </div>
                            <div className="text-[10px] text-[#7A7A7A]">
                              {item.quantity} x {item.product.price === 0 ? 'GRATIS' : formatIDR(item.product.price)}
                            </div>
                          </div>
                          <div className="font-bold text-[#222222]">
                            {item.product.price === 0 ? (
                              <span className="text-[#1F6347]">GRATIS</span>
                            ) : (
                              formatIDR(item.product.price * item.quantity)
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1.5 text-xs pt-1">
                      <div className="flex justify-between text-[#595959]">
                        <span>Subtotal Produk:</span>
                        <span className="font-bold text-[#222222]">
                          {subtotal === 0 ? <span className="text-[#1F6347]">GRATIS (Rp 0)</span> : formatIDR(subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between text-[#595959]">
                        <span>Ongkos Kirim:</span>
                        <span className="font-bold text-[#19583E]">
                          {shippingCost === 0 ? 'GRATIS / Rp 0' : formatIDR(shippingCost)}
                        </span>
                      </div>
                      <div className="border-t border-[#E6E1D8] pt-2 flex justify-between text-sm font-black text-[#222222]">
                        <span>Total Pembayaran:</span>
                        <span className="text-base text-[#DE5A35]">
                          {grandTotal === 0 ? <span className="text-[#1F6347] font-black">GRATIS (Rp 0)</span> : formatIDR(grandTotal)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {paymentError && (
                    <div
                      role="alert"
                      className="p-3 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-700 font-medium"
                    >
                      {paymentError}
                    </div>
                  )}

                  <button
                    id="checkout-submit-btn"
                    type="submit"
                    disabled={isProcessing || (hasPhysical && (!selectedCourier || isLoadingRates))}
                    className="w-full py-3.5 bg-[#DE5A35] hover:bg-[#C54724] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{grandTotal === 0 ? 'Memproses klaim gratis...' : 'Membuat tagihan...'}</span>
                      </>
                    ) : grandTotal === 0 ? (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Klaim &amp; Unduh Gratis Sekarang</span>
                      </>
                    ) : (
                      <>
                        <span>Lanjut Bayar</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="p-3 bg-white rounded-xl border border-[#E6E1D8] text-[11px] text-[#7A7A7A] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#222222]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#1F6347]" />
                      <span>Akad Jual Beli Jelas & Syar&apos;i</span>
                    </div>
                    <p>
                      Barang digital maupun fisik dijamin keaslian dan kesesuaian spesifikasinya. Khiyar berlaku jika barang fisik cacat produksi.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            /* Step 2: Payment Gateway Simulation */
            <div className="max-w-md mx-auto space-y-5 text-center py-4">
              <div className="w-12 h-12 rounded-2xl bg-[#DE5A35]/10 text-[#DE5A35] flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Mode Simulasi Pengembangan (bukan pembayaran asli)
                </span>
                <h3 className="text-xl font-bold text-[#222222] font-serif-title mt-0.5">
                  Total Tagihan: {formatIDR(grandTotal)}
                </h3>
                <p className="text-xs text-[#595959] mt-1">
                  Tagihan untuk {fullName} ({email})
                </p>
              </div>

              {/* QRIS / VA Display */}
              <div className="bg-[#FAF7F2] p-5 rounded-3xl border-2 border-dashed border-[#DE5A35]/30 space-y-3">
                {paymentMethod === 'QRIS' ? (
                  <>
                    <div className="w-48 h-48 bg-white mx-auto rounded-2xl p-2.5 shadow-sm border border-[#E6E1D8] flex flex-col items-center justify-center">
                      <div className="w-full h-full bg-[#222222] rounded-xl flex items-center justify-center text-white text-[10px] font-mono p-3 text-center">
                        <div className="space-y-1">
                          <QrCode className="w-16 h-16 mx-auto text-white" />
                          <span className="block font-bold">QRIS RESMI TOKO</span>
                          <span className="text-[8px] opacity-80">NMID: ID10202688921ZAID</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-[#222222]">
                      Pindai QRIS menggunakan Mobile Banking atau E-Wallet
                    </p>
                  </>
                ) : (
                  <div className="bg-white p-4 rounded-2xl border border-[#E6E1D8] text-left space-y-2">
                    <div className="text-[11px] text-[#7A7A7A]">Nomor Virtual Account:</div>
                    <div className="text-lg font-mono font-black text-[#1F6347] tracking-wider">
                      8912 0812 3456 7890
                    </div>
                    <div className="text-[10px] text-[#595959]">
                      Nama Tagihan: <strong>TOKO ZAIDLY - {fullName}</strong>
                    </div>
                  </div>
                )}

                <div className="text-[11px] text-[#7A7A7A] flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1F6347]" />
                  <span>Sistem mendeteksi pembayaran secara otomatis</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="w-1/3 py-3 border border-[#E6E1D8] rounded-full text-xs font-bold text-[#595959] hover:bg-[#FAF7F2]"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={handleConfirmMayarPaid}
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-[#1F6347] hover:bg-[#164E36] text-white rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengonfirmasi Pembayaran...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Simulasikan Pembayaran Berhasil</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
