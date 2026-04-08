'use client';

import { useCallback, useMemo, useState } from 'react';
import type { KhatuPackageServices, KhatuServiceKey } from './types';

const BASE_PRICE_INR = 1499;

const SERVICE_PRICE_MAP: Record<KhatuServiceKey, number> = {
  cab: 699,
  hotel: 1400,
  food: 499,
  guide: 399,
  darshan: 599,
  waterPark: 899,
  returnTrip: 699,
};

const DEFAULT_SERVICES: KhatuPackageServices = {
  cab: true,
  hotel: false,
  food: false,
  guide: false,
  darshan: true,
  waterPark: false,
  returnTrip: true,
};

export function useKhatuPackageBuilder() {
  const [services, setServices] = useState<KhatuPackageServices>(DEFAULT_SERVICES);

  const toggleService = useCallback((key: KhatuServiceKey) => {
    setServices((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const resetServices = useCallback(() => {
    setServices(DEFAULT_SERVICES);
  }, []);

  const selectedServiceKeys = useMemo(
    () => (Object.keys(services) as KhatuServiceKey[]).filter((key) => services[key]),
    [services],
  );

  const addOnsTotal = useMemo(
    () => selectedServiceKeys.reduce((sum, key) => sum + SERVICE_PRICE_MAP[key], 0),
    [selectedServiceKeys],
  );

  const totalPrice = useMemo(() => BASE_PRICE_INR + addOnsTotal, [addOnsTotal]);

  return {
    services,
    toggleService,
    resetServices,
    selectedServiceKeys,
    hasSelection: selectedServiceKeys.length > 0,
    basePrice: BASE_PRICE_INR,
    addOnsTotal,
    totalPrice,
    servicePriceMap: SERVICE_PRICE_MAP,
  };
}
