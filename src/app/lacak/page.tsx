'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, ShieldCheck, Info, MessageCircle, Download } from 'lucide-react';

/**
 * Halaman lacak pesanan.
 * Jujur: belum ada database pesanan, jadi halaman ini TIDAK menampilkan status/resi karangan.
 * Pembeli diarahkan menghubungi toko dengan nomor pesanan. Setelah database pesanan tersedia,
 * ganti bagian "hasil" dengan data asli dari server.
 */

const STORE_WHATSAPP = process.env.NEXT_PUBLIC_STORE_WHATSAPP || '';

export default function TrackingPage() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fromPayment, setFromPayment] = useState(false);

  // Pembeli yang kembali dari pembayaran atau klaim gratis membawa ?order=ORD-xxx&email=xxx
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const order = params.get('order');
    const emailParam = params.get('email');
    if (order) {
      const clean = order.replace(/[^A-Za-z0-9-]/g, '').slice(0, 40);
      setQuery(clean);
      setSubmittedQuery(clean);
      setFromPayment(true);
      if (emailParam) {
        setEmail(emailParam);
        setLoading(true);
        fetch('/api/orders/lookup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: clean, email: emailParam }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data?.order) setResult(data.order);
          })
          .catch(() => {})
          .finally(() => setLoading(false));
      }
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim().slice(0, 40);
    if (!clean) return;
    setSubmittedQuery(clean); setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/orders/lookup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: clean, email }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Pesanan tidak ditemukan.');
      setResult(data.order);
    } catch (err) { setError(err instanceof Error ? err.message : 'Pelacakan gagal.'); }
    finally { setLoading(false); }
  };

  const waLink = STORE_WHATSAPP
    ? `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(
        `Assalamu'alaikum Admin Toko Zaidly, saya ingin menanyakan status pesanan ${submittedQuery}`
      )}`
    : '';

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
            <h1 className="text-2xl font-bold font-serif-title text-[#222222]">
              Lacak Pesanan &amp; Unduh Ebook
            </h1>
            <p className="text-xs text-[#595959] max-w-md mx-auto">
              Masukkan <strong>Nomor Pesanan</strong> yang tertera di email tagihan / bukti pembayaran Anda.
            </p>
          </div>

          {fromPayment && (
            <div className="p-4 bg-[#E8F4EC] rounded-2xl border border-[#19583E]/20 text-xs text-[#19583E] space-y-1">
              <p className="font-bold">
                {result && (Number(result.total) <= 1 || result.customer?.isFreeOrder)
                  ? `Alhamdulillah! Pesanan gratis #${submittedQuery} berhasil diproses.`
                  : `Terima kasih, pesanan #${submittedQuery} sudah kami terima.`}
              </p>
              <p>
                {result && (Number(result.total) <= 1 || result.customer?.isFreeOrder)
                  ? 'File PDF digital Anda siap diunduh langsung pada tombol di bawah ini.'
                  : 'Bukti pembayaran resmi dikirim ke email Anda. Jika pembayaran berhasil, pesanan akan kami proses dan informasi pengiriman / tautan ebook dikirim ke email & WhatsApp Anda.'}
              </p>
            </div>
          )}

          <form onSubmit={handleSearch} className="grid sm:grid-cols-[1fr_1fr_auto] gap-2">
            <label htmlFor="order-query" className="sr-only">Nomor pesanan</label>
            <input
              id="order-query"
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Contoh: ORD-M1ABC2D-3F4E"
              className="flex-1 bg-[#FAF7F2] border border-[#E6E1D8] focus:border-[#DE5A35] rounded-full px-4 py-2.5 text-xs text-[#222222] outline-none"
            />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email saat checkout" className="bg-[#FAF7F2] border border-[#E6E1D8] focus:border-[#DE5A35] rounded-full px-4 py-2.5 text-xs outline-none" />
            <button
              id="order-search-btn"
              type="submit"
              className="px-6 py-2.5 bg-[#DE5A35] hover:bg-[#C54724] text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Mencari...' : 'Cari'}</span>
            </button>
          </form>

          {error && <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-200 text-xs">{error}</div>}
          {submittedQuery && result && (
            <div className="p-5 bg-[#FAF7F2] rounded-3xl border border-[#E6E1D8] space-y-4 animate-fade-in">
              {/* STATUS BADGE */}
              {result.status === 'PAID' ? (
                <div className="p-4 bg-[#E8F4EC] rounded-2xl border border-[#19583E]/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#19583E] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#19583E] animate-pulse" />
                      Status: {Number(result.total) <= 1 || result.customer?.isFreeOrder ? 'Akses Unduh Gratis Terkonfirmasi' : 'Pembayaran Lunas Terverifikasi'}
                    </span>
                    <span className="text-[10px] font-bold text-[#19583E] bg-white px-2 py-0.5 rounded-full border border-[#19583E]/20">
                      PAID
                    </span>
                  </div>
                  <div className="text-xs text-[#19583E]/90 flex flex-wrap gap-x-4 gap-y-1">
                    <span>Pesanan: <strong>#{submittedQuery}</strong></span>
                    {result.total !== undefined && (
                      <span>
                        Total:{' '}
                        <strong>
                          {Number(result.total) <= 1 || result.customer?.isFreeOrder
                            ? 'GRATIS (Rp 0)'
                            : `Rp ${Number(result.total).toLocaleString('id-ID')}`}
                        </strong>
                      </span>
                    )}
                    {result.paidAt && (
                      <span>Waktu Lunas: <strong>{new Date(result.paidAt).toLocaleString('id-ID')}</strong></span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2.5 text-xs text-amber-900">
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                      Status: Menunggu Pembayaran
                    </span>
                    <span className="text-[10px] font-bold bg-white text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                      PENDING
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Jika Anda baru saja menyelesaikan transfer / QRIS via Mayar, mohon tunggu beberapa detik hingga sistem gateway mengonfirmasi pembayaran Anda.
                  </p>
                  <button
                    type="button"
                    onClick={(e) => handleSearch(e)}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-full text-xs font-bold transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                  >
                    <span>🔄 Periksa Ulang Status Pembayaran</span>
                  </button>
                </div>
              )}

              {/* DOWNLOAD SECTION (CLOUD FLARE R2) */}
              {result.status === 'PAID' && (
                <div className="space-y-2.5 pt-1">
                  <h3 className="text-xs font-bold text-[#222222] uppercase tracking-wider flex items-center gap-1.5">
                    <span>📥 Berkas Ebook Unduhan Anda (Cloudflare R2):</span>
                  </h3>

                  {result.downloads && result.downloads.length > 0 ? (
                    <div className="space-y-2">
                      {result.downloads.map((file: any) => (
                        <div
                          key={file.productId}
                          className="p-3.5 bg-white rounded-2xl border border-[#E6E1D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                        >
                          <div className="space-y-0.5 min-w-0">
                            <div className="font-bold text-xs text-[#222222] truncate">
                              📄 {file.fileName}
                            </div>
                            <div className="text-[10px] text-[#7A7A7A]">
                              Format PDF Asli • Tautan aman aktif {file.expiresInMinutes || 10} menit
                            </div>
                          </div>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-[#1F6347] hover:bg-[#164E36] text-white text-xs font-bold rounded-full flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Unduh Berkas PDF</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3.5 bg-white rounded-2xl border border-[#E6E1D8] text-xs text-[#595959] space-y-1">
                      <p className="font-semibold text-[#222222]">
                        Berkas PDF sedang disiapkan oleh sistem admin.
                      </p>
                      <p className="text-[11px] text-[#7A7A7A]">
                        Jika berkas belum muncul, Anda dapat menghubungi admin toko via WhatsApp di bawah untuk pengiriman langsung.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ACTION LINKS */}
              <div className="pt-2 flex flex-wrap gap-2 items-center justify-between border-t border-[#E6E1D8]">
                {waLink && (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FAF7F2] hover:bg-[#EAE4D8] text-[#1F6347] text-xs font-bold rounded-full border border-[#E6E1D8] transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Tanya Admin via WhatsApp</span>
                  </a>
                )}
                <span className="text-[10px] text-[#7A7A7A]">
                  Nomor Pesanan: #{submittedQuery}
                </span>
              </div>
            </div>
          )}

          <div className="pt-2 text-center text-[11px] text-[#7A7A7A] flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#1F6347]" />
            <span>Kami tidak pernah meminta password atau kode OTP Anda.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
