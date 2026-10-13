import React from 'react';
import { notFound } from 'next/navigation';
import { INITIAL_PRODUCTS, MOCK_COURIER_RATES } from '@/data/mockData';
import { Metadata } from 'next';
import Link from 'next/link';
import ProductGallery from '@/components/ProductGallery';
import {
  Star,
  Download,
  Truck,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Calculator,
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return INITIAL_PRODUCTS.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = INITIAL_PRODUCTS.find((p) => p.slug === slug);
  if (!product) return { title: 'Produk Tidak Ditemukan' };

  return {
    title: `${product.title} | toko.zaidly.com`,
    description: product.shortDescription,
    openGraph: {
      title: product.title,
      description: product.shortDescription,
      images: [{ url: product.coverImage }],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = INITIAL_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const isDigital = product.type === 'DIGITAL_EBOOK';
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.coverImage,
    description: product.shortDescription,
    brand: {
      '@type': 'Brand',
      name: product.publisherOrBrand,
    },
    offers: {
      '@type': 'Offer',
      url: `https://toko.zaidly.com/products/${product.slug}`,
      priceCurrency: 'IDR',
      price: product.price,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: product.reviewsCount || 1,
    },
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#595959] hover:text-[#DE5A35] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda Katalog</span>
        </Link>

        {/* Product Card Container */}
        <div className="bg-white rounded-3xl border border-[#E6E1D8] shadow-sm p-6 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Gallery Left */}
            <div className="md:col-span-6 space-y-4">
              <ProductGallery product={product} />
            </div>

            {/* Buy Box Right */}
            <div className="md:col-span-6 space-y-4">
              <div className="flex items-center justify-between text-xs text-[#7A7A7A]">
                <span>{product.publisherOrBrand}</span>
                <span className="bg-[#F3EEE7] px-2.5 py-0.5 rounded-full font-semibold text-[#595959]">
                  {product.targetAge}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold font-serif-title text-[#222222] leading-snug">
                {product.title}
              </h1>

              <div className="flex items-center gap-2 text-xs">
                <div className="flex text-[#F59E0B]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F59E0B]" />
                  ))}
                </div>
                <span className="font-bold text-[#222222]">{product.rating.toFixed(1)}</span>
                <span className="text-[#7A7A7A]">({product.reviewsCount} Ulasan Pembeli)</span>
              </div>

              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6E1D8]">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl font-black text-[#222222]">
                    {formatIDR(product.price)}
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E6E1D8] space-y-2">
                <h4 className="text-xs font-bold text-[#222222] uppercase tracking-wider">
                  Highlight Produk:
                </h4>
                <div className="space-y-1.5 text-xs text-[#4A4A4A]">
                  {product.highlights.map((hl, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1F6347] shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {!isDigital && (
                <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E6E1D8] space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-[#222222]">
                    <span className="flex items-center gap-1.5">
                      <Calculator className="w-3.5 h-3.5 text-[#DE5A35]" />
                      <span>Ekspedisi KiriminAja</span>
                    </span>
                    <span className="text-[#7A7A7A]">Berat: {product.weightGrams} gram</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    {MOCK_COURIER_RATES.map((rate) => (
                      <div key={rate.courierCode} className="p-2 bg-white rounded-xl border border-[#E6E1D8]">
                        <div className="text-[10px] font-bold text-[#222222]">{rate.courierName}</div>
                        <div className="text-[11px] font-black text-[#1F6347]">{formatIDR(rate.cost)}</div>
                        <div className="text-[9px] text-[#7A7A7A]">{rate.etd}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Link
                href={`/?checkout=${product.id}`}
                className="w-full py-3.5 bg-[#DE5A35] hover:bg-[#C54724] text-white rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all text-center block"
              >
                <span>Beli Sekarang via Mayar (Tanpa Wajib Sign-in)</span>
              </Link>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#7A7A7A]">
                <ShieldCheck className="w-4 h-4 text-[#1F6347]" />
                <span>Transaksi Amanah &amp; Bergaransi</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-[#E6E1D8] mt-8 pt-6">
            <h3 className="font-bold text-sm text-[#222222] uppercase tracking-wider mb-3">
              Deskripsi Lengkap & Faedah Syar&apos;i
            </h3>
            <div
              className="text-xs text-[#4A4A4A] leading-relaxed space-y-3 prose"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
