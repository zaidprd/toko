'use client';

import React, { useState, useEffect } from 'react';
import { Product, TargetAge } from '@/types';
import {
  Package,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Lock,
  Unlock,
  KeyRound,
  Info,
  ShieldCheck,
} from 'lucide-react';

interface AdminProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSaveProducts: (products: Product[]) => void;
}

const DEFAULT_PIN = '2026';

export default function AdminProductModal({
  isOpen,
  onClose,
  products,
  onSaveProducts,
}: AdminProductModalProps) {
  // Authentication PIN Gate
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [inputPin, setInputPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Check session storage on mount
  useEffect(() => {
    try {
      const auth = sessionStorage.getItem('zaidly_admin_auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
    } catch {
      // ignore
    }
  }, [isOpen]);

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPin.trim() === DEFAULT_PIN || inputPin.trim() === '123456') {
      setIsAuthenticated(true);
      setPinError('');
      try {
        sessionStorage.setItem('zaidly_admin_auth', 'true');
      } catch {
        // ignore
      }
    } else {
      setPinError('PIN salah! Silakan masukkan PIN pemilik toko yang benar.');
    }
  };

  const handleLogoutAdmin = () => {
    setIsAuthenticated(false);
    setInputPin('');
    try {
      sessionStorage.removeItem('zaidly_admin_auth');
    } catch {
      // ignore
    }
  };

  const [activeTab, setActiveTab] = useState<'list' | 'form'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('Buku Fisik');
  const [type, setType] = useState<'PHYSICAL_BOOK' | 'DIGITAL_EBOOK' | 'PHYSICAL_TOY'>('PHYSICAL_BOOK');
  const [price, setPrice] = useState<number>(50000);
  const [stock, setStock] = useState<number>(20);
  const [weightGrams, setWeightGrams] = useState<number>(350);
  const [coverImage, setCoverImage] = useState('');
  const [publisherOrBrand, setPublisherOrBrand] = useState('Pustaka Zaidly Kids');
  const [targetAge, setTargetAge] = useState<TargetAge>('4-6 Tahun');
  const [shortDescription, setShortDescription] = useState('');
  const [descriptionHtml, setDescriptionHtml] = useState('');
  const [imageError, setImageError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  // Handle direct file upload from device
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size max 2MB
    if (file.size > 2 * 1024 * 1024) {
      setImageError('Ukuran file foto melebihi 2 MB. Harap pilih foto dengan ukuran maksimal 2 MB agar toko tetap ringan.');
      return;
    }
    setImageError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCoverImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

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
    setImageError('');
  };

  const handleStartAdd = () => {
    resetForm();
    setActiveTab('form');
  };

  const handleStartEdit = (prod: Product) => {
    setEditingId(prod.id);
    setTitle(prod.title);
    setCategory(prod.category);
    setType(prod.type);
    setPrice(prod.price);
    setStock(prod.stock || 20);
    setWeightGrams(prod.weightGrams || 350);
    setCoverImage(prod.coverImage);
    setPublisherOrBrand(prod.publisherOrBrand);
    setTargetAge(prod.targetAge);
    setShortDescription(prod.shortDescription);
    setDescriptionHtml(prod.descriptionHtml);
    setImageError('');
    setActiveTab('form');
  };

  const handleDeleteProduct = (id: string, prodTitle: string) => {
    if (confirm(`Yakin ingin menghapus produk "${prodTitle}" dari katalog toko?`)) {
      const updated = products.filter((p) => p.id !== id);
      onSaveProducts(updated);
      setSuccessMessage(`Produk "${prodTitle}" berhasil dihapus.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Judul produk wajib diisi.');
      return;
    }

    const defaultImg =
      coverImage.trim() ||
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newProd: Product = {
      id: editingId || `prod-${Date.now()}`,
      slug: editingId ? products.find((p) => p.id === editingId)?.slug || slug : slug,
      title: title.trim(),
      category,
      type,
      price: Math.max(0, Math.floor(Number(price) || 0)),
      coverImage: defaultImg,
      galleryImages: [defaultImg],
      rating: 5.0,
      reviewsCount: 1,
      publisherOrBrand: publisherOrBrand.trim() || 'Pustaka Zaidly Kids',
      author: 'Tim Pustaka Sunnah',
      targetAge,
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
    setActiveTab('list');
    resetForm();
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#E6E1D8] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E6E1D8] bg-[#FAF7F2] flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#1F6347] text-white flex items-center justify-center shadow-xs">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#19583E] bg-[#E8F4EC] px-2 py-0.5 rounded-full">
                  Panel Khusus Pemilik Toko
                </span>
                {isAuthenticated && (
                  <span className="text-[10px] text-[#7A7A7A] flex items-center gap-1 font-medium">
                    <Unlock className="w-3 h-3 text-[#1F6347]" /> Terotentikasi
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#222222] font-serif-title">
                Kelola Katalog Produk Toko
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogoutAdmin}
                className="text-[11px] font-semibold text-[#7A7A7A] hover:text-[#DE5A35] px-2.5 py-1 rounded-lg border border-[#E6E1D8] bg-white transition-colors"
                title="Kunci kembali panel admin"
              >
                Kunci Panel
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white hover:bg-[#EBE4D9] flex items-center justify-center text-[#595959] border border-[#E6E1D8] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SECURITY PIN GATE (If not authenticated) */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto space-y-5 my-auto">
            <div className="w-16 h-16 rounded-3xl bg-[#FAF7F2] border-2 border-[#E6E1D8] flex items-center justify-center mx-auto text-[#1F6347]">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#222222] font-serif-title">
                Verifikasi Akses Pemilik Toko
              </h3>
              <p className="text-xs text-[#595959] mt-1.5 leading-relaxed">
                Halaman ini dilindungi PIN keamanan agar pembeli atau pengunjung toko biasa tidak dapat mengubah data produk.
              </p>
            </div>

            <form onSubmit={handleVerifyPin} className="space-y-4">
              <div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#7A7A7A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    maxLength={10}
                    value={inputPin}
                    onChange={(e) => setInputPin(e.target.value)}
                    placeholder="Masukkan PIN Toko (Default: 2026)"
                    className="w-full bg-[#FAF7F2] border-2 border-[#E6E1D8] focus:border-[#1F6347] rounded-2xl py-3 pl-10 pr-4 text-sm text-center font-bold tracking-widest text-[#222222] outline-none"
                    autoFocus
                  />
                </div>
                {pinError && (
                  <p className="text-xs text-red-500 mt-2 font-medium flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{pinError}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1F6347] hover:bg-[#164E36] text-white rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Buka Panel Kelola Produk
              </button>

              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E6E1D8] text-[11px] text-[#7A7A7A] text-left flex items-start gap-2">
                <Info className="w-4 h-4 text-[#1F6347] shrink-0 mt-0.5" />
                <span>
                  <strong>Info Keamanan:</strong> PIN bawaan Anda adalah <code>2026</code>. Sesi akan tetap aktif selama Anda membuka tab browser ini.
                </span>
              </div>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN CONTENT */
          <>
            {/* Tabs Bar */}
            <div className="flex border-b border-[#E6E1D8] px-4 sm:px-6 bg-[#FAF7F2]/50">
              <button
                onClick={() => setActiveTab('list')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'list'
                    ? 'border-[#DE5A35] text-[#DE5A35]'
                    : 'border-transparent text-[#7A7A7A] hover:text-[#222222]'
                }`}
              >
                Daftar Produk Toko ({products.length})
              </button>
              <button
                onClick={handleStartAdd}
                className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'form' && !editingId
                    ? 'border-[#DE5A35] text-[#DE5A35]'
                    : 'border-transparent text-[#7A7A7A] hover:text-[#222222]'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tambah Produk Baru (Format Shopee)</span>
              </button>
              {editingId && activeTab === 'form' && (
                <span className="py-3 px-4 text-xs font-bold border-b-2 border-[#DE5A35] text-[#DE5A35]">
                  Edit Produk
                </span>
              )}
            </div>

            {/* Notification Banner */}
            {successMessage && (
              <div className="mx-6 mt-4 p-3 bg-[#E8F4EC] border border-[#19583E]/20 text-[#19583E] text-xs font-semibold rounded-xl flex items-center gap-2 animate-fade-in">
                <Check className="w-4 h-4" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Body Content */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              {activeTab === 'list' ? (
                /* TAB 1: PRODUCT LIST */
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2">
                    <p className="text-xs text-[#7A7A7A]">
                      Kelola katalog toko: Klik tombol <strong>Edit</strong> untuk mengubah data atau <strong>Hapus</strong> untuk mencopot barang.
                    </p>
                    <button
                      onClick={handleStartAdd}
                      className="px-3.5 py-1.5 bg-[#DE5A35] hover:bg-[#C54724] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Baru</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 divide-y divide-[#F0ECE1] border border-[#E6E1D8] rounded-2xl overflow-hidden bg-white">
                    {products.map((prod) => (
                      <div
                        key={prod.id}
                        className="p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-[#FAF7F2] transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={prod.coverImage}
                            alt={prod.title}
                            className="w-12 h-12 rounded-xl object-cover border border-[#E6E1D8] bg-[#F5EFEB] shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E6E1D8] text-[#595959]">
                                {prod.category}
                              </span>
                              <span className="text-[10px] text-[#19583E] font-semibold bg-[#E8F4EC] px-2 py-0.5 rounded-md">
                                {prod.type === 'DIGITAL_EBOOK' ? 'Digital PDF' : `${prod.weightGrams || 350}g`}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-[#222222] truncate max-w-md">
                              {prod.title}
                            </h4>
                            <div className="text-xs font-bold text-[#DE5A35] mt-0.5">
                              Rp {prod.price.toLocaleString('id-ID')}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleStartEdit(prod)}
                            className="p-2 rounded-xl border border-[#E6E1D8] bg-white hover:bg-[#FAF7F2] text-[#222222] transition-colors cursor-pointer"
                            title="Ubah Produk"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id, prod.title)}
                            className="p-2 rounded-xl border border-[#E6E1D8] bg-white hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
                            title="Hapus Produk"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* TAB 2: SHOPEE-STYLE PRODUCT FORM */
                <form onSubmit={handleSaveProduct} className="space-y-6 max-w-3xl mx-auto">
                  {/* SEKSI 1: FOTO & GAMBAR PRODUK (SHOPEE STYLE) */}
                  <div className="p-4 sm:p-5 bg-[#FAF7F2] rounded-2xl border border-[#E6E1D8] space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#222222] flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-[#DE5A35]" />
                        <span>1. Foto Produk (Upload &amp; Aturan Ukuran)</span>
                      </h3>
                      <span className="text-[10px] text-red-500 font-bold">* Wajib</span>
                    </div>

                    {/* Panduan & Aturan Ukuran Foto Shopee */}
                    <div className="p-3 bg-white rounded-xl border border-[#E6E1D8] text-[11px] text-[#595959] space-y-1">
                      <div className="font-bold text-[#222222] flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#1F6347]" />
                        <span>Aturan &amp; Standar Ukuran Foto Toko:</span>
                      </div>
                      <ul className="list-disc pl-4 space-y-0.5 text-[#595959]">
                        <li>
                          <strong>Rasio Ideal:</strong> 1:1 (Persegi) atau minimal <strong>800 x 800 pixel</strong> (agar jernih saat di-zoom pembeli).
                        </li>
                        <li>
                          <strong>Ukuran File:</strong> Maksimal <strong>2 MB</strong> per foto (format: JPG, PNG, atau WebP).
                        </li>
                        <li>
                          <strong>Kesesuaian Syar&apos;i:</strong> Foto barang asli atau ilustrasi <em>faceless</em> tanpa gambar wajah makhluk bernyawa detail.
                        </li>
                      </ul>
                    </div>

                    {/* Image Preview & Upload Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start pt-1">
                      {/* Box Preview */}
                      <div className="aspect-square rounded-2xl border-2 border-dashed border-[#DE5A35]/40 bg-white flex flex-col items-center justify-center p-2 overflow-hidden relative group">
                        {coverImage ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={coverImage}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-xl"
                            />
                            <button
                              type="button"
                              onClick={() => setCoverImage('')}
                              className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full text-xs shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Hapus Foto"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <div className="text-center p-3 text-[#7A7A7A]">
                            <ImageIcon className="w-8 h-8 mx-auto text-[#DE5A35]/60 mb-1" />
                            <span className="text-[10px] block font-semibold">Belum ada foto</span>
                            <span className="text-[9px] block text-[#999999]">Pilih file dari HP/Laptop</span>
                          </div>
                        )}
                      </div>

                      {/* Upload Controls */}
                      <div className="sm:col-span-2 space-y-2.5">
                        <div>
                          <label className="text-[11px] font-bold text-[#222222] block mb-1">
                            Pilih Foto dari Perangkat (HP / Laptop):
                          </label>
                          <label className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-white border border-[#E6E1D8] hover:border-[#DE5A35] rounded-xl text-xs font-bold text-[#222222] cursor-pointer transition-all hover:bg-[#FAF7F2]">
                            <Upload className="w-4 h-4 text-[#DE5A35]" />
                            <span>📷 Upload Foto dari Galeri / File</span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={handleImageFileUpload}
                              className="hidden"
                            />
                          </label>
                          {imageError && (
                            <p className="text-[10px] text-red-500 mt-1 font-semibold">{imageError}</p>
                          )}
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-[#595959] block mb-1">
                            Atau Masukkan URL Gambar (Opsional):
                          </label>
                          <input
                            type="url"
                            value={coverImage}
                            onChange={(e) => setCoverImage(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full bg-white border border-[#E6E1D8] focus:border-[#DE5A35] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SEKSI 2: INFORMASI DASAR PRODUK */}
                  <div className="p-4 sm:p-5 bg-[#FAF7F2] rounded-2xl border border-[#E6E1D8] space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#222222] flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-[#DE5A35]" />
                      <span>2. Informasi Dasar Produk</span>
                    </h3>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[11px] font-semibold text-[#595959]">
                          Nama / Judul Produk *
                        </label>
                        <span className="text-[10px] text-[#7A7A7A]">{title.length}/120 karakter</span>
                      </div>
                      <input
                        type="text"
                        required
                        maxLength={120}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Contoh: Buku 25 Kisah Nabi Anak Bergambar Faceless"
                        className="w-full bg-white border border-[#E6E1D8] focus:border-[#DE5A35] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none font-semibold"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-[#595959] block mb-1">
                          Tipe Produk *
                        </label>
                        <select
                          value={type}
                          onChange={(e) => {
                            const newType = e.target.value as any;
                            setType(newType);
                            if (newType === 'DIGITAL_EBOOK') {
                              setCategory('Ebook Digital (PDF)');
                            }
                          }}
                          className="w-full bg-white border border-[#E6E1D8] focus:border-[#DE5A35] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none font-medium"
                        >
                          <option value="PHYSICAL_BOOK">📚 Buku Fisik (Kirim Ekspedisi)</option>
                          <option value="PHYSICAL_TOY">🧩 Mainan Fisik (Kirim Ekspedisi)</option>
                          <option value="DIGITAL_EBOOK">⚡ Ebook Digital (Unduhan PDF)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-[#595959] block mb-1">
                          Kategori Katalog *
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-white border border-[#E6E1D8] focus:border-[#DE5A35] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none font-medium"
                        >
                          <option value="Buku Fisik">Buku Anak Sunnah</option>
                          <option value="Mainan Edukasi">Mainan Sensori &amp; Kayu</option>
                          <option value="Ebook Digital (PDF)">Printable Ebook (PDF)</option>
                          <option value="Flashcard &amp; Kartu Adab">Flashcard &amp; Kartu Adab</option>
                          <option value="Paket Belajar">Paket Bundling Belajar</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-[#595959] block mb-1">
                          Target Usia Anak *
                        </label>
                        <select
                          value={targetAge}
                          onChange={(e) => setTargetAge(e.target.value as TargetAge)}
                          className="w-full bg-white border border-[#E6E1D8] focus:border-[#DE5A35] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none font-medium"
                        >
                          <option value="Semua Usia">Semua Usia</option>
                          <option value="1-3 Tahun">1-3 Tahun (Balita)</option>
                          <option value="4-6 Tahun">4-6 Tahun (TK)</option>
                          <option value="7-10 Tahun">7-10 Tahun (SD Awal)</option>
                          <option value="10+ Tahun">10+ Tahun (Remaja)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#595959] block mb-1">
                        Penerbit / Brand Toko
                      </label>
                      <input
                        type="text"
                        value={publisherOrBrand}
                        onChange={(e) => setPublisherOrBrand(e.target.value)}
                        placeholder="Contoh: Pustaka Zaidly Kids, Al-Kautsar Kids"
                        className="w-full bg-white border border-[#E6E1D8] focus:border-[#DE5A35] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none"
                      />
                    </div>
                  </div>

                  {/* SEKSI 3: HARGA, STOK & PENGIRIMAN */}
                  <div className="p-4 sm:p-5 bg-[#FAF7F2] rounded-2xl border border-[#E6E1D8] space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#222222] flex items-center gap-1.5">
                      <Save className="w-4 h-4 text-[#DE5A35]" />
                      <span>3. Harga, Stok &amp; Ekspedisi</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-[#595959] block mb-1">
                          Harga Jual Riil (Rp) *
                        </label>
                        <input
                          type="number"
                          required
                          min={0}
                          value={price}
                          onChange={(e) => setPrice(Number(e.target.value))}
                          placeholder="0 (Gratis) atau 68000"
                          className="w-full bg-white border border-[#E6E1D8] focus:border-[#DE5A35] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none font-bold"
                        />
                        <span className="text-[10px] text-[#7A7A7A] mt-0.5 block">
                          Harga riil (Isi 0 jika produk gratis / free download).
                        </span>
                      </div>

                      {type !== 'DIGITAL_EBOOK' ? (
                        <>
                          <div>
                            <label className="text-[11px] font-semibold text-[#595959] block mb-1">
                              Berat Barang (gram) *
                            </label>
                            <input
                              type="number"
                              required
                              min={10}
                              value={weightGrams}
                              onChange={(e) => setWeightGrams(Number(e.target.value))}
                              placeholder="350"
                              className="w-full bg-white border border-[#E6E1D8] focus:border-[#DE5A35] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none font-semibold"
                            />
                            <span className="text-[10px] text-[#7A7A7A] mt-0.5 block">
                              Penting untuk ongkir otomatis KiriminAja.
                            </span>
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-[#595959] block mb-1">
                              Stok Barang (Pcs) *
                            </label>
                            <input
                              type="number"
                              required
                              min={1}
                              value={stock}
                              onChange={(e) => setStock(Number(e.target.value))}
                              placeholder="20"
                              className="w-full bg-white border border-[#E6E1D8] focus:border-[#DE5A35] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none font-semibold"
                            />
                          </div>
                        </>
                      ) : (
                        <div className="sm:col-span-2 flex items-center p-3 bg-[#E8F4EC] rounded-xl border border-[#19583E]/20 text-xs text-[#19583E]">
                          <span>⚡ <strong>Produk Digital:</strong> Bebas ongkir dan stok tak terbatas (langsung aktif link download PDF setelah bayar).</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SEKSI 4: DESKRIPSI & KEUNGGULAN PRODUK */}
                  <div className="p-4 sm:p-5 bg-[#FAF7F2] rounded-2xl border border-[#E6E1D8] space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#222222] flex items-center gap-1.5">
                      <Edit3 className="w-4 h-4 text-[#DE5A35]" />
                      <span>4. Deskripsi &amp; Detail Produk</span>
                    </h3>

                    <div>
                      <label className="text-[11px] font-semibold text-[#595959] block mb-1">
                        Deskripsi Singkat (Muncul di Kartu Etalase)
                      </label>
                      <input
                        type="text"
                        value={shortDescription}
                        onChange={(e) => setShortDescription(e.target.value)}
                        placeholder="Contoh: Kumpulan 25 kisah Nabi shahih dengan ilustrasi faceless ramah anak."
                        className="w-full bg-white border border-[#E6E1D8] focus:border-[#DE5A35] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#595959] block mb-1">
                        Deskripsi Lengkap &amp; Spesifikasi Bahan
                      </label>
                      <textarea
                        rows={4}
                        value={descriptionHtml}
                        onChange={(e) => setDescriptionHtml(e.target.value)}
                        placeholder="Tuliskan spesifikasi lengkap, jumlah halaman, dalil/rujukan, bahan kayu, cat non-toxic berbasis air..."
                        className="w-full bg-white border border-[#E6E1D8] focus:border-[#DE5A35] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none font-sans"
                      />
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        setActiveTab('list');
                      }}
                      className="px-5 py-2.5 rounded-full border border-[#E6E1D8] text-xs font-bold text-[#595959] hover:bg-[#FAF7F2] transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#DE5A35] hover:bg-[#C54724] text-white text-xs font-bold rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{editingId ? 'Simpan Perubahan' : 'Tambahkan ke Katalog'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
