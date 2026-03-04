export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--landing-bg,#FCFBF8)]" aria-live="polite" aria-busy="true">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent" />
    </div>
  );
}
