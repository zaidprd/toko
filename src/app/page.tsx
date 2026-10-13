'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Product, CartItem, CompletedOrder, BlogPost } from '@/types';
import { INITIAL_PRODUCTS, INITIAL_BLOG_POSTS } from '@/data/mockData';
import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import FilterPills, { FilterOption } from '@/components/FilterPills';
import ProductCard from '@/components/ProductCard';
import ProductDetailModal from '@/components/ProductDetailModal';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import OrderSuccessModal from '@/components/OrderSuccessModal';
import BlogSection from '@/components/BlogSection';
import Footer from '@/components/Footer';

export default function Home() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);

  // Shared server catalog; built-in data remains as a read-only fallback.
  useEffect(() => {
    Promise.all([fetch('/api/products').then((r) => r.json()), fetch('/api/blogs').then((r) => r.json())])
      .then(([catalog, blog]) => {
        if (Array.isArray(catalog.products)) setProducts(catalog.products);
        if (Array.isArray(blog.posts)) setBlogPosts(blog.posts);
      }).catch(console.error);
  }, []);

  const handleSaveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
  };

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('ALL');

  // Cart & Wishlist
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);

  // Filtered Products Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(query);
        const matchBrand = p.publisherOrBrand.toLowerCase().includes(query);
        const matchDesc = p.shortDescription.toLowerCase().includes(query);
        if (!matchTitle && !matchBrand && !matchDesc) return false;
      }

      // 2. Category Nav
      if (activeCategory !== 'ALL' && p.category !== activeCategory) {
        return false;
      }

      // 3. Quick Filter Pills
      if (activeFilter === 'INSTANT_DOWNLOAD' && p.type !== 'DIGITAL_EBOOK') {
        return false;
      }
      if (activeFilter === 'PHYSICAL' && p.type === 'DIGITAL_EBOOK') {
        return false;
      }
      if (activeFilter === 'AGE_1_3' && p.targetAge !== '1-3 Tahun') {
        return false;
      }
      if (activeFilter === 'AGE_4_6' && p.targetAge !== '4-6 Tahun') {
        return false;
      }
      if (activeFilter === 'AGE_7_10' && p.targetAge !== '7-10 Tahun') {
        return false;
      }
      if (activeFilter === 'UNDER_50K' && p.price >= 50000) {
        return false;
      }

      return true;
    });
  }, [products, searchQuery, activeCategory, activeFilter]);

  // Cart Operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleDirectCheckout = (product: Product, quantity = 1) => {
    // Add product then open checkout immediately
    handleAddToCart(product, quantity);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Wishlist Toggle
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  const handleScrollToBlog = () => {
    const el = document.getElementById('blog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddNewBlogPost = (newPost: BlogPost) => {
    setBlogPosts((prev) => [newPost, ...prev]);
  };

  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      {/* 1. Header (Etsy style with search and categories) */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setActiveFilter('ALL');
        }}
        cartCount={cartTotalCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onScrollToBlog={handleScrollToBlog}
      />

      {/* 2. Hero Proposition Banner with Trust Badges */}
      <HeroBanner
        onSelectEbook={() => {
          setActiveCategory('Ebook Digital');
          setActiveFilter('INSTANT_DOWNLOAD');
        }}
        onSelectPhysical={() => {
          setActiveCategory('ALL');
          setActiveFilter('PHYSICAL');
        }}
      />

      {/* 3. Horizontal Filter Pills */}
      <FilterPills
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
        totalResults={filteredProducts.length}
      />

      {/* 4. Product Catalog Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E6E1D8] p-12 text-center max-w-md mx-auto space-y-3">
            <h3 className="font-bold text-base text-[#222222] font-serif-title">
              Tidak Ada Produk yang Sesuai
            </h3>
            <p className="text-xs text-[#7A7A7A]">
              Coba gunakan kata kunci pencarian lain atau klik tombol reset filter di bawah.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('ALL');
                setActiveFilter('ALL');
              }}
              className="px-5 py-2 bg-[#222222] text-white text-xs font-bold rounded-full hover:bg-black transition-all"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={handleToggleWishlist}
                onSelectProduct={setSelectedProduct}
                onQuickAddToCart={(prod) => handleAddToCart(prod, 1)}
              />
            ))}
          </div>
        )}
      </main>

      {/* 5. Blog Section (Parenting Sunnah, Rumaysho, Faceless Guideline) */}
      <BlogSection posts={blogPosts} />

      {/* 6. Footer (Mission statement & Syar'i principles) */}
      <Footer />

      {/* MODALS */}
      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onDirectCheckout={handleDirectCheckout}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal (Mayar & KiriminAja) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderSuccess={(order) => {
          setCompletedOrder(order);
          setCartItems([]); // Clear cart
        }}
      />

      {/* Order Success & Instant Download Hub */}
      <OrderSuccessModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
      />
    </div>
  );
}
