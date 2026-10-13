'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product, TargetAge, BlogPost } from '@/types';
import { INITIAL_PRODUCTS, INITIAL_BLOG_POSTS } from '@/data/mockData';
import { generateSlug, calculateReadTime, markdownToHtml } from '@/lib/markdownUtils';
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
  Video,
  Film,
  Play,
  Star,
  Link as LinkIcon,
  FileText,
  Eye,
  EyeOff,
  Search,
  Tag,
  Calendar,
  Clock,
  User,
  Quote,
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  ListOrdered,
  Globe,
  Share2,
  Sparkles,
} from 'lucide-react';
import { isYouTubeUrl, getYouTubeEmbedUrl } from '@/lib/mediaUtils';

export default function AdminPage() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');

  // Top Section Switcher: Produk vs Blog
  const [adminSection, setAdminSection] = useState<'products' | 'blogs'>('products');

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('ahmadzaid.simetri@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Products State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [activeTab, setActiveTab] = useState<'list' | 'form'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form States (Shopee-Style Product)
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('Buku Fisik');
  const [type, setType] = useState<'PHYSICAL_BOOK' | 'DIGITAL_EBOOK' | 'PHYSICAL_TOY'>('PHYSICAL_BOOK');
  const [price, setPrice] = useState<number>(50000);
  const [stock, setStock] = useState<number>(20);
  const [weightGrams, setWeightGrams] = useState<number>(350);

  // Photos & Gallery States (Multi-photos, min 5 recommended)
  const [coverImage, setCoverImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [imageError, setImageError] = useState('');

  // Video States (Max 30s or YouTube)
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [videoError, setVideoError] = useState('');
  const [isCheckingVideo, setIsCheckingVideo] = useState(false);

  const [publisherOrBrand, setPublisherOrBrand] = useState('Pustaka Zaidly Kids');
  const [targetAge, setTargetAge] = useState<TargetAge>('4-6 Tahun');
  const [shortDescription, setShortDescription] = useState('');
  const [descriptionHtml, setDescriptionHtml] = useState('');
  const [ebookFile, setEbookFile] = useState<File | null>(null);
  const [mayarDeliveryUrl, setMayarDeliveryUrl] = useState('');
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // ==========================================
  // BLOG POSTS STATE & CMS (WORDPRESS STYLE)
  // ==========================================
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
  const [blogTab, setBlogTab] = useState<'list' | 'form'>('list');
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogSearch, setBlogSearch] = useState('');

  // Blog Form States
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSlug, setBlogSlug] = useState('');
  const [blogCategory, setBlogCategory] = useState('Parenting Sunnah');
  const [blogAuthor, setBlogAuthor] = useState('Tim Edukasi Zaidly');
  const [blogDate, setBlogDate] = useState('13 Oktober 2026');
  const [blogReadTime, setBlogReadTime] = useState('4 menit baca');
  const [blogCoverImage, setBlogCoverImage] = useState('');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogTags, setBlogTags] = useState('Parenting, Sunnah, Edukasi Anak');
  const [blogFocusKeyword, setBlogFocusKeyword] = useState('parenting sunnah');
  const [blogEditorMode, setBlogEditorMode] = useState<'write' | 'preview'>('write');
  const [blogImageError, setBlogImageError] = useState('');

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

    Promise.all([fetch('/api/products').then((r) => r.json()), fetch('/api/blogs').then((r) => r.json())])
      .then(([catalog, blog]) => {
        if (Array.isArray(catalog.products)) setProducts(catalog.products);
        if (Array.isArray(blog.posts)) setBlogPosts(blog.posts);
      }).catch(console.error);
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

  const saveProductToServer = async (product: Product) => {
    const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(product) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Produk gagal disimpan.');
    setProducts((current) => [product, ...current.filter((item) => item.id !== product.id)]);
  };

  const saveBlogToServer = async (post: BlogPost) => {
    const res = await fetch('/api/blogs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(post) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Artikel gagal disimpan.');
    setBlogPosts((current) => [post, ...current.filter((item) => item.id !== post.id)]);
  };

  // ==========================================
  // PRODUCT HANDLERS (MULTI-PHOTO & 30S VIDEO)
  // ==========================================
  const handleMultipleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setImageError('');
    const newFiles = Array.from(files);
    const maxFileSize = 3 * 1024 * 1024; // 3 MB per foto

    newFiles.forEach((file) => {
      if (file.size > maxFileSize) {
        setImageError(`File "${file.name}" melebihi 3 MB. Harap kompres ukuran foto Anda.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setGalleryImages((prev) => {
            if (prev.includes(dataUrl)) return prev;
            const updated = [...prev, dataUrl];
            if (!coverImage) {
              setCoverImage(dataUrl);
            }
            return updated;
          });
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleAddImageUrl = () => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      setImageError('URL gambar harus diawali dengan https:// atau http://');
      return;
    }
    setImageError('');
    setGalleryImages((prev) => {
      if (prev.includes(trimmed)) return prev;
      const updated = [...prev, trimmed];
      if (!coverImage) {
        setCoverImage(trimmed);
      }
      return updated;
    });
    setNewImageUrl('');
  };

  const handleSetAsCover = (img: string) => {
    setCoverImage(img);
    setGalleryImages((prev) => {
      const filtered = prev.filter((item) => item !== img);
      return [img, ...filtered];
    });
  };

  const handleRemoveImage = (index: number) => {
    setGalleryImages((prev) => {
      const removed = prev[index];
      const next = prev.filter((_, i) => i !== index);
      if (removed === coverImage) {
        setCoverImage(next[0] || '');
      }
      return next;
    });
  };

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoError('');
    setIsCheckingVideo(true);

    if (file.size > 25 * 1024 * 1024) {
      setVideoError('Ukuran file video melebihi 25 MB. Harap kompres video atau gunakan tautan link YouTube.');
      setIsCheckingVideo(false);
      e.target.value = '';
      return;
    }

    const videoEl = document.createElement('video');
    videoEl.preload = 'metadata';
    const tempBlobUrl = URL.createObjectURL(file);
    videoEl.src = tempBlobUrl;

    videoEl.onloadedmetadata = () => {
      URL.revokeObjectURL(tempBlobUrl);
      const dur = videoEl.duration;
      setIsCheckingVideo(false);

      if (dur > 30.5) {
        setVideoError(
          `❌ Durasi video melebihi batas 30 detik (terdeteksi: ${Math.round(dur)} detik). Silakan potong/pangkas video menjadi maksimal 30 detik sebelum diunggah.`
        );
        return;
      }

      setVideoDuration(dur);
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setVideoUrl(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    };

    videoEl.onerror = () => {
      URL.revokeObjectURL(tempBlobUrl);
      setIsCheckingVideo(false);
      setVideoError('Gagal membaca video. Pastikan format file adalah MP4 atau WebM.');
    };

    e.target.value = '';
  };

  const handleRemoveVideo = () => {
    setVideoUrl('');
    setVideoDuration(null);
    setVideoError('');
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
    setGalleryImages([]);
    setNewImageUrl('');
    setImageError('');
    setVideoUrl('');
    setVideoDuration(null);
    setVideoError('');
    setPublisherOrBrand('Pustaka Zaidly Kids');
    setTargetAge('4-6 Tahun');
    setShortDescription('');
    setDescriptionHtml('');
    setEbookFile(null);
    setMayarDeliveryUrl('');
    setUploadStatusText('');
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
    const existingGallery = Array.isArray(prod.galleryImages) && prod.galleryImages.length > 0
      ? prod.galleryImages
      : (prod.coverImage ? [prod.coverImage] : []);
    setGalleryImages(existingGallery);
    setNewImageUrl('');
    setImageError('');
    setVideoUrl(prod.videoUrl || '');
    setVideoDuration(prod.videoDurationSec || null);
    setVideoError('');
    setPublisherOrBrand(prod.publisherOrBrand);
    setTargetAge(prod.targetAge);
    setShortDescription(prod.shortDescription);
    setDescriptionHtml(prod.descriptionHtml);
    setActiveTab('form');
  };

  const handleDeleteProduct = async (id: string, prodTitle: string) => {
    if (confirm(`Yakin ingin menghapus produk "${prodTitle}" dari katalog toko?`)) {
      const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) return alert('Produk gagal dihapus dari server.');
      setProducts((current) => current.filter((p) => p.id !== id));
      setSuccessMessage(`Produk "${prodTitle}" berhasil dihapus.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Judul produk wajib diisi.');
      return;
    }

    const defaultImg =
      coverImage.trim() ||
      galleryImages[0] ||
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';

    let finalGallery = [...galleryImages];
    if (coverImage.trim() && !finalGallery.includes(coverImage.trim())) {
      finalGallery.unshift(coverImage.trim());
    }
    if (finalGallery.length === 0) {
      finalGallery = [defaultImg];
    }
    const finalCover = coverImage.trim() || finalGallery[0];
    finalGallery = [finalCover, ...finalGallery.filter((img) => img !== finalCover)];

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
      coverImage: finalCover,
      galleryImages: finalGallery,
      videoUrl: videoUrl.trim() || undefined,
      videoDurationSec: videoDuration ? Math.round(videoDuration) : undefined,
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

    setIsSavingProduct(true);
    setUploadStatusText('Menyimpan informasi produk...');

    try {
      await saveProductToServer(newProd);
      if (newProd.type === 'DIGITAL_EBOOK' && ebookFile) {
        const sizeMb = (ebookFile.size / (1024 * 1024)).toFixed(1);
        setUploadStatusText(`Mengunggah berkas PDF ke Cloudflare R2 (${sizeMb} MB)...`);

        const formData = new FormData();
        formData.append('file', ebookFile);
        formData.append('productId', newProd.id);
        if (mayarDeliveryUrl.trim()) {
          formData.append('mayarDeliveryUrl', mayarDeliveryUrl.trim());
        }

        const uploadRes = await fetch('/api/admin/ebooks', {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadRes.json().catch(() => ({}));
        if (!uploadRes.ok) {
          throw new Error(uploadData.error || 'Upload PDF ke Cloudflare R2 gagal.');
        }
      }

      if (editingId) {
        setSuccessMessage('Produk berhasil diperbarui!');
      } else {
        setSuccessMessage('Produk baru berhasil ditambahkan!');
      }

      setActiveTab('list');
      resetForm();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Produk gagal disimpan.');
    } finally {
      setIsSavingProduct(false);
      setUploadStatusText('');
    }
  };

  // ==========================================
  // BLOG POST HANDLERS (WORDPRESS STYLE & SEO)
  // ==========================================
  const handleBlogCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setBlogImageError('Ukuran file foto melebihi 3 MB. Harap kompres ukuran foto Anda.');
      return;
    }
    setBlogImageError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setBlogCoverImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const insertMarkdown = (prefix: string, suffix: string = '', defaultText: string = '') => {
    setBlogContent((prev) => {
      const needsLeadingNewline = prev.length > 0 && !prev.endsWith('\n');
      return prev + (needsLeadingNewline ? '\n\n' : '') + prefix + defaultText + suffix;
    });
  };

  const resetBlogForm = () => {
    setEditingBlogId(null);
    setBlogTitle('');
    setBlogSlug('');
    setBlogCategory('Parenting Sunnah');
    setBlogAuthor('Tim Edukasi Zaidly');
    setBlogDate('13 Oktober 2026');
    setBlogReadTime('4 menit baca');
    setBlogCoverImage('');
    setBlogExcerpt('');
    setBlogContent('');
    setBlogTags('Parenting, Sunnah, Edukasi Anak');
    setBlogFocusKeyword('parenting sunnah');
    setBlogEditorMode('write');
    setBlogImageError('');
  };

  const handleStartAddBlog = () => {
    resetBlogForm();
    setBlogTab('form');
  };

  const handleStartEditBlog = (post: BlogPost) => {
    setEditingBlogId(post.id);
    setBlogTitle(post.title);
    setBlogSlug(post.slug);
    setBlogCategory(post.category);
    setBlogAuthor(post.author);
    setBlogDate(post.date);
    setBlogReadTime(post.readTime);
    setBlogCoverImage(post.coverImage);
    setBlogExcerpt(post.excerpt);
    setBlogContent(post.contentHtml);
    setBlogTags(Array.isArray(post.tags) ? post.tags.join(', ') : '');
    setBlogFocusKeyword(post.tags?.[0] || 'parenting sunnah');
    setBlogEditorMode('write');
    setBlogImageError('');
    setBlogTab('form');
  };

  const handleDeleteBlog = async (id: string, postTitle: string) => {
    if (confirm(`Yakin ingin menghapus artikel "${postTitle}" dari blog toko?`)) {
      const res = await fetch(`/api/blogs?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) return alert('Artikel gagal dihapus dari server.');
      setBlogPosts((current) => current.filter((b) => b.id !== id));
      setSuccessMessage(`Artikel "${postTitle}" berhasil dihapus.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!blogTitle.trim()) {
      alert('Judul artikel wajib diisi.');
      return;
    }

    if (!blogContent.trim()) {
      alert('Isi konten artikel wajib diisi.');
      return;
    }

    const defaultImg =
      blogCoverImage.trim() ||
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';

    const slug = blogSlug.trim()
      ? generateSlug(blogSlug)
      : generateSlug(blogTitle);

    const generatedHtml = markdownToHtml(blogContent);
    const calculatedRead = calculateReadTime(blogContent);
    const parsedTags = blogTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newPost: BlogPost = {
      id: editingBlogId || `blog-${Date.now()}`,
      slug: editingBlogId ? blogPosts.find((b) => b.id === editingBlogId)?.slug || slug : slug,
      title: blogTitle.trim(),
      excerpt: blogExcerpt.trim() || blogTitle.trim(),
      contentHtml: generatedHtml,
      author: blogAuthor.trim() || 'Tim Edukasi Zaidly',
      date: blogDate.trim() || '13 Oktober 2026',
      readTime: blogReadTime.trim() || calculatedRead,
      category: blogCategory.trim() || 'Parenting Sunnah',
      coverImage: defaultImg,
      tags: parsedTags.length > 0 ? parsedTags : ['Edukasi Sunnah', 'Parenting'],
    };

    if (editingBlogId) {
      setSuccessMessage('Artikel berhasil diperbarui!');
    } else {
      setSuccessMessage('Artikel baru berhasil dipublikasikan!');
    }

    try { await saveBlogToServer(newPost); } catch (error) {
      alert(error instanceof Error ? error.message : 'Artikel gagal disimpan.');
      return;
    }
    setBlogTab('list');
    resetBlogForm();
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // CHECKING AUTH SCREEN
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#DE5A35] mx-auto" />
          <p className="text-xs font-semibold text-[#595959]">Memeriksa Sesi Keamanan Admin...</p>
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
            Login resmi sisi server untuk mengelola produk, artikel blog, dan stok.
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
            <span className="text-[11px] font-semibold text-[#7A7A7A] block">Artikel Blog Sunnah</span>
            <span className="text-2xl font-bold font-serif-title text-[#1F6347] mt-1 block">
              {blogPosts.length}
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

        {/* Top Section Switcher: Produk vs Blog */}
        <div className="flex gap-2">
          <button
            onClick={() => setAdminSection('products')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              adminSection === 'products'
                ? 'bg-[#DE5A35] text-white shadow-sm'
                : 'bg-white text-[#595959] hover:bg-[#FAF7F2] border border-[#E6E1D8]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Katalog Produk ({products.length})</span>
          </button>

          <button
            onClick={() => setAdminSection('blogs')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              adminSection === 'blogs'
                ? 'bg-[#1F6347] text-white shadow-sm'
                : 'bg-white text-[#595959] hover:bg-[#FAF7F2] border border-[#E6E1D8]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Artikel Blog &amp; Edukasi Sunnah ({blogPosts.length})</span>
          </button>
        </div>

        {/* Success Notification */}
        {successMessage && (
          <div className="p-3.5 bg-[#E8F4EC] border border-[#19583E]/20 text-[#19583E] text-xs font-semibold rounded-2xl flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* SECTION 1: PRODUK (KATALOG PRODUK) */}
        {adminSection === 'products' ? (
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

            <div className="p-4 sm:p-6">
              {activeTab === 'list' ? (
                /* TAB 1: PRODUCT LIST TABLE */
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2">
                    <p className="text-xs text-[#7A7A7A]">
                      Daftar seluruh buku, mainan kayu, dan ebook printable aktif.
                    </p>
                    <button
                      onClick={handleStartAdd}
                      className="px-4 py-2 bg-[#DE5A35] hover:bg-[#C54724] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Produk Baru</span>
                    </button>
                  </div>

                  <div className="divide-y divide-[#E6E1D8] border border-[#E6E1D8] rounded-2xl overflow-hidden bg-white">
                    {products.map((prod) => (
                      <div
                        key={prod.id}
                        className="p-3.5 sm:p-4 flex items-center justify-between gap-4 hover:bg-[#FAF7F2] transition-colors"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#E6E1D8]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={prod.coverImage}
                              alt={prod.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

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
                            <div className="text-xs font-bold mt-0.5">
                              {prod.price === 0 ? (
                                <span className="inline-block text-[#1F6347] bg-[#EBF7EE] px-2 py-0.5 rounded-md text-[11px] font-black border border-[#1F6347]/20">
                                  GRATIS (Rp 0)
                                </span>
                              ) : (
                                <span className="text-[#DE5A35]">
                                  Rp {prod.price.toLocaleString('id-ID')}
                                </span>
                              )}
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
                /* TAB 2: PRODUCT FORM (SHOPEE STYLE) */
                <form onSubmit={handleSaveProduct} className="space-y-6 max-w-3xl mx-auto">
                  {/* 1. GALERI FOTO PRODUK */}
                  <div className="p-5 bg-[#FAF7F2] rounded-2xl border border-[#E6E1D8] space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#222222] flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-[#DE5A35]" />
                        <span>1. Galeri Foto Produk (Disarankan Min. 5 Foto Detail)</span>
                      </h3>
                      <span className="text-[10px] text-red-500 font-bold">* Wajib Min. 1 Foto</span>
                    </div>

                    <div className="p-3.5 bg-white rounded-xl border border-[#E6E1D8] text-[11px] text-[#595959] space-y-1.5">
                      <div className="font-bold text-[#222222] flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#1F6347]" />
                        <span>Panduan Foto Toko Zaidly Kids:</span>
                      </div>
                      <ul className="list-disc pl-4 space-y-1 text-[#595959]">
                        <li>
                          <strong>Rekomendasi Minimal 5 Foto:</strong> Unggah foto Cover Depan, Halaman Isi/Daftar Isi, Detail Tekstur/Bahan, Tampak Belakang/Sinopsis, serta Variasi/Kemasan agar pembeli puas melihat detail.
                        </li>
                        <li>
                          <strong>Bebas Tanpa Batas Maksimal:</strong> Anda dapat mengunggah berapa pun foto (opsional tanpa batas kuota foto) sesuai kebutuhan produk.
                        </li>
                        <li>
                          <strong>Standar Ukuran:</strong> Rasio 1:1 (Persegi) atau minimal <strong>800 x 800 pixel</strong> (format JPG, PNG, atau WebP, maks 3 MB per foto).
                        </li>
                        <li>
                          <strong>Kesesuaian Syar&apos;i:</strong> Foto asli atau ilustrasi <em>faceless</em> tanpa gambar wajah bernyawa detail.
                        </li>
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="text-[11px] font-bold text-[#222222] block mb-1">
                          Pilih Foto dari Perangkat (Bisa Pilih Banyak Sekaligus):
                        </label>
                        <label className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-white border border-[#E6E1D8] hover:border-[#DE5A35] rounded-xl text-xs font-bold text-[#222222] cursor-pointer transition-all hover:bg-[#FAF7F2] shadow-2xs">
                          <Upload className="w-4 h-4 text-[#DE5A35]" />
                          <span>📷 Upload Foto dari Galeri (Bisa 5+ Sekaligus)</span>
                          <input
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleMultipleImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-[#595959] block mb-1">
                          Atau Tambahkan URL Gambar (Opsional):
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="flex-1 bg-white border border-[#E6E1D8] focus:border-[#DE5A35] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleAddImageUrl}
                            className="px-3.5 py-2 bg-[#FAF7F2] hover:bg-[#DE5A35] hover:text-white border border-[#E6E1D8] rounded-xl text-xs font-bold text-[#222222] transition-colors shrink-0 cursor-pointer"
                          >
                            + Tambah
                          </button>
                        </div>
                      </div>
                    </div>

                    {imageError && (
                      <p className="text-[11px] text-red-500 font-semibold bg-red-50 p-2.5 rounded-xl border border-red-200">
                        {imageError}
                      </p>
                    )}

                    <div className="flex items-center justify-between px-3.5 py-2.5 bg-white rounded-xl border border-[#E6E1D8] text-xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-[#222222]">
                          Total Foto: {galleryImages.length} Foto
                        </span>
                        {galleryImages.length >= 5 ? (
                          <span className="text-[10px] font-bold text-[#19583E] bg-[#E8F4EC] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>Sudah Memenuhi Rekomendasi 5+ Foto</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                            💡 Tambahkan {Math.max(0, 5 - galleryImages.length)} foto lagi untuk hasil detail maksimal
                          </span>
                        )}
                      </div>
                      {galleryImages.length > 0 && (
                        <span className="text-[10px] text-[#7A7A7A]">
                          Klik &quot;Jadikan Sampul&quot; untuk memilih foto muka utama
                        </span>
                      )}
                    </div>

                    {galleryImages.length === 0 ? (
                      <div className="p-8 border-2 border-dashed border-[#DE5A35]/30 rounded-2xl bg-white text-center space-y-2">
                        <ImageIcon className="w-10 h-10 mx-auto text-[#DE5A35]/50" />
                        <p className="text-xs font-bold text-[#222222]">
                          Belum Ada Foto Produk yang Ditambahkan
                        </p>
                        <p className="text-[11px] text-[#7A7A7A]">
                          Pilih foto dari galeri HP / laptop Anda (bisa langsung pilih 5 atau lebih sekaligus) atau masukkan URL gambar di atas.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {galleryImages.map((img, idx) => {
                          const isCover = coverImage ? img === coverImage : idx === 0;
                          return (
                            <div
                              key={idx}
                              className={`group relative aspect-square rounded-2xl overflow-hidden border-2 bg-white shadow-2xs transition-all ${
                                isCover ? 'border-[#DE5A35] ring-2 ring-[#DE5A35]/30' : 'border-[#E6E1D8] hover:border-[#DE5A35]/50'
                              }`}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={img}
                                alt={`Foto produk ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />

                              <div className="absolute top-2 left-2 z-10">
                                {isCover ? (
                                  <span className="bg-[#DE5A35] text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
                                    <Star className="w-2.5 h-2.5 fill-white" />
                                    <span>Foto Utama</span>
                                  </span>
                                ) : (
                                  <span className="bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                                    Foto #{idx + 1}
                                  </span>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="absolute top-2 right-2 z-10 p-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-full text-xs shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                title="Hapus Foto"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>

                              {!isCover && (
                                <button
                                  type="button"
                                  onClick={() => handleSetAsCover(img)}
                                  className="absolute bottom-2 inset-x-2 py-1 bg-white/95 hover:bg-white text-[#222222] hover:text-[#DE5A35] text-[10px] font-bold rounded-lg shadow-sm border border-[#E6E1D8] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-center"
                                >
                                  Jadikan Sampul
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* 2. VIDEO REVIEW PRODUK */}
                  <div className="p-5 bg-[#FAF7F2] rounded-2xl border border-[#E6E1D8] space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#222222] flex items-center gap-1.5">
                        <Film className="w-4 h-4 text-[#DE5A35]" />
                        <span>2. Video Review Produk (Maks 30 Detik atau Link YouTube)</span>
                      </h3>
                      <span className="text-[10px] text-[#7A7A7A] font-semibold bg-[#E6E1D8]/60 px-2 py-0.5 rounded-md">
                        Opsional
                      </span>
                    </div>

                    <div className="p-3.5 bg-white rounded-xl border border-[#E6E1D8] text-[11px] text-[#595959] space-y-1.5">
                      <div className="font-bold text-[#222222] flex items-center gap-1.5">
                        <Video className="w-4 h-4 text-[#DE5A35]" />
                        <span>Ketentuan Video Produk:</span>
                      </div>
                      <ul className="list-disc pl-4 space-y-1 text-[#595959]">
                        <li>
                          <strong>Link YouTube / YouTube Shorts (Sangat Disarankan):</strong> Masukkan link video YouTube produk (bebas durasi &amp; hemat kuota pengunjung tanpa membebani server).
                        </li>
                        <li>
                          <strong>Upload Video Langsung dari Perangkat:</strong> Dibatasi maksimal <strong>30 detik</strong> (format MP4/WebM, maksimal 25 MB). Sistem otomatis memvalidasi durasi video.
                        </li>
                        <li>
                          <strong>Adab Syar&apos;i:</strong> Pastikan video hening tanpa alunan musik instrumen.
                        </li>
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="text-[11px] font-bold text-[#222222] block mb-1">
                          Link YouTube / YouTube Shorts (Disarankan):
                        </label>
                        <div className="flex items-center gap-1.5 bg-white border border-[#E6E1D8] focus-within:border-[#DE5A35] rounded-xl px-3 py-2">
                          <LinkIcon className="w-3.5 h-3.5 text-[#7A7A7A] shrink-0" />
                          <input
                            type="url"
                            value={isYouTubeUrl(videoUrl) ? videoUrl : ''}
                            onChange={(e) => {
                              setVideoUrl(e.target.value);
                              setVideoDuration(null);
                              setVideoError('');
                            }}
                            placeholder="https://www.youtube.com/watch?v=... atau https://youtu.be/..."
                            className="w-full bg-transparent text-xs text-[#222222] outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-[#222222] block mb-1">
                          Atau Upload Video (Maksimal 30 Detik):
                        </label>
                        <label className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-white border border-[#E6E1D8] hover:border-[#DE5A35] rounded-xl text-xs font-bold text-[#222222] cursor-pointer transition-all hover:bg-[#FAF7F2] shadow-2xs">
                          {isCheckingVideo ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-[#DE5A35]" />
                              <span>Memeriksa Durasi Video...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 text-[#DE5A35]" />
                              <span>🎬 Upload Video (MP4 / WebM &le; 30s)</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="video/mp4,video/webm"
                            disabled={isCheckingVideo}
                            onChange={handleVideoFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {videoError && (
                      <div className="text-[11px] text-red-600 font-semibold bg-red-50 p-3 rounded-xl border border-red-200 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <span>{videoError}</span>
                      </div>
                    )}

                    {videoUrl && (
                      <div className="p-4 bg-white rounded-2xl border border-[#E6E1D8] space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-[#222222] flex items-center gap-1.5">
                              <Play className="w-3.5 h-3.5 fill-[#DE5A35] text-[#DE5A35]" />
                              <span>Preview Video Produk:</span>
                            </span>
                            {videoDuration ? (
                              <span className="text-[10px] font-bold text-[#19583E] bg-[#E8F4EC] px-2 py-0.5 rounded-full">
                                ⏱️ Durasi: {Math.round(videoDuration)} detik (Lolos Maks 30s)
                              </span>
                            ) : isYouTubeUrl(videoUrl) ? (
                              <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
                                ▶ Terhubung ke YouTube
                              </span>
                            ) : null}
                          </div>

                          <button
                            type="button"
                            onClick={handleRemoveVideo}
                            className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus Video</span>
                          </button>
                        </div>

                        <div className="aspect-video max-w-md mx-auto rounded-xl overflow-hidden bg-black border border-[#E6E1D8] relative">
                          {isYouTubeUrl(videoUrl) && getYouTubeEmbedUrl(videoUrl) ? (
                            <iframe
                              src={getYouTubeEmbedUrl(videoUrl)!}
                              title="Preview Video Produk"
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <video
                              src={videoUrl}
                              controls
                              playsInline
                              className="w-full h-full object-contain"
                            >
                              Browser tidak mendukung pemutar video.
                            </video>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3. INFORMASI DASAR PRODUK */}
                  <div className="p-5 bg-[#FAF7F2] rounded-2xl border border-[#E6E1D8] space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#222222] flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-[#DE5A35]" />
                      <span>3. Informasi Dasar Produk</span>
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

                  {/* 4. HARGA, STOK & EKSPEDISI */}
                  <div className="p-5 bg-[#FAF7F2] rounded-2xl border border-[#E6E1D8] space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#222222] flex items-center gap-1.5">
                      <Save className="w-4 h-4 text-[#DE5A35]" />
                      <span>4. Harga, Stok &amp; Ekspedisi</span>
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
                        <div className="sm:col-span-2 space-y-3 p-4 bg-[#E8F4EC] rounded-2xl border-2 border-[#19583E]/20 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#19583E] flex items-center gap-1.5">
                              <span>⚡ Unggah Berkas PDF Ebook (Cloudflare R2)</span>
                            </span>
                            <span className="text-[10px] font-bold text-[#19583E] bg-white px-2 py-0.5 rounded-full border border-[#19583E]/20">
                              Penyimpanan Privat R2
                            </span>
                          </div>
                          <p className="text-[11px] text-[#19583E]/90 leading-relaxed">
                            Berkas PDF akan diunggah langsung ke penyimpanan Cloudflare R2 privat toko Anda. Tautan unduh hanya dibuatkan secara otomatis untuk pembeli yang statusnya <strong>LUNAS (PAID)</strong> dengan masa aktif 10 menit agar aman dari penyebaran liar.
                          </p>

                          <div className="bg-white p-3.5 rounded-xl border border-[#19583E]/30 space-y-2.5">
                            <label className="text-[11px] font-bold text-[#222222] block">
                              Pilih Berkas PDF Asli (Maks. 50 MB):
                            </label>

                            {ebookFile ? (
                              <div className="flex items-center justify-between p-2.5 bg-[#FAF7F2] rounded-xl border border-[#E6E1D8]">
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="w-8 h-8 rounded-lg bg-[#DE5A35]/10 text-[#DE5A35] flex items-center justify-center shrink-0 font-bold text-[10px]">
                                    PDF
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-bold text-xs text-[#222222] truncate">
                                      {ebookFile.name}
                                    </div>
                                    <div className="text-[10px] text-[#7A7A7A]">
                                      {(ebookFile.size / (1024 * 1024)).toFixed(2)} MB • Siap diunggah ke Cloudflare R2
                                    </div>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setEbookFile(null)}
                                  className="text-[11px] font-bold text-red-600 hover:text-red-700 ml-2 shrink-0 cursor-pointer"
                                >
                                  Ganti File
                                </button>
                              </div>
                            ) : (
                              <div className="relative border-2 border-dashed border-[#19583E]/40 rounded-xl p-4 text-center hover:bg-[#FAF7F2] transition-colors cursor-pointer">
                                <input
                                  type="file"
                                  accept="application/pdf,.pdf"
                                  onChange={(e) => setEbookFile(e.target.files?.[0] || null)}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="space-y-1">
                                  <p className="text-xs font-bold text-[#19583E]">
                                    + Klik untuk Memilih Berkas PDF dari Perangkat
                                  </p>
                                  <p className="text-[10px] text-[#7A7A7A]">
                                    Format .pdf • Ukuran maksimal 50 MB
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="space-y-1 pt-1">
                            <label className="text-[10px] font-semibold text-[#595959] block">
                              Tautan Delivery Mayar (Opsional):
                            </label>
                            <input
                              type="url"
                              value={mayarDeliveryUrl}
                              onChange={(e) => setMayarDeliveryUrl(e.target.value)}
                              placeholder="https://... (Opsional jika ingin menyertakan tautan Mayar)"
                              className="w-full bg-white border border-[#19583E]/20 rounded-xl px-3 py-2 text-xs text-[#222] outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 5. DESKRIPSI & SPESIFIKASI */}
                  <div className="p-5 bg-[#FAF7F2] rounded-2xl border border-[#E6E1D8] space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#222222] flex items-center gap-1.5">
                      <Edit3 className="w-4 h-4 text-[#DE5A35]" />
                      <span>5. Deskripsi &amp; Detail Produk</span>
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
                      className="px-5 py-2.5 rounded-full border border-[#E6E1D8] text-xs font-bold text-[#595959] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingProduct}
                      className="px-6 py-2.5 bg-[#DE5A35] hover:bg-[#C54724] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {isSavingProduct ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>{uploadStatusText || 'Menyimpan...'}</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>{editingId ? 'Simpan Perubahan' : 'Tambahkan ke Katalog'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        ) : (
          /* SECTION 2: BLOG CMS (WORDPRESS & SEO STYLE) */
          <div className="bg-white rounded-3xl border border-[#E6E1D8] shadow-sm overflow-hidden">
            <div className="flex border-b border-[#E6E1D8] px-4 sm:px-6 bg-[#FAF7F2]/60">
              <button
                onClick={() => setBlogTab('list')}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  blogTab === 'list'
                    ? 'border-[#1F6347] text-[#1F6347]'
                    : 'border-transparent text-[#7A7A7A] hover:text-[#222222]'
                }`}
              >
                📝 Daftar Artikel Blog ({blogPosts.length})
              </button>
              <button
                onClick={handleStartAddBlog}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
                  blogTab === 'form' && !editingBlogId
                    ? 'border-[#1F6347] text-[#1F6347]'
                    : 'border-transparent text-[#7A7A7A] hover:text-[#222222]'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tulis Artikel Baru (Format SEO &amp; Markdown)</span>
              </button>
              {editingBlogId && blogTab === 'form' && (
                <span className="py-3.5 px-4 text-xs font-bold border-b-2 border-[#1F6347] text-[#1F6347]">
                  ✏️ Edit Artikel: {blogTitle || 'Artikel'}
                </span>
              )}
            </div>

            <div className="p-4 sm:p-6">
              {blogTab === 'list' ? (
                /* BLOG LIST VIEW */
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2">
                    <div>
                      <h3 className="text-sm font-bold text-[#222222] font-serif-title">
                        Kelola Publikasi Artikel Tarbiyah Sunnah
                      </h3>
                      <p className="text-xs text-[#7A7A7A]">
                        Artikel otomatis terindeks di mesin pencari Google dengan format SEO ramah sitemap.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="relative flex-1 sm:w-60">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]" />
                        <input
                          type="text"
                          value={blogSearch}
                          onChange={(e) => setBlogSearch(e.target.value)}
                          placeholder="Cari artikel..."
                          className="w-full pl-8.5 pr-3 py-1.5 bg-[#FAF7F2] border border-[#E6E1D8] focus:border-[#1F6347] rounded-xl text-xs text-[#222222] outline-none"
                        />
                      </div>

                      <button
                        onClick={handleStartAddBlog}
                        className="px-4 py-2 bg-[#1F6347] hover:bg-[#164E36] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tulis Artikel Baru</span>
                      </button>
                    </div>
                  </div>

                  <div className="divide-y divide-[#E6E1D8] border border-[#E6E1D8] rounded-2xl overflow-hidden bg-white">
                    {blogPosts
                      .filter((post) =>
                        blogSearch.trim() === ''
                          ? true
                          : post.title.toLowerCase().includes(blogSearch.toLowerCase()) ||
                            post.excerpt.toLowerCase().includes(blogSearch.toLowerCase())
                      )
                      .map((post) => (
                        <div
                          key={post.id}
                          className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#FAF7F2] transition-colors"
                        >
                          <div className="flex items-center gap-3.5 min-w-0 flex-1">
                            <div className="w-16 h-16 sm:w-20 sm:h-16 rounded-xl overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#E6E1D8]">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E8F4EC] text-[#19583E] border border-[#19583E]/20">
                                  {post.category}
                                </span>
                                <span className="text-[10px] text-[#7A7A7A] flex items-center gap-1">
                                  <Clock className="w-2.5 h-2.5" />
                                  <span>{post.readTime}</span>
                                </span>
                                <span className="text-[10px] text-[#7A7A7A] flex items-center gap-1">
                                  <Calendar className="w-2.5 h-2.5" />
                                  <span>{post.date}</span>
                                </span>
                              </div>

                              <h4 className="text-xs sm:text-sm font-bold text-[#222222] truncate max-w-xl">
                                {post.title}
                              </h4>
                              <p className="text-[11px] text-[#7A7A7A] truncate max-w-lg mt-0.5">
                                {post.excerpt}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              className="p-2.5 rounded-xl border border-[#E6E1D8] bg-white hover:bg-[#FAF7F2] text-[#595959] hover:text-[#DE5A35] transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                              title="Lihat Tampilan Publik"
                            >
                              <Globe className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Lihat</span>
                            </Link>

                            <button
                              onClick={() => handleStartEditBlog(post)}
                              className="p-2.5 rounded-xl border border-[#E6E1D8] bg-white hover:bg-[#FAF7F2] text-[#222222] transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                              title="Edit Artikel"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Ubah</span>
                            </button>

                            <button
                              onClick={() => handleDeleteBlog(post.id, post.title)}
                              className="p-2.5 rounded-xl border border-[#E6E1D8] bg-white hover:bg-red-50 text-red-600 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                              title="Hapus Artikel"
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
                /* BLOG FORM VIEW (WORDPRESS GUTENBERG & YOAST SEO STYLE) */
                <form onSubmit={handleSaveBlog} className="space-y-6 max-w-4xl mx-auto">
                  {/* BAGIAN 1: JUDUL & INFORMASI UTAMA */}
                  <div className="p-5 bg-[#FAF7F2] rounded-2xl border border-[#E6E1D8] space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#222222] flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-[#1F6347]" />
                        <span>1. Judul &amp; Informasi Artikel (WordPress Style)</span>
                      </h3>
                      <span className="text-[10px] text-red-500 font-bold">* Wajib</span>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#222222] block mb-1">
                        Judul Artikel Blog (H1 Google SEO) *
                      </label>
                      <input
                        type="text"
                        required
                        value={blogTitle}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBlogTitle(val);
                          if (!editingBlogId || !blogSlug) {
                            setBlogSlug(generateSlug(val));
                          }
                        }}
                        placeholder="Contoh: 5 Cara Efektif Mengajarkan Huruf Hijaiyah Tanpa Paksaan pada Balita"
                        className="w-full bg-white border border-[#E6E1D8] focus:border-[#1F6347] rounded-xl px-4 py-3 text-sm text-[#222222] outline-none font-bold"
                      />
                      <div className="flex justify-between items-center text-[10px] text-[#7A7A7A] mt-1">
                        <span>Panjang judul: {blogTitle.length} karakter</span>
                        <span className={blogTitle.length >= 40 && blogTitle.length <= 70 ? 'text-[#19583E] font-bold' : ''}>
                          {blogTitle.length >= 40 && blogTitle.length <= 70 ? '✓ Panjang judul optimal untuk Google (40-70 karakter)' : 'Saran: 40-70 karakter'}
                        </span>
                      </div>
                    </div>

                    {/* Slug & Permalinks */}
                    <div>
                      <label className="text-[11px] font-semibold text-[#595959] block mb-1">
                        Tautan Permalink / Slug URL Ramah Mesin Pencari:
                      </label>
                      <div className="flex items-center gap-1 bg-white border border-[#E6E1D8] focus-within:border-[#1F6347] rounded-xl px-3 py-2 text-xs">
                        <span className="text-[#7A7A7A] shrink-0 font-mono">toko.zaidly.com/blog/</span>
                        <input
                          type="text"
                          required
                          value={blogSlug}
                          onChange={(e) => setBlogSlug(generateSlug(e.target.value))}
                          placeholder="judul-artikel-ramah-seo"
                          className="flex-1 bg-transparent text-[#222222] outline-none font-mono font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-[#595959] block mb-1">
                          Kategori Artikel *
                        </label>
                        <select
                          value={blogCategory}
                          onChange={(e) => setBlogCategory(e.target.value)}
                          className="w-full bg-white border border-[#E6E1D8] focus:border-[#1F6347] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none font-medium"
                        >
                          <option value="Parenting Sunnah">Parenting Sunnah</option>
                          <option value="Fiqih & Adab Anak">Fiqih &amp; Adab Anak</option>
                          <option value="Edukasi Balita">Edukasi Balita</option>
                          <option value="Rujukan Fatwa Rumaysho">Rujukan Fatwa Rumaysho</option>
                          <option value="Tips Belajar Al-Qur'an">Tips Belajar Al-Qur&apos;an</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-[#595959] block mb-1">
                          Penulis / Asatidzah
                        </label>
                        <input
                          type="text"
                          value={blogAuthor}
                          onChange={(e) => setBlogAuthor(e.target.value)}
                          placeholder="Tim Edukasi Zaidly"
                          className="w-full bg-white border border-[#E6E1D8] focus:border-[#1F6347] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-[#595959] block mb-1">
                          Tanggal Publikasi
                        </label>
                        <input
                          type="text"
                          value={blogDate}
                          onChange={(e) => setBlogDate(e.target.value)}
                          placeholder="13 Oktober 2026"
                          className="w-full bg-white border border-[#E6E1D8] focus:border-[#1F6347] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* BAGIAN 2: FOTO SAMPUL ARTIKEL (FEATURED IMAGE) */}
                  <div className="p-5 bg-[#FAF7F2] rounded-2xl border border-[#E6E1D8] space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#222222] flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-[#1F6347]" />
                        <span>2. Foto Sampul Artikel (Featured Image)</span>
                      </h3>
                      <span className="text-[10px] text-red-500 font-bold">* Wajib</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
                      <div className="aspect-16/9 rounded-2xl border-2 border-dashed border-[#1F6347]/40 bg-white flex flex-col items-center justify-center p-2 overflow-hidden relative group">
                        {blogCoverImage ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={blogCoverImage}
                              alt="Cover Preview"
                              className="w-full h-full object-cover rounded-xl"
                            />
                            <button
                              type="button"
                              onClick={() => setBlogCoverImage('')}
                              className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full text-xs shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              title="Hapus Foto"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <div className="text-center p-3 text-[#7A7A7A]">
                            <ImageIcon className="w-8 h-8 mx-auto text-[#1F6347]/50 mb-1" />
                            <span className="text-[10px] block font-semibold">Belum Ada Sampul</span>
                            <span className="text-[9px] block text-[#999999]">Rasio 16:9 disarankan</span>
                          </div>
                        )}
                      </div>

                      <div className="sm:col-span-2 space-y-2.5">
                        <div>
                          <label className="text-[11px] font-bold text-[#222222] block mb-1">
                            Pilih Foto dari Perangkat (HP / Laptop):
                          </label>
                          <label className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-white border border-[#E6E1D8] hover:border-[#1F6347] rounded-xl text-xs font-bold text-[#222222] cursor-pointer transition-all hover:bg-[#FAF7F2] shadow-2xs">
                            <Upload className="w-4 h-4 text-[#1F6347]" />
                            <span>📷 Upload Sampul dari File / Galeri</span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={handleBlogCoverUpload}
                              className="hidden"
                            />
                          </label>
                          {blogImageError && (
                            <p className="text-[10px] text-red-500 mt-1 font-semibold">{blogImageError}</p>
                          )}
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-[#595959] block mb-1">
                            Atau Masukkan URL Gambar Sampul:
                          </label>
                          <input
                            type="url"
                            value={blogCoverImage}
                            onChange={(e) => setBlogCoverImage(e.target.value)}
                            placeholder="https://images.unsplash.com/photo-..."
                            className="w-full bg-white border border-[#E6E1D8] focus:border-[#1F6347] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BAGIAN 3: KONTEN ARTIKEL (MARKDOWN / HTML DENGAN LIVE PREVIEW) */}
                  <div className="p-5 bg-[#FAF7F2] rounded-2xl border border-[#E6E1D8] space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#222222] flex items-center gap-1.5">
                        <Edit3 className="w-4 h-4 text-[#1F6347]" />
                        <span>3. Konten Artikel (Bisa Paste Markdown atau Pure HTML)</span>
                      </h3>

                      {/* Mode Tulis vs Preview Switcher */}
                      <div className="flex bg-white rounded-xl border border-[#E6E1D8] p-0.5 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => setBlogEditorMode('write')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            blogEditorMode === 'write'
                              ? 'bg-[#1F6347] text-white shadow-2xs'
                              : 'text-[#7A7A7A] hover:text-[#222222]'
                          }`}
                        >
                          ✏️ Editor Markdown
                        </button>
                        <button
                          type="button"
                          onClick={() => setBlogEditorMode('preview')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            blogEditorMode === 'preview'
                              ? 'bg-[#1F6347] text-white shadow-2xs'
                              : 'text-[#7A7A7A] hover:text-[#222222]'
                          }`}
                        >
                          👁️ Live Preview
                        </button>
                      </div>
                    </div>

                    {/* WordPress Quick Format Toolbar */}
                    {blogEditorMode === 'write' && (
                      <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white rounded-xl border border-[#E6E1D8] shadow-2xs">
                        <button
                          type="button"
                          onClick={() => insertMarkdown('## ', '', 'Judul Bagian Utama')}
                          className="px-2.5 py-1 text-xs font-bold bg-[#FAF7F2] hover:bg-[#EBE4D9] rounded-lg border border-[#E6E1D8] text-[#222222] cursor-pointer"
                          title="Heading 2 (H2)"
                        >
                          H2
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('### ', '', 'Sub-Judul Bagian')}
                          className="px-2.5 py-1 text-xs font-bold bg-[#FAF7F2] hover:bg-[#EBE4D9] rounded-lg border border-[#E6E1D8] text-[#222222] cursor-pointer"
                          title="Heading 3 (H3)"
                        >
                          H3
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('**', '**', 'teks tebal')}
                          className="px-2.5 py-1 text-xs font-bold bg-[#FAF7F2] hover:bg-[#EBE4D9] rounded-lg border border-[#E6E1D8] text-[#222222] cursor-pointer"
                          title="Tebal (Bold)"
                        >
                          <Bold className="w-3.5 h-3.5 inline" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('*', '*', 'teks miring')}
                          className="px-2.5 py-1 text-xs font-bold bg-[#FAF7F2] hover:bg-[#EBE4D9] rounded-lg border border-[#E6E1D8] text-[#222222] cursor-pointer"
                          title="Miring (Italic)"
                        >
                          <Italic className="w-3.5 h-3.5 inline" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('> "', '" (HR. Bukhari)', 'Kutipan hadits / rujukan fatwa ulama...')}
                          className="px-2.5 py-1 text-xs font-bold bg-[#FAF7F2] hover:bg-[#EBE4D9] rounded-lg border border-[#E6E1D8] text-[#222222] cursor-pointer"
                          title="Kutipan Dalil / Hadits"
                        >
                          ❝ Dalil
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('- Poin 1\n- Poin 2\n- Poin 3')}
                          className="px-2.5 py-1 text-xs font-bold bg-[#FAF7F2] hover:bg-[#EBE4D9] rounded-lg border border-[#E6E1D8] text-[#222222] cursor-pointer"
                          title="Daftar Poin"
                        >
                          <List className="w-3.5 h-3.5 inline" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('1. Langkah pertama\n2. Langkah kedua\n3. Langkah ketiga')}
                          className="px-2.5 py-1 text-xs font-bold bg-[#FAF7F2] hover:bg-[#EBE4D9] rounded-lg border border-[#E6E1D8] text-[#222222] cursor-pointer"
                          title="Daftar Angka"
                        >
                          <ListOrdered className="w-3.5 h-3.5 inline" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('![Keterangan Gambar](', ')', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c')}
                          className="px-2.5 py-1 text-xs font-bold bg-[#FAF7F2] hover:bg-[#EBE4D9] rounded-lg border border-[#E6E1D8] text-[#222222] cursor-pointer"
                          title="Sisipkan Gambar"
                        >
                          🖼️ Gambar
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('[Teks Tautan](', ')', 'https://toko.zaidly.com/')}
                          className="px-2.5 py-1 text-xs font-bold bg-[#FAF7F2] hover:bg-[#EBE4D9] rounded-lg border border-[#E6E1D8] text-[#222222] cursor-pointer"
                          title="Sisipkan Tautan"
                        >
                          <LinkIcon className="w-3.5 h-3.5 inline" />
                        </button>
                      </div>
                    )}

                    {blogEditorMode === 'write' ? (
                      <div>
                        <textarea
                          rows={14}
                          required
                          value={blogContent}
                          onChange={(e) => setBlogContent(e.target.value)}
                          placeholder="Ketik atau paste artikel Anda di sini dalam format Markdown atau HTML..."
                          className="w-full bg-white border border-[#E6E1D8] focus:border-[#1F6347] rounded-xl p-4 text-xs sm:text-sm text-[#222222] outline-none font-mono leading-relaxed"
                        />
                        <div className="flex justify-between items-center text-[10px] text-[#7A7A7A] mt-1">
                          <span>
                            {blogContent.trim().split(/\s+/).filter(Boolean).length} kata • Estimasi baca: {calculateReadTime(blogContent)}
                          </span>
                          <span>Format Markdown &amp; HTML otomatis dikonversi saat disimpan</span>
                        </div>
                      </div>
                    ) : (
                      /* LIVE PREVIEW CONTAINER */
                      <div className="p-6 bg-white rounded-xl border border-[#E6E1D8] shadow-2xs min-h-[300px] overflow-y-auto max-h-[500px]">
                        <div className="border-b border-[#F0ECE1] pb-4 mb-4">
                          <span className="text-[10px] font-bold text-[#19583E] bg-[#E8F4EC] px-2.5 py-0.5 rounded-full">
                            {blogCategory}
                          </span>
                          <h2 className="text-xl sm:text-2xl font-bold font-serif-title text-[#222222] mt-2">
                            {blogTitle || 'Judul Artikel Anda Akan Muncul di Sini'}
                          </h2>
                          <div className="text-[11px] text-[#7A7A7A] mt-1">
                            Oleh: {blogAuthor} • {blogDate} • {calculateReadTime(blogContent)}
                          </div>
                        </div>

                        <div
                          className="prose prose-sm max-w-none text-[#333333] leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html:
                              markdownToHtml(blogContent) ||
                              '<p class="text-[#7A7A7A] italic">Konten artikel masih kosong. Tulis atau paste teks markdown di tab Editor.</p>',
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* BAGIAN 4: KOTAK OPTIMASI SEO (YOAST / RANKMATH STYLE) */}
                  <div className="p-5 bg-white rounded-2xl border border-[#E6E1D8] shadow-2xs space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-[#E6E1D8]">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#222222] flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                        <span>4. Optimasi SEO Google (Yoast &amp; SERP Snippet Preview)</span>
                      </h3>
                      <span className="text-[10px] font-bold text-[#19583E] bg-[#E8F4EC] px-2 py-0.5 rounded-full">
                        Google Friendly
                      </span>
                    </div>

                    {/* Google SERP Snippet Simulator */}
                    <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-[#E6E1D8] space-y-1">
                      <div className="text-[11px] text-[#7A7A7A] flex items-center gap-1 font-mono">
                        <div className="w-3.5 h-3.5 rounded-full bg-[#DE5A35] text-white text-[8px] flex items-center justify-center font-bold">
                          Z
                        </div>
                        <span>https://toko.zaidly.com › blog › {blogSlug || 'judul-artikel'}</span>
                      </div>
                      <h4 className="text-sm sm:text-base font-semibold text-[#1A0DAB] hover:underline cursor-pointer leading-snug">
                        {blogTitle || 'Judul Artikel Blog Anda'} | Toko Zaidly
                      </h4>
                      <p className="text-xs text-[#4D5156] line-clamp-2 leading-relaxed">
                        {blogExcerpt || 'Cuplikan ringkasan meta description artikel Anda akan muncul di hasil pencarian Google seperti ini...'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Meta Description / Excerpt */}
                      <div className="sm:col-span-2">
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[11px] font-bold text-[#222222]">
                            Meta Description / Ringkasan Cuplikan (Excerpt) *
                          </label>
                          <span className={`text-[10px] ${blogExcerpt.length >= 120 && blogExcerpt.length <= 160 ? 'text-[#19583E] font-bold' : 'text-[#7A7A7A]'}`}>
                            {blogExcerpt.length} / 160 karakter (Ideal: 120-160)
                          </span>
                        </div>
                        <textarea
                          rows={2}
                          required
                          maxLength={180}
                          value={blogExcerpt}
                          onChange={(e) => setBlogExcerpt(e.target.value)}
                          placeholder="Tuliskan 1-2 kalimat ringkasan artikel yang memikat calon pembaca saat mencari di Google..."
                          className="w-full bg-[#FAF7F2] border border-[#E6E1D8] focus:border-[#1F6347] rounded-xl p-3 text-xs text-[#222222] outline-none"
                        />
                      </div>

                      {/* Focus Keyword */}
                      <div>
                        <label className="text-[11px] font-bold text-[#222222] block mb-1">
                          Focus Keyword (Kata Kunci Utama Target Google)
                        </label>
                        <input
                          type="text"
                          value={blogFocusKeyword}
                          onChange={(e) => setBlogFocusKeyword(e.target.value)}
                          placeholder="Contoh: parenting sunnah balita"
                          className="w-full bg-[#FAF7F2] border border-[#E6E1D8] focus:border-[#1F6347] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none font-semibold"
                        />
                      </div>

                      {/* Tags SEO */}
                      <div>
                        <label className="text-[11px] font-bold text-[#222222] block mb-1">
                          Tags Topik Artikel (Pisahkan dengan tanda koma)
                        </label>
                        <input
                          type="text"
                          value={blogTags}
                          onChange={(e) => setBlogTags(e.target.value)}
                          placeholder="Rumaysho, Faceless, Aqidah Anak, Sunnah"
                          className="w-full bg-[#FAF7F2] border border-[#E6E1D8] focus:border-[#1F6347] rounded-xl px-3 py-2 text-xs text-[#222222] outline-none"
                        />
                      </div>
                    </div>

                    {/* SEO Health Checklist */}
                    <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E6E1D8] text-[11px] space-y-1">
                      <div className="font-bold text-[#222222] mb-1">Audit Cepat Kualitas SEO:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[#595959]">
                        <div className="flex items-center gap-1.5">
                          <Check className={`w-3.5 h-3.5 ${blogTitle.length >= 30 ? 'text-[#1F6347]' : 'text-[#CCCCCC]'}`} />
                          <span>Judul spesifik &amp; informatif ({blogTitle.length >= 30 ? 'Lolos' : 'Perlu ditingkatkan'})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Check className={`w-3.5 h-3.5 ${blogExcerpt.length >= 80 ? 'text-[#1F6347]' : 'text-[#CCCCCC]'}`} />
                          <span>Meta description terisi memadai</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Check className={`w-3.5 h-3.5 ${blogCoverImage ? 'text-[#1F6347]' : 'text-[#CCCCCC]'}`} />
                          <span>Foto sampul (Featured Image) terpasang</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Check className={`w-3.5 h-3.5 ${blogContent.includes('##') ? 'text-[#1F6347]' : 'text-[#CCCCCC]'}`} />
                          <span>Memiliki sub-heading H2/H3 untuk keterbacaan</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        resetBlogForm();
                        setBlogTab('list');
                      }}
                      className="px-5 py-2.5 rounded-full border border-[#E6E1D8] text-xs font-bold text-[#595959] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#1F6347] hover:bg-[#164E36] text-white text-xs font-bold rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{editingBlogId ? 'Simpan Perubahan Artikel' : 'Publikasikan Artikel ke Blog'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
