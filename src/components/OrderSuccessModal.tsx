'use client';

import React, { useState } from 'react';
import { CompletedOrder } from '@/types';
import {
  CheckCircle2,
  Download,
  Truck,
  ExternalLink,
  MessageCircle,
  Copy,
  Check,
} from 'lucide-react';

interface OrderSuccessModalProps {
  order: CompletedOrder | null;
  onClose: () => void;
}

export default function OrderSuccessModal({ order, onClose }: OrderSuccessModalProps) {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [downloadSuccessMap, setDownloadSuccessMap] = useState<Record<string, boolean>>({});

  if (!order) return null;

  const handleSimulatedDownload = (fileName: string, productId: string) => {
    // Generate simulated downloaded text/pdf content
    const blob = new Blob(
      [
        `Bismillaah. Ini adalah berkas ebook anak edukasi sunnah resmi dari toko.zaidly.com.\n\nNomor Pesanan: ${order.orderId}\nPembeli: ${order.customer.fullName}\nEmail: ${order.customer.email}\nTanggal Pembelian: ${order.paidAt}\n\nJazaakumullahu Khayran telah berbelanja di toko.zaidly.com!`,
      ],
      { type: 'application/pdf' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccessMap((prev) => ({ ...prev, [productId]: true }));
  };

  const copyAwb = (awb: string) => {
    navigator.clipboard.writeText(awb);
    setCopiedToken(awb);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E6E1D8] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Celebration */}
        <div className="p-6 text-center bg-gradient-to-b from-[#E8F4EC] to-white border-b border-[#E6E1D8]">
          <div className="w-14 h-14 bg-[#1F6347] text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-bold text-[#19583E] tracking-wider uppercase bg-white px-3 py-1 rounded-full border border-[#19583E]/20">
            Pembayaran Lunas Terverifikasi
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#222222] font-serif-title mt-2">
            Jazaakumullahu Khayran, {order.customer.fullName}!
          </h2>
          <p className="text-xs text-[#595959] mt-1">
            Pesanan <strong>#{order.orderId}</strong> telah berhasil diproses pada {order.paidAt}.
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* DIGITAL DOWNLOAD ACCESS */ }
          {order.digitalDownloads.length > 0 && (
            <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-2xl border-2 border-[#19583E]/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-[#19583E]" />
                  <h3 className="text-xs font-bold text-[#222222] uppercase tracking-wider">
                    Pusat Unduhan Ebook Instan
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-[#19583E] bg-[#E8F4EC] px-2 py-0.5 rounded">
                  Siap Unduh Detik Ini
                </span>
              </div>

              <div className="space-y-2">
                {order.digitalDownloads.map((dl) => (
                  <div
                    key={dl.productId}
                    className="p-3 bg-white rounded-xl border border-[#E6E1D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-[#222222]">{dl.productTitle}</h4>
                      <div className="text-[10px] text-[#7A7A7A] mt-0.5">
                        Format PDF • {dl.fileSizeMb} MB • Tautan Aman Aktif {dl.expiresInHours} Jam
                      </div>
                    </div>

                    <button
                      onClick={() => handleSimulatedDownload(dl.fileName, dl.productId)}
                      className="px-4 py-2 bg-[#1F6347] hover:bg-[#164E36] text-white rounded-full text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{downloadSuccessMap[dl.productId] ? 'Unduh Ulang' : 'Unduh Berkas PDF'}</span>
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-[#595959]">
                💡 Salinan link unduh juga telah dikirimkan ke email <strong>{order.customer.email}</strong>.
              </p>
            </div>
          )}

          {/* PHYSICAL SHIPPING DETAILS (KiriminAja Logistics) */}
          {order.shippingAwb && (
            <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-[#E6E1D8] space-y-3">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#DE5A35]" />
                <h3 className="text-xs font-bold text-[#222222] uppercase tracking-wider">
                  Pengiriman Paket Fisik (KiriminAja API)
                </h3>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E6E1D8] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#222222]">
                    {order.shippingAwb.courierName}
                  </span>
                  <span className="text-[10px] font-bold text-[#19583E] bg-[#E8F4EC] px-2 py-0.5 rounded">
                    {order.shippingAwb.status}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-[#F5EFEB] p-2 rounded-lg">
                  <div>
                    <div className="text-[10px] text-[#7A7A7A]">Nomor Resi Resmi:</div>
                    <div className="text-xs font-mono font-bold text-[#222222]">
                      {order.shippingAwb.awbNumber}
                    </div>
                  </div>
                  <button
                    onClick={() => copyAwb(order.shippingAwb!.awbNumber)}
                    className="p-1.5 text-[#595959] hover:text-[#222222] bg-white rounded-md border border-[#E6E1D8] text-xs flex items-center gap-1"
                  >
                    {copiedToken === order.shippingAwb.awbNumber ? (
                      <Check className="w-3.5 h-3.5 text-[#19583E]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span className="text-[10px] font-semibold">Salin Resi</span>
                  </button>
                </div>

                <div className="text-[11px] text-[#595959]">
                  Tujuan: {order.customer.addressDetail}, Kec. {order.customer.subdistrict}, {order.customer.city}
                </div>
              </div>
            </div>
          )}

          {/* Rincian Finansial */}
          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E6E1D8] text-xs space-y-1">
            <div className="flex justify-between text-[#595959]">
              <span>Subtotal Produk:</span>
              <span className="font-semibold text-[#222222]">Rp {order.subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-[#595959]">
              <span>Ongkos Kirim:</span>
              <span className="font-semibold text-[#222222]">Rp {order.shippingCost.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between font-bold text-[#222222] pt-1 border-t border-[#E6E1D8]">
              <span>Total Lunas:</span>
              <span className="text-[#DE5A35]">Rp {order.grandTotal.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[#E6E1D8] bg-[#FAF7F2] flex flex-wrap gap-2 justify-between items-center">
          {process.env.NEXT_PUBLIC_STORE_WHATSAPP ? (
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_STORE_WHATSAPP}?text=${encodeURIComponent(
                `Assalamu'alaikum Admin Zaidly, saya ingin menanyakan pesanan ${order.orderId}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[#1F6347] hover:underline flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Konfirmasi / Tanya via WhatsApp</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span />
          )}

          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#222222] hover:bg-black text-white rounded-full text-xs font-bold transition-all"
          >
            Selesai & Belanja Lagi
          </button>
        </div>
      </div>
    </div>
  );
}
