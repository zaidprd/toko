export type ProductType = 'DIGITAL_EBOOK' | 'PHYSICAL_BOOK' | 'PHYSICAL_TOY';

export type TargetAge = 'Semua Usia' | '1-3 Tahun' | '4-6 Tahun' | '7-10 Tahun' | '10+ Tahun';

export interface Product {
  id: string;
  slug: string;
  title: string;
  type: ProductType;
  category: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  coverImage: string;
  galleryImages: string[];
  videoUrl?: string; // Link YouTube, YouTube Shorts, atau URL video MP4 / Data URL
  videoDurationSec?: number; // Maksimal 30 detik
  rating: number;
  reviewsCount: number;
  publisherOrBrand: string;
  author?: string;
  targetAge: TargetAge;
  isFaceless: boolean;
  hasMusic: boolean; // Selalu false
  shortDescription: string;
  descriptionHtml: string;
  highlights: string[];
  
  // Khusus Digital
  digitalFormat?: 'PDF High-Resolution' | 'EPUB & PDF Bundle' | 'Printable Activity Kit';
  fileSizeMb?: number;
  totalPages?: number;
  previewPages?: string[]; // URL preview lembar buku
  
  // Khusus Fisik
  stock?: number;
  weightGrams?: number;
  dimensions?: string;
  material?: string; // e.g. "Kayu Pinus Alami, Cat Non-Toxic Berbasis Air"
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CourierRate {
  courierCode: string; // JNT, SICEPAT, JNE
  courierName: string;
  service: string; // EZ, REG, BEST
  etd: string; // "1-2 Hari", "2-3 Hari"
  cost: number;
  logo: string;
}

export interface OrderCustomer {
  fullName: string;
  whatsapp: string;
  email: string;
  province: string;
  city: string;
  subdistrict: string;
  addressDetail: string;
  courier?: CourierRate;
  paymentMethod: 'QRIS' | 'VA_BSI' | 'VA_MANDIRI' | 'VA_BCA';
}

export interface CompletedOrder {
  orderId: string;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  grandTotal: number;
  paymentStatus: 'PAID';
  paidAt: string;
  invoiceUrl: string;
  digitalDownloads: {
    productId: string;
    productTitle: string;
    fileName: string;
    fileSizeMb: number;
    downloadToken: string;
    expiresInHours: number;
  }[];
  shippingAwb?: {
    courierName: string;
    awbNumber: string;
    status: string;
    estimatedDelivery: string;
  };
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  coverImage: string;
  tags: string[];
}
