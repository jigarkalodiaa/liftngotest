import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME } from '@/lib/site';
import ContentLayout from '@/components/layout/ContentLayout';
import Link from 'next/link';

export const metadata = generatePageMetadata({
  title: `Careers | ${SITE_NAME}`,
  description: `Join ${SITE_NAME} and help shape the future of local logistics. Explore open roles in engineering, operations, and driver partnerships.`,
  path: '/careers',
  keywords: ['LiftnGo careers', 'logistics jobs', 'delivery jobs', 'work at LiftnGo'],
});

const BENEFITS = [
  { title: 'Growth', description: 'Work on problems that impact millions of deliveries and drivers.' },
  { title: 'Inclusion', description: 'Diverse, collaborative teams and an inclusive culture.' },
  { title: 'Flexibility', description: 'Hybrid and remote-friendly roles where it makes sense.' },
  { title: 'Impact', description: 'Your work directly improves how goods move in cities.' },
];

const OPEN_ROLES = [
  { title: 'Operations Associate', team: 'Operations', location: 'India' },
  { title: 'Driver Success Lead', team: 'Driver Partnerships', location: 'India' },
  { title: 'Senior Software Engineer', team: 'Engineering', location: 'Remote' },
  { title: 'City Launcher', team: 'Growth', location: 'Multiple cities' },
];

export default function CareersPage() {
  return (
    <ContentLayout>
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Careers at {SITE_NAME}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl">
              We’re building the future of local logistics. Join us to help move goods faster, support drivers, and simplify last-mile delivery for everyone.
            </p>
          </div>

          <section className="mb-14">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Why join us</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {BENEFITS.map((b) => (
                <div
                  key={b.title}
                  className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{b.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{b.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Open roles</h2>
            <p className="text-gray-600 mb-6">
              We’re always looking for talented people. Below are some of our current openings.
            </p>
            <ul className="space-y-3">
              {OPEN_ROLES.map((role) => (
                <li key={role.title}>
                  <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{role.title}</h3>
                      <p className="text-sm text-gray-500">{role.team} · {role.location}</p>
                    </div>
                    <a
                      href={`mailto:careers@liftngo.com?subject=Application: ${encodeURIComponent(role.title)}`}
                      className="inline-flex items-center justify-center rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity w-fit"
                    >
                      Apply
                    </a>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-gray-500 text-sm">
              Don’t see a fit? Send your resume to{' '}
              <a href="mailto:careers@liftngo.com" className="text-[var(--color-primary)] hover:underline">
                careers@liftngo.com
              </a>
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Become a driver partner</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Earn on your own schedule as a LiftnGo driver. Get the app, complete verification, and start accepting deliveries.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl bg-[var(--landing-orange)] px-6 py-3 text-base font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Get the Driver App
            </Link>
          </section>
        </div>
      </main>
    </ContentLayout>
  );
}
