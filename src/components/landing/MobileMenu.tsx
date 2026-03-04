'use client';

import Link from 'next/link';

const menuSections = [
  {
    title: 'Preference',
    items: [
      { label: 'Home', href: '/' },
      { label: 'My Details', href: '/my-details' },
      { label: 'History', href: '/history' },
    ],
  },
  {
    title: 'Liftngo',
    items: [
      { label: 'Why Choose', href: '/why-choose' },
      { label: 'How Liftngo works', href: '/how-it-works' },
      { label: 'Offer', href: '/offers' },
    ],
  },
  {
    title: 'Other',
    items: [
      { label: 'FAQs', href: '/faqs' },
      { label: 'Customer Support', href: '/support' },
      { label: 'Term & Condition', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-[85vw] bg-white z-[60] shadow-2xl transform transition-transform duration-300 ease-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu content */}
        <div className="flex-1 overflow-y-auto px-6 pb-8">
          {menuSections.map((section) => (
            <div key={section.title} className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center justify-between py-3 text-gray-600 hover:text-gray-900 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        <span>{item.label}</span>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
