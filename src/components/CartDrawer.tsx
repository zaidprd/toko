'use client';

import React from 'react';
import { CartItem } from '@/types';
import { X, Trash2, Download, Truck, ShoppingBag, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}: CartDrawerProps) {
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
  const freeShippingThreshold = 150000;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#E6E1D8] animate-slide-down">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E6E1D8] flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#DE5A35]" />
            <h3 className="font-bold text-base text-[#222222] font-serif-title">
              Keranjang Belanja ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#EBE4D9] flex items-center justify-center text-[#595959]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Progress for physical */}
        {hasPhysical && (
          <div className="bg-[#E8F4EC] p-3 text-xs border-b border-[#19583E]/10">
            {remainingForFreeShipping > 0 ? (
              <p className="text-[#19583E]">
                Belanja <strong>{formatIDR(remainingForFreeShipping)}</strong> lagi untuk <strong>Bebas Ongkir se-Jawa!</strong>
              </p>
            ) : (
              <p className="text-[#19583E] font-bold">
                🎉 Masyaa Allah! Anda mendapatkan Bebas Ongkir se-Jawa!
              </p>
            )}
            <div className="w-full bg-white/70 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#1F6347] h-full rounded-full transition-all duration-300"
                style={{ width: `${freeShippingPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#7A7A7A] space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#FAF7F2] flex items-center justify-center border border-[#E6E1D8]">
                <ShoppingBag className="w-8 h-8 text-[#A0988E]" />
              </div>
              <h4 className="font-bold text-sm text-[#222222]">Keranjang Anda Kosong</h4>
              <p className="text-xs max-w-xs">
                Pilihlah buku sunnah, mainan montessori faceless, atau ebook printable untuk si kecil.
              </p>
            </div>
          ) : (
            items.map((item) => {
              const isDigital = item.product.type === 'DIGITAL_EBOOK';
              return (
                <div
                  key={item.product.id}
                  className="flex gap-3 p-3 rounded-2xl bg-[#FAF7F2] border border-[#E6E1D8]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.product.coverImage}
                    alt={item.product.title}
                    className="w-18 h-18 rounded-xl object-cover border border-[#E6E1D8] shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isDigital ? 'badge-digital' : 'badge-physical'
                          }`}
                        >
                          {isDigital ? '⚡ Ebook Digital' : '📦 Buku/Mainan Fisik'}
                        </span>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-[#8A8A8A] hover:text-[#DE5A35]"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="text-xs font-semibold text-[#222222] line-clamp-1">
                        {item.product.title}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-extrabold text-[#222222]">
                        {formatIDR(item.product.price * item.quantity)}
                      </span>

                      {/* Quantity Controller */}
                      <div className="flex items-center bg-white border border-[#E6E1D8] rounded-full">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-xs font-bold text-[#595959] hover:text-[#222222]"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-xs font-bold text-[#595959] hover:text-[#222222]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Subtotal & Checkout */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#E6E1D8] bg-[#FAF7F2] space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#595959]">
                <span>Subtotal Barang:</span>
                <span className="font-bold text-[#222222]">{formatIDR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#595959]">
                <span>Biaya Pengiriman:</span>
                <span className="font-medium text-[#19583E]">
                  {hasPhysical ? 'Dihitung saat Checkout' : 'Rp 0 (Ebook Digital)'}
                </span>
              </div>
              <div className="border-t border-[#E6E1D8] pt-2 flex justify-between text-sm font-black text-[#222222]">
                <span>Total Estimasi:</span>
                <span className="text-base text-[#DE5A35]">{formatIDR(subtotal)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 bg-[#DE5A35] hover:bg-[#C54724] text-white rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Lanjut ke Pembayaran</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
