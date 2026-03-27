import { GOOGLE_MAPS_KHATUSHYAM_URL, KHATUSHYAM_JI_ADDRESS_SUFFIX } from '@/features/food-delivery/constants';

type Props = { address: string };

export function AddressWithKhatushyamMapsLink({ address }: Props) {
  if (address.endsWith(KHATUSHYAM_JI_ADDRESS_SUFFIX)) {
    const prefix = address.slice(0, -KHATUSHYAM_JI_ADDRESS_SUFFIX.length);
    return (
      <>
        {prefix}
        {', '}
        <a
          href={GOOGLE_MAPS_KHATUSHYAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open Khatushyam Ji area in Google Maps (opens in new tab)"
          className="rounded-sm font-medium text-[var(--color-primary)] underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-1"
        >
          Khatushyam Ji
        </a>
      </>
    );
  }
  return <>{address}</>;
}
