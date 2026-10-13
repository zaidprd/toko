import 'server-only';
import { INITIAL_BLOG_POSTS, INITIAL_PRODUCTS } from '@/data/mockData';
import type { BlogPost, Product } from '@/types';
import { db, isDatabaseConfigured } from './db';

type ProductRow = { id: string; data: Product; active: boolean; updated_at: string };
type BlogRow = { id: string; data: BlogPost; published: boolean; updated_at: string };

export async function getProducts(): Promise<Product[]> {
  if (!isDatabaseConfigured()) return INITIAL_PRODUCTS;
  const rows = await db.list<ProductRow>('products', 'select=data&active=eq.true&order=updated_at.desc');
  return rows.length ? rows.map((row) => row.data) : INITIAL_PRODUCTS;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!isDatabaseConfigured()) return INITIAL_BLOG_POSTS;
  const rows = await db.list<BlogRow>('blog_posts', 'select=data&published=eq.true&order=updated_at.desc');
  return rows.length ? rows.map((row) => row.data) : INITIAL_BLOG_POSTS;
}

export async function saveProduct(product: Product) {
  return db.insert<ProductRow>('products', { id: product.id, slug: product.slug, data: product, active: true }, 'id');
}

export async function saveBlogPost(post: BlogPost) {
  return db.insert<BlogRow>('blog_posts', { id: post.id, slug: post.slug, data: post, published: true }, 'id');
}
