'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product, TargetAge } from '@/types';
import { INITIAL_PRODUCTS } from '@/data/mockData';
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
  LogOut,
  Mail,
  KeyRound,
  ShieldCheck,
  ExternalLink,
  BookOpen,
  Loader2,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function AdminPage() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('ahmadzaid.simetri@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Products State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [activeTab, setActiveTab] = useState<'list' | 'form'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form States (Shopee-Style)
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

  // 1. Check Server Session on Mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/me');
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          setAdminEmail(data.user?.email || 'ahmadzaid.simetri@gmail.com');
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Session check error:', err);
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    }

    checkAuth();

    // Load persisted products
    try {
      const saved = localStorage.getItem('zaidly_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLogin(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setAdminEmail(data.user?.email);
      } else {
        setLoginError(data.message || 'Email atau password salah!');
      }
    } catch {
      setLoginError('Terjadi kesalahan jaringan. Coba lagi.');
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
    setIsAuthenticated(false);
    setLoginPassword('');
  };

  const saveProductsList = (newList: Product[]) => {
    setProducts(newList);
    try {
      localStorage.setItem('zaidly_products', JSON.stringify(newList));
    } catch (e) {
      console.error(e);
    }
  };

  // Handle direct file upload from device
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setImageError('Ukuran file foto melebihi 2 MB. Harap pilih foto dengan ukuran maksimal 2 MB.');
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
      saveProductsList(updated);
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
      price: Number(price) || 10000,
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

    saveProductsList(updatedList);
    setActiveTab('list');
    resetForm();
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Loading State
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#DE5A35] animate-spin" />
          <p className="text-xs font-semibold text-[#595959]">Memverifikasi sesi keamanan server...</p>
        </div>
      </div>
    );
  }

  // LOGIN SCREEN (If not authenticated)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#DE5A35] text-white flex items-center justify-center mx-auto shadow-md mb-3">
            <BookOpen className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold font-serif-title text-[#222222]">
            Portal Pengelola Toko Zaidly
          </h1>
          <p className="mt-1.5 text-xs text-[#595959]">
            Login resmi sisi server untuk mengelola produk, stok, dan ekspedisi.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
          <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-[#E6E1D8]">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#222222] block mb-1">
                  Email Admin Toko
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#7A7A7A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full bg-[#FAF7F2] border border-[#E6E1D8] focus:border-[#DE5A35] rounded-xl py-2.5 pl-10 pr-3 text-xs text-[#222222] outline-none font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#222222] block mb-1">
                  Password Rahasia Admin
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#7A7A7A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Masukkan password admin..."
                    className="w-full bg-[#FAF7F2] border border-[#E6E1D8] focus:border-[#DE5A35] rounded-xl py-2.5 pl-10 pr-3 text-xs text-[#222222] outline-none font-semibold"
                  />
                </div>
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmittingLogin}
                className="w-full py-3 bg-[#1F6347] hover:bg-[#164E36] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isSubmittingLogin ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Masuk ke Panel Pengelola</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <Link
                  href="/"
                  className="text-xs text-[#7A7A7A] hover:text-[#DE5A35] transition-colors"
                >
                  ← Kembali ke Beranda Toko Publik
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  const countPhysical = products.filter((p) => p.type !== 'DIGITAL_EBOOK').length;
  const countDigital = products.filter((p) => p.type === 'DIGITAL_EBOOK').length;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#222222] flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E6E1D8] shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#DE5A35] text-white flex items-center justify-center font-bold text-lg shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#19583E] bg-[#E8F4EC] px-2 py-0.5 rounded-full uppercase">
                  Panel Admin Toko
                </span>
                <span className="text-xs font-bold text-[#222222]">toko.zaidly.com</span>
              </div>
              <p className="text-[11px] text-[#7A7A7A]">Admin: {adminEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#595959] hover:text-[#DE5A35] rounded-xl border border-[#E6E1D8] bg-white transition-colors"
            >
              <span>Lihat Toko Publik</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl border border-red-200 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-[#E6E1D8] shadow-2xs">
            <span className="text-[11px] font-semibold text-[#7A7A7A] block">Total Produk Aktif</span>
            <span className="text-2xl font-bold font-serif-title text-[#222222] mt-1 block">
              {products.length}
            </span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#E6E1D8] shadow-2xs">
            <span className="text-[11px] font-semibold text-[#7A7A7A] block">Buku & Mainan Fisik</span>
            <span className="text-2xl font-bold font-serif-title text-[#1F6347] mt-1 block">
              {countPhysical}
            </span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#E6E1D8] shadow-2xs">
            <span className="text-[11px] font-semibold text-[#7A7A7A] block">Ebook Digital (PDF)</span>
            <span className="text-2xl font-bold font-serif-title text-[#DE5A35] mt-1 block">
              {countDigital}
            </span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#E6E1D8] shadow-2xs">
            <span className="text-[11px] font-semibold text-[#7A7A7A] block">Status Keamanan</span>
            <span className="text-xs font-bold text-[#19583E] bg-[#E8F4EC] px-2 py-1 rounded-lg mt-2 inline-block">
              ✓ Server Session Aktif
            </span>
          </div>
        </div>

        {/* Dashboard Tabs & Actions */}
        <div className="bg-white rounded-3xl border border-[#E6E1D8] shadow-sm overflow-hidden">
          <div className="flex border-b border-[#E6E1D8] px-4 sm:px-6 bg-[#FAF7F2]/60">
            <button
              onClick={() => setActiveTab('list')}
              className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'list'
                  ? 'border-[#DE5A35] text-[#DE5A35]'
                  : 'border-transparent text-[#7A7A7A] hover:text-[#222222]'
              }`}
            >
              📦 Daftar Produk ({products.length})
            </button>
            <button
              onClick={handleStartAdd}
              className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'form' && !editingId
                  ? 'border-[#DE5A35] text-[#DE5A35]'
                  : 'border-transparent text-[#7A7A7A] hover:text-[#222222]'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Tambah Produk Baru (Format Shopee)</span>
            </button>
            {editingId && activeTab === 'form' && (
              <span className="py-3.5 px-4 text-xs font-bold border-b-2 border-[#DE5A35] text-[#DE5A35]">
                ✏️ Edit Produk
              </span>
            )}
          </div>

          {/* Success Notification */}
          {successMessage && (
            <div className="mx-6 mt-4 p-3 bg-[#E8F4EC] border border-[#19583E]/20 text-[#19583E] text-xs font-semibold rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="p-4 sm:p-6">
            {activeTab === 'list' ? (
              /* TAB 1: PRODUCT LIST */
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-1">
                  <p className="text-xs text-[#7A7A7A]">
                    Daftar produk yang tayang di etalase toko.zaidly.com:
                  </p>
                  <button
                    onClick={handleStartAdd}
                    className="px-4 py-2 bg-[#DE5A35] hover:bg-[#C54724] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Produk Baru</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 divide-y divide-[#F0ECE1] border border-[#E6E1D8] rounded-2xl overflow-hidden bg-white">
                  {products.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-4 flex items-center justify-between gap-3 hover:bg-[#FAF7F2] transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={prod.coverImage}
                          alt={prod.title}
                          className="w-14 h-14 rounded-xl object-cover border border-[#E6E1D8] bg-[#F5EFEB] shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E6E1D8] text-[#595959]">
                              {prod.category}
                            </span>
                            <span className="text-[10px] text-[#19583E] font-semibold bg-[#E8F4EC] px-2 py-0.5 rounded-md">
                              {prod.type === 'DIGITAL_EBOOK' ? '⚡ Ebook PDF' : `📦 ${prod.weightGrams || 350}g`}
                            </span>
                            <span className="text-[10px] text-[#7A7A7A]">
                              Usia: {prod.targetAge}
                            </span>
                          </div>
                          <h3 className="text-xs sm:text-sm font-bold text-[#222222] truncate max-w-lg">
                            {prod.title}
                          </h3>
                          <div className="text-xs font-bold text-[#DE5A35] mt-0.5">
                            Rp {prod.price.toLocaleString('id-ID')}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleStartEdit(prod)}
                          className="p-2.5 rounded-xl border border-[#E6E1D8] bg-white hover:bg-[#FAF7F2] text-[#222222] transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                          title="Ubah Produk"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Ubah</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.title)}
                          className="p-2.5 rounded-xl border border-[#E6E1D8] bg-white hover:bg-red-50 text-red-600 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Hapus</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* TAB 2: SHOPEE-STYLE PRODUCT FORM */
              <form onSubmit={handleSaveProduct} className="space-y-6 max-w-3xl mx-auto">
                {/* 1. FOTO PRODUK */}
                <div className="p-5 bg-[#FAF7F2] rounded-2xl border border-[#E6E1D8] space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#222222] flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#DE5A35]" />
                      <span>1. Foto Produk (Upload &amp; Aturan Ukuran)</span>
                    </h3>
                    <span className="text-[10px] text-red-500 font-bold">* Wajib</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#E6E1D8] text-[11px] text-[#595959] space-y-1">
                    <div className="font-bold text-[#222222] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#1F6347]" />
                      <span>Aturan &amp; Standar Ukuran Foto Toko:</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-0.5 text-[#595959]">
                      <li>
                        <strong>Rasio Ideal:</strong> 1:1 (Persegi) atau minimal <strong>800 x 800 pixel</strong>.
                      </li>
                      <li>
                        <strong>Ukuran File:</strong> Maksimal <strong>2 MB</strong> per foto (format: JPG, PNG, atau WebP).
                      </li>
                      <li>
                        <strong>Kesesuaian Syar&apos;i:</strong> Foto barang asli atau ilustrasi <em>faceless</em> tanpa wajah makhluk bernyawa detail.
                      </li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start pt-1">
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

                {/* 2. INFORMASI DASAR PRODUK */}
                <div className="p-5 bg-[#FAF7F2] rounded-2xl border border-[#E6E1D8] space-y-3">
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
                      placeholder="Contoh: Pustaka Zaidly Kids"
                      className="w-full bg-white border border-[#E6E1D8] focus:border-[#DE5A35] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none"
                    />
                  </div>
                </div>

                {/* 3. HARGA, STOK & EKSPEDISI */}
                <div className="p-5 bg-[#FAF7F2] rounded-2xl border border-[#E6E1D8] space-y-3">
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
                        min={1000}
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        placeholder="68000"
                        className="w-full bg-white border border-[#E6E1D8] focus:border-[#DE5A35] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none font-bold"
                      />
                      <span className="text-[10px] text-[#7A7A7A] mt-0.5 block">
                        Harga jujur tunggal (tanpa manipulasi harga coret).
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
                            Penting untuk hitung ongkir otomatis KiriminAja.
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
                        <span>⚡ <strong>Produk Digital:</strong> Bebas ongkir &amp; langsung aktif link unduhan file PDF.</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. DESKRIPSI & SPESIFIKASI */}
                <div className="p-5 bg-[#FAF7F2] rounded-2xl border border-[#E6E1D8] space-y-3">
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
        </div>
      </main>
    </div>
  );
}
