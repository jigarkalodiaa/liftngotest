import ContentLayout from '@/components/layout/ContentLayout';
import MyDetailsForm from '@/components/my-details/MyDetailsForm';

export default function MyDetailsPage() {
  return (
    <ContentLayout>
      <main className="flex-1">
        <MyDetailsForm />
      </main>
    </ContentLayout>
  );
}
