import React from 'react';
import type { Metadata } from 'next';
import { INITIAL_BLOG_POSTS } from '@/data/mockData';
import BlogPostReader from '@/components/BlogPostReader';
import { getBlogPosts, getProducts } from '@/lib/catalog';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return INITIAL_BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = (await getBlogPosts()).find((p) => p.slug === slug);

  if (!post) {
    return {
      title: 'Artikel Blog Sunnah | Toko Zaidly',
    };
  }

  const url = `https://toko.zaidly.com/blog/${post.slug}`;

  return {
    title: `${post.title} | Toko Zaidly`,
    description: post.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      siteName: 'Toko Zaidly',
      locale: 'id_ID',
      type: 'article',
      publishedTime: '2026-10-12T00:00:00Z',
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: post.coverImage,
          width: 800,
          height: 600,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = (await getBlogPosts()).find((p) => p.slug === slug) || null;
  const relatedProducts = (await getProducts()).slice(0, 3);

  const jsonLd = post
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        image: post.coverImage,
        author: {
          '@type': 'Person',
          name: post.author,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Toko Zaidly',
          url: 'https://toko.zaidly.com',
          logo: {
            '@type': 'ImageObject',
            url: 'https://toko.zaidly.com/favicon.ico',
          },
        },
        datePublished: '2026-10-12',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://toko.zaidly.com/blog/${post.slug}`,
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <BlogPostReader
        serverPost={post}
        slug={slug}
        relatedProducts={relatedProducts}
      />
    </>
  );
}
