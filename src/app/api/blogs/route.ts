import { NextResponse } from 'next/server';
import { getBlogPosts, saveBlogPost } from '@/lib/catalog';
import { db, isDatabaseConfigured } from '@/lib/db';
import { requireAdmin } from '@/lib/adminAuth';
import type { BlogPost } from '@/types';

export async function GET() {
  return NextResponse.json({ posts: await getBlogPosts(), persistent: isDatabaseConfigured() });
}
export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isDatabaseConfigured()) return NextResponse.json({ error: 'Database belum dikonfigurasi.' }, { status: 503 });
  const post = (await req.json()) as BlogPost;
  if (!post?.id || !post?.slug || !post?.title || !post?.contentHtml)
    return NextResponse.json({ error: 'Data artikel tidak valid.' }, { status: 400 });
  await saveBlogPost(post);
  return NextResponse.json({ post });
}
export async function DELETE(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID wajib diisi.' }, { status: 400 });
  await db.remove('blog_posts', `id=eq.${encodeURIComponent(id)}`);
  return NextResponse.json({ success: true });
}
