import ContentLayout from '@/components/layout/ContentLayout';
import MyDetailsForm from '@/components/my-details/MyDetailsForm';
import { BREADCRUMB_HOME } from '@/lib/breadcrumbsNav';
import { ROUTES } from '@/lib/constants';

export default function MyDetailsPage() {
  return (
    <ContentLayout
      breadcrumbs={[BREADCRUMB_HOME, { name: 'My details', path: ROUTES.MY_DETAILS }]}
    >
      <main className="flex-1">
        <MyDetailsForm />
      </main>
    </ContentLayout>
  );
}
