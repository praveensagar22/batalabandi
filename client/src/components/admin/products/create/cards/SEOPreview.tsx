'use client';

interface SEOPreviewProps {
  title: string;
  description: string;
  url: string;
}

export default function SEOPreview({ title, description, url }: SEOPreviewProps) {
  const displayTitle = title || 'Product Title — BatalaBandi';
  const displayDesc =
    description ||
    'Add a meta description to improve click-through rates in search results.';
  const displayUrl = url || 'batalabandi.com/products/your-product';

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
          Google Search Preview
        </p>
        <div className="bg-white border border-stone-100 rounded-xl p-5 shadow-sm max-w-lg">
          <p className="text-xs text-stone-500 truncate">{displayUrl}</p>
          <p className="text-lg text-blue-700 font-medium mt-0.5 line-clamp-1 hover:underline cursor-default">
            {displayTitle}
          </p>
          <p className="text-sm text-stone-600 mt-1 line-clamp-2 leading-relaxed">
            {displayDesc}
          </p>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
          Social Share Preview
        </p>
        <div className="bg-white border border-stone-100 rounded-xl overflow-hidden shadow-sm max-w-lg">
          <div className="h-32 bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
            <span className="text-xs text-stone-400">Open Graph Image</span>
          </div>
          <div className="p-3 border-t border-stone-100">
            <p className="text-[10px] text-stone-400 uppercase">batalabandi.com</p>
            <p className="text-sm font-semibold text-stone-900 mt-0.5 line-clamp-1">
              {displayTitle}
            </p>
            <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">{displayDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
