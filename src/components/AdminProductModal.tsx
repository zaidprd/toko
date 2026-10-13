'use client';

import React, { useState } from 'react';
import { Product, TargetAge } from '@/types';
import { Package, Plus, Trash2, Edit3, Save, X, Image as ImageIcon, Tag, Check, RefreshCw } from 'lucide-react';

interface AdminProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSaveProducts: (products: Product[]) => void;
}

export default function AdminProductModal({
  isOpen,
  onClose,
  products,
  onSaveProducts,
}: AdminProductModalProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'form'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Buku Fisik' | 'Ebook Digital' | 'Mainan Edukasi'>('Buku Fisik');
  const [type, setType] = useState<'PHYSICAL_BOOK' | 'DIGITAL_EBOOK' | 'PHYSICAL_TOY'>('PHYSICAL_BOOK');
  const [price, setPrice] = useState<number>(50000);
  const [stock, setStock] = useState<number>(20);
  const [weightGrams, setWeightGrams] = useState<number>(350);
  const [coverImage, setCoverImage] = useState('');
  const [publisherOrBrand, setPublisherOrBrand] = useState('Pustaka Zaidly Kids');
  const [targetAge, setTargetAge] = useState<TargetAge>('4-6 Tahun');
  const [shortDescription, setShortDescription] = useState('');
  const [descriptionHtml, setDescriptionHtml] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setCategory('Buku Fisik');
    setType('PHYSICAL_BOOK');
    setPrice(50000);
    setStock(20);
    setWeightGrams(350);
    setCoverImage('');
    setPublisherOrBrand('Pustaka Zaidly Kids');
    setTargetAge('4-6 Tahun');
    setShortDescription('');
    setDescriptionHtml('');
  };

  const handleStartAdd = () => {
    resetForm();
    setActiveTab('form');
  };

  const handleStartEdit = (prod: Product) => {
    setEditingId(prod.id);
    setTitle(prod.title);
    setCategory(prod.category as any);
    setType(prod.type);
    setPrice(prod.price);
    setStock(prod.stock || 20);
    setWeightGrams(prod.weightGrams || 350);
    setCoverImage(prod.coverImage);
    setPublisherOrBrand(prod.publisherOrBrand);
    setTargetAge(prod.targetAge);
    setShortDescription(prod.shortDescription);
    setDescriptionHtml(prod.descriptionHtml);
    setActiveTab('form');
  };

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus produk ini dari katalog toko?')) {
      const updated = products.filter((p) => p.id !== id);
      onSaveProducts(updated);
      setSuccessMessage('Produk berhasil dihapus!');
      setTimeout(() => setSuccessMessage(''), 2500);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Mohon isi judul produk!');
      return;
    }

    const defaultImg =
      coverImage.trim() ||
      (type === 'DIGITAL_EBOOK'
        ? 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80');

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newProd: Product = {
      id: editingId || `prod-${Date.now()}`,
      slug: editingId ? (products.find((p) => p.id === editingId)?.slug || slug) : slug,
      title: title.trim(),
      category,
      type,
      price: Number(price) || 10000,
      coverImage: defaultImg,
      galleryImages: [defaultImg],
      rating: 5.0,
      reviewsCount: 1,
      publisherOrBrand: publisherOrBrand.trim() || 'Toko Zaidly',
      author: 'Tim Pustaka Sunnah',
      targetAge: targetAge || 'Semua Usia',
      isFaceless: true,
      hasMusic: false,
      shortDescription: shortDescription.trim() || title,
      descriptionHtml: descriptionHtml.trim() || `<p>${shortDescription || title}</p>`,
      highlights: [
        type === 'DIGITAL_EBOOK' ? '⚡ Unduhan File Digital (PDF)' : '📦 Pengiriman Fisik via Ekspedisi',
        '🌿 100% Ilustrasi Faceless (Syar\'i)',
        '⭐ Kualitas Terjamin',
      ],
      stock: type === 'DIGITAL_EBOOK' ? undefined : Number(stock) || 10,
      weightGrams: type === 'DIGITAL_EBOOK' ? 0 : Number(weightGrams) || 350,
      fileSizeMb: type === 'DIGITAL_EBOOK' ? 15 : undefined,
    };

    let updatedList: Product[];
    if (editingId) {
      updatedList = products.map((p) => (p.id === editingId ? newProd : p));
      setSuccessMessage('Produk berhasil diperbarui!');
    } else {
      updatedList = [newProd, ...products];
      setSuccessMessage('Produk baru berhasil ditambahkan!');
    }

    onSaveProducts(updatedList);
    resetForm();
    setActiveTab('list');
    setTimeout(() => setSuccessMessage(''), 2500);
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#E6E1D8] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#E6E1D8] bg-[#FAF7F2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#19583E] text-white flex items-center justify-center shadow-xs">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#19583E] bg-[#E8F4EC] px-2 py-0.5 rounded-full border border-[#19583E]/20">
                Panel Admin Toko
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[#222222] font-serif-title mt-0.5">
                Kelola Katalog Produk Toko
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#EBE4D9] flex items-center justify-center text-[#595959] transition-transform active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-5 pt-3 border-b border-[#E6E1D8] bg-[#FAF7F2] flex items-center justify-between">
          <div className="flex gap-4 text-xs font-bold">
            <button
              onClick={() => setActiveTab('list')}
              className={`pb-2.5 transition-all border-b-2 ${
                activeTab === 'list'
                  ? 'border-[#DE5A35] text-[#DE5A35]'
                  : 'border-transparent text-[#7A7A7A] hover:text-[#222222]'
              }`}
            >
              Daftar Produk ({products.length})
            </button>
            <button
              onClick={handleStartAdd}
              className={`pb-2.5 transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'form'
                  ? 'border-[#DE5A35] text-[#DE5A35]'
                  : 'border-transparent text-[#7A7A7A] hover:text-[#222222]'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{editingId ? 'Edit Produk' : 'Tambah Produk Baru'}</span>
            </button>
          </div>

          {successMessage && (
            <span className="text-[11px] font-bold text-[#19583E] bg-[#E8F4EC] px-3 py-1 rounded-full flex items-center gap-1 mb-2 animate-fade-in">
              <Check className="w-3.5 h-3.5" /> {successMessage}
            </span>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {activeTab === 'list' ? (
            /* Tab: Daftar Produk */
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-[#595959]">
                  Kelola stok, harga, dan informasi barang di etalase toko. Produk baru akan langsung tayang.
                </p>
                <button
                  onClick={handleStartAdd}
                  className="px-3.5 py-1.5 bg-[#DE5A35] hover:bg-[#C54724] text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Produk</span>
                </button>
              </div>

              <div className="divide-y divide-[#E6E1D8] border border-[#E6E1D8] rounded-2xl overflow-hidden bg-white">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#FAF7F2] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={prod.coverImage}
                        alt={prod.title}
                        className="w-12 h-12 rounded-xl object-cover border border-[#E6E1D8] shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              prod.type === 'DIGITAL_EBOOK'
                                ? 'bg-[#E8F4EC] text-[#19583E]'
                                : 'bg-[#FEF3C7] text-[#92400E]'
                            }`}
                          >
                            {prod.category}
                          </span>
                          <span className="text-[10px] text-[#7A7A7A] truncate">
                            {prod.publisherOrBrand}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-[#222222] truncate mt-0.5 max-w-md">
                          {prod.title}
                        </h4>
                        <div className="flex items-center gap-3 text-[11px] mt-0.5">
                          <span className="font-extrabold text-[#19583E]">{formatIDR(prod.price)}</span>
                          {prod.type !== 'DIGITAL_EBOOK' && (
                            <span className="text-[#7A7A7A]">Stok: {prod.stock || 0} unit</span>
                          )}
                          {prod.weightGrams ? (
                            <span className="text-[#7A7A7A]">Berat: {prod.weightGrams} gr</span>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleStartEdit(prod)}
                        className="p-2 rounded-xl hover:bg-white border border-transparent hover:border-[#E6E1D8] text-[#595959] hover:text-[#DE5A35] transition-all"
                        title="Edit Produk"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id)}
                        className="p-2 rounded-xl hover:bg-[#FEE2E2] border border-transparent hover:border-[#FCA5A5] text-[#991B1B] transition-all"
                        title="Hapus Produk"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Tab: Form Tambah / Edit */
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6E1D8] space-y-3">
                <h3 className="text-xs font-bold text-[#222222] uppercase tracking-wider">
                  1. Informasi Dasar Produk
                </h3>

                <div>
                  <label className="text-[11px] font-semibold text-[#595959] block mb-1">
                    Judul Produk *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Buku 25 Kisah Nabi & Rasul untuk Balita"
                    className="w-full bg-white border border-[#E6E1D8] focus:border-[#DE5A35] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#595959] block mb-1">
                      Kategori Produk
                    </label>
                    <select
                      value={category}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setCategory(val);
                        if (val === 'Ebook Digital') setType('DIGITAL_EBOOK');
                        else if (val === 'Mainan Edukasi') setType('PHYSICAL_TOY');
                        else setType('PHYSICAL_BOOK');
                      }}
                      className="w-full bg-white border border-[#E6E1D8] focus:border-[#DE5A35] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none"
                    >
                      <option value="Buku Fisik">Buku Fisik</option>
                      <option value="Ebook Digital">Ebook Digital (PDF)</option>
                      <option value="Mainan Edukasi">Mainan Edukasi</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#595959] block mb-1">
                      Harga Jual Riil (Rp) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1000}
                      step={1000}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      placeholder="68000"
                      className="w-full bg-white border border-[#E6E1D8] focus:border-[#DE5A35] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none font-bold"
                    />
                    <span className="text-[10px] text-[#7A7A7A] mt-0.5 block">
                      Harga jujur (tanpa manipulasi harga coret).
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#595959] block mb-1">
                      Target Usia Anak
                    </label>
                    <select
                      value={targetAge}
                      onChange={(e) => setTargetAge(e.target.value as TargetAge)}
                      className="w-full bg-white border border-[#E6E1D8] focus:border-[#DE5A35] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none"
                    >
                      <option value="Semua Usia">Semua Usia</option>
                      <option value="1-3 Tahun">1-3 Tahun (Balita)</option>
                      <option value="4-6 Tahun">4-6 Tahun (TK)</option>
                      <option value="7-10 Tahun">7-10 Tahun (SD Awal)</option>
                      <option value="10+ Tahun">10+ Tahun (Remaja)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {type !== 'DIGITAL_EBOOK' && (
                    <>
                      <div>
                        <label className="text-[11px] font-semibold text-[#595959] block mb-1">
                          Berat Barang (gram) *
                        </label>
                        <input
                          type="number"
                          min={10}
                          value={weightGrams}
                          onChange={(e) => setWeightGrams(Number(e.target.value))}
                          placeholder="380"
                          className="w-full bg-white border border-[#E6E1D8] focus:border-[#DE5A35] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none"
                        />
                        <span className="text-[10px] text-[#7A7A7A] mt-0.5 block">
                          Digunakan untuk perhitungan tarif ongkir KiriminAja.
                        </span>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-[#595959] block mb-1">
                          Jumlah Stok Fisik (unit)
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={stock}
                          onChange={(e) => setStock(Number(e.target.value))}
                          placeholder="25"
                          className="w-full bg-white border border-[#E6E1D8] focus:border-[#DE5A35] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 2. Media & Deskripsi */}
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6E1D8] space-y-3">
                <h3 className="text-xs font-bold text-[#222222] uppercase tracking-wider">
                  2. Gambar &amp; Deskripsi
                </h3>

                <div>
                  <label className="text-[11px] font-semibold text-[#595959] block mb-1">
                    URL Foto Sampul (Cover Image)
                  </label>
                  <input
                    type="url"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... atau link gambar Cloudflare R2"
                    className="w-full bg-white border border-[#E6E1D8] focus:border-[#DE5A35] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none"
                  />
                  <span className="text-[10px] text-[#7A7A7A] mt-0.5 block">
                    Kosongkan jika ingin memakai gambar standar otomatis.
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#595959] block mb-1">
                    Deskripsi Singkat Produk
                  </label>
                  <textarea
                    rows={2}
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Deskripsi singkat yang tampil pada kartu produk..."
                    className="w-full bg-white border border-[#E6E1D8] focus:border-[#DE5A35] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#595959] block mb-1">
                    Penerbit / Brand
                  </label>
                  <input
                    type="text"
                    value={publisherOrBrand}
                    onChange={(e) => setPublisherOrBrand(e.target.value)}
                    placeholder="Pustaka Zaidly Kids"
                    className="w-full bg-white border border-[#E6E1D8] focus:border-[#DE5A35] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-4 py-2 border border-[#E6E1D8] hover:bg-[#FAF7F2] text-[#595959] rounded-full text-xs font-semibold transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#DE5A35] hover:bg-[#C54724] text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingId ? 'Simpan Perubahan' : 'Tambah ke Etalase'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
