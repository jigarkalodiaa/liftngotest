'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import Modal from '@/components/ui/Modal';
import OfferWhatsAppLink, { OfferWhatsAppIcon } from '@/components/offers/OfferWhatsAppLink';
import { offerCtaSecondary, offerCtaWhatsapp } from '@/components/offers/offerCtaStyles';
import {
  B2B_OFFER_IMAGE_PATH,
  B2B_OFFER_LANDING_PATH,
  B2B_OFFER_POPUP_DELAY_MS,
  isB2bOfferPopupDismissed,
  setB2bOfferPopupDismissed,
  shouldShowB2bOfferPopup,
} from '@/lib/b2bOffer';
import { ArrowRight } from 'lucide-react';

const compactCta = 'min-h-10 py-2.5 text-sm sm:min-h-11';

export default function B2bOfferPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const canShowOnRoute = shouldShowB2bOfferPopup(pathname);

  const dismiss = useCallback(() => {
    setOpen(false);
    setB2bOfferPopupDismissed();
  }, []);

  useEffect(() => {
    setOpen(false);
    if (!canShowOnRoute) return;
    if (isB2bOfferPopupDismissed()) return;

    const timer = window.setTimeout(() => {
      if (!isB2bOfferPopupDismissed()) {
        setOpen(true);
      }
    }, B2B_OFFER_POPUP_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [canShowOnRoute, pathname]);

  if (!canShowOnRoute) return null;

  return (
    <Modal
      isOpen={open}
      onClose={dismiss}
      align="center"
      hideHeader
      titleId="b2b-offer-popup-title"
      title="First Business Delivery FREE for GST registered businesses in Delhi NCR"
      panelClassName="max-w-[min(100%,340px)] overflow-hidden rounded-2xl border border-gray-200/90 p-0 shadow-[0_24px_56px_-14px_rgba(44,45,91,0.22)] sm:max-w-[360px]"
    >
      <div className="relative bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={B2B_OFFER_IMAGE_PATH}
          alt="First Business Delivery FREE for GST registered businesses in Delhi NCR"
          width={840}
          height={1050}
          className="block h-auto w-full object-contain"
          decoding="async"
        />
      </div>

      <div className="flex flex-col gap-2 border-t border-gray-100 bg-white px-3 py-3 sm:px-4 sm:py-3.5">
        <OfferWhatsAppLink
          trackSource="b2b_offer_popup_whatsapp"
          className={`${offerCtaWhatsapp} ${compactCta} w-full`}
        >
          <OfferWhatsAppIcon />
          Claim Offer on WhatsApp
        </OfferWhatsAppLink>
        <NextLink
          href={B2B_OFFER_LANDING_PATH}
          onClick={() => setOpen(false)}
          className={`${offerCtaSecondary} ${compactCta} w-full`}
        >
          Know More
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
        </NextLink>
      </div>
    </Modal>
  );
}
