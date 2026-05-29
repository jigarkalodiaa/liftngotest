'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import B2bOfferPopup from './B2bOfferPopup';

/** Portals the B2B offer popup to `document.body` (avoids parent overflow clipping). */
export default function B2bSiteConversion() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(<B2bOfferPopup />, document.body);
}
