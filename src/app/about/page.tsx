import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'About Us',
  description: 'Learn more about our company and mission. We build modern web applications with SEO best practices.',
  path: '/about',
  keywords: ['about', 'company', 'mission', 'team'],
});

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">About Us</h1>
      <p className="text-lg text-gray-600 max-w-2xl text-center">
        This is an example page demonstrating how to use the reusable SEO metadata generator.
        Each page can have its own unique title, description, and Open Graph data.
      </p>
    </main>
  );
}
