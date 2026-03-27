import Link from 'next/link';
import type { BlogBodyBlock, BlogInlineSegment } from '@/types/blog';

function Inline({ segments }: { segments: BlogInlineSegment[] }) {
  return (
    <>
      {segments.map((seg, i) =>
        typeof seg === 'string' ? (
          <span key={i}>{seg}</span>
        ) : (
          <Link
            key={i}
            href={seg.href}
            className="font-medium text-[var(--color-primary)] underline decoration-[var(--color-primary)]/30 underline-offset-2 hover:decoration-[var(--color-primary)]"
          >
            {seg.text}
          </Link>
        ),
      )}
    </>
  );
}

export default function BlogPostBody({ blocks }: { blocks: BlogBodyBlock[] }) {
  return (
    <div className="prose prose-gray max-w-none">
      {blocks.map((block, i) => {
        if (block.type === 'p') {
          return (
            <p key={i} className="text-base sm:text-lg text-gray-700 leading-relaxed mb-5">
              <Inline segments={block.segments} />
            </p>
          );
        }
        if (block.type === 'h2') {
          return (
            <h2 key={i} className="text-xl sm:text-2xl font-bold text-gray-900 mt-10 mb-4 scroll-mt-24">
              {block.text}
            </h2>
          );
        }
        if (block.type === 'h3') {
          return (
            <h3 key={i} className="text-lg sm:text-xl font-semibold text-gray-900 mt-8 mb-3 scroll-mt-24">
              {block.text}
            </h3>
          );
        }
        if (block.type === 'ul') {
          return (
            <ul key={i} className="list-disc pl-5 sm:pl-6 space-y-2 mb-6 text-gray-700 text-base sm:text-lg">
              {block.items.map((item) => (
                <li key={item} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          );
        }
        return null;
      })}
    </div>
  );
}
