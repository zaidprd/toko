'use client';

import React, { useState } from 'react';
import { CartItem, CourierRate, CompletedOrder } from '@/types';
import { MOCK_COURIER_RATES } from '@/data/mockData';
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
} from 'lucide-react';
import confetti from 'canvas-confetti';

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
  onOrderSuccess,
}: CheckoutModalProps) {
  const [fullName, setFullName] = useState('Ahmad Zaid');
  const [whatsapp, setWhatsapp] = useState('081234567890');
  const [email, setEmail] = useState('zaid@zaidly.com');

  // Shipping (Default Jakarta Barat, se-area dengan gudang di Kebon Jeruk)
  const [province, setProvince] = useState('DKI Jakarta');
  const [city, setCity] = useState('Kota Jakarta Barat');
  const [subdistrict, setSubdistrict] = useState('Kebon Jeruk');
  const [addressDetail, setAddressDetail] = useState('');
  const [courierRates, setCourierRates] = useState<CourierRate[]>(MOCK_COURIER_RATES);
  const [selectedCourier, setSelectedCourier] = useState<CourierRate>(MOCK_COURIER_RATES[0]);

  const currentProvObj = INDONESIA_PROVINCES.find((p) => p.name === province) || INDONESIA_PROVINCES[0];
  const availableCities = currentProvObj.cities;

  const updateRatesForDestination = async (pName: string, cName: string, dName: string) => {
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
      }
    } catch (e) {
      console.error(e);
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
  const shippingCost = hasPhysical ? (isFreeShipping ? 0 : selectedCourier.cost) : 0;
  const grandTotal = subtotal + shippingCost;

  const handleStartMayarPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const orderId = `ORD-${Date.now().toString().slice(-6)}`;
      const res = await fetch('/api/payment/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          customer: {
            fullName,
            whatsapp,
            email,
            province,
            city,
            subdistrict,
            addressDetail,
            courier: hasPhysical ? selectedCourier : undefined,
            paymentMethod,
          },
          items,
          shippingCost,
          grandTotal,
        }),
      });

      const data = await res.json();

      // Jika ada link invoice resmi dari Mayar.id, arahkan pelanggan langsung ke Mayar!
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }

      // Jika masih mode simulator lokal
      setStep('mayar_gateway');
    } catch (err) {
      console.error('Error create invoice:', err);
      setStep('mayar_gateway');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmMayarPaid = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        console.error('Confetti error:', err);
      }

      const completedOrder: CompletedOrder = {
        orderId: `ORD-${Date.now().toString().slice(-6)}`,
        customer: {
          fullName,
          whatsapp,
          email,
          province,
          city,
          subdistrict,
          addressDetail,
          courier: hasPhysical ? selectedCourier : undefined,
          paymentMethod,
        },
        items,
        subtotal,
        shippingCost,
        grandTotal,
        paymentStatus: 'PAID',
        paidAt: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        invoiceUrl: `https://zaidly.mayar.shop/invoices/inv-${Date.now()}`,
        digitalDownloads: items
          .filter((i) => i.product.type === 'DIGITAL_EBOOK')
          .map((i) => ({
            productId: i.product.id,
            productTitle: i.product.title,
            fileName: `${i.product.slug}.pdf`,
            fileSizeMb: i.product.fileSizeMb || 12.5,
            downloadToken: `r2_token_${Math.random().toString(36).substring(2, 10)}`,
            expiresInHours: 24,
          })),
        shippingAwb: hasPhysical
          ? {
              courierName: selectedCourier.courierName,
              awbNumber: `${selectedCourier.courierCode}ID${Math.floor(1000000000 + Math.random() * 9000000000)}`,
              status: 'Menunggu Penjemputan Kurir',
              estimatedDelivery: selectedCourier.etd,
            }
          : undefined,
      };

      onOrderSuccess(completedOrder);
      onClose();
    }, 1200);
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
              {step === 'form' ? 'Informasi Pengiriman & Pembayaran' : 'Portal Pembayaran Mayar.id'}
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
                        <span className="text-[10px] text-[#19583E] font-bold">API Real-Time</span>
                      </div>

                      <div className="bg-white/80 p-2 rounded-xl text-[11px] text-[#595959] border border-[#E6E1D8] flex items-center justify-between">
                        <span>📍 <strong>Dikirim dari Gudang:</strong> Kebon Jeruk, Jakarta Barat (11550)</span>
                        <span className="text-[10px] text-[#1F6347] font-bold">JNE, J&T, SiCepat</span>
                      </div>

                      {/* Pilihan Wilayah Pengiriman Lengkap */}
                      <div className="space-y-2.5">
                        <div>
                          <label className="text-[11px] font-semibold text-[#595959] block mb-1">
                            Pilih Provinsi
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
                              Pilih Kota / Kabupaten ({availableCities.length} Wilayah)
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
                              Kecamatan (Ketik Nama Kecamatan)
                            </label>
                            <input
                              type="text"
                              required
                              value={subdistrict}
                              onChange={(e) => handleDistrictChange(e.target.value)}
                              placeholder="Contoh: Depok, Kebon Jeruk, Sukajadi..."
                              className="w-full bg-white border border-[#E6E1D8] focus:border-[#DE5A35] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-[#595959] block mb-1">
                          Alamat Lengkap &amp; Patokan Rumah
                        </label>
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
                          Pilih Layanan Ekspedisi (Kalkulasi Otomatis dari Kebon Jeruk):
                        </label>
                        <div className="space-y-1.5">
                          {courierRates.map((rate) => {
                            const isSelected = selectedCourier.courierCode === rate.courierCode;
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
                          Keranjang Anda 100% berisi ebook printable. File PDF akan langsung aktif untuk diunduh segera setelah pembayaran terkonfirmasi via Mayar.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Pilihan Metode Pembayaran via Mayar */}
                  <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6E1D8] space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-[#222222] uppercase tracking-wider flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-[#1F6347]" />
                        <span>3. Metode Pembayaran (Mayar.id)</span>
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <label
                        className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                          paymentMethod === 'QRIS'
                            ? 'bg-white border-[#DE5A35] shadow-xs'
                            : 'bg-white/70 border-[#E6E1D8]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'QRIS'}
                          onChange={() => setPaymentMethod('QRIS')}
                          className="accent-[#DE5A35]"
                        />
                        <div>
                          <div className="text-xs font-bold text-[#222222] flex items-center gap-1">
                            <QrCode className="w-3.5 h-3.5 text-[#DE5A35]" />
                            <span>QRIS Instan</span>
                          </div>
                          <div className="text-[10px] text-[#7A7A7A]">BSI, BCA, GoPay, ShopeePay</div>
                        </div>
                      </label>

                      <label
                        className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                          paymentMethod === 'VA_BSI'
                            ? 'bg-white border-[#DE5A35] shadow-xs'
                            : 'bg-white/70 border-[#E6E1D8]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'VA_BSI'}
                          onChange={() => setPaymentMethod('VA_BSI')}
                          className="accent-[#DE5A35]"
                        />
                        <div>
                          <div className="text-xs font-bold text-[#222222] flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-[#1F6347]" />
                            <span>VA Bank Syariah</span>
                          </div>
                          <div className="text-[10px] text-[#7A7A7A]">BSI Virtual Account</div>
                        </div>
                      </label>
                    </div>
                  </div>
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
                              {item.quantity} x {formatIDR(item.product.price)}
                            </div>
                          </div>
                          <div className="font-bold text-[#222222]">
                            {formatIDR(item.product.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1.5 text-xs pt-1">
                      <div className="flex justify-between text-[#595959]">
                        <span>Subtotal Produk:</span>
                        <span className="font-bold text-[#222222]">{formatIDR(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-[#595959]">
                        <span>Ongkos Kirim:</span>
                        <span className="font-bold text-[#19583E]">
                          {shippingCost === 0 ? 'GRATIS / Rp 0' : formatIDR(shippingCost)}
                        </span>
                      </div>
                      <div className="border-t border-[#E6E1D8] pt-2 flex justify-between text-sm font-black text-[#222222]">
                        <span>Total Pembayaran:</span>
                        <span className="text-base text-[#DE5A35]">{formatIDR(grandTotal)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#DE5A35] hover:bg-[#C54724] text-white rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <span>Lanjut Bayar via Mayar.id</span>
                    <ArrowRight className="w-4 h-4" />
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
            /* Step 2: Mayar.id Gateway Simulation */
            <div className="max-w-md mx-auto space-y-5 text-center py-4">
              <div className="w-12 h-12 rounded-2xl bg-[#DE5A35]/10 text-[#DE5A35] flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>

              <div>
                <span className="text-xs font-bold text-[#7A7A7A] uppercase tracking-wider">
                  Mayar.id Secure Checkout
                </span>
                <h3 className="text-xl font-bold text-[#222222] font-serif-title mt-0.5">
                  Selesaikan Pembayaran {formatIDR(grandTotal)}
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
                      {/* Simulating QRIS Code Pattern */}
                      <div className="w-full h-full bg-[#222222] rounded-xl flex items-center justify-center text-white text-[10px] font-mono p-3 text-center">
                        <div className="space-y-1">
                          <QrCode className="w-16 h-16 mx-auto text-white" />
                          <span className="block font-bold">QRIS NATIONAL MAYAR</span>
                          <span className="text-[8px] opacity-80">NMID: ID10202688921ZAID</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-[#222222]">
                      Pindai QRIS menggunakan aplikasi Bank Syariah (BSI), BCA, atau E-Wallet
                    </p>
                  </>
                ) : (
                  <div className="bg-white p-4 rounded-2xl border border-[#E6E1D8] text-left space-y-2">
                    <div className="text-[11px] text-[#7A7A7A]">Nomor Virtual Account BSI:</div>
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
                  <span>Sistem mendeteksi pembayaran secara otomatis via Webhook Mayar</span>
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
