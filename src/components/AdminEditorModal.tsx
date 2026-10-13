'use client';

import React, { useState } from 'react';
import { BlogPost } from '@/types';
import { X, Code, Eye, Save, Sparkles, CheckCircle2 } from 'lucide-react';

interface AdminEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPost: (post: BlogPost) => void;
}

export default function AdminEditorModal({
  isOpen,
  onClose,
  onAddPost,
}: AdminEditorModalProps) {
  const [title, setTitle] = useState('Pentingnya Mengenalkan Adab Sebelum Ilmu kepada Anak');
  const [category, setCategory] = useState('Adab & Akhlaq');
  const [author, setAuthor] = useState('Ahmad Zaid (Admin)');
  const [markdownContent, setMarkdownContent] = useState(`### Mengapa Adab Lebih Didahulukan?

Imam Malik bin Anas *rahimahullah* pernah berpesan kepada seorang pemuda Quraisy:

> "Pelajarilah adab sebelum engkau mempelajari suatu ilmu."

Dalam mendidik anak-anak kita di rumah:
- **Keteladanan Orang Tua:** Anak meniru apa yang dilihat, bukan sekadar apa yang didengar.
- **Membiasakan Senyum & Mengucap Salam:** Menumbuhkan rasa cinta sesama muslim.
- **Adab Makan & Minum Sesuai Sunnah:** Menggunakan tangan kanan dan membaca bismillah.`);

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  // Simple Markdown to HTML converter for live demonstration
  const convertMarkdownToHtml = (md: string) => {
    return md
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-[#222222] mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-[#222222] mt-5 mb-2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-[#222222] mt-6 mb-3">$1</h1>')
      .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-[#1F6347] pl-3 py-1 my-3 italic text-[#19583E] bg-[#E8F4EC] rounded-r">$1</blockquote>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
      .replace(/\n$/gim, '<br />');
  };

  const previewHtml = convertMarkdownToHtml(markdownContent);

  const handleSaveArticle = () => {
    const newPost: BlogPost = {
      id: `blog-${Date.now()}`,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title,
      excerpt: markdownContent.slice(0, 150) + '...',
      contentHtml: previewHtml,
      author,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      readTime: '3 menit baca',
      category,
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      tags: ['Adab Anak', 'Sunnah', 'Parenting'],
    };

    onAddPost(newPost);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#E6E1D8] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E6E1D8] bg-[#FAF7F2] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#DE5A35]" />
            <div>
              <h3 className="font-bold text-sm text-[#222222] font-serif-title">
                CMS Editor Blog (Markdown / Pure HTML Ready)
              </h3>
              <p className="text-[11px] text-[#7A7A7A]">
                Bebas biaya server (Rp 0), tanpa WordPress, dan langsung menghasilkan HTML murni tanpa Sanity PortableText!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#EBE4D9] flex items-center justify-center text-[#595959]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Editor Form */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-[#595959]">Judul Artikel</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E6E1D8] rounded-xl px-3 py-2 text-xs text-[#222222] font-bold focus:border-[#DE5A35] outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#595959]">Kategori</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E6E1D8] rounded-xl px-3 py-2 text-xs text-[#222222] focus:border-[#DE5A35] outline-none"
              />
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center justify-between border-b border-[#E6E1D8] pb-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                  activeTab === 'editor'
                    ? 'bg-[#222222] text-white'
                    : 'bg-[#FAF7F2] text-[#595959] hover:text-[#222222]'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Editor Markdown</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                  activeTab === 'preview'
                    ? 'bg-[#1F6347] text-white'
                    : 'bg-[#FAF7F2] text-[#595959] hover:text-[#222222]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Pratinjau HTML Murni</span>
              </button>
            </div>

            <span className="text-[10px] text-[#7A7A7A]">
              Decap CMS / Git Markdown Architecture
            </span>
          </div>

          {/* Editor Body */}
          {activeTab === 'editor' ? (
            <div>
              <textarea
                rows={10}
                value={markdownContent}
                onChange={(e) => setMarkdownContent(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E6E1D8] rounded-2xl p-4 text-xs font-mono text-[#222222] focus:border-[#DE5A35] outline-none leading-relaxed"
                placeholder="Tulis artikel tarbiyah sunnah Anda di sini..."
              />
              <p className="text-[10px] text-[#7A7A7A] mt-1">
                Gunakan format Markdown: `### Subjudul`, `**Tebal**`, `*Miring*`, `&gt; Kutipan Hadits`, `- Poin`
              </p>
            </div>
          ) : (
            <div className="bg-[#FAF7F2] border border-[#E6E1D8] rounded-2xl p-5 min-h-[220px]">
              <div
                className="text-xs text-[#333333] space-y-2 prose"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[#E6E1D8] bg-[#FAF7F2] flex items-center justify-between">
          <span className="text-[11px] text-[#595959]">
            Penulis: <strong>{author}</strong>
          </span>

          <button
            type="button"
            onClick={handleSaveArticle}
            disabled={isSaved}
            className="px-5 py-2.5 bg-[#DE5A35] hover:bg-[#C54724] text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Artikel Berhasil Disimpan!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan & Publikasikan ke Blog</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
