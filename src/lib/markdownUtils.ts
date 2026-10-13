/**
 * Markdown & SEO Utilities for Toko Zaidly Blog CMS
 */

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function calculateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} menit baca`;
}

/**
 * Converts Markdown text to clean semantic HTML.
 * Also preserves existing HTML tags if the user writes or pastes pure HTML.
 */
export function markdownToHtml(md: string): string {
  if (!md) return '';

  // If already full HTML and doesn't look like markdown headers or lists, return formatted
  const trimmed = md.trim();

  let html = trimmed;

  // Code blocks: ```lang ... ```
  html = html.replace(/```([\s\S]*?)```/g, (_match, code) => {
    return `<pre class="bg-[#2D2A26] text-[#FAF7F2] p-4 rounded-xl overflow-x-auto text-xs my-4 font-mono"><code>${escapeHtml(code.trim())}</code></pre>`;
  });

  // Inline code: `code`
  html = html.replace(/`([^`]+)`/g, '<code class="bg-[#EBE4D9] text-[#222222] px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');

  // Headings
  html = html.replace(/^#### (.*$)/gim, '<h4 class="text-base font-bold text-[#222222] mt-6 mb-2">$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-[#222222] mt-7 mb-2.5">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-[#222222] mt-8 mb-3 font-serif-title">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-[#222222] mt-8 mb-4 font-serif-title">$1</h1>');

  // Blockquotes / Dalil hadits
  html = html.replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-[#DE5A35] pl-4 py-2 my-4 bg-[#FAF7F2] text-[#4A4A4A] italic text-xs sm:text-sm rounded-r-xl">$1</blockquote>');

  // Horizontal Rule
  html = html.replace(/^(?:---|\*\*\*|___)$/gim, '<hr class="my-6 border-[#E6E1D8]" />');

  // Bold & Italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/___(.*?)___/g, '<strong><em>$1</em></strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');

  // Images: ![alt](url)
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<figure class="my-6"><img src="$2" alt="$1" class="w-full rounded-2xl border border-[#E6E1D8] shadow-xs object-cover max-h-[420px]" /><figcaption class="text-center text-[11px] text-[#7A7A7A] mt-2 italic">$1</figcaption></figure>');

  // Links: [text](url)
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#DE5A35] font-semibold underline underline-offset-2 hover:text-[#C54724]">$1</a>');

  // Unordered Lists (- item or * item)
  html = html.replace(/(?:^[ \t]*[-*][ \t]+.*(?:\r?\n|$))+/gm, (list) => {
    const items = list
      .trim()
      .split(/\r?\n/)
      .map((item) => `<li>${item.replace(/^[ \t]*[-*][ \t]+/, '')}</li>`)
      .join('');
    return `<ul class="list-disc pl-5 space-y-1 my-3 text-xs sm:text-sm text-[#4A4A4A]">${items}</ul>`;
  });

  // Ordered Lists (1. item)
  html = html.replace(/(?:^[ \t]*\d+\.[ \t]+.*(?:\r?\n|$))+/gm, (list) => {
    const items = list
      .trim()
      .split(/\r?\n/)
      .map((item) => `<li>${item.replace(/^[ \t]*\d+\.[ \t]+/, '')}</li>`)
      .join('');
    return `<ol class="list-decimal pl-5 space-y-1 my-3 text-xs sm:text-sm text-[#4A4A4A]">${items}</ol>`;
  });

  // Paragraphs (lines separated by blank lines that are not already tags)
  const blocks = html.split(/\n{2,}/);
  const wrapped = blocks
    .map((block) => {
      const b = block.trim();
      if (!b) return '';
      if (
        b.startsWith('<h1') ||
        b.startsWith('<h2') ||
        b.startsWith('<h3') ||
        b.startsWith('<h4') ||
        b.startsWith('<ul') ||
        b.startsWith('<ol') ||
        b.startsWith('<blockquote') ||
        b.startsWith('<pre') ||
        b.startsWith('<hr') ||
        b.startsWith('<figure') ||
        b.startsWith('<p') ||
        b.startsWith('<div')
      ) {
        return b;
      }
      return `<p class="leading-relaxed text-xs sm:text-sm text-[#4A4A4A] my-3">${b.replace(/\n/g, '<br/>')}</p>`;
    })
    .join('\n');

  return wrapped;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
